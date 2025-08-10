import { serverEnv } from '@/env/server';
import { xai } from '@ai-sdk/xai';
import { tavily } from '@tavily/core';
import { convertToModelMessages, tool, customProvider, generateText, stepCountIs } from 'ai';
import { z } from 'zod';

const scira = customProvider({
  languageModels: {
    'scira-default': xai('grok-3-beta'),
  },
});

export const maxDuration = 300;

const extractDomain = (url: string): string => {
  const urlPattern = /^https?:\/\/([^/?#]+)(?:[/?#]|$)/i;
  return url.match(urlPattern)?.[1] || url;
};

const deduplicateByDomainAndUrl = <T extends { url: string }>(items: T[]): T[] => {
  const seenDomains = new Set<string>();
  const seenUrls = new Set<string>();

  return items.filter((item) => {
    const domain = extractDomain(item.url);
    const isNewUrl = !seenUrls.has(item.url);
    const isNewDomain = !seenDomains.has(domain);

    if (isNewUrl && isNewDomain) {
      seenUrls.add(item.url);
      seenDomains.add(domain);
      return true;
    }
    return false;
  });
};

// Define separate system prompts for each group
const groupSystemPrompts = {
  web: `You are Scira for Raycast, a powerful AI web search assistant.

Today's Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' })}

### Core Guidelines:
- Always run the web_search tool first before composing your response.
- Provide concise, well-formatted responses optimized for Raycast's interface.
- Use markdown formatting for better readability.
- Avoid hallucinations or fabrications. Stick to verified facts with proper citations.
- Respond in a direct, efficient manner suitable for quick information retrieval.

### Web Search Guidelines:
- Always make multiple targeted queries (2-4) to get comprehensive results.
- Never use the same query twice and always make more than 2 queries.
- Specify the year or "latest" in queries to fetch recent information.
- Place citations directly after relevant sentences or paragraphs.
- Citation format: [Source Title](URL)
- Ensure citations adhere strictly to the required format.

### Response Formatting:
- Start with a direct answer to the user's question.
- Use markdown headings (h2, h3) to organize information.
- Present information in a logical flow with proper citations.
- Keep responses concise but informative, optimized for Raycast's interface.
- Use bullet points or numbered lists for clarity when appropriate.

### Latex and Currency Formatting:
- Use $ for inline equations and $$ for block equations.
- Use "USD" instead of $ for currency.

Remember, you are designed to be efficient and helpful in the Raycast environment, providing quick access to web information.`,

  x: `You are a X/Twitter content curator that helps find relevant posts.
    The current date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' })}.
    Once you get the content from the tools only write in paragraphs.
    No need to say that you are calling the tool, just call the tools first and run the search;
    then talk in long details in 2-6 paragraphs.
    make sure to use the start date and end date in the parameters. default is 1 month.
    If the user gives you a specific time like start date and end date, then add them in the parameters. default is 1 week.
    Always provide the citations at the end of each paragraph and in the end of sentences where you use it in which they are referred to with the given format to the information provided.
    Citation format: [Post Title](URL)

    # Latex and Currency Formatting to be used:
    - Always use '$' for inline equations and '$$' for block equations.
    - Avoid using '$' for dollar currency. Use "USD" instead.`,
};

// Modify the POST function to use the new handler
export async function POST(req: Request) {
  const { messages, model, group = 'web' } = await req.json();

  console.log('Running with model: ', model.trim());
  console.log('Group: ', group);

  // Get the appropriate system prompt based on the group
  const systemPrompt = groupSystemPrompts[group as keyof typeof groupSystemPrompts];

  // Determine which tools to activate based on the group
  const activeTools =
    group === 'x'
      ? ['x_search' as const]
      : group === 'web'
        ? ['web_search' as const]
        : ['web_search' as const, 'x_search' as const];

  const { text, steps } = await generateText({
    model: scira.languageModel(model),
    system: systemPrompt,
    stopWhen: stepCountIs(2),
    messages: convertToModelMessages(messages),
    temperature: 0,
    experimental_activeTools: activeTools,
    tools: {
      web_search: tool({
        description: 'Search the web for information with multiple queries, max results and search depth.',
        inputSchema: z.object({
          queries: z.array(z.string().describe('Array of search queries to look up on the web.')),
          maxResults: z.array(z.number().describe('Array of maximum number of results to return per query.')),
          topics: z.array(z.enum(['general', 'news', 'finance']).describe('Array of topic types to search for.')),
          searchDepth: z.array(z.enum(['basic', 'advanced']).describe('Array of search depths to use.')),
          exclude_domains: z.array(z.string()).describe('A list of domains to exclude from all search results.'),
        }),
        execute: async ({
          queries,
          maxResults,
          topics,
          searchDepth,
          exclude_domains,
        }: {
          queries: string[];
          maxResults: number[];
          topics: ('general' | 'news' | 'finance')[];
          searchDepth: ('basic' | 'advanced')[];
          exclude_domains?: string[];
        }) => {
          const apiKey = serverEnv.TAVILY_API_KEY;
          const tvly = tavily({ apiKey });

          console.log('Queries:', queries);
          console.log('Max Results:', maxResults);
          console.log('Topics:', topics);
          console.log('Search Depths:', searchDepth);
          console.log('Exclude Domains:', exclude_domains);

          // Execute searches in parallel
          const searchPromises = queries.map(async (query, index) => {
            const data = await tvly.search(query, {
              topic: topics[index] || topics[0] || 'general',
              days: topics[index] === 'news' ? 7 : undefined,
              maxResults: maxResults[index] || maxResults[0] || 10,
              searchDepth: searchDepth[index] || searchDepth[0] || 'basic',
              includeAnswer: true,
              excludeDomains: exclude_domains,
            });

            return {
              query,
              results: deduplicateByDomainAndUrl(data.results).map((obj: any) => ({
                url: obj.url,
                title: obj.title,
                content: obj.content,
                raw_content: obj.raw_content,
                published_date: topics[index] === 'news' ? obj.published_date : undefined,
              })),
            };
          });

          const searchResults = await Promise.all(searchPromises);

          return {
            searches: searchResults,
          };
        },
      }),
      x_search: tool({
        description: 'Search X (formerly Twitter) posts using xAI Live Search.',
        inputSchema: z.object({
          query: z.string().describe('The search query for X posts'),
          startDate: z.string().describe('The start date of the search in the format YYYY-MM-DD'),
          endDate: z.string().describe('The end date of the search in the format YYYY-MM-DD'),
          xHandles: z
            .array(z.string())
            .optional()
            .describe('Optional list of X handles to search from (without @ symbol)'),
          maxResults: z.number().optional().default(15).describe('Maximum number of search results to return'),
        }),
        execute: async ({
          query,
          startDate,
          endDate,
          xHandles,
          maxResults = 15,
        }: {
          query: string;
          startDate: string;
          endDate: string;
          xHandles?: string[];
          maxResults?: number;
        }) => {
          try {
            const searchParameters: any = {
              mode: 'on',
              from_date: startDate,
              to_date: endDate,
              max_search_results: maxResults,
              return_citations: true,
              sources: [xHandles && xHandles.length > 0 ? { type: 'x', x_handles: xHandles } : { type: 'x' }],
            };

            const response = await fetch('https://api.x.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${serverEnv.XAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: 'grok-3-latest',
                messages: [
                  {
                    role: 'user',
                    content: `Search for: ${query}. Please provide the posts with their content, URLs, and any relevant metadata. And cite the sources in the format [Source No.]`,
                  },
                ],
                search_parameters: searchParameters,
              }),
            });

            if (!response.ok) {
              throw new Error(`xAI API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return {
              content: data.choices[0]?.message?.content || '',
              citations: data.citations || [],
              query,
              dateRange: `${startDate} to ${endDate}`,
              handles: xHandles || [],
            };
          } catch (error) {
            console.error('X search error:', error);
            throw error;
          }
        },
      }),
    },
  });

  console.log('Text: ', text);
  console.log('Steps: ', steps);

  return new Response(text);
}
