# 🎯 SkillMarketCap x NS Learn-Earn Proposal

## The Problem

**Network School has:**
- $1M+ in tasks ready to deploy
- 1000+ portfolio companies
- Residents who want to earn but don't know how
- 40 MDEC applicants (need 100+)
- No systematic way to route talent → learning → earning

**The broader problem:**
- Education is disconnected from economic reality
- "Dark talent" can't find opportunities
- Companies can't find skilled people
- No transparent skill → salary → opportunity mapping

---

## The Solution: SkillMarketCap as Learn-Earn Infrastructure

### What It Is
A transparent skills marketplace that:
1. **Shows economic reality** - What skills pay, where, and how much
2. **Measures skill gaps** - Compare your skills vs. target jobs
3. **Routes to learning** - Connect gaps → ns.com/learn courses
4. **Routes to earning** - Connect skills → ns.com/earn opportunities
5. **Tracks progress** - Cryptographically verify skill acquisition

### Why It Works
- **Economic signal beats academic signal** - Money doesn't lie
- **Measurement enables improvement** - You manage what you measure
- **Personalized routing** - Each person's unique skill gap → learning path
- **Network effects** - More data → better routing → more users
- **Content moat** - SEO traffic → lead generation for NS

---

## Implementation Roadmap

### Phase 1: Core Infrastructure (Weeks 1-3)
**Goal: Get SkillMarketCap working with real data**

#### Week 1: Data Integration
- [ ] Connect Indeed API for job counts
- [ ] Scrape RemoteOK/Remotive for remote jobs
- [ ] Pull GitHub API for tech skill trends
- [ ] Aggregate salary data (Payscale/manual curation)
- **Deliverable**: Real-time job openings per skill

#### Week 2: NS Ecosystem Integration
- [ ] Create API: `/api/skills/{slug}/learn` → ns.com/learn courses
- [ ] Create API: `/api/skills/{slug}/earn` → ns.com/earn jobs
- [ ] Build "Learn this skill" CTA on skill pages
- [ ] Build "Find jobs" section on skill pages
- [ ] UTM tracking for conversions
- **Deliverable**: Users can click skill → see learning path + jobs

#### Week 3: Skill Gap Analyzer
- [ ] Job description parser (extract required skills)
- [ ] User skill profile (what you know)
- [ ] Gap analysis UI (what you need to learn)
- [ ] Learning path generator (courses to fill gaps)
- **Deliverable**: Paste any job description → see your gaps + learning path

### Phase 2: Talent Routing System (Weeks 4-6)
**Goal: Help 10+ NS residents earn through the system**

#### Week 4: User Accounts & Tracking
- [ ] Auth with Web3 (Farcaster) or email
- [ ] Skill portfolio (self-reported + verified)
- [ ] Learning progress tracking
- [ ] Task/bounty completion tracking
- **Deliverable**: Users can track their skill journey

#### Week 5: Task Marketplace
- [ ] Import $1M tasks from NS backlog
- [ ] Match tasks to required skills
- [ ] Recommend tasks based on user skills
- [ ] Track task completion → skill verification
- **Deliverable**: Users can find tasks matching their skills

#### Week 6: Portfolio Company Integration
- [ ] Map portfolio companies → skills needed
- [ ] Create "warm intro" system
- [ ] Track internship/job placements
- [ ] Collect outcome data (hired? salary?)
- **Deliverable**: 10+ residents earning through the system

### Phase 3: Scale & Content (Weeks 7-12)
**Goal: 100+ MDEC applicants, Balaji launch post**

#### Weeks 7-9: Content & SEO
- [ ] Write Balaji-style launch post
- [ ] Create skill-specific landing pages (500+ skills)
- [ ] Build "State of Skills" quarterly report
- [ ] Email capture for weekly skill reports
- **Deliverable**: SEO traffic → NS lead gen

#### Weeks 10-12: Advanced Features
- [ ] Skill combination analyzer (React + TypeScript = $X)
- [ ] Career path simulator (5-year earning projection)
- [ ] Company skill profiles (what Google values)
- [ ] Reverse engineering (I want to work at X → skills needed)
- **Deliverable**: Advanced routing intelligence

---

## Success Metrics

### Month 1
- ✅ SkillMarketCap live with real data
- ✅ ns.com/learn + ns.com/earn integration working
- ✅ 100+ skills with accurate salary/job data

### Month 2
- ✅ 10+ NS residents earning through the system
- ✅ 5+ residents hit MDEC income requirements ($2k/month)
- ✅ Skill gap analyzer working

### Month 3
- ✅ 50+ residents using the platform
- ✅ 100+ MDEC applicants (up from 40)
- ✅ Draft content for Balaji's substack
- ✅ Working L2 with 20+ paid members ($100/month)

---

## Business Model

### Revenue Streams
1. **Course Affiliates** - Commission from ns.com/learn enrollments
2. **Job Placement Fees** - 10-15% of first year salary (standard recruiting)
3. **Premium Features** - $100/month for advanced routing
4. **Company Subscriptions** - $500/month for talent search
5. **API Access** - $1k/month for developers

