"use client";

import { CookieDoodle } from "@/components/brand/Marks";

/**
 * Stands in while a 3D scene chunk is still downloading, and is what renders
 * if WebGL is unavailable. Imports nothing from three — it must stay in the
 * main bundle so it can appear before the 3D chunk arrives.
 */
export default function SceneFallback({
  className = "pointer-events-none absolute inset-0 z-0",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-center">
        <CookieDoodle
          className="h-[38vmin] w-[38vmin] animate-drift text-ink/20"
          strokeWidth={4}
        />
      </div>
    </div>
  );
}
