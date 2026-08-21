"use client";

import Image from "next/image";

export default function HeroLogo() {
  return (
    <div className="hero-logo-wrap">
      <div className="hero-logo-stage">
        <div className="hero-logo-reveal" aria-hidden="true">
          <Image
            src="/floowp-wt.png"
            alt=""
            width={2048}
            height={565}
            className="hero-logo-image"
            priority
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
      </div>

      <style jsx>{`
        .hero-logo-wrap {
          flex: 1;
          min-height: 300px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 0 30px;
          overflow: hidden;
        }

        .hero-logo-stage {
          position: relative;
          width: min(70vw, 940px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-logo-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }

        .hero-logo-reveal {
          position: absolute;
          inset: 0;
          overflow: hidden;
          clip-path: inset(0 100% 0 0);
          animation: logoTrimReveal 1.45s cubic-bezier(0.77, 0, 0.18, 1)
            0.12s forwards;
        }

        .hero-logo-final {
          position: relative;
          opacity: 0;
          animation:
            logoFinalIn 0.18s ease 1.48s forwards,
            logoFloat 7s ease-in-out 1.8s infinite;
          will-change: transform;
        }

        @keyframes logoTrimReveal {
          0% {
            clip-path: inset(0 100% 0 0);
          }

          28% {
            clip-path: inset(0 72% 0 0);
          }

          55% {
            clip-path: inset(0 43% 0 0);
          }

          78% {
            clip-path: inset(0 18% 0 0);
          }

          100% {
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes logoFinalIn {
          to {
            opacity: 1;
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(8px, -4px, 0);
          }
        }

        @media (max-width: 900px) {
          .hero-logo-wrap {
            min-height: 220px;
            padding: 20px 0 24px;
          }

          .hero-logo-stage {
            width: min(86vw, 720px);
          }

          .hero-logo-final {
            animation:
              logoFinalIn 0.18s ease 1.48s forwards,
              logoFloatMobile 7s ease-in-out 1.8s infinite;
          }
        }

        @keyframes logoFloatMobile {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(4px, -2px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-logo-reveal,
          .hero-logo-final {
            animation: none;
          }

          .hero-logo-reveal {
            clip-path: inset(0 0 0 0);
          }

          .hero-logo-final {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
