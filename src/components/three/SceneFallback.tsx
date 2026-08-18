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
      {/*
       * Smaller and fainter than the scene it stands in for, and offset the
       * same way, so a slow chunk or a machine without WebGL never puts a
       * heavy outline straight through the page title.
       */}
      <div className="flex h-full w-full items-center justify-center">
        <CookieDoodle
          className="h-[26vmin] w-[26vmin] translate-x-[14%] translate-y-[18%] animate-drift text-ink/12"
          strokeWidth={4}
        />
      </div>
    </div>
  );
}
