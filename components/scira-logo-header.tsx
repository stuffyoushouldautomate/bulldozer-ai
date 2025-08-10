import React from 'react';
import Image from 'next/image';

export const BulldozerLogoHeader = () => (
  <div className="flex items-center gap-3 my-1.5">
    <Image
      src="/app/apple-icon.png"
      alt="Bulldozer Brain - Local 825"
      className="size-8 rounded-md"
      width={100}
      height={100}
      unoptimized
      quality={100}
      priority
    />
    <div className="flex flex-col">
      <h2 className="text-lg font-bold font-be-vietnam-pro text-foreground">Bulldozer Brain</h2>
      <span className="text-xs text-muted-foreground font-medium">Local 825</span>
    </div>
  </div>
);