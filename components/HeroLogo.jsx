"use client";

import Image from "next/image";

export default function HeroLogo() {
  return (
    <div className="hero-logo-wrap">
      <div className="hero-logo-stage">
        <div className="hero-logo-base" aria-hidden="true">
          <Image
            src="/floowp-wt.png"
            alt=""
            width={2048}
            height={565}
            className="hero-logo-image"
          />
        </div>

        <div className="hero-logo-fill-window" aria-hidden="true">
          <Image
            src="/floowp-wt.png"
            alt=""
            width={2048}
            height={565}
            className="hero-logo-image hero-logo-fill"
            priority
          />
        </div>

        <div className="hero-logo-shimmer-window" aria-hidden="true">
          <Image
            src="/floowp-wt.png"
            alt=""
            width={2048}
            height={565}
            className="hero-logo-image hero-logo-shimmer"
          />
        </div>

        <Image
          src="/floowp-wt.png"
          alt="Floowp"
          width={2048}
          height={565}
          className="hero-logo-image hero-logo-final"
          priority
        />

        <span className="hero-logo-sheen" aria-hidden="true" />
      </div>

      <style jsx>{`
        .hero-logo-wrap {
          flex: 1;
          min-height: 320px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 0 30px;
          overflow: hidden;
        }

        .hero-logo-stage {
          position: relative;
          width: min(74vw, 980px);
          display: flex;
          align-items: center;
          justify-content: center;
          isolation: isolate;
        }

        .hero-logo-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }

        .hero-logo-base,
        .hero-logo-fill-window,
        .hero-logo-shimmer-window,
        .hero-logo-final {
          position: absolute;
          inset: 0;
        }

        .hero-logo-base {
          opacity: 0.12;
          transform: translateY(2px);
          filter: blur(0.4px);
        }

        .hero-logo-fill-window,
        .hero-logo-shimmer-window {
          overflow: hidden;
          width: 0%;
        }

        .hero-logo-fill-window {
          z-index: 2;
          animation: fillTrim 1.45s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards;
        }

        .hero-logo-fill {
          filter: brightness(1.04);
        }

        .hero-logo-shimmer-window {
          z-index: 3;
          mix-blend-mode: screen;
          animation: shimmerTrim 1.2s cubic-bezier(0.25, 1, 0.3, 1) 0.42s forwards;
        }

        .hero-logo-shimmer {
          opacity: 0.5;
          filter: brightness(1.35) blur(0.5px);
        }

        .hero-logo-final {
          position: relative;
          z-index: 4;
          opacity: 0;
          animation:
            finalReveal 0.15s linear 1.36s forwards,
            floatLogo 6.8s ease-in-out 1.65s infinite;
          will-change: transform;
        }

        .hero-logo-sheen {
          position: absolute;
          inset: -6% -8%;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.02) 35%,
            rgba(255, 255, 255, 0.28) 50%,
            rgba(255, 255, 255, 0.02) 65%,
            transparent 100%
          );
          transform: translateX(-120%) skewX(-18deg);
          animation: sheenPass 1.1s ease-out 1s forwards;
          mix-blend-mode: screen;
        }

        @keyframes fillTrim {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }

        @keyframes shimmerTrim {
          0% {
            width: 0%;
            opacity: 0;
          }

          18% {
            opacity: 0.75;
          }

          100% {
            width: 100%;
            opacity: 0;
          }
        }

        @keyframes finalReveal {
          to {
            opacity: 1;
          }
        }

        @keyframes sheenPass {
          0% {
            opacity: 0;
            transform: translateX(-120%) skewX(-18deg);
          }

          18% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateX(120%) skewX(-18deg);
          }
        }

        @keyframes floatLogo {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          25% {
            transform: translate3d(8px, -4px, 0);
          }

          50% {
            transform: translate3d(14px, 1px, 0);
          }

          75% {
            transform: translate3d(5px, 5px, 0);
          }
        }

        @media (max-width: 900px) {
          .hero-logo-wrap {
            min-height: 220px;
            padding: 22px 0 26px;
          }

          .hero-logo-stage {
            width: min(88vw, 760px);
          }

          .hero-logo-final {
            animation:
              finalReveal 0.15s linear 1.36s forwards,
              floatLogoMobile 6.8s ease-in-out 1.65s infinite;
          }
        }

        @keyframes floatLogoMobile {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          25% {
            transform: translate3d(4px, -2px, 0);
          }

          50% {
            transform: translate3d(7px, 1px, 0);
          }

          75% {
            transform: translate3d(2px, 3px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-logo-fill-window,
          .hero-logo-shimmer-window,
          .hero-logo-final,
          .hero-logo-sheen {
            animation: none;
          }

          .hero-logo-fill-window {
            width: 100%;
          }

          .hero-logo-shimmer-window,
          .hero-logo-sheen {
            display: none;
          }

          .hero-logo-final {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
