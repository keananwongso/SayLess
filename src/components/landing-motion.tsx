"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Progressive enhancement: content stays visible if JS, observation, or
// animation support is unavailable. Never intercept scrolling or move focus.
export function LandingMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root.current || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const targets = entry.target.hasAttribute("data-stagger")
          ? [...entry.target.children] : [entry.target];
        targets.forEach((target, index) => {
          const restingTransform = window.getComputedStyle(target).transform;
          const transform = restingTransform === "none" ? "" : restingTransform;
          animations.push(target.animate([
            { opacity: 0.15, transform: `translateY(28px) scale(.985) ${transform}` },
            { opacity: 1, transform: `translateY(0) scale(1) ${transform}` },
          ], { duration: 650, delay: index * 90, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
        });
      }
    }, { threshold: 0.12 });
    root.current.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const cancelMotion = () => {
      if (preference.matches) animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", cancelMotion);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", cancelMotion);
    };
  }, []);
  return <div className={className} ref={root}>{children}</div>;
}
