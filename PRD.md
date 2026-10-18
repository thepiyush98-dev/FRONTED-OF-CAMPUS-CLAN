# Campus Clain — Product Requirements Document

## Document Summary

| Item | Detail |
|---|---|
| Product | Campus Clain |
| Platform | Responsive web application, followed by a mobile application |
| Product category | College networking, team formation, project discovery, and campus administration |
| Core team | Four members |
| Primary ownership | UI/UX design and frontend implementation |
| Primary users | Students, campus-level local admins, and platform-level main admins |

---

## 1. Project Overview

Campus Clain is a campus-focused collaboration platform that helps students discover peers with complementary skills, form project teams or “clans,” showcase ongoing work, and stay informed about opportunities inside and outside their college.

The platform also gives college administrations a structured source of student project, hackathon, event, and achievement data. This data can support NAAC documentation, annual reports, accreditation processes, and institutional reviews.

### Product vision

Create the default digital collaboration layer for a college campus: a place where students can **connect, collaborate, and grow**, and where institutions can understand and support student innovation.

### Product principles

1. **Skills before popularity:** discovery should prioritize capability, interests, and collaboration needs.
2. **Teams before individuals:** clan progress, projects, and achievements are the primary social objects.
3. **Relevant campus context:** students should see information connected to their institution while retaining access to external opportunities.
4. **Safe communication:** direct communication starts through requests, reducing unsolicited personal messages.
5. **Structured evidence:** meaningful platform activity should produce usable institutional records.

---

## 2. Problem Statement

### 2.1 Difficulty finding teammates

Students struggle to find collaborators with specific skills such as UI/UX design, frontend development, backend development, machine learning, business strategy, pitching, or research. Existing social networks are not designed around campus identity, project intent, and skill compatibility.

**Product response:** searchable student and clan profiles, skill tags, recommendations, clan discovery, and controlled chat requests.

### 2.2 Fragmented event information

Information about hackathons, workshops, networking sessions, competitions, and campus events is spread across informal groups and multiple social channels. Students frequently receive information late or miss it entirely.

**Product response:** a centralized events directory with live events, upcoming opportunities, event categories, registration states, and local-admin publishing.

### 2.3 Unstructured institutional reporting

Colleges often struggle to collect accurate student project, team, hackathon, and achievement data for NAAC or annual reporting. Manual collection is repetitive, incomplete, and difficult to validate.

**Product response:** admin dashboards with student, clan, project, event, participation, and achievement records, plus report-ready exports.

---

## 3. Goals and Success Measures

### Product goals

- Reduce the time required to discover suitable collaborators.
- Increase the number of active cross-skill student teams.
- Improve awareness and participation in campus and external events.
- Create a verified record of projects, participation, and achievements.
- Give each campus operational autonomy while retaining global governance.

### Suggested success metrics

| Area | Metric |
|---|---|
| Activation | Percentage of new students who complete profile, skills, and interests |
| Discovery | Clan profile views and skill-search-to-request conversion |
| Team formation | Accepted chat requests and clans created per month |
| Collaboration | Active projects and weekly active clan members |
| Events | Event views, interest selections, registrations, and attendance |
| Retention | Weekly and monthly active students |
| Administration | Percentage of projects and achievements with complete report data |
| Safety | Request rejection, block, report, and suspension rates |

---

## 4. Target Audience and Roles

### 4.1 Students

Students are the primary product users.

**Objectives**

- Build a profile representing academic identity, skills, and interests.
- Discover students or clans with complementary skills.
- Create, join, and contribute to clans.
- Showcase projects, progress, and achievements.
- Find relevant events and opportunities.
- Communicate safely through requests and team channels.

**Profile data**

- Full name
- College and campus
- Branch and department
- Current year
- Bio and collaboration availability
- Skills and preferred project roles
- Project and hackathon history
- Clan membership
- Achievements and trophies
- Social links such as Instagram and YouTube, displayed as small interactive bubbles

### 4.2 Local admins

A local admin is assigned to an individual campus.

**Permissions**

- View registered students and campus engagement.
- View all campus clans and their status.
- Review active and completed projects.
- Create and publish campus events.
- Allocate verified achievements or trophies to clans.
- Moderate, suspend, or delete unwanted teams.
- Review project and event participation data.
- Export records for institutional reporting.

Local admins must only access data belonging to their assigned campus unless explicitly granted broader permissions.

### 4.3 Main admins

Main admins are controlled by the Campus Clain platform team.

**Permissions**

- Manage all colleges, campuses, and local admins.
- Create, suspend, or remove campus access.
- Define platform-wide policies and moderation rules.
- Review aggregate activity and platform health.
- Audit local-admin actions.
- Manage categories, feature access, and global event visibility.
- Respond to escalated safety or compliance concerns.

---

## 5. Authentication and Role Routing

