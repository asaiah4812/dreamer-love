"use client";

import { useEffect, useRef } from "react";
import LoveContent from "@/components/love-content";
import Marquee from "@/components/mauquee"; // Fixed typo in import path (was "mauquee")
import { useGSAP } from "@/hooks/use-gsap";
import { Heart } from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  const contentRef = useRef<HTMLElement>(null);
  const gsapLoaded = useGSAP();

  useEffect(() => {
    if (!gsapLoaded || !contentRef.current) return;

    const { gsap, ScrollTrigger } = window as any;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)");
    const sections = document.querySelectorAll(".page-content__section");
    const marquees = document.querySelectorAll(".marquee div");
    let marqueeText = "";

    // Create floating hearts
    const createFloatingHearts = () => {
      const container = document.querySelector(".floating-hearts");
      if (!container) return;

      for (let i = 0; i < 15; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = "❤️";
        heart.classList.add("floating-heart");
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${Math.random() * 10 + 10}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        container.appendChild(heart);
      }
    };

    createFloatingHearts();

    const updateMarqueeText = () => {
      [...marquees].forEach((marquee) => {
        marquee.classList.add("active");
        marquee.addEventListener("transitionend", () => {
          marquee.classList.remove("active");
          marquee.innerHTML = `${marqueeText} ❤️ `.repeat(20);
        });
      });
    };

    const updateBgColor = (color: string) =>
      document.documentElement.style.setProperty("--color-background", color);

    const setActiveSection = (section: Element) => {
      marqueeText = section.querySelector("h2")?.textContent || "";
      [...sections].forEach((section) => section.classList.remove("active"));
      section.classList.add("active");
      !prefersReducedMotion.matches &&
        updateBgColor(section.getAttribute("data-bg-color") || "#151818");
      updateMarqueeText();
    };

    if (!prefersReducedMotion.matches) {
      gsap.to(".marquee div", {
        scrollTrigger: {
          trigger: ".page-content",
          scrub: 0.25,
          start: "top bottom",
          end: "bottom top",
          ease: "power2",
        },
        xPercent: -50,
      });

      // Add parallax effect to hearts
      gsap.to(".floating-heart", {
        y: "random(-100, 100)",
        x: "random(-50, 50)",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    }

    gsap.utils
      .toArray(".page-content__section h2")
      .forEach((heading: Element) => {
        ScrollTrigger.create({
          trigger: heading,
          start: "top center",
          end: "bottom 200px",
          toggleActions: "play reset play reset",
          ease: "power2",
          onEnter: () =>
            marqueeText !== heading.textContent &&
            setActiveSection(heading.parentElement as Element),
          onEnterBack: () =>
            marqueeText !== heading.textContent &&
            setActiveSection(heading.parentElement as Element),
        });
      });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, [gsapLoaded]);

  return (
    <>
      <div className="floating-hearts"></div>
      <Marquee />
      <main className="page-content" ref={contentRef}>
        <div className="love-header">
          <Heart className="heart-icon pulse" />
          <h1>Love Notes</h1>
          <Heart className="heart-icon pulse" />
        </div>
          
        <LoveContent />
        <Footer/>
      </main>
    </>
  );
}
