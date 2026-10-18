import React from "react"

interface GrapeVineBackgroundProps {
  orientation?: "horizontal" | "vertical"
  className?: string
  opacity?: number
}

/**
 * GrapeVineBackground: An artistic, elegant animated "growing grape vine" (अंगूर की बेल)
 * Featuring climbing vines, delicate grape leaves with veins, curling tendrils,
 * and hanging amethyst/golden grape clusters with gentle organic animations.
 */
export default function GrapeVineBackground({
  orientation = "horizontal",
  className = "",
  opacity = 0.35,
}: GrapeVineBackgroundProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 260 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Vine Stem Gradient */}
            <linearGradient id="verticalVineStem" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4d7c0f" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#65a30d" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#84cc16" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.85" />
            </linearGradient>

            {/* Grape Leaf Gradient */}
            <linearGradient id="grapeLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="50%" stopColor="#4d7c0f" />
              <stop offset="100%" stopColor="#1e3a12" />
            </linearGradient>

            {/* Golden Grape Leaf Gradient (for contrast) */}
            <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>

            {/* Amethyst Grape Berry Gradient with Glass Luster */}
            <radialGradient id="purpleGrapeGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="35%" stopColor="#a855f7" />
              <stop offset="75%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#3b0764" />
            </radialGradient>

            {/* Golden Amber Grape Berry Gradient */}
            <radialGradient id="amberGrapeGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            {/* Ambient Leaf Glow Filter */}
            <filter id="vineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main Climbing Vine Stem */}
          <path
            d="M 30,900 C 55,780 15,680 45,560 C 70,450 20,340 50,220 C 75,120 30,60 40,0"
            stroke="url(#verticalVineStem)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1200"
            strokeDashoffset="0"
            className="animate-vine-grow"
          />

          {/* Secondary Branch 1 */}
          <path
            d="M 45,560 C 85,540 120,560 145,530 C 165,505 180,515 195,500"
            stroke="url(#verticalVineStem)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Secondary Branch 2 */}
          <path
            d="M 50,220 C 95,200 135,230 170,195 C 190,175 215,185 235,160"
            stroke="url(#verticalVineStem)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Secondary Branch 3 (lower) */}
          <path
            d="M 35,740 C 75,720 110,750 140,710"
            stroke="url(#verticalVineStem)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Curly Tendrils */}
          <path
            d="M 140,710 C 160,695 175,705 170,725 C 165,740 150,735 152,720"
            stroke="#84cc16"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 195,500 C 215,490 225,505 220,520 C 215,530 205,525 208,512"
            stroke="#eab308"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 235,160 C 250,145 258,160 252,175 C 245,185 235,180 238,168"
            stroke="#84cc16"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* --- GRAPE LEAVES --- */}
          {/* Leaf 1 (Top) */}
          <g className="animate-leaf-sway" style={{ transformOrigin: "40px 100px" }}>
            <path
              d="M 40,100 C 20,80 15,50 35,35 C 55,20 75,45 80,65 C 85,85 60,115 40,100 Z"
              fill="url(#grapeLeafGrad)"
              opacity="0.85"
            />
            {/* Veins */}
            <path d="M 40,100 Q 55,65 65,45 M 50,80 Q 30,70 25,60 M 55,70 Q 75,60 78,55" stroke="#a3e635" strokeWidth="0.8" opacity="0.7" fill="none" />
          </g>

          {/* Leaf 2 (Mid-high) */}
          <g className="animate-leaf-sway-delayed" style={{ transformOrigin: "120px 210px" }}>
            <path
              d="M 120,210 C 100,195 95,170 115,155 C 135,140 155,160 160,180 C 165,200 140,225 120,210 Z"
              fill="url(#goldLeafGrad)"
              opacity="0.8"
            />
            <path d="M 120,210 Q 135,180 145,165 M 130,195 Q 110,185 105,175 M 135,185 Q 155,175 158,170" stroke="#fef08a" strokeWidth="0.8" opacity="0.8" fill="none" />
          </g>

          {/* Leaf 3 (Center) */}
          <g className="animate-leaf-sway" style={{ transformOrigin: "45, 420" }}>
            <path
              d="M 45,420 C 20,400 15,370 38,355 C 60,340 82,365 85,390 C 88,410 65,435 45,420 Z"
              fill="url(#grapeLeafGrad)"
              opacity="0.85"
            />
            <path d="M 45,420 Q 60,385 70,365 M 52,400 Q 30,390 25,380 M 58,390 Q 78,380 80,375" stroke="#a3e635" strokeWidth="0.8" opacity="0.7" fill="none" />
          </g>

          {/* Leaf 4 (Lower Branch) */}
          <g className="animate-leaf-sway-delayed" style={{ transformOrigin: "100px 550px" }}>
            <path
              d="M 100,550 C 80,535 75,510 95,495 C 115,480 135,500 140,520 C 145,540 120,565 100,550 Z"
              fill="url(#grapeLeafGrad)"
              opacity="0.8"
            />
            <path d="M 100,550 Q 115,520 125,505" stroke="#bef264" strokeWidth="0.8" opacity="0.7" fill="none" />
          </g>

          {/* Leaf 5 (Bottom) */}
          <g className="animate-leaf-sway" style={{ transformOrigin: "35px 780px" }}>
            <path
              d="M 35,780 C 15,760 10,730 30,715 C 50,700 70,725 75,745 C 80,765 55,795 35,780 Z"
              fill="url(#goldLeafGrad)"
              opacity="0.8"
            />
          </g>

          {/* --- GRAPE BUNCH 1: Hanging Amethyst Cluster at y=250 --- */}
          <g className="animate-grape-glow" transform="translate(145, 205)">
            {/* Top row */}
            <circle cx="0" cy="0" r="6" fill="url(#purpleGrapeGrad)" />
            <circle cx="10" cy="2" r="6.5" fill="url(#purpleGrapeGrad)" />
            <circle cx="20" cy="0" r="6" fill="url(#purpleGrapeGrad)" />
            {/* Second row */}
            <circle cx="5" cy="9" r="6" fill="url(#purpleGrapeGrad)" />
            <circle cx="15" cy="10" r="6" fill="url(#purpleGrapeGrad)" />
            {/* Third row */}
            <circle cx="10" cy="18" r="5.5" fill="url(#purpleGrapeGrad)" />
            {/* Bottom tip */}
            <circle cx="10" cy="26" r="4.5" fill="url(#purpleGrapeGrad)" />
            {/* Tiny stem */}
            <path d="M 10, -5 Q 8, -12 2, -15" stroke="#65a30d" strokeWidth="1.5" fill="none" />
          </g>

          {/* --- GRAPE BUNCH 2: Golden Amber Cluster at y=540 --- */}
          <g className="animate-grape-glow-delayed" transform="translate(130, 530)">
            <circle cx="0" cy="0" r="5.5" fill="url(#amberGrapeGrad)" />
            <circle cx="9" cy="1" r="6" fill="url(#amberGrapeGrad)" />
            <circle cx="18" cy="0" r="5.5" fill="url(#amberGrapeGrad)" />
            <circle cx="5" cy="8" r="5.5" fill="url(#amberGrapeGrad)" />
            <circle cx="14" cy="9" r="5.5" fill="url(#amberGrapeGrad)" />
            <circle cx="9" cy="16" r="5" fill="url(#amberGrapeGrad)" />
            <circle cx="9" cy="23" r="4" fill="url(#amberGrapeGrad)" />
            <path d="M 9, -4 Q 5, -10 0, -12" stroke="#eab308" strokeWidth="1.4" fill="none" />
          </g>

          {/* --- GRAPE BUNCH 3: Amethyst Cluster at y=720 --- */}
          <g className="animate-grape-glow" transform="translate(85, 715)">
            <circle cx="0" cy="0" r="5" fill="url(#purpleGrapeGrad)" />
            <circle cx="8" cy="1" r="5.5" fill="url(#purpleGrapeGrad)" />
            <circle cx="16" cy="0" r="5" fill="url(#purpleGrapeGrad)" />
            <circle cx="4" cy="7" r="5" fill="url(#purpleGrapeGrad)" />
            <circle cx="12" cy="8" r="5" fill="url(#purpleGrapeGrad)" />
            <circle cx="8" cy="14" r="4.5" fill="url(#purpleGrapeGrad)" />
            <path d="M 8, -4 Q 6, -9 2, -11" stroke="#65a30d" strokeWidth="1.3" fill="none" />
          </g>
        </svg>
      </div>
    )
  }

  // Horizontal Navbar Orientation
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full min-w-[900px]"
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Horizontal Vine Stem Gradient */}
          <linearGradient id="horizVineStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4d7c0f" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#84cc16" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f5b800" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#84cc16" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0.8" />
          </linearGradient>

          {/* Grape Leaf Gradient */}
          <linearGradient id="hGrapeLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="60%" stopColor="#4d7c0f" />
            <stop offset="100%" stopColor="#1e3a12" />
          </linearGradient>

          {/* Amber Leaf Gradient */}
          <linearGradient id="hGoldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Purple Amethyst Grape Gradient */}
          <radialGradient id="hPurpleGrape" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="35%" stopColor="#c084fc" />
            <stop offset="75%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#3b0764" />
          </radialGradient>

          {/* Golden Grape Gradient */}
          <radialGradient id="hAmberGrape" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="40%" stopColor="#f5b800" />
            <stop offset="80%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>
        </defs>

        {/* Main Growing Vine across the navbar */}
        <path
          d="M -10,35 Q 120,65 260,30 T 560,45 T 840,25 T 1140,48 T 1450,30"
          stroke="url(#horizVineStem)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="1600"
          strokeDashoffset="0"
          className="animate-vine-grow"
        />

        {/* Secondary Upper Wave */}
        <path
          d="M 180,42 Q 280,15 390,28 T 680,18 T 990,32 T 1280,16"
          stroke="url(#horizVineStem)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Tendrils curling into space */}
        <path
          d="M 390,28 C 410,12 425,22 418,35 C 412,45 400,40 405,30"
          stroke="#84cc16"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 720,20 C 740,5 755,14 748,26 C 742,36 730,32 735,22"
          stroke="#eab308"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 1040,30 C 1060,15 1075,24 1070,36 C 1064,46 1052,42 1056,32"
          stroke="#84cc16"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* --- LEAVES ACROSS THE NAVBAR --- */}
        {/* Leaf 1 (Left at x=140) */}
        <g className="animate-leaf-sway" style={{ transformOrigin: "140px 48px" }}>
          <path
            d="M 140,48 C 125,28 135,10 155,18 C 175,25 170,45 160,55 C 150,65 145,58 140,48 Z"
            fill="url(#hGrapeLeafGrad)"
            opacity="0.85"
          />
          <path d="M 140,48 Q 155,30 162,24" stroke="#d9f99d" strokeWidth="0.7" fill="none" />
        </g>

        {/* Leaf 2 (Near Clan Center at x=340) */}
        <g className="animate-leaf-sway-delayed" style={{ transformOrigin: "340px 32px" }}>
          <path
            d="M 340,32 C 320,15 330,-2 350,5 C 370,12 368,32 358,42 C 348,52 344,42 340,32 Z"
            fill="url(#hGoldLeafGrad)"
            opacity="0.8"
          />
          <path d="M 340,32 Q 352,16 358,10" stroke="#fef08a" strokeWidth="0.7" fill="none" />
        </g>

        {/* Leaf 3 (Mid Left at x=520) */}
        <g className="animate-leaf-sway" style={{ transformOrigin: "520px 44px" }}>
          <path
            d="M 520,44 C 505,24 515,6 535,14 C 555,22 550,42 540,52 C 530,62 525,54 520,44 Z"
            fill="url(#hGrapeLeafGrad)"
            opacity="0.85"
          />
        </g>

        {/* Leaf 4 (Center at x=780) */}
        <g className="animate-leaf-sway-delayed" style={{ transformOrigin: "780px 24px" }}>
          <path
            d="M 780,24 C 760,8 770,-8 790,-2 C 810,5 808,24 798,34 C 788,44 784,34 780,24 Z"
            fill="url(#hGoldLeafGrad)"
            opacity="0.8"
          />
        </g>

        {/* Leaf 5 (Mid Right at x=980) */}
        <g className="animate-leaf-sway" style={{ transformOrigin: "980px 40px" }}>
          <path
            d="M 980,40 C 965,20 975,2 995,10 C 1015,18 1010,38 1000,48 C 990,58 985,50 980,40 Z"
            fill="url(#hGrapeLeafGrad)"
            opacity="0.85"
          />
        </g>

        {/* Leaf 6 (Right at x=1220) */}
        <g className="animate-leaf-sway-delayed" style={{ transformOrigin: "1220px 22px" }}>
          <path
            d="M 1220,22 C 1200,6 1210,-10 1230,-4 C 1250,3 1248,22 1238,32 C 1228,42 1224,32 1220,22 Z"
            fill="url(#hGoldLeafGrad)"
            opacity="0.8"
          />
        </g>

        {/* --- HANGING GRAPE CLUSTERS --- */}
        {/* Cluster 1: Amethyst cluster at x=240 */}
        <g className="animate-grape-glow" transform="translate(240, 36)">
          <circle cx="0" cy="0" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="8" cy="1" r="5.5" fill="url(#hPurpleGrape)" />
          <circle cx="16" cy="0" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="4" cy="7" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="12" cy="8" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="8" cy="15" r="4.5" fill="url(#hPurpleGrape)" />
          <circle cx="8" cy="22" r="3.5" fill="url(#hPurpleGrape)" />
          <path d="M 8, -3 Q 6, -8 2, -10" stroke="#65a30d" strokeWidth="1.2" fill="none" />
        </g>

        {/* Cluster 2: Golden Amber cluster at x=640 */}
        <g className="animate-grape-glow-delayed" transform="translate(640, 30)">
          <circle cx="0" cy="0" r="5" fill="url(#hAmberGrape)" />
          <circle cx="8" cy="1" r="5.5" fill="url(#hAmberGrape)" />
          <circle cx="16" cy="0" r="5" fill="url(#hAmberGrape)" />
          <circle cx="4" cy="7" r="5" fill="url(#hAmberGrape)" />
          <circle cx="12" cy="8" r="5" fill="url(#hAmberGrape)" />
          <circle cx="8" cy="14" r="4.5" fill="url(#hAmberGrape)" />
          <path d="M 8, -3 Q 6, -7 3, -9" stroke="#eab308" strokeWidth="1.2" fill="none" />
        </g>

        {/* Cluster 3: Amethyst cluster at x=1080 */}
        <g className="animate-grape-glow" transform="translate(1080, 42)">
          <circle cx="0" cy="0" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="8" cy="1" r="5.5" fill="url(#hPurpleGrape)" />
          <circle cx="16" cy="0" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="4" cy="7" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="12" cy="8" r="5" fill="url(#hPurpleGrape)" />
          <circle cx="8" cy="15" r="4.5" fill="url(#hPurpleGrape)" />
          <circle cx="8" cy="21" r="3.5" fill="url(#hPurpleGrape)" />
          <path d="M 8, -3 Q 6, -8 2, -10" stroke="#65a30d" strokeWidth="1.2" fill="none" />
        </g>
      </svg>
    </div>
  )
}