Campus Clain uses one unified login experience for students and local admins.

### Login flow

1. User enters institutional email or approved credentials.
2. System validates identity and assigned role.
3. Student accounts enter the student home feed.
4. Local-admin accounts enter the campus dashboard.
5. Main-admin accounts enter the global administration console.
6. New students complete onboarding before entering the full product.

### Student onboarding

1. Confirm name, college, branch, department, and year.
2. Add skills and preferred collaboration roles.
3. Add a short bio and availability.
4. Add optional social handles.
5. Join an existing clan, create a clan, or continue independently.

---

## 6. Student Product Features and Flows

### 6.1 Home feed

The home feed introduces the message **“Connect, Collaborate, Grow”** and provides a personalized campus overview.

**Content order**

1. User greeting and profile-completion preview
2. Horizontally sliding clan stories
3. Live and upcoming events
4. Recommended clans based on skills
5. Clan project and progress posts
6. Solo student achievements where relevant

**Primary actions**

- Find a clan
- Complete profile
- Open a clan story
- View an event
- React to or save a post
- Open a recommended clan

### 6.2 Clans and team formation

Every clan represents a working student team.

**Clan profile**

- Clan name, thumbnail, and banner
- About section
- Member count and roles
- Required or preferred skills
- Active and completed projects
- Horizontal post gallery
- Clan stories
- Verified trophies and achievements
- Chat-request action

**Join and contact flow**

1. Student discovers a clan through search, recommendations, posts, or stories.
2. Student reviews skills, work, members, and achievements.
3. Student sends a chat request with optional context.
4. Clan members accept or reject the request.
5. Accepted users can continue the conversation.
6. Personal direct chat remains restricted to approved connections or team members.

### 6.3 Posts

Posts communicate completed work, milestones, opportunities, or achievements.

**Supported content**

- Project updates
- Design or technical previews
- Team member requirements
- Hackathon results
- Solo student achievements
- Event recaps

Users can react, comment where permitted, share, and save posts.

### 6.4 Clan stories

Stories focus on what a clan is currently building rather than personal lifestyle content.

**Story examples**

- Current build progress
- Prototype previews
- Behind-the-scenes teamwork
- Hackathon participation
- Skill or teammate requirements
- Recently unlocked achievements

Stories appear in an Instagram-inspired horizontal rail and should support touch, swipe, keyboard, and pointer navigation.

### 6.5 Chat and requests

The communication model protects students from unsolicited direct messages.

**Rules**

- Clan channels are available to verified clan members.
- Non-members initiate contact using a chat request.
- Personal chat unlocks only after request acceptance.
- Users can ignore, reject, block, or report requests.
- Moderation events are logged for admins.

**States**

- Pending
- Accepted
- Rejected
- Expired
- Blocked

### 6.6 Events

The events area centralizes internal and external opportunities.

**Event data**

- Title and visual
- Event category
- Host or organizer
- Date and time
- Location or meeting link
- Eligibility
- Registration deadline
- External registration URL
- Student interest and attendance state

**User flow**

1. Discover event through home feed or event directory.
2. Filter by category and date.
3. Open event details.
4. Mark interest or register.
5. Receive reminders for saved or registered events.
6. Record participation and achievements when applicable.

### 6.7 Personal profile

The personal profile is a professional campus identity rather than a traditional social profile.

**Sections**

- Academic information
- Bio and availability
- Skills and roles
- Clan membership
- Projects
- Hackathons
- Achievements
- Interactive social bubbles
- Profile-completion indicator

---

## 7. Navigation Model

### Primary student navigation

- Home feed
- Discover clans
- Messages and requests
- Events
- Personal profile

### Sliding content navigation

Horizontal sliders are used for:

- Clan stories
- Clan posts
- Recommended clans
- User’s own clan profile
- Personal account shortcuts

Slider interactions must provide clear position, smooth momentum, keyboard accessibility, and reduced-motion support.

---

## 8. UI/UX Direction

### Visual vibe

Campus Clain should feel contemporary to Gen Z and Gen Alpha without becoming visually noisy.

**Core characteristics**

- Dark-mode-first interface
- Atmospheric purple and indigo background
- Translucent glass surfaces
- Minimal card layouts
- Compact, readable information density
- Soft borders and restrained shadows
- Strong typography hierarchy
- Rounded geometric icons
- Skill tags and status indicators

### Interaction design

- Subtle background movement and ambient gradients
- Smooth horizontal sliders
- Small elevation and border changes on card hover
- Animated toggle, request, save, and interest states
- Responsive modal and drawer transitions
- No excessive movement during normal navigation
- Full support for `prefers-reduced-motion`

### Responsive behavior

**Desktop**

- Fixed side navigation
- Multi-column feeds and dashboards
- Dense admin tables and analytics

**Mobile**

