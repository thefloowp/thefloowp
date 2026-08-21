"use client";

import Image from "next/image";

const imageStyle = {
  width: "100%",
  height: "auto",
  display: "block",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
};

export default function HeroLogo() {
  return (
    <div className="hero-logo-wrap-new">
      <div className="hero-logo-stage-new">
        <div className="hero-logo-reveal-new" aria-hidden="true">
          <Image
            src="/floowp-wt.png"
            alt=""
            width={2048}
            height={565}
            priority
            style={imageStyle}
          />
        </div>

        <div className="hero-logo-final-new">
          <Image
            src="/floowp-wt.png"
            alt="Floowp"
            width={2048}
            height={565}
            priority
            style={imageStyle}
          />
        </div>
      </div>

      <style jsx>{`
        .hero-logo-wrap-new {
          flex: 1;
          min-height: 300px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 0 30px;
          overflow: hidden;
        }

        .hero-logo-stage-new {
          position: relative;
          width: min(68vw, 900px);
          max-width: 100%;
          aspect-ratio: 2048 / 565;
          overflow: hidden;
          flex: 0 0 auto;
        }

        .hero-logo-reveal-new,
        .hero-logo-final-new {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .hero-logo-reveal-new {
          z-index: 2;
          overflow: hidden;
          clip-path: inset(0 100% 0 0);
          animation: logoFilledTrim 1.55s cubic-bezier(0.76, 0, 0.24, 1)
            0.12s forwards;
        }

        .hero-logo-final-new {
          z-index: 3;
          opacity: 0;
          animation:
            logoSolidIn 0.12s linear 1.58s forwards,
            logoDrift 7s ease-in-out 1.85s infinite;
          will-change: transform;
        }

        @keyframes logoFilledTrim {
          0% {
            clip-path: inset(0 100% 0 0);
          }

          16% {
            clip-path: inset(0 86% 0 0);
          }

          36% {
            clip-path: inset(0 67% 0 0);
          }

          58% {
            clip-path: inset(0 43% 0 0);
          }

          78% {
            clip-path: inset(0 20% 0 0);
          }

          100% {
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes logoSolidIn {
          to {
            opacity: 1;
          }
        }

        @keyframes logoDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(6px, -3px, 0);
          }
        }

        @media (max-width: 900px) {
          .hero-logo-wrap-new {
            min-height: 210px;
            padding: 20px 0 24px;
          }

          .hero-logo-stage-new {
            width: min(84vw, 680px);
          }

          .hero-logo-final-new {
            animation:
              logoSolidIn 0.12s linear 1.58s forwards,
              logoDriftMobile 7s ease-in-out 1.85s infinite;
          }
        }

        @keyframes logoDriftMobile {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(3px, -2px, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-logo-reveal-new,
          .hero-logo-final-new {
            animation: none;
          }

          .hero-logo-reveal-new {
            clip-path: inset(0 0 0 0);
          }

          .hero-logo-final-new {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
