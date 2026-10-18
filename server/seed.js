require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Student = require('./models/Student')
const Clan = require('./models/Clan')
const Event = require('./models/Event')
const Post = require('./models/Post')
const Notification = require('./models/Notification')
const Trophy = require('./models/Trophy')
const connectDB = require('./config/db')

const seedData = async () => {
  await connectDB()

  console.log('[Seeder] Clearing old collections...')
  await User.deleteMany({})
  await Student.deleteMany({})
  await Clan.deleteMany({})
  await Event.deleteMany({})
  await Post.deleteMany({})
  await Notification.deleteMany({})
  await Trophy.deleteMany({})

  console.log('[Seeder] Seeding Users...')
  const adminUser = new User({
    name: 'Campus Administrator',
    email: 'admin@campus.edu',
    password: 'password123',
    role: 'admin',
    avatar: 'CA',
    clanName: '',
    skills: ['Audit', 'Governance', 'Event Operations'],
  })
  await adminUser.save()

  const studentUser = new User({
    name: 'Aarav Khanna',
    email: 'aarav.k@campus.edu',
    password: 'password123',
    role: 'student',
    avatar: 'AK',
    clanName: 'Pixel Pirates',
    skills: ['React', 'UI/UX', 'Tailwind', 'Figma'],
  })
  await studentUser.save()

  console.log('[Seeder] Seeding Students...')
  await Student.insertMany([
    {
      customId: 'stu-1',
      name: 'Aarav Khanna',
      username: 'aarav_k',
      department: 'Engineering',
      branch: 'B.Tech CSE',
      year: '3rd year',
      email: 'aarav.k@campus.edu',
      avatar: 'AK',
      initials: 'AK',
      clanName: 'Pixel Pirates',
      status: 'Active',
      skills: ['React', 'UI/UX', 'Tailwind', 'Figma'],
      about: 'Frontend enthusiast building campus apps and mentoring juniors in web development.',
      socialLinks: {
        github: 'https://github.com/aaravk',
        linkedin: 'https://linkedin.com/in/aaravk',
      },
      projectsCount: 4,
      trophiesCount: 2,
    },
    {
      customId: 'stu-2',
      name: 'Riya Malhotra',
      username: 'riya_design',
      department: 'Design',
      branch: 'B.Des',
      year: '2nd year',
      email: 'riya.m@campus.edu',
      avatar: 'RM',
      initials: 'RM',
      clanName: 'Pixel Pirates',
      status: 'Active',
      skills: ['UI/UX', 'Design Systems', 'Prototyping'],
      about: 'Interaction designer passionate about accessible user experiences and motion design.',
      projectsCount: 3,
      trophiesCount: 1,
    },
    {
      customId: 'stu-3',
      name: 'Kabir Singh',
      username: 'kabir_ece',
      department: 'Engineering',
      branch: 'B.Tech ECE',
      year: '4th year',
      email: 'kabir.s@campus.edu',
      avatar: 'KS',
      initials: 'KS',
      clanName: 'Circuit Crew',
      status: 'Suspended',
      skills: ['Robotics', 'Embedded C', 'IoT'],
      about: 'Hardware tinkerer working on smart drone communication arrays.',
      projectsCount: 5,
      trophiesCount: 3,
      suspensionDetails: {
        reason: 'Lab equipment policy non-compliance during hackathon hours',
        startDate: '2026-10-10',
        endDate: '2026-10-24',
        durationDays: 14,
      },
    },
    {
      customId: 'stu-4',
      name: 'Naina Kapoor',
      username: 'naina_biz',
      department: 'Management',
      branch: 'BBA',
      year: '2nd year',
      email: 'naina.k@campus.edu',
      avatar: 'NK',
      initials: 'NK',
      clanName: 'Venture Verse',
      status: 'Active',
      skills: ['Market Research', 'Product Pitching', 'Financial Modeling'],
      about: 'Business strategist connecting student tech innovations with startup capital.',
      projectsCount: 2,
      trophiesCount: 1,
    },
    {
      customId: 'stu-5',
      name: 'Devansh Sharma',
      username: 'devansh_ml',
      department: 'Engineering',
      branch: 'B.Tech CSE',
      year: '3rd year',
      email: 'devansh.s@campus.edu',
      avatar: 'DS',
      initials: 'DS',
      clanName: 'Binary Beasts',
      status: 'Active',
      skills: ['Python', 'PyTorch', 'FastAPI', 'NLP'],
      about: 'Machine learning builder focusing on local LLM fine-tuning and campus search engines.',
      projectsCount: 6,
      trophiesCount: 4,
    },
    {
      customId: 'stu-6',
      name: 'Ananya Patel',
      username: 'ananya_p',
      department: 'Engineering',
      branch: 'B.Tech IT',
      year: '1st year',
      email: 'ananya.p@campus.edu',
      avatar: 'AP',
      initials: 'AP',
      clanName: '',
      status: 'Active',
      skills: ['Python', 'Algorithms', 'C++'],
      about: 'First year programmer exploring algorithms, looking for an energetic clan to join.',
      projectsCount: 1,
      trophiesCount: 0,
    },
  ])

  console.log('[Seeder] Seeding Clans...')
  await Clan.insertMany([
    {
      customId: 'clan-1',
      name: 'Pixel Pirates',
      initials: 'PP',
      speciality: 'Design & Frontend Engineering',
      bannerColor: 'from-amber-600 to-slate-900',
      memberCount: 18,
      leaderName: 'Aarav Khanna',
      status: 'Active',
      shortDescription: 'Crafting delightful web applications and high-fidelity interface systems.',
      fullDescription:
        'Pixel Pirates is our campus premier frontend clan. We build open-source tools, compete in UI/UX hackathons, and collaborate with hardware teams to deliver responsive interfaces.',
      projectsCount: 6,
      activeProjects: ['Nova Campus Feed', 'Design Kit v2', 'Event Registration Portal'],
      recruitmentOpenings: ['Junior React Developer', '3D Motion Designer'],
      trophiesCount: 5,
      members: [
        { studentId: 'stu-1', name: 'Aarav Khanna', role: 'Leader', branch: 'B.Tech CSE' },
        { studentId: 'stu-2', name: 'Riya Malhotra', role: 'Co-Leader', branch: 'B.Des' },
      ],
    },
    {
      customId: 'clan-2',
      name: 'Binary Beasts',
      initials: 'BB',
      speciality: 'AI & Distributed Systems',
      bannerColor: 'from-blue-700 to-slate-900',
      memberCount: 24,
      leaderName: 'Devansh Sharma',
      status: 'Active',
      shortDescription: 'Distributed computing, microservices, and applied machine learning.',
      fullDescription:
        'A collective of backend engineers and ML practitioners. We train domain models on campus servers and build scalable APIs.',
      projectsCount: 9,
      activeProjects: ['Campus RAG Search', 'Campus Bus Tracker', 'GPU Cluster Scheduler'],
      recruitmentOpenings: ['PyTorch Contributor', 'DevOps Assistant'],
      trophiesCount: 8,
      members: [{ studentId: 'stu-5', name: 'Devansh Sharma', role: 'Leader', branch: 'B.Tech CSE' }],
    },
    {
      customId: 'clan-3',
      name: 'Venture Verse',
      initials: 'VV',
      speciality: 'Product Strategy & Startup Incubation',
      bannerColor: 'from-rose-700 to-slate-900',
      memberCount: 12,
      leaderName: 'Naina Kapoor',
      status: 'Suspended',
      shortDescription: 'Business models, customer discovery, and pitch decks.',
      fullDescription:
        'Venture Verse turns technical projects into viable student ventures. Currently suspended pending administrative compliance check.',
      projectsCount: 4,
      activeProjects: ['College Commerce', 'Pitch Incubator 2026'],
      recruitmentOpenings: [],
      trophiesCount: 2,
      members: [{ studentId: 'stu-4', name: 'Naina Kapoor', role: 'Leader', branch: 'BBA' }],
      suspensionDetails: {
        reason: 'Incomplete verification documents for inter-college event sponsorship',
        startDate: '2026-10-12',
        endDate: '2026-10-26',
        durationDays: 14,
      },
    },
    {
      customId: 'clan-4',
      name: 'Circuit Crew',
      initials: 'CC',
      speciality: 'Robotics & Embedded Systems',
      bannerColor: 'from-emerald-700 to-slate-900',
      memberCount: 16,
      leaderName: 'Kabir Singh',
      status: 'Active',
      shortDescription: 'Autonomous bots, PCB design, and sensory telemetry.',
      fullDescription:
        'Hardware hackers representing the college at national RoboCon competitions and maker expos.',
      projectsCount: 7,
      activeProjects: ['Quadruped Rover', 'Autonomous Greenhouse', 'Solar Sun-Tracker'],
      recruitmentOpenings: ['Firmware Specialist', 'Mechanical Drafter'],
      trophiesCount: 6,
      members: [{ studentId: 'stu-3', name: 'Kabir Singh', role: 'Leader', branch: 'B.Tech ECE' }],
    },
  ])

  console.log('[Seeder] Seeding Events...')
  await Event.insertMany([
    {
      customId: 'evt-1',
      title: 'North India Hackfest 2026',
      month: 'OCT',
      day: '12',
      type: 'Hackathon',
      location: 'Innovation Hub',
      time: '9:00 AM',
      participantsCount: 248,
      accentColor: 'amber',
      featured: true,
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1280&h=720&q=80',
      tagline: '36-Hour National Code Sprint & AI Hackathon',
      description: '48-hour continuous innovation sprint across Web3, AI, and Green Energy.',
      status: 'Active',
      participationMode: 'both',
    },
    {
      customId: 'evt-2',
      title: 'Designing for Impact',
      month: 'OCT',
      day: '16',
      type: 'Workshop',
      location: 'Design Studio 2',
      time: '2:30 PM',
      participantsCount: 84,
      accentColor: 'indigo',
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1280&h=720&q=80',
      tagline: 'Master Design Systems, Figma Prototyping & UX Psychology',
      description: 'Hands-on UI/UX workshop focusing on user research and Figma component systems.',
      status: 'Upcoming',
      participationMode: 'individual',
    },
    {
      customId: 'evt-3',
      title: "Founders' Fireside",
      month: 'OCT',
      day: '20',
      type: 'Talk',
      location: 'Main Auditorium',
      time: '5:00 PM',
      participantsCount: 172,
      accentColor: 'rose',
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1280&h=720&q=80',
      tagline: 'From Dorm Room to Series A: Stories of 4 Student Founders',
      description: 'Alumni founders sharing candid lessons on scaling from campus dorms to Series A.',
      status: 'Upcoming',
      participationMode: 'individual',
    },
    {
      customId: 'evt-4',
      title: 'AI Builders Night',
      month: 'OCT',
      day: '26',
      type: 'Build Night',
      location: 'CS Block',
      time: '7:00 PM',
      participantsCount: 116,
      accentColor: 'emerald',
      featured: false,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1280&h=720&q=80',
      tagline: 'Hands-on LLM Agents, PyTorch & Vector Database Lab',
      description: 'Late night collaborative sprint fixing issues on open source campus repositories.',
      status: 'Upcoming',
      participationMode: 'clan',
    },
  ])

  console.log('[Seeder] Seeding Notifications (6 admin categories)...')
  await Notification.insertMany([
    {
      category: 'Trophy Allocated',
      title: 'Trophy Allocated: HackFest 2026 Champion',
      description: 'Gold Trophy for "Best Campus AI Architecture" has been officially allocated to Pixel Pirates.',
      meta: 'Awarded to Pixel Pirates · Allocation by Campus Admin',
      time: '12 mins ago',
      unread: true,
      badgeColor: 'amber',
      icon: 'trophy',
      actionLabel: 'View Trophy',
    },
    {
      category: 'New Candidate Application',
      title: 'New Candidate Application: Ananya Patel',
      description: 'Ananya Patel (B.Tech IT, 1st Year) submitted a membership application to join Pixel Pirates as a Frontend Developer.',
      meta: 'Applicant: Ananya Patel · Skills: React, Tailwind, C++',
      time: '28 mins ago',
      unread: true,
      badgeColor: 'blue',
      icon: 'user-plus',
      actionLabel: 'Review Candidate',
    },
    {
      category: 'Event Reminder',
      title: 'Event Reminder: Annual Campus Tech Symposium',
      description: 'HackFest 2026 & Tech Symposium starts in 2 hours at Central Auditorium. 248 registered students.',
      meta: 'Starts Today at 09:00 AM · Hall A & Design Studio 2B',
      time: '1 hour ago',
      unread: true,
      badgeColor: 'emerald',
      icon: 'calendar',
      actionLabel: 'View Event',
    },
    {
      category: 'Achievement Published',
      title: 'Achievement Published: 120+ Active Clan Projects',
      description: 'New campus milestone reached: Over 120 collaborative open-source and hardware prototypes published across all active clans.',
      meta: 'Campus Ecosystem Milestone · Published to Community Feed',
      time: '3 hours ago',
      unread: false,
      badgeColor: 'purple',
      icon: 'award',
      actionLabel: 'View Feed',
    },
    {
      category: 'Weekly Leaderboard',
      title: 'Weekly Leaderboard: Pixel Pirates takes #1 Spot',
      description: 'Pixel Pirates advanced to Rank 1 this week following 14 new GitHub pull requests and event participation.',
      meta: 'Leaderboard Week 42 · +340 XP gained',
      time: '5 hours ago',
      unread: false,
      badgeColor: 'sky',
      icon: 'trending-up',
      actionLabel: 'View Standings',
    },
    {
      category: 'Recruitment Update',
      title: 'Recruitment Update: 8 New Applications Submitted',
      description: 'Active openings in Circuit Crew and Pixel Pirates received 8 prospective student submissions today.',
      meta: 'Recruitment Cycle Autumn 2026 · Pending Review',
      time: 'Yesterday',
      unread: false,
      badgeColor: 'rose',
      icon: 'users',
      actionLabel: 'Open Applications',
    },
  ])

  console.log('[Seeder] Seeding Trophies...')
  await Trophy.insertMany([
    {
      customId: 'trophy-1',
      name: 'First Place: Best System Architecture',
      description: 'Awarded for exceptional microservice resilience and telemetry integration.',
      eventId: 'evt-1',
      eventName: 'North India Hackfest 2026',
      recipientType: 'clan',
      recipientName: 'Binary Beasts',
      clanRepresentatives: ['Devansh Sharma'],
      awardDate: '2026-10-14',
    },
    {
      customId: 'trophy-2',
      name: 'Excellence in Human-Centered Design',
      description: 'Recognizing outstanding UI accessibility and user flow clarity.',
      eventId: 'evt-2',
      eventName: 'Designing for Impact',
      recipientType: 'student',
      recipientName: 'Riya Malhotra',
      clanRepresentatives: ['Riya Malhotra'],
      awardDate: '2026-10-16',
    },
  ])

  console.log('[Seeder] Seeding Community Posts...')
  await Post.insertMany([
    {
      authorName: 'Devansh Sharma',
      authorInitials: 'DS',
      authorRole: 'Clan Lead · Binary Beasts',
      clanName: 'Binary Beasts',
      timestamp: '2 hours ago',
      content:
        '🏆 Huge shoutout to the entire team! Binary Beasts secured 1st Place at the North India Hackfest 2026! We deployed a real-time autonomous emergency routing model in 36 hours. Teamwork at its finest!',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=600&q=80',
      tags: ['Hackfest2026', 'AI', 'EmergencyRouting', 'BinaryBeasts'],
      likesCount: 58,
      commentsCount: 14,
      sharesCount: 8,
      comments: [
        {
          authorName: 'Aarav Khanna',
          authorInitials: 'AK',
          text: 'Tremendous architecture! Honored to collaborate with Binary Beasts!',
          timestamp: '1 hour ago',
        },
      ],
    },
    {
      authorName: 'Aarav Khanna',
      authorInitials: 'AK',
      authorRole: 'Lead Frontend · Pixel Pirates',
      clanName: 'Pixel Pirates',
      timestamp: 'Yesterday at 4:30 PM',
      content:
        '🎨 Proud to announce our new open-source project: Campus Clans Glassmorphic UI Kit v2! Built with React 19, Tailwind CSS v4, and KaTeX math rendering. Includes 3D convex card carousels and responsive bottom sheets.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=600&q=80',
      tags: ['DesignSystems', 'React19', 'TailwindCSS', 'OpenSource'],
      likesCount: 84,
      commentsCount: 22,
      sharesCount: 19,
    },
  ])

  console.log('[Seeder] MongoDB Database seeded successfully!')
  process.exit(0)
}

seedData().catch((err) => {
  console.error('[Seeder] Error seeding data:', err)
  process.exit(1)
})