- Bottom navigation
- Single-column content
- Horizontally scrollable story and filter rails
- Touch-friendly controls
- Condensed chat and admin views

### Accessibility requirements

- WCAG AA text contrast where practical
- Visible keyboard focus indicators
- Semantic labels for icon controls
- Non-color indicators for status
- Reduced-motion fallback
- Minimum touch target consideration
- Logical focus handling in dialogs

---

## 9. Local Admin Dashboard

The local-admin interface uses a minimal, laptop-oriented dashboard.

### Overview

- Total registered students
- Active clans
- Active and completed projects
- Campus events
- Allocated and pending achievements
- Campus participation and engagement score

### Student management

- Search and filter students
- Review academic and profile details
- Review clan membership and project contribution
- Suspend access where policy permits
- Export student activity records

### Clan management

- View all campus clans
- Review members, projects, and achievements
- Approve or flag clan information
- Suspend or delete inappropriate or inactive teams
- Add moderation notes

Destructive actions require confirmation and should be included in an audit log.

### Project management

- View project name, clan, members, category, and status
- Verify project completion
- Attach hackathon or competition data
- Flag incomplete institutional-report fields
- Export project records

### Event management

- Create, edit, publish, and archive campus events
- Define eligibility and registration data
- Send updates or reminders
- Track interest, registration, and attendance

### Achievement allocation

1. Admin selects a clan or student.
2. Admin selects or creates an achievement category.
3. Admin adds event, date, proof, and description.
4. Achievement enters a verified or pending-review state.
5. Verified trophy appears on the clan or student profile.

### Reporting

Admin reporting should support:

- Date-range filtering
- Department and academic-year filtering
- Project and hackathon summaries
- Event participation
- Clan activity
- Achievement records
- CSV or spreadsheet export
- Future NAAC-specific report templates

---

## 10. Main Admin Controls

### Global dashboard

- Total institutions, campuses, students, and clans
- Platform-wide activity and growth
- Moderation and safety trends
- Event and project distribution

### Campus management

- Add or deactivate a campus
- Assign and revoke local admins
- Configure campus branding and identity
- Review campus health and data completion

### Governance

- Define global content and moderation policies
- Review escalated reports
- Audit local-admin activity
- Manage achievement and event categories
- Configure global platform settings

---

## 11. Data and Permission Logic

| Capability | Student | Local Admin | Main Admin |
|---|---:|---:|---:|
| Manage own profile | Yes | Own account only | Own account only |
| Create or join clan | Yes | Optional as student | Optional |
| Publish clan content | Clan permission | Moderate campus content | Moderate all content |
| Send chat request | Yes | Not required for admin work | Not required |
| Publish campus event | No | Yes, assigned campus | Yes, any campus/global |
| Allocate trophies | No | Assigned campus | Any campus |
| Suspend clan | No | Assigned campus | Any campus |
| Manage admins | No | No | Yes |
| Export campus reports | Own data only | Assigned campus | All campuses |

All privileged actions should be role-checked on the server and recorded in an audit trail.

---

## 12. MVP Scope

### Included

- Unified authentication and role routing
- Student onboarding and profiles
- Skill-based clan discovery
- Clan profiles, posts, and stories
- Chat requests and approved messaging
- Event discovery and local-admin event publishing
- Achievement and trophy allocation
- Local-admin operational dashboard
- Main-admin campus and local-admin management
- Responsive web experience

### Future phases

- Native mobile application
- Push notifications
- Advanced skill-matching recommendations
- Calendar integrations
- Verified external hackathon integrations
- Project portfolios and recruiter access
- Institution-specific NAAC report templates
- Inter-campus clans and competitions

---

## 13. Risks and Considerations

- **Incomplete profiles:** use progressive completion prompts and meaningful benefits.
- **Spam and unwanted contact:** retain request-based messaging, block/report tools, and moderation logs.
- **Unverified achievements:** require proof and admin verification states.
- **Admin misuse:** use scoped permissions, confirmation steps, and audit trails.
- **Low-quality or inactive clans:** add status indicators, inactivity rules, and archival flows.
- **Sensitive student data:** collect only necessary data and apply institution-appropriate privacy controls.
- **Mobile complexity:** preserve core workflows and reduce secondary detail on small screens.

---

## 14. Acceptance Criteria

The MVP is ready when:

1. Students can complete a profile and discover clans by skill.
2. Students can inspect clan work, stories, members, and trophies.
3. A non-member must send a request before starting personal chat.
4. Clan members can publish project-focused posts and stories.
5. Students can find and save internal or external events.
6. Local admins can manage campus students, clans, projects, events, and achievements.
7. Main admins can manage campuses and local-admin permissions.
8. Admins can export structured campus activity data.
9. Core student and admin flows work on desktop and mobile.
10. Interactive motion remains subtle and respects reduced-motion preferences.
