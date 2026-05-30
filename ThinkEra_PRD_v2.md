THINKERA
Page Flow & UX Product Requirements Document

Version
2.0 — Production
Focus
Frontend UX Only

AI-Powered DSA Learning & Placement Preparation Platform

01  Project Overview
Executive summary, target users, and success metrics

ThinkEra is an AI-powered DSA learning and placement preparation platform designed for BCA, BTech, and MCA students in India. It consolidates six core workflows — structured learning, visual roadmaps, coding practice, AI mentorship, community engagement, and Pomodoro-based productivity — into a single cohesive product, replacing the fragmented multi-platform workflow students currently endure (YouTube + LeetCode + Notion + Discord + random blogs).

The platform guides a student through a complete journey: from 'I don't know DSA' through concept learning, hands-on practice, AI-assisted doubt resolution, community support, and focused study sessions — all the way to 'I am placement-ready.'

Target Users
User Segment
Primary Need
BCA / BTech / MCA students (Year 2–4)
Structured DSA learning path with clear progression
Campus placement aspirants
Interview-ready practice with topic-wise problems
DSA beginners (0–6 months experience)
Guided entry point with beginner-friendly resources
Coding interview preppers (6–24 months)
Timed practice, AI hints, mock-interview-style problems

Success Metrics
Metric
Definition / Target
Daily Active Users (DAU)
Users completing ≥1 topic resource or coding problem per day
Roadmap Node Completion Rate
% of started nodes reaching 'Completed' status
AI Mentor Engagement Rate
AI hint requests per coding session (target: >1.5/session)
Focus Session Completion Rate
Sessions completed vs. sessions started (target: >70%)
Community Post Volume
New posts per week across all 4 community sections
7-Day Retention Rate
Users returning within 7 days of signup (target: >40%)
Problem Solve Rate
Problems solved / problems attempted (target: >55%)

Design Principles
Progression over perfection — reward incremental progress, not just completion
AI as a guide, not a cheat code — hints surface insight without removing the challenge
Single source of truth — every learning resource, problem, and note lives in ThinkEra
Community as accountability — peer visibility drives consistency

02  User Types & Permissions
Role definitions, access levels, and auth flows


## Student (Primary User)

Students self-register via email/password or Google OAuth. Upon first login, they are directed through a 3-step onboarding flow to personalize their experience. All core platform features are accessible to students.

Permission Area
Student Access
Learn (Videos, Blogs)
Full read access; can mark resources as watched/read
Roadmap
Full view + interactive progress tracking on both roadmaps
Coding Problems
Full access; can run code, submit solutions, view own history
AI Mentor
Full access within problem solver; limited standalone queries (rate-limited)
Community (all 4 sections)
Can read, post, reply, upvote, and mark own posts as solved
Focus Mode
Full access; session history scoped to own account
Profile Page
Can view own and others' public profiles
Admin Panel
No access — redirect to /dashboard with toast

Auth Flow — Student
Sign up (email + password OR Google OAuth) → account created
Email verification link sent (email signup only) → user clicks link → verified
First login: redirected to /onboarding (3-step wizard)
Returning login: redirected to /dashboard
Forgot password: email reset link → /auth/reset-password/[token]


## Admin (Content Manager)

