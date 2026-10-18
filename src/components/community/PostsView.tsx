import React, { useState, useEffect } from "react"
import { mernApi } from "@/services/mernApi"

export interface CommunityPost {
  id: string
  authorName: string
  authorAvatar?: string
  authorInitials: string
  authorRole: string
  clanName: string
  timestamp: string
  content: string
  imageUrl?: string
  tags: string[]
  likesCount: number
  isLiked: boolean
  commentsCount: number
  sharesCount: number
}

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Devansh Sharma",
    authorInitials: "DS",
    authorRole: "Clan Lead · Binary Beasts",
    clanName: "Binary Beasts",
    timestamp: "2 hours ago",
    content:
      "🏆 Huge shoutout to the entire team! Binary Beasts secured 1st Place at the North India Hackfest 2026! We deployed a real-time autonomous emergency routing model in 36 hours. Massive appreciation to Aarav Khanna for collaborating on the live telemetry integration. Teamwork at its finest!",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=600&q=80",
    tags: ["Hackfest2026", "AI", "EmergencyRouting", "BinaryBeasts"],
    likesCount: 58,
    isLiked: true,
    commentsCount: 14,
    sharesCount: 8,
  },
  {
    id: "post-2",
    authorName: "Aarav Khanna",
    authorInitials: "AK",
    authorRole: "Lead Frontend · Pixel Pirates",
    clanName: "Pixel Pirates",
    timestamp: "Yesterday at 4:30 PM",
    content:
      "🎨 Proud to announce our new open-source project: Campus Clans Glassmorphic UI Kit v2! Built with React 19, Tailwind CSS v4, and KaTeX math rendering. Includes 3D convex card carousels, responsive bottom sheets, and dark executive palettes. Documentation is live on GitHub.",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80",
    tags: ["DesignSystems", "React19", "TailwindCSS", "OpenSource"],
    likesCount: 84,
    isLiked: false,
    commentsCount: 22,
    sharesCount: 19,
  },
  {
    id: "post-3",
    authorName: "Kabir Singh",
    authorInitials: "KS",
    authorRole: "Robotics Club Lead",
    clanName: "Circuit Crew",
    timestamp: "2 days ago",
    content:
      "🤖 Full hardware integration benchmark passed! Our autonomous rover telemetry is streaming sensor packages over 5.8GHz radio link to the web client seamlessly. Next stop: National RoboCon 2026 Arena!",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&h=600&q=80",
    tags: ["Robotics", "Hardware", "CircuitCrew", "RoboCon"],
    likesCount: 43,
    isLiked: false,
    commentsCount: 9,
    sharesCount: 5,
  },
  {
    id: "post-4",
    authorName: "Riya Malhotra",
    authorInitials: "RM",
    authorRole: "Design Strategist",
    clanName: "Pixel Pirates",
    timestamp: "3 days ago",
    content:
      "💡 Key takeaways from our 'Designing for Impact' sprint: 1) Test with real campus students within 48 hours. 2) Accessibility isn't an afterthought — WCAG contrast should be baked in from sprint day 1. Slides and Figma files shared in the clan channel!",
    tags: ["UIUX", "DesignSprint", "CampusCommunity"],
    likesCount: 37,
    isLiked: false,
    commentsCount: 6,
    sharesCount: 3,
  },
  {
    id: "post-5",
    authorName: "Aarav Khanna",
    authorInitials: "AK",
    authorRole: "Lead Frontend · Pixel Pirates",
    clanName: "Pixel Pirates",
    timestamp: "4 days ago",
    content:
      "💡 Mentoring 40+ junior developers this Saturday on campus in Block C! We'll cover building modern component libraries with Tailwind CSS v4, TypeScript generics, and glassmorphic micro-interactions. Bring your laptops!",
    tags: ["Workshop", "Mentorship", "Frontend", "CampusTech"],
    likesCount: 49,
    isLiked: false,
    commentsCount: 12,
    sharesCount: 7,
  },
  {
    id: "post-6",
    authorName: "Naina Kapoor",
    authorInitials: "NK",
    authorRole: "Business Strategist",
    clanName: "Venture Verse",
    timestamp: "5 days ago",
    content:
      "🚀 Venture Verse is hosting a Pitch Practice Night for student startups next Wednesday! Get actionable feedback on pitch decks, unit economics, and campus launch strategies before presenting to angel mentors.",
    tags: ["Startups", "PitchNight", "VentureVerse"],
    likesCount: 31,
    isLiked: false,
    commentsCount: 5,
    sharesCount: 4,
  },
]

