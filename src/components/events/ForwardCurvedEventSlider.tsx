import React, { useState, useEffect, useRef, useMemo } from "react"
import Icon from "@/components/common/Icon"

export interface EventSlideItem {
  id: number | string
  title: string
  type: string
  location: string
  time: string
  month: string
  day: string
  people: number
  accent: string
  thumbnail?: string
  tagline?: string
  featured?: boolean
}

interface ForwardCurvedEventSliderProps {
  events: EventSlideItem[]
  onSelectEvent?: (event: EventSlideItem) => void
  onExploreAll?: () => void
  title?: string
  subtitle?: string
}

/**
 * ForwardCurvedEventSlider
 *
 * Implements a forward-curved (convex 3D cylinder) panoramic ribbon carousel:
 * - 3D perspective with center card bowing forward towards the user (translateZ + scale).
 * - Side cards curve backwards into the distance with rotateY and perspective depth.
 * - 16:9 aspect ratio thumbnail containers (standard YouTube video thumbnail format).
 * - Circular outline navigation controls (← and →) centered underneath, matching reference design.
 * - Automatic forward sliding with pause on mouse hover / mobile touch.
 * - Category filter pills and active slide indicator dots.
 */
export default function ForwardCurvedEventSlider({
  events,
  onSelectEvent,
  onExploreAll,
  title = "Trending Campus Events & Hackathons",
  subtitle = "Connect · Collaborate · Grow with top student-led initiatives",
}: ForwardCurvedEventSliderProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [cardSpacing, setCardSpacing] = useState(420)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Dynamically update card spacing based on window viewport width
  useEffect(() => {
    function updateSpacing() {
      const width = typeof window !== "undefined" ? window.innerWidth : 1200
      if (width < 640) {
        setCardSpacing(290)
      } else if (width < 1024) {
        setCardSpacing(370)
      } else {
        setCardSpacing(430)
      }
    }
    updateSpacing()
    window.addEventListener("resize", updateSpacing)
    return () => window.removeEventListener("resize", updateSpacing)
  }, [])

  // Categories list derived from events
  const categories = useMemo(() => {
    const list = ["All", ...Array.from(new Set(events.map((e) => e.type)))]
    return list
  }, [events])

  // Filtered event list
  const filteredEvents = useMemo(() => {
    if (selectedCategory === "All") return events
    return events.filter((e) => e.type === selectedCategory)
  }, [events, selectedCategory])

  // Reset activeIndex when filter changes
  useEffect(() => {
    setActiveIndex(0)
  }, [selectedCategory])

  // Automatic forward sliding every 3.6 seconds
  useEffect(() => {
    if (isPaused || filteredEvents.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredEvents.length)
    }, 3600)

    return () => clearInterval(timer)
  }, [isPaused, filteredEvents.length])

  // Manual navigation handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredEvents.length)
  }

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const currentX = e.touches[0].clientX
    setTouchDeltaX(currentX - touchStartX)
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX > 0) {
        handlePrev()
      } else {
        handleNext()
      }
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
    setTimeout(() => setIsPaused(false), 2000)
  }

  // Fallback thumbnail generator for 16:9 high-res imagery
  const getThumbnail = (event: EventSlideItem, index: number) => {
    if (event.thumbnail) return event.thumbnail

    const defaults = [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1280&h=720&q=80",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1280&h=720&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1280&h=720&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&h=720&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&h=720&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1280&h=720&q=80",
    ]
    return defaults[index % defaults.length]
  }

  return (
    <section className="space-y-4 select-none relative overflow-hidden py-1">
      {/* Header with Title, Slogan, and Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f5b800]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
              Connect · Collaborate · Grow
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-[10px] font-extrabold text-amber-800 border border-amber-400/30 backdrop-blur-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-ping"}`} />
              {isPaused ? "Paused" : "Auto-sliding Forward"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Category Filter Pills & Explore All */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20 scale-105"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-slate-950 shadow-2xs"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {onExploreAll && (
            <button
              type="button"
              onClick={onExploreAll}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 pl-2 whitespace-nowrap cursor-pointer"
            >
              See all <Icon name="arrow" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 
        3D FORWARD-CURVED CYLINDER STAGE
        - perspective: 1200px
        - Center item pops forward (convex curve facing viewer)
        - Side items curve backward into depth with rotateY
        - YouTube thumbnail 16:9 ratio
      */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden py-2 md:py-3"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Subtle Ambient Glowing Dome behind the active card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[320px] rounded-full bg-amber-400/12 blur-[100px] pointer-events-none" />

        {/* 
          Ribbon Silhouette Arch:
          Forward-curved ribbon silhouette with gentle convex arch
        */}
        <div className="relative h-[260px] sm:h-[310px] md:h-[360px] lg:h-[380px] w-full flex items-center justify-center">
          {filteredEvents.map((event, index) => {
            // Calculate circular offset relative to activeIndex
            const count = filteredEvents.length
            let offset = (index - activeIndex + count) % count
            if (offset > count / 2) {
              offset -= count
            }

            // Visible range: up to 2 cards on each side
            const isVisible = Math.abs(offset) <= 2
            const isCenter = offset === 0

            // Responsive offset calculations for forward-curved cylinder
            // Desktop horizontal displacement based on viewport
            const xOffset = offset * cardSpacing // px
            // In forward curve: center has highest Z, sides drop back in Z
            const zOffset = isCenter ? 60 : Math.abs(offset) === 1 ? -40 : -120 // px
            // In forward curve: left items angle back (+rotateY), right items angle back (-rotateY)
            const yRotation = offset * -18 // degrees
            // Scale drops gracefully on sides
            const cardScale = isCenter ? 1.05 : Math.abs(offset) === 1 ? 0.9 : 0.78
            // Opacity drops slightly on sides
            const cardOpacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.85 : 0.45
            // Z-Index hierarchy: center on top
            const zIndex = isCenter ? 30 : 20 - Math.abs(offset) * 5

            if (!isVisible) {
              return null
            }

            const thumbnailSrc = getThumbnail(event, index)

            return (
              <div
                key={event.id}
                onClick={() => {
                  if (isCenter) {
                    onSelectEvent?.(event)
                  } else {
                    setActiveIndex(index)
                  }
                }}
                className={`absolute left-1/2 top-1/2 transition-all duration-700 ease-out cursor-pointer group ${
                  isCenter ? "cursor-pointer" : "cursor-pointer hover:opacity-95"
                }`}
                style={{
                  transform: `translate3d(calc(-50% + ${xOffset}px), -50%, ${zOffset}px) rotateY(${yRotation}deg) scale(${cardScale})`,
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  zIndex,
                  opacity: cardOpacity,
                  width: "min(90vw, 540px)",
                }}
              >
                {/* 
                  16:9 YouTube Thumbnail Container
                  Includes border glow, dark cinematic vignette, and event metadata (play button removed as requested)
                */}
                <div
                  className={`relative aspect-[16/9] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border ${
                    isCenter
                      ? "border-amber-400/60 shadow-amber-500/20 shadow-2xl ring-2 ring-amber-400/30"
                      : "border-slate-700/40 shadow-xl"
                  } bg-slate-950`}
                >
                  {/* High-Resolution Thumbnail Image */}
                  <img
                    src={thumbnailSrc}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* YouTube Thumbnail Cinematic Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 pointer-events-none" />

                  {/* Top Badges Row */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    {/* Category Tag */}
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/40 text-[10px] md:text-xs font-black tracking-wider uppercase shadow-md">
                      {event.type}
                    </span>

                    {/* Date Tag */}
                    <div className="px-2.5 py-1 rounded-lg bg-white/95 text-slate-950 font-black text-center text-xs shadow-lg flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">{event.month}</span>
                      <span className="text-sm font-black">{event.day}</span>
                    </div>
                  </div>

                  {/* Bottom Meta & Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10 pointer-events-none space-y-1.5">
                    <div className="flex items-center gap-3 text-slate-300 text-[11px] md:text-xs font-semibold">
                      <span className="flex items-center gap-1 truncate">
                        <Icon name="clock" size={12} /> {event.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <Icon name="pin" size={12} /> {event.location}
                      </span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">
                        👥 +{event.people} registered
                      </span>
                    </div>

                    <h3 className="text-base md:text-xl font-black text-white leading-tight drop-shadow-md truncate">
                      {event.title}
                    </h3>

                    {event.tagline && (
                      <p className="text-xs text-slate-300/90 line-clamp-1 font-medium hidden sm:block">
                        {event.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Pill CTA Bar for Active Center Card */}
                {isCenter && (
                  <div className="pt-3 flex items-center justify-between px-2 animate-fade">
                    <div className="flex items-center -space-x-2">
                      <span className="w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-950 shadow-sm">
                        AK
                      </span>
                      <span className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                        RM
                      </span>
                      <span className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                        +
                      </span>
                      <span className="pl-3 text-xs font-bold text-slate-700">
                        {event.people} students participating
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectEvent?.(event)
                      }}
                      className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Event</span>
                      <Icon name="arrow" size={13} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 
        BOTTOM NAVIGATION CONTROLS
        Strictly matches the uploaded reference design:
        - Centered circular navigation buttons (← and →)
        - Clean circular outline with smooth hover interactions
        - Progress dots indicator below
      */}
      <div className="flex flex-col items-center justify-center gap-3 pt-2">
        {/* Circular Arrows Row matching reference screenshot */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            title="Slide backward"
            className="w-12 h-12 rounded-full border-2 border-slate-300 bg-white text-slate-700 hover:border-amber-500 hover:bg-amber-400 hover:text-slate-950 shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer group"
          >
            <span className="text-xl font-bold transition-transform duration-200 group-hover:-translate-x-0.5 select-none">
              ←
            </span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            title="Slide forward"
            className="w-12 h-12 rounded-full border-2 border-slate-300 bg-white text-slate-700 hover:border-amber-500 hover:bg-amber-400 hover:text-slate-950 shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer group"
          >
            <span className="text-xl font-bold transition-transform duration-200 group-hover:translate-x-0.5 select-none">
              →
            </span>
          </button>
        </div>

        {/* Progress Indicator Dots */}
        {filteredEvents.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {filteredEvents.map((ev, idx) => (
              <button
                key={ev.id}
                type="button"
                aria-label={`Jump to event ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "w-8 bg-amber-400 shadow-[0_0_8px_#f5b800]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