### Cost Structure
- **Month 1-3**: $2k/month contractor fee
- **Tools**: $500/month (APIs, hosting, tools)
- **Total**: $6.5k for 3-month MVP

### ROI for NS
- **100+ MDEC applicants** → Hit quota, keep visa privileges
- **SEO traffic** → Lead gen worth $10k+/month
- **Task marketplace** → Deploy $1M in tasks
- **Job placements** → Revenue share from companies
- **Content** → Balaji post → visibility → more residents

**Break-even**: 1-2 job placements OR 50 paid members

---

## Why Adam is Perfect for This

### Background
- ✅ App Academy grad (coding bootcamp = learn-to-earn model)
- ✅ High compassion + technical skills
- ✅ Living the problem (needs income for visa)
- ✅ Already built 50+ projects (ships fast)
- ✅ Understands NS ecosystem deeply

### Unique Position
- **Skin in the game** - Needs this to work for himself
- **First user** - Can dogfood the system
- **Community trust** - Residents already know him
- **Content creator** - Can write + build simultaneously

---

## The Ask

### Option A: 3-Month Contractor
- **$2k/month x 3 months = $6k total**
- Build SkillMarketCap + NS integration
- Help 10+ residents earn
- Write Balaji launch content
- If successful → L2 with $5k funding

### Option B: L2 from Day 1
- **$5k NS L2 funding**
- Run as "Ikigai L2" - Find your career path
- 20 members x $100/month = $2k/month revenue
- Build SkillMarketCap as L2 infrastructure
- Sustainable from month 1

### Option C: Hybrid
- **$2k/month contractor + L2 launch in Month 2**
- Month 1: Build infrastructure (paid by NS)
- Month 2: Launch L2 (self-sustaining)
- Month 3: Scale to 50+ members

---

## Timeline

### Week 1 (Now)
- [x] Finish SkillMarketCap prototype
- [ ] Present proposal to Franco/Brian/Balaji
- [ ] Get approval for contractor role OR L2

### Weeks 2-4
- [ ] Connect real APIs
- [ ] Build NS integration
- [ ] Launch to NS residents

### Weeks 5-8
- [ ] Help 10+ residents earn
- [ ] Document case studies
- [ ] Write launch content

### Weeks 9-12
- [ ] Scale to 100+ MDEC applicants
- [ ] Launch publicly
- [ ] Transition to L2 or permanent role

---

## Risk Mitigation

**What if it doesn't work?**
- ✅ Downside capped (3 months, $6k)
- ✅ You get a working product regardless
- ✅ Content for Balaji's substack
- ✅ Learning experience for Adam
- ✅ Adam goes back to job search if needed

**What if residents don't use it?**
- ✅ Adam is first user (dogfooding)
- ✅ Mandatory for MDEC applicants
- ✅ Integrated into NS onboarding

**What if APIs are expensive?**
- ✅ Start with free tiers
- ✅ Scraping as backup
- ✅ Manual curation initially

---

## The Bigger Vision

This isn't just SkillMarketCap. It's:
- **The measurement layer** for education-employment
- **The routing system** for dark talent
- **The economic signal** that replaces degrees
- **The infrastructure** for NS Learn-Earn
- **The content moat** for NS growth

If it works at NS, it becomes:
- **YC for individuals** - Application → Learning → Task → Internship → Job
- **Hogwarts with economics** - Learn magic that actually pays
- **Transparent ikigai discovery** - What you love + What pays

---

## Next Steps

1. **Get on Franco's calendar** - 30min pitch
2. **Show the prototype** - http://localhost:3001
3. **Walk through this doc** - Answer questions
4. **Get approval** - Contractor OR L2
5. **Start building** - Week 1 deliverables

---

## Appendices

### A. Competitive Landscape
- **Levels.fyi** - Salary data, but no learning integration
- **LinkedIn Learning** - Learning, but no economic signal
- **Coursera** - Courses, but no job routing
- **Indeed** - Jobs, but no skill measurement
- **SkillMarketCap** - All of the above, integrated

### B. Similar Successful Models
- **App Academy** - Learn → Earn (ISA model)
- **Lambda School** - Education with income guarantee
- **YC** - Startup → Funding → Growth
- **Thiel Fellowship** - Skip college → Build
- **1517 Fund** - Dark talent discovery

### C. Why Now?
- ✅ AI makes personalized routing possible
- ✅ Remote work = global talent market
- ✅ College ROI declining
- ✅ Skills change faster than degrees
- ✅ Web3 enables cryptographic verification
- ✅ NS has the infrastructure (tasks, companies, residents)

---

**TL;DR**: Let Adam build SkillMarketCap as NS Learn-Earn infrastructure. $2k/month x 3 months. Help 10+ residents earn. Hit 100+ MDEC quota. Write Balaji launch post. If it works, become L2 or permanent role. If not, no hard feelings.