export default function PostsView({
  currentUserName = "Aarav Khanna",
  currentUserClan = "Pixel Pirates",
  currentUserRole = "Lead Frontend · Pixel Pirates",
  currentUserInitials = "AK",
}: {
  currentUserName?: string
  currentUserClan?: string
  currentUserRole?: string
  currentUserInitials?: string
}) {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS)
  const [filterClan, setFilterClan] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false)

  // Fetch live posts from MERN backend
  useEffect(() => {
    let isMounted = true
    mernApi.posts.getAll()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped: CommunityPost[] = data.map((p: any) => ({
            id: p._id || p.id,
            authorName: p.authorName,
            authorInitials: p.authorInitials || (p.authorName ? p.authorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "CC"),
            authorRole: p.authorRole || "Student Member",
            clanName: p.clanName || "Campus Community",
            timestamp: p.timestamp || "Recently",
            content: p.content,
            imageUrl: p.imageUrl,
            tags: p.tags || [],
            likesCount: p.likesCount || 0,
            isLiked: false,
            commentsCount: p.commentsCount || (p.comments ? p.comments.length : 0),
            sharesCount: p.sharesCount || 0,
          }))
          setPosts(mapped)
        }
      })
      .catch((err) => {
        console.warn("[PostsView] Using initial posts dataset (Backend offline):", err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // New Post Form State
  const [newContent, setNewContent] = useState<string>("")
  const [newTags, setNewTags] = useState<string>("")
  const [newImageUrl, setNewImageUrl] = useState<string>("")

  // Handle Like/Unlike
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          }
        }
        return p
      })
    )
    mernApi.posts.like(postId).catch(() => {})
  }

  // Handle Delete Post (Only author can delete)
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  // Handle Submit New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim()) return

    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)

    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUserName,
      authorInitials: currentUserInitials,
      authorRole: currentUserRole,
      clanName: currentUserClan,
      timestamp: "Just now",
      content: newContent.trim(),
      imageUrl: newImageUrl.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ["CampusUpdate"],
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
    }

    setPosts((prev) => [createdPost, ...prev])

    // Save to MERN backend
    mernApi.posts.create({
      authorName: currentUserName,
      authorRole: currentUserRole,
      clanName: currentUserClan,
      content: newContent.trim(),
      imageUrl: newImageUrl.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ["CampusUpdate"],
    }).catch((err) => {
      console.warn("[PostsView] Created post locally (Backend offline):", err)
    })

    setNewContent("")
    setNewTags("")
    setNewImageUrl("")
    setShowCreatePost(false)
  }

  // Filtered Posts
  const filteredPosts = posts.filter((post) => {
    // Filter by Clan / Tab
    if (filterClan === "my") {
      if (post.authorName !== currentUserName) return false
    } else if (filterClan !== "all") {
      if (post.clanName.toLowerCase() !== filterClan.toLowerCase()) return false
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesContent = post.content.toLowerCase().includes(q)
      const matchesAuthor = post.authorName.toLowerCase().includes(q)
      const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q))
      const matchesClan = post.clanName.toLowerCase().includes(q)
      return matchesContent || matchesAuthor || matchesTags || matchesClan
    }

    return true
  })

  const myPostsCount = posts.filter((p) => p.authorName === currentUserName).length

  return (
    <div className="student-page space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f5b800]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-600">
              Community Feed · Campus Wall
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading mt-0.5">
            Campus Posts.
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
            Real-time project showcases, hackathon achievements, and announcements from all clans.
          </p>
        </div>

        {/* High-Contrast, Clearly Legible Create Post Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowCreatePost(!showCreatePost)}
            style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:brightness-105 active:scale-95 cursor-pointer border border-amber-400 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span style={{ color: "#0f172a", fontWeight: 900 }}>+ Create Post</span>
          </button>
        </div>
      </div>

      {/* Create Post Inline Box */}
      {showCreatePost && (
        <form
          onSubmit={handleCreatePost}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-amber-300 shadow-xl space-y-4 animate-fade-in"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            <span>Publish an update or project showcase to the campus community</span>
          </div>
          <textarea
            rows={3}
            placeholder="What are you building or sharing? Mention project milestones, hackathon wins, or campus workshops..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-3.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
            required
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tags separated by commas (e.g. React, AI, Hackathon)..."
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
            />
            <input
              type="url"
              placeholder="Optional image URL (https://...)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreatePost(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "#f5b800", color: "#0f172a" }}
              className="px-5 py-2 rounded-xl font-black text-xs cursor-pointer shadow-sm hover:brightness-105 active:scale-95"
            >
              Publish Post
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterClan("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterClan === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            All Posts ({posts.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterClan("my")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterClan === "my"
                ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-300 font-black"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            My Posts ({myPostsCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterClan("Pixel Pirates")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterClan === "Pixel Pirates"
                ? "bg-amber-100 text-amber-900 border border-amber-300 font-black"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            Pixel Pirates
          </button>

          <button
            type="button"
            onClick={() => setFilterClan("Binary Beasts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterClan === "Binary Beasts"
                ? "bg-blue-100 text-blue-900 border border-blue-300 font-black"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            Binary Beasts
          </button>

          <button
            type="button"
            onClick={() => setFilterClan("Circuit Crew")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterClan === "Circuit Crew"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-black"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            Circuit Crew
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search posts or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs font-medium rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-amber-500 text-slate-800 shadow-2xs"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 shadow-xs">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="text-base font-black text-slate-800">No posts match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or select "All Posts" to see campus-wide discussions.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isMyPost = post.authorName === currentUserName

            return (
              <article
                key={post.id}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Post Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-xs border ${
                        isMyPost
                          ? "bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 border-amber-300"
                          : "bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      {post.authorInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-slate-900">
                          {post.authorName}
                        </strong>
                        {isMyPost && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            You
                          </span>
                        )}
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {post.clanName}
                        </span>
                      </div>
                      <small className="text-[11px] text-slate-500 font-medium block pt-0.5">
                        {post.authorRole} · {post.timestamp}
                      </small>
                    </div>
                  </div>

                  {/* If user is the author: show functional Delete Button */}
                  {isMyPost && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      title="Delete your post"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {post.content}
                </p>

                {/* Optional Media Image */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[2/1] bg-slate-900 border border-slate-100">
                    <img
                      src={post.imageUrl}
                      alt="Post visual"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Footer Action Bar: Like is strictly here at the bottom of the post */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer active:scale-95 ${
                        post.isLiked
                          ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 bg-white"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          post.isLiked ? "fill-rose-500 text-rose-500 scale-110" : "fill-none stroke-current"
                        }`}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{post.likesCount} {post.isLiked ? "Liked" : "Like"}</span>
                    </button>

                    {/* Comments Button */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{post.commentsCount} Comments</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
