"use client";

import { useEffect, useState } from "react";

export function useGSAP() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load GSAP and ScrollTrigger dynamically
    const loadGSAP = async () => {
      try {
        // Import GSAP core
        const gsap = await import("gsap").then(
          (module) => module.default || module
        );

        // Import ScrollTrigger as a named export from gsap/ScrollTrigger
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        // Register the plugin
        gsap.registerPlugin(ScrollTrigger);

        // Attach to window for global access
        (window as any).gsap = gsap;
        (window as any).ScrollTrigger = ScrollTrigger;

        setLoaded(true);
      } catch (error) {
        console.error("Failed to load GSAP:", error);

        // Fallback to CDN if local import fails
        try {
          // Check if GSAP is already available globally (from CDN)
          if (!(window as any).gsap) {
            // Load GSAP from CDN
            await loadScript(
              "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
            );
            await loadScript(
              "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
            );

            // Register the plugin
            (window as any).gsap.registerPlugin((window as any).ScrollTrigger);
          }

          setLoaded(true);
        } catch (cdnError) {
          console.error("Failed to load GSAP from CDN:", cdnError);
        }
      }
    };

    loadGSAP();
  }, []);

  return loaded;
}

// Helper function to load scripts from CDN
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