Admin accounts are manually provisioned by the ThinkEra team — no self-registration path exists. Admins have full student access plus a separate admin panel at /admin/*. On login, role is checked server-side; admins are redirected to /admin/dashboard.

Permission Area
Admin Access
Problem Management
Create, edit, delete problems; manage test cases and starter code
Content Management
Add/edit/remove YouTube videos and blog resources per topic
Roadmap Management
Add/edit roadmap nodes, reorder, set prerequisite relationships
Community Moderation
Pin posts, remove posts, issue warnings, ban users
Platform Analytics
View DAU, solve rates, popular topics, AI usage, retention data
User Management
View user list, reset passwords, manage roles

Session & Security Considerations
JWT tokens with 7-day expiry; refresh tokens stored in httpOnly cookies
Role checked on every protected route — client and server
Google OAuth: if email already exists via email signup, accounts are merged
Rate limiting on AI Mentor: 20 queries/hour per student to control Gemini API costs

03  Navigation & Information Architecture
Route hierarchy, nav structure, and mobile patterns


## Navigation Pattern: Hybrid (Top Bar + Contextual Sidebar)

A persistent global top bar handles platform-wide navigation and utility actions. Within each major section, a contextual left sidebar appears for section-specific sub-navigation. This keeps the global UI clean while providing deep navigation within feature areas.

Global Top Bar (Always Visible)
Zone
Contents
Left
ThinkEra logo (click → /dashboard)
Center
Primary nav: Learn | Roadmap | Problems | Community | Focus
Right
AI Mentor icon (glowing pulse when available) | Notifications bell (badge count) | User avatar (dropdown: Profile, Settings, Logout)

Contextual Left Sidebar — Per Section
Section
Sidebar Contents
Learn
Topic list grouped: Fundamentals / Intermediate / Advanced. Each item shows completion badge (grey/blue/green). Collapse/expand by group.
Roadmap
Roadmap switcher (DSA Roadmap / Placement Roadmap). Overall % progress ring. Phase completion status.
Problems
Filter panel: Topic (multi-select), Difficulty (Easy/Med/Hard toggle), Status (All/Solved/Unsolved/Attempted). Stats: Solved X / Total Y.
Community
Section switcher: Doubts | Discussions | Resources | Achievements. Post count badges per section.
Focus
Today's stats: X sessions, Y min focused. Streak counter. Session history (last 5 entries).


## Route Hierarchy

Route
Description
/
Landing Page (public)
/auth/login
Login (public)
/auth/signup
Signup (public)
/auth/forgot-password
Forgot password (public)
/auth/reset-password/[token]
Password reset (public)
/onboarding
New user onboarding wizard (authenticated, first-time only)
/dashboard
Main dashboard (authenticated)
/learn
Learn home (authenticated)
/learn/[topicSlug]
Topic dashboard (authenticated)
/learn/[topicSlug]/videos
Topic videos list (authenticated)
/learn/[topicSlug]/blogs
Topic blogs list (authenticated)
/roadmap
Redirects to /roadmap/dsa
/roadmap/dsa
DSA visual roadmap (authenticated)
/roadmap/placement
Placement visual roadmap (authenticated)
/problems
Problems list with filters (authenticated)
/problems/[problemSlug]
3-panel problem solver (authenticated)
/community/doubts
Doubts feed (authenticated)
/community/discussions
Discussions feed (authenticated)
/community/resources
Resources feed (authenticated)
/community/achievements
Achievements feed (authenticated)
/community/post/[id]
Single post with replies (authenticated)
/focus
Focus mode (authenticated)
/profile/[username]
Public profile (authenticated)
/settings
Account settings (authenticated)
/admin/dashboard
Admin home (admin only)
/admin/problems
Problem CRUD (admin only)
/admin/content
Videos/blogs management (admin only)
/admin/community
Community moderation (admin only)
/admin/analytics
Platform analytics (admin only)

Mobile Navigation
Top bar: logo left, hamburger right; center links hidden
Hamburger opens full-screen nav overlay with all primary links + user info
Contextual sidebar becomes bottom sheet drawer, triggered by a 'Filter/Menu' floating button
Problem solver: 3-panel stacks vertically; bottom tab bar switches between Problem / Code / AI+Results
Roadmap: touch-to-pan, pinch-to-zoom on node canvas; tap node to open topic tooltip

04  Core User Flows
Step-by-step journeys for all primary feature interactions

Flow 1
New User Onboarding
Entry Point
/auth/signup (or OAuth redirect)
Prerequisites
None — first-time user
Steps
1. User fills signup form (name, email, password) OR clicks 'Continue with Google' → account created
2. Email signup: verification email sent → user clicks link → redirected to /onboarding
3. Google OAuth: email pre-verified → redirected directly to /onboarding
4. Onboarding Step 1 — Experience Level: Beginner / Intermediate / Advanced (with description of each)
5. Onboarding Step 2 — Goal: Crack FAANG / Campus Placements / Learn DSA from Scratch / General Improvement
6. Onboarding Step 3 — Roadmap preview shown based on selections, with 'Start Your Journey' CTA and 'Skip' link
7. User lands on /dashboard with personalized 'Recommended First Topic' widget and highlighted roadmap node
✓ Success
Dashboard loads with first topic recommendation; streak starts at Day 1; onboarding flag set — wizard never shown again
⚠ Errors
• Email already registered → inline error 'An account with this email exists. Log in instead.'
• Google OAuth failure → fallback to email form with error toast
• Email verification link expired (24hr) → 'Resend verification email' option on login page
• User skips onboarding → generic dashboard with global CTA banner 'Complete your profile for personalized recommendations'
Alt Paths
• User lands on /login instead of /signup → 'Don't have an account? Sign up' link at bottom
• User starts Google OAuth but cancels → returns to /auth/signup with no error shown
• User skips onboarding → preferences default to Beginner + General Improvement

Flow 2
Topic Learning Journey
Entry Point
/roadmap/dsa (click a node) OR /learn sidebar (click topic)
Prerequisites
User is authenticated
Steps
1. User clicks topic node 'Arrays' on roadmap OR 'Arrays' in Learn sidebar → /learn/arrays loads
2. Topic Dashboard shows: Videos card (count + watched/total), Blogs card (count + read/total), Problems card (count + solved/total), and progress bar
3. User clicks 'Videos' card → /learn/arrays/videos opens with YouTube embed list
4. User clicks a video thumbnail → video plays inline in expandable embed player
5. User finishes video → clicks 'Mark as Watched' → progress updates in sidebar and topic dashboard
6. User navigates to Blogs tab → curated article list with title, source, estimated read time
7. User clicks 'Practice Problems' CTA → /problems?topic=arrays loads pre-filtered
8. As resources are completed, topic progress % updates; when all resources done, roadmap node turns green
✓ Success
Topic card shows 100% completion; roadmap node is green; 'Completed' badge visible in Learn sidebar
⚠ Errors
• YouTube video unavailable → placeholder with 'Watch on YouTube' external link shown
• Blog link 404 → 'This resource may have moved — try searching on Google' with search query pre-filled
• Progress save fails → local cache preserves state; retry on next load with success toast
Alt Paths
• User opens problems directly without watching videos — all paths are valid, no forced order
• User accesses topic directly via URL without going through roadmap
• User re-watches an already-marked video — 'Watched' state toggles back; progress recalculates

Flow 3
Coding Problem Solving with AI Mentor
Entry Point
/problems list → click problem title
Prerequisites
User is authenticated
Steps
1. Problem page loads: Left panel (problem statement + examples + constraints), Center (Monaco code editor with language selector), Right (AI Mentor tab active by default)
2. User reads problem statement, selects preferred language (Python / C++ / Java / JavaScript)
3. User writes code in editor — starter code scaffold pre-loaded based on language
4. User clicks 'Run' → code submitted to execution engine → Right panel auto-switches to 'Results' tab showing passed/failed test cases
5. Tests fail → user clicks 'AI Mentor' tab → types question or clicks 'Get a Hint' quick-action
6. AI Mentor streams contextual response (typewriter effect) — hints reference the problem but never reveal the full solution
7. User iterates on code based on hints → runs again → all visible test cases pass
8. User clicks 'Submit' → hidden test cases run → if all pass: confetti animation, problem marked 'Solved', roadmap topic progress updates; if fail: results panel shows which cases failed with input/expected/actual
✓ Success
Problem card shows 'Solved' checkmark in /problems list; topic completion % increases; XP points added to profile
⚠ Errors
• Code execution timeout (>5s) → 'Time Limit Exceeded' shown with tip to optimize time complexity
• Code compilation error → error message shown in Results tab with line number highlighted in editor
• AI Mentor API down → 'AI Mentor is temporarily unavailable' banner in right panel; coding still works
• Network drops mid-submission → code preserved in local storage; 'Resubmit?' prompt on reconnect
Alt Paths
• User gives up → 'See Community Doubts for this problem' link opens filtered /community/doubts?problem=[slug]
• User wants to see editorial → 'View Editorial' (unlocked after 3 attempts or after first solve)
• User switches language mid-solve → confirmation modal 'Switching language will reset your code. Continue?'

Flow 4
Community Doubt Posting & Resolution
Entry Point
/community/doubts OR problem page 'See Doubts' link
Prerequisites
User is authenticated
Steps
1. User lands on Doubts feed — sorted by recency by default; toggle to 'Top' for most upvoted
2. User clicks 'Post a Doubt' button → modal opens
3. Modal: Title (required), Description with rich text editor (required), Topic tag selector (multi-select), optional code snippet block with syntax highlighting, optional problem link
4. User submits → modal closes → doubt appears at top of feed with 'New' badge (fades after 24h)
5. Other users see the doubt, click to open → /community/post/[id] loads with full thread
6. Replier writes answer → submits → reply appears under original post
7. Original poster receives in-app notification + email digest
8. Original poster reads reply → clicks 'Mark as Solution' on the most helpful reply → thread gains 'Resolved' badge
9. Resolver receives reputation point and notification
✓ Success
Doubt card shows green 'Resolved' badge; poster and resolver both gain reputation; thread pinned in search results
⚠ Errors
• Empty title or body → inline validation error shown before submit allowed
• Code snippet syntax error in preview → warning shown but submission not blocked
• Duplicate doubt detected (similar title/topic) → 'Similar doubts found' section shown before posting with option to view existing or continue posting
Alt Paths
• User searches existing doubts before posting → search bar in sidebar filters feed in real time
• User opens a doubt from problem page → pre-populated with problem context and title
• User reports a post instead of replying → 'Report' option in post overflow menu

Flow 5
Focus Mode Session
Entry Point
/focus page OR 'Focus' in top nav
Prerequisites
User is authenticated
Steps
1. Focus Mode page loads — shows Pomodoro timer (25 min default), session goal text input, timer customization (work/break duration), and today's stats
2. User optionally types a session goal (e.g., 'Solve 3 Array problems today')
3. User clicks 'Start Session' → countdown begins → UI shifts to minimal ambient mode (sidebar hides, distractions fade)
4. Timer runs — progress ring animates; subtle tick sound optional (toggle in settings)
5. Work timer ends → break prompt appears with 5-min break timer and encouraging message
6. After break timer ends → next session prompt; user can continue or end
7. After 4 Pomodoros (or manual end) → session summary card shows: total time, sessions completed, goal entered, and self-reported completion checkbox
8. Session saved to history; streak count updated if daily minimum met
✓ Success
Session appears in history with timestamp and goal; streak increments; dashboard shows updated focus stats
⚠ Errors
• User closes tab mid-session → elapsed time saved to localStorage; on return 'Resume your session?' prompt
• User abandons session without completing → partial session still logged as attempted (not counted in streak)
• Timer drifts due to browser throttling on background tabs → compensated via requestAnimationFrame + timestamp comparison
Alt Paths
• User skips break → 'Skip Break' button available during break countdown
• User customizes timer → settings persist across sessions in user preferences
• User opens Focus Mode from a different device → session history syncs from server; timer does not resume (session is device-local)

05  Detailed Page Specifications
Layout, wireframes, data, interactions, and states for all key pages

Dashboard
/dashboard
Purpose
Central hub showing progress overview, personalized recommendations, and quick access to all platform features.
User Access
All authenticated students
Wireframe
+--------------------------------------------+
| [Logo]  Learn Roadmap Problems ... | AI 🔔 👤|
+--------------------------------------------+
| Welcome back, Rahul  🔥 7-day streak       |
+----------------+------------+--------------+
| Roadmap        | Today's    | Recent       |
| Progress       | Problems   | Activity     |
| [Ring 34%]     | [3 cards]  | [Feed items] |
+----------------+------------+--------------+
| Continue: Arrays → [topic card with CTA]   |
+--------------------------------------------+
| Community Highlights | Focus Stats Today   |
+--------------------------------------------+
Data Displayed
Streak count, last active date; roadmap completion %; recommended next topic (based on onboarding + last activity); today's problems solved vs daily goal; 3 recent community posts; today's focus minutes
User Actions
• 'Continue Learning' card → resumes last topic (/learn/[lastTopicSlug])
• Roadmap ring widget → /roadmap/dsa
• Problem card → /problems/[slug]
• 'Set daily goal' → opens inline goal setter
State Variations
• New user: Onboarding CTA replaces all widgets ('Complete setup to personalize')
• Loading: skeleton cards in all widget positions
• No activity yet: gentle 'Start here' CTA on first recommended topic
• Streak broken: 'Restart your streak today!' motivational banner
Mobile Notes
• Single-column stacked widget layout on mobile
• Roadmap ring becomes smaller progress bar strip
• 'Continue Learning' card pinned at top of mobile view

Learn — Topic Dashboard
/learn/[topicSlug]
Purpose
Entry point for studying a specific DSA topic. Gives an overview of all available resources and current progress before diving into any one area.
User Access
All authenticated students
Wireframe
+----------+----------------------------------+
| TOPICS   | Arrays               68%         |
| > Arrays | ████████░░ progress bar          |
|   Trees  +----------+-----------------------+
|   Graphs | 📹 Videos | 📝 Blogs             |
|   DP     | 12 videos | 8 articles           |
|   ...    | 8 watched | 3 read               |
|          +-----------+-----------+----------+
|          | 💻 Problems| 🤖 AI Mentor        |
|          | 24 problems| Ask a concept       |
|          | 9 solved   |                     |
+----------+------------+---------------------+
Data Displayed
Topic title and category breadcrumb; progress bar (% of resources completed); Videos card (total count, watched count); Blogs card (total count, read count); Problems card (total, solved); estimated completion time; prerequisite topics (with links)
User Actions
• Videos card → /learn/[slug]/videos
• Blogs card → /learn/[slug]/blogs
• Problems card → /problems?topic=[slug]
• AI Mentor card → opens AI chat panel as right-side drawer
• 'Mark topic complete' CTA (visible when >80% done)
State Variations
• Not started: all cards show 0/N with 'Start' badge
• In progress: cards show completion fractions
• Completed: green checkmark overlay on all cards; 'Next Topic' CTA appears
• Loading: skeleton 2x2 card grid
Mobile Notes
• Cards stack 2x2 on tablet, single column on mobile
• Sidebar topic list collapses to dropdown on mobile
• AI Mentor drawer becomes a full bottom sheet

Problems List
/problems
Purpose
Browse, search, and filter all coding problems by topic, difficulty, and completion status.
User Access
All authenticated students
Wireframe
+----------+------------------------------------+
| FILTERS  | 📊 Solved: 42 / 200               |
| Topic ▼  | 🔍 Search problems...             |
| Diff  ▼  +----+------------+------+----------+
| Status ▼ | #  | Title      | Diff | Status   |
|          +----+------------+------+----------+
| Easy  42 |  1 | Two Sum    | Easy | ✅ Solved |
| Med   18 |  2 | Valid Par. | Med  | 🔄 Tried  |
| Hard   4 |  3 | Merge Sort | Hard | ○ Unseen  |
|          +----+------------+------+----------+
|          |     [Pagination: < 1 2 3 >]       |
+----------+------------------------------------+
Data Displayed
Problem number, title, difficulty badge (color-coded: green/yellow/red), status icon (Solved/Attempted/Unseen), topic tags, acceptance rate (% of submitters who solved it)
User Actions
• Click problem row → /problems/[slug]
• Apply topic filter → table updates (debounced 300ms)
• Toggle difficulty → instant filter
• Search by title → debounced search
• Sort by: Default / Difficulty / Acceptance Rate / Title
State Variations
• Empty filter result: 'No problems match your filters' + 'Reset Filters' button
• Loading: skeleton table rows
• All solved: celebration message 'You've solved all problems in this filter! 🎉'
• Error fetching: 'Failed to load problems — Retry' button
Mobile Notes
• Table becomes a card list on mobile (one card per problem)
• Filters open as a bottom sheet on mobile
• Swipe problem card right to mark as 'Bookmarked'

Problem Solver (3-Panel)
/problems/[problemSlug]
Purpose
Immersive full-width coding environment with problem statement, Monaco editor, and AI Mentor / test results in one view.
User Access
All authenticated students
Wireframe
+---------------+------------------+-----------+
| Two Sum [Easy]| Python ▼  Run ▶  | AI | Tests |
+---------------+------------------+-----------+
| Given array.. | def twoSum(..):  | Ask AI... |
| nums = [...]  |   # your code    |           |
|               |   here           | [Hint 1]  |
| Examples:     |                  | [Hint 2]  |
| Input:[2,7,11]|                  |           |
| Output:[0,1]  +------------------+           |
|               | [Run]  [Submit]  |           |
| [See Doubts]  | [Reset] [Save]   |           |
+---------------+------------------+-----------+
Data Displayed
Problem title, difficulty badge, topic tags, success rate; problem description, examples, constraints; code editor with language selector and starter code; run/submit buttons; test case results (input, expected, actual, status); AI Mentor chat history
User Actions
• Language dropdown → switches starter code (with confirmation if code written)
• 'Run' → executes against visible test cases, results appear in right panel
• 'Submit' → runs against all test cases (hidden + visible)
• 'Get Hint' → AI Mentor generates contextual hint
• 'See Community Doubts' → opens filtered doubts feed for this problem
• 'View Editorial' → unlocked after 3 attempts; opens editorial modal
• 'Bookmark' → saves problem to bookmarks list
State Variations
• Editor empty: starter code shown in grey placeholder style
• Running: 'Executing...' spinner in Results tab; Run button disabled
• All tests pass: green 'All Passed' banner + Submit button pulses
• Submission success: confetti, 'Problem Solved!' modal with stats
• Submission fail: red failed cases shown with diff view
• AI Mentor loading: animated dots in chat area
Mobile Notes
• Bottom tab bar: Problem | Code | AI+Results
• Full-screen code mode available via expand icon
• Keyboard shortcuts: Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit

Visual Roadmap (DSA)
/roadmap/dsa
Purpose
Interactive node-graph visualization of the full DSA learning journey with prerequisite relationships and progress tracking.
User Access
All authenticated students
Wireframe
+----------+-----------------------------------------+
| DSA      |  Phase 1: Foundations                   |
| Placement|                                         |
|          |  [Arrays]──>[Strings]──>[Hashing]       |
| Progress:|      │                                  |
| 34% done |  [LinkedList]──>[Stacks]──>[Queues]     |
|          |                                         |
| Phase 1✅|  Phase 2: Core DSA                      |
| Phase 2🔄|  [Trees]──────────>[Graphs]             |
| Phase 3○ |      └──>[BST]         └──>[DP]        |
+----------+-----------------------------------------+
             Click any node to open topic details
Data Displayed
Node status (Not Started = grey, In Progress = blue with pulse, Completed = green with checkmark); prerequisite arrows between nodes; phase labels; overall progress %; per-phase completion badges; estimated total completion time
User Actions
• Click node → tooltip opens showing: topic name, completion %, resource counts, 'Open Topic' CTA
• Hover node → subtle scale animation, node description in tooltip
• 'Open Topic' in tooltip → /learn/[topicSlug]
• Roadmap switcher → toggles between DSA and Placement maps
• 'Reset Zoom' button → recenters canvas
State Variations
• First visit: animated 'fly-in' of nodes to establish the map
• All nodes grey: 'Start your journey — click any node to begin'
• Phase completed: phase label gets checkmark badge and subtle highlight
• All nodes green: 'You've mastered the roadmap! 🏆' celebration state
Mobile Notes
• Touch-to-pan, pinch-to-zoom on canvas
• Tap node → bottom sheet with topic details instead of tooltip
• 'Open Topic' in bottom sheet navigates to /learn/[slug]

Community — Doubts Feed
/community/doubts
Purpose
Browse, search, and post DSA doubts. Peer-to-peer doubt resolution with reputation system.
User Access
All authenticated students
Wireframe
+----------+--------------------------------------+
| Doubts ● | 🔍 Search doubts...    [+ Post Doubt]|
| Discuss  +--------------------------------------+
| Resources| [Resolved ✓] Arrays - Two pointer    |
| Achieve  | Why does my solution TLE on LC 15?   |
|          | @rahul · 2h ago · Arrays · 3 💬 · 12↑|
| [+ Post] +--------------------------------------+
|          | [Open] Trees - Inorder traversal     |
|          | Getting wrong output for skewed tree  |
|          | @priya · 4h ago · Trees · 1 💬 · 5↑  |
+----------+--------------------------------------+
Data Displayed
Post title, truncated body, author name + avatar, timestamp, topic tag, reply count, upvote count, resolved badge (if applicable)
User Actions
• '+ Post Doubt' → opens Post Creation modal
• Click doubt card → /community/post/[id] (full thread)
• Upvote button → instant upvote (optimistic)
• Topic tag filter (sidebar) → filters feed to that topic
• Sort: Latest / Top (most upvoted) / Unanswered
State Variations
• Empty feed: 'No doubts yet — be the first to ask!' + Post CTA
• Loading: skeleton post cards
• No search results: 'No doubts found for your search' + 'Ask this doubt' CTA with pre-filled title
Mobile Notes
• Single column card feed on all screen sizes
• Floating '+ Post' FAB button on mobile (bottom right)
• Swipe card right to upvote on mobile

Focus Mode
/focus
Purpose
Pomodoro-based focus session manager with goal setting, study tracking, and session history.
User Access
All authenticated students
Wireframe
+------------------------------------------+
|            🎯  FOCUS MODE               |
|                                          |
|  Session Goal: [Solve 3 Array problems]  |
|                                          |
|              25 : 00                     |
|           ▶  Start Session              |
|                                          |
|  ⚙ 25 min work / 5 min break [Edit]    |
|                                          |
|  ─────────────────────────────────────  |
|  Today: 2 sessions · 50 min focused     |
|  Session History  ↓                     |
|  Yesterday: 3 sessions · 75 min         |
+------------------------------------------+
Data Displayed
Pomodoro timer (countdown); session goal input; work/break duration config; today's session count and total minutes; streak indicator; last 7-day focus trend; session history list (date, goal, duration, sessions count)
User Actions
• 'Start Session' → timer countdown begins; UI enters minimal mode
• 'Pause' → timer pauses; 'Resume' restarts
• 'End Session' (during session) → shows confirmation dialog, then session summary
• 'Edit' timer settings → inline form to adjust work/break durations
• 'Mark Goal Complete' on summary → self-reported completion logged
State Variations
• First visit: 'Start your first focus session' onboarding tooltip
• Active session: full ambient mode (top bar still accessible for emergency nav)
• Break time: calming animation + 'Take a break' message
• Session complete: summary card with stats and motivational message
• Tab closed mid-session: on return 'Your session was interrupted. Log partial time?'
Mobile Notes
• Full-screen focus mode on mobile hides all chrome
• Timer large and readable (minimum 48px font)
• Haptic feedback on timer end (if supported)

06  Mock Data Strategy
Entity counts, key fields, relationships, and data approach

Entity
Records & Key Fields
Topics (15)
id, slug, title, category (Fundamentals/Core/Advanced), description, estimatedHours, prerequisiteTopicIds[], order
Problems (50)
id, slug, title, difficulty (Easy/Med/Hard), topicIds[], description, examples[], constraints, starterCode{ python, cpp, java, js }, testCases[], acceptanceRate, tags[]
Videos (3–5 per topic = ~60)
id, topicId, title, youtubeId, channelName, durationSeconds, order
Blogs (2–3 per topic = ~35)
id, topicId, title, url, source, estimatedReadMinutes, tags[]
Community Posts (43 total)
id, type (doubt/discussion/resource/achievement), authorId, title, body, topicTag, problemSlug?, codeSnippet?, upvotes, replyCount, resolved, createdAt
Mock Users (5)
id, username, avatar, level (Beginner/Intermediate/Advanced), joinDate, solvedCount, streakDays
Focus Sessions (10 mock)
id, userId, goal, workDuration, sessionsCompleted, totalMinutes, date, goalCompleted

Data Relationships
Topic → Videos (1:many), Topic → Blogs (1:many), Topic → Problems (many:many via problemTopics join)
Problem → TestCases (1:many), Problem → StarterCode (1:many keyed by language)
User → Progress (1:many) — tracks topicId, videosWatched[], blogsRead[], problemsSolved[]
Community Post → Replies (1:many), Reply → Upvotes (1:many)

Data Approach
Hardcoded JSON files in /src/mock/ folder (topics.json, problems.json, community.json, users.json)
User progress stored server-side (PostgreSQL) with optimistic local cache in React state
Mock community authors use randomized avatars from a local avatar set (not external API)
Problem test cases include: 2–3 visible examples + 5–8 hidden cases; edge cases included for Hard problems

Realistic Sample Values
Field
Example Values
Problem titles
Two Sum, Valid Parentheses, Maximum Subarray, Reverse Linked List, Binary Tree Level Order Traversal
Community post titles
'Why does my Two Sum solution give TLE?', 'Best resources for learning DP?', 'Finally solved my 50th problem!'
Focus session goals
'Solve 3 Array problems', 'Finish Arrays video series', 'Complete Trees topic today'
Topic estimated hours
Arrays: 8h, Trees: 12h, DP: 20h, Graphs: 15h, Bit Manipulation: 4h

07  Interaction Patterns & Micro-interactions
Modal vs page decisions, animations, and feedback patterns

Pattern
Implementation Detail
Modals
Community post creation, problem submission confirmation, language-switch warning, editorial view, session end confirmation. Always dismissable via Escape or backdrop click.
New Page
Problem solver (/problems/[slug]), single community post (/community/post/[id]), topic deep-dives (/learn/[slug]/videos). Full-page navigations with back-button support.
Inline Updates
Video/blog 'Mark as watched/read' checkboxes, upvote buttons, problem bookmarks. All optimistic — update UI first, sync to server silently.
Toasts (Bottom-Right)
Problem submitted, community post created, focus session saved, progress synced, copy to clipboard. Auto-dismiss after 3s. Error toasts stay until dismissed.
Confetti
Triggered on: first problem solve ever, roadmap phase completion, streak milestones (7/30/100 days), 100% topic completion.
Typewriter Effect
AI Mentor responses stream character by character via SSE. Gives conversational feel and makes latency feel intentional.
Skeleton Screens
All data-fetched lists and grids show skeleton placeholders during load. Never show empty state and loading state simultaneously.
Node Hover (Roadmap)
Scale 1.0 → 1.08 on hover (200ms ease). Tooltip fades in with topic name, completion %, and 'Open Topic' CTA button.
Progress Rings
Dashboard roadmap widget and topic dashboard use SVG ring charts. Animated fill on first render (750ms ease-out).
Streak Counter
Flame icon pulses subtly on dashboard load when streak is active. Broken streak shows grey flame with 'Restart today' message.

08  Edge Cases & Error Handling
Loading states, empty states, validation, and error recovery

Loading States
Page / Component
Loading Behavior
Problems list
Skeleton table rows (5 rows) with shimmer animation
Topic dashboard
Skeleton 2x2 card grid
Community feeds
Skeleton post cards (3 cards)
Roadmap canvas
Nodes fade in progressively as data loads (staggered 50ms per node)
Code execution
'Executing...' spinner in Results tab; Run and Submit buttons disabled
AI Mentor response
Animated typing dots while waiting for first streamed token
Dashboard
Skeleton widgets in all grid positions

Empty States
Context
Message & CTA
Problems list (all filters active)
'No problems match your filters' + 'Reset Filters' button
Community feed (new platform)
'No posts yet — be the first!' + 'Post' CTA button
Focus session history (new user)
'No sessions yet — start your first focus session' + 'Start Now' button
Search results (no match)
'No results for [query]' + suggestion to try broader terms
Topic videos (none added yet)
'Videos coming soon for this topic' + link to community resources
Notifications (none)
'You're all caught up!' with checkmark illustration

Form Validation Rules
Signup: email format validated on blur; password min 8 chars with strength indicator; name min 2 chars
Community post: title required (5–100 chars); body required (20–5000 chars); character count shown below each field
Code editor: language mismatch warning if switching after writing code; not a blocking error
Focus session goal: optional field; 0–100 chars; no special characters required

Error Recovery Patterns
Error Scenario
Recovery UX
AI Mentor API failure (Gemini down)
Yellow banner in AI panel: 'AI Mentor temporarily unavailable'. Coding continues normally. Retry button shown.
Code execution server error (not user error)
Generic message: 'Something went wrong on our end. Please try again.' Distinguish from user code errors via response status.
Network offline during coding
Orange offline banner at top. Code auto-saved to localStorage every 30s. 'Offline — changes saved locally' indicator.
YouTube embed blocked
Placeholder with video title + 'Watch on YouTube' external link + thumbnail image.
Progress sync failure
Local state preserved. Silent retry every 60s. 'Progress saving...' subtle indicator replaces normal 'Saved' status.
Admin route accessed by student
Immediate redirect to /dashboard + toast: 'You don't have access to that page.'
Expired auth session
Redirect to /auth/login with query param ?redirect=[originalPath] so user lands back after re-login.

09  Performance & UX Considerations
Pagination, lazy loading, and optimistic update strategies

Area
Strategy
Monaco Editor (Code)
Dynamic import (code-split) — only loaded on /problems/[slug] route. Reduces initial bundle by ~500KB.
Roadmap Canvas
Node data lazy-loaded on hover/click. Full graph structure (metadata only) loaded upfront for rendering. Topic details fetched on demand.
Problems List
Server-side pagination, 20 items per page. Filters trigger debounced API calls (300ms). URL reflects filter state for shareability.
Community Feeds
Infinite scroll with 10 posts per batch. IntersectionObserver triggers next page load when user is 200px from bottom.
YouTube Embeds
Lazy load iframes — only load when video enters viewport. Thumbnail + play button shown first (facade pattern).
Images / Avatars
Next.js Image component for automatic WebP conversion and responsive sizing. Avatars served from CDN.
Optimistic Updates
Upvotes, watched/read progress, problem solved status — all update UI instantly before API response. Rollback on error with subtle toast.
Route Prefetching
Next.js Link prefetches /learn/[slug] on hover in sidebar. Roadmap node clicks prefetch topic data on hover.

010  Implementation Checklist
Page-by-page development task list

Landing Page
Build hero section with headline, subheadline, and CTA buttons
Add features overview section (6 feature cards with icons)
Add social proof section (student testimonials / stats)
Implement mobile-responsive layout
Add smooth scroll navigation

Auth Pages (/auth/*)
Build login form (email/password + Google OAuth button)
Build signup form with inline validation and strength indicator
Implement Google OAuth flow
Build forgot password flow (/auth/forgot-password)
Build password reset page (/auth/reset-password/[token])
Handle email verification flow
Add redirect-after-login support (?redirect=)

Onboarding (/onboarding)
Build 3-step wizard with progress indicator
Step 1: experience level selector (3 options with descriptions)
Step 2: goal selector (4 options)
Step 3: roadmap preview with 'Start Journey' and 'Skip' options
Store user preferences to backend on completion
Set onboarding_completed flag to prevent re-showing

Dashboard (/dashboard)
Build 3-column responsive widget grid
Implement streak counter with flame animation
Build roadmap progress ring widget
Build 'Today's Problems' widget with daily goal
Build 'Continue Learning' recommendation card
Build recent community activity feed widget
Build Focus stats widget
Handle new user empty state (onboarding CTA replaces widgets)
Add skeleton loading for all widgets

Learn — Topic Dashboard (/learn/[topicSlug])
Build topic list sidebar with completion badges and group headers
Build topic header with progress bar
Build 2x2 resource card grid (Videos, Blogs, Problems, AI Mentor)
Show resource counts and completion fractions on each card
Implement progress bar update when resources completed
Show prerequisite topics with links
Handle not-started / in-progress / completed state variations
Add skeleton loading state

Learn — Videos (/learn/[topicSlug]/videos)
Build video list with thumbnails, titles, durations, channel names
Implement YouTube inline embed (facade pattern — thumbnail first)
Add 'Mark as Watched' toggle per video
Update topic progress on watch status change
Handle 'video unavailable' state with fallback link
Add skeleton loading

Problems List (/problems)
Build filterable problems table with columns: #, Title, Difficulty, Status, Tags
Implement topic filter (multi-select dropdown)
Implement difficulty toggle filter (Easy / Med / Hard)
Implement status filter (All / Solved / Attempted / Unseen)
Implement debounced title search
Implement sort by: Default / Difficulty / Acceptance Rate
Add server-side pagination (20 per page) with URL state
Show stats bar (Solved X / Total Y, breakdown by difficulty)
Handle empty filter result state
Add skeleton table loading
Make table rows into cards on mobile

Problem Solver (/problems/[problemSlug])
Build 3-panel resizable layout (35% / 40% / 25%)
Integrate Monaco Editor with dynamic import
Implement language selector with starter code per language
Implement 'Run' action with loading state and results display
Implement 'Submit' action with hidden test case feedback
Build test results panel (input / expected / actual / status per case)
Build AI Mentor chat panel with streaming typewriter response
Add 'Get Hint' quick-action button in AI panel
Add 'See Community Doubts' link (filtered to this problem)
Implement 'View Editorial' (unlocked after 3 attempts)
Add 'Bookmark' action
Implement confetti on successful first solve
Add code auto-save to localStorage (every 30s)
Handle network offline state gracefully
Build mobile tab layout (Problem / Code / AI+Results)

Visual Roadmap (/roadmap/dsa, /roadmap/placement)
Build interactive SVG/canvas node graph
Implement node status colors (grey / blue-pulse / green-check)
Implement prerequisite arrows between nodes
Build node hover tooltip with progress, resource counts, and 'Open Topic' CTA
Implement node click → tooltip opens (and stays open until dismissed)
Add phase grouping labels and phase completion badges
Add roadmap switcher (DSA / Placement)
Add overall progress % display in sidebar
Implement pan and zoom (desktop: scroll to zoom, drag to pan; mobile: pinch and touch)
Add 'Reset Zoom' button
Animate node entry on first load (staggered fade-in)
Handle mobile: tap node opens bottom sheet

Community — All Sections
Build section switcher sidebar (Doubts / Discussions / Resources / Achievements)
Build post feed (card list) with upvote, reply count, topic tag, and timestamp
Build post creation modal (title, rich text body, topic tag, code snippet)
Build single post view (/community/post/[id]) with full reply thread
Implement reply composer with code snippet support
Implement 'Mark as Solution' action (post author only)
Implement upvote (optimistic) on posts and replies
Implement feed sorting: Latest / Top / Unanswered
Implement search within section
Handle 'Resolved' badge on doubt threads
Show 'Similar doubts' suggestions when creating a new doubt
Handle empty feed state per section
Add infinite scroll (10 posts per batch)
Add floating '+ Post' FAB on mobile

Focus Mode (/focus)
Build Pomodoro timer with animated countdown ring
Implement work/break cycle logic
Build session goal text input
Build timer customization (work/break duration editor)
Implement minimal ambient mode during active session
Build session summary card (stats + self-reported completion checkbox)
Build session history list (last 14 days)
Save sessions to backend; update streak counter
Handle partial session on tab close / browser refresh
Compensate timer drift with timestamp comparison

Admin Panel (/admin/*)
Build admin dashboard with key metrics
Build problem CRUD interface (create, edit, delete with test case management)
Build content management (add/edit/remove videos and blogs per topic)
Build community moderation view (pin, remove, warn actions)
Build platform analytics page (DAU, solve rates, popular topics)
Restrict all /admin/* routes server-side to admin role
Redirect non-admin users to /dashboard with access denied toast

Global / Shared
Implement global top navigation bar with all links and user dropdown
Implement contextual sidebar system (section-specific)
Build notification bell with badge count and dropdown
Add toast notification system (success, error, info variants)
Add skeleton screen components for all data-fetched areas
Add offline detection banner
Implement mobile hamburger nav with full-screen overlay
Implement bottom sheet drawer for mobile contextual sidebar
Implement route-based auth guards (redirect to login if unauthenticated)
Add Framer Motion page transition animations
Implement 404 page with navigation back to dashboard
