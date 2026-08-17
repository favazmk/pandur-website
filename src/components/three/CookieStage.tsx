"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CookieDoodle } from "@/components/brand/Marks";
import { useClientValue } from "@/lib/useMedia";

let cachedSupport: boolean | null = null;
function webglSupported() {
  if (cachedSupport !== null) return cachedSupport;
  try {
    const c = document.createElement("canvas");
    cachedSupport = !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

/**
 * Canvas wrapper.
 *
 * Two gates before a context is ever created:
 *   1. the section must be near the viewport (the page has three stages —
 *      mounting them all up front would cost three GL contexts and, for the
 *      bite scene, a CSG build nobody has scrolled to yet)
 *   2. the browser must be idle, so the hero type paints before the 3D
 *
 * Degrades to the monoline line-art if WebGL is missing or the context is lost.
 * The site must never render blank.
 */
export default function CookieStage({
  children,
  className,
  camera = { position: [0, 0.9, 3.1] as [number, number, number], fov: 38 },
  rootMargin = "600px",
}: {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov: number };
  rootMargin?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Capabilities, read without a setState-in-effect.
  const hasIO = useClientValue(
    () => typeof IntersectionObserver !== "undefined",
    true
  );
  const hasWebGL = useClientValue(() => webglSupported(), true);

  // With no IntersectionObserver there is nothing to wait for.
  const near = seen || !hasIO;
  const failed = !hasWebGL || contextLost;

  // gate 1 — proximity
  useEffect(() => {
    const el = host.current;
    if (!el || !hasIO || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, hasIO, seen]);

  // gate 2 — idle
  useEffect(() => {
    if (!near || failed || idle) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 900 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setIdle(true), 220);
    return () => clearTimeout(t);
  }, [near, failed, idle]);

  return (
    <div ref={host} className={className}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center">
          <CookieDoodle className="h-2/3 w-2/3 animate-drift text-ink/70" />
        </div>
      ) : (
        near &&
        idle && (
          <Canvas
            dpr={[1, 2]}
            camera={camera}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                setContextLost(true);
              });
            }}
          >
            {children}
          </Canvas>
        )
      )}
    </div>
  );
}
