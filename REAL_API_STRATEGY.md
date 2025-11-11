# 🔌 Real API Strategy for SkillMarketCap

## Priority 1: Free APIs (Start Here)

### 1. GitHub API ⭐⭐⭐⭐⭐
**Why**: Best proxy for tech skill demand + completely free

```bash
# Get trending repos by language
GET https://api.github.com/search/repositories?q=language:python&sort=stars

# Track skill growth
GET https://api.github.com/search/repositories?q=language:rust+created:>2024-01-01
```

**What you get:**
- Repository counts by tech stack
- Star growth = popularity trend
- Issue/PR activity = community health
- Free: 5,000 requests/hour (authenticated)

**Implementation:**
```typescript
// app/api/skills/[slug]/github-activity/route.ts
export async function GET(req, { params }) {
  const skill = params.slug; // e.g., "python"
  const response = await fetch(
    `https://api.github.com/search/repositories?q=language:${skill}&sort=stars&per_page=100`,
    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }}
  );
  return Response.json(response);
}
```

### 2. Stack Overflow API ⭐⭐⭐⭐
**Why**: Developer community sentiment + question trends

```bash
# Get questions by tag
GET https://api.stackexchange.com/2.3/questions?tagged=reactjs&site=stackoverflow

# Track tag growth
GET https://api.stackexchange.com/2.3/tags/reactjs/info?site=stackoverflow
```

**What you get:**
- Question volume = skill popularity
- Tag trends = emerging skills
- Free: 10,000 requests/day

### 3. Google Trends (Unofficial) ⭐⭐⭐⭐
**Why**: Search interest = skill demand

```bash
npm install google-trends-api
```

```typescript
const googleTrends = require('google-trends-api');

googleTrends.interestOverTime({keyword: 'react js', startTime: new Date('2023-01-01')})
  .then((results) => {
    console.log(JSON.parse(results));
  });
```

**What you get:**
- Search volume trends
- Geographic interest
- Related queries
- Free: No API key needed

### 4. Hacker News API ⭐⭐⭐
**Why**: Tech community pulse

```bash
# Get top stories
GET https://hacker-news.firebaseio.com/v0/topstories.json

# Get item details
GET https://hacker-news.firebaseio.com/v0/item/8863.json
```

**What you get:**
- Trending tech topics
- Community sentiment
- Job posting frequency
- Free: Unlimited

### 5. Reddit API ⭐⭐⭐
**Why**: Community discussions + job postings

```bash
# Search subreddits
GET https://www.reddit.com/r/cscareerquestions/search.json?q=python&restrict_sr=1
```

**What you get:**
- Job posting frequency
- Salary discussions
- Learning resource recommendations
- Free: 60 requests/minute

---

## Priority 2: Freemium APIs (Free Tier)

### 6. Adzuna API (Job Search) ⭐⭐⭐⭐⭐
**Why**: Free job search API with salary data

```bash
# Get job listings
GET https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=YOUR_ID&app_key=YOUR_KEY&what=python developer

# Get salary histogram
GET https://api.adzuna.com/v1/api/jobs/us/histogram?app_id=YOUR_ID&app_key=YOUR_KEY&what=python
```

**What you get:**
- Job counts by skill
- Salary ranges
- Location data
- Free: 1 request/second

**Sign up:** https://developer.adzuna.com/

### 7. Remotive API (Remote Jobs) ⭐⭐⭐⭐
**Why**: Remote-first job data

```bash
GET https://remotive.com/api/remote-jobs
```

**What you get:**
- Remote job listings
- Salary ranges (when available)
- Company info
- Free: Public API

### 8. Arbeitnow API (EU Jobs) ⭐⭐⭐
**Why**: European market data

```bash
GET https://www.arbeitnow.com/api/job-board-api
```

**What you get:**
- EU tech jobs
- Salary ranges
- Skills required
- Free: Public API

---

## Priority 3: Scraping (Legal & Ethical)

### 9. LinkedIn Jobs (Scraped) ⭐⭐⭐⭐
**Why**: Best job data, but no official API

```typescript
import puppeteer from 'puppeteer';

async function scrapeLinkedInJobs(skill: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.linkedin.com/jobs/search?keywords=${skill}`);

  const jobCount = await page.$eval(
    '.results-context-header__job-count',
    el => el.textContent
  );

  return jobCount;
}
```

**Legal considerations:**
- Use rate limiting (1 request/5 seconds)
- Don't overwhelm servers
- Cache aggressively
- Consider using ScraperAPI or Bright Data

### 10. Indeed (Scraped) ⭐⭐⭐⭐
**Why**: Largest job board

```typescript
// Use Indeed's public job search (no login required)
const url = `https://www.indeed.com/jobs?q=${skill}&l=Remote`;
```

**Alternative:** Use Indeed Publisher API (requires approval)

### 11. Glassdoor (Scraped) ⭐⭐⭐
**Why**: Salary data

```typescript
// Scrape salary pages (public data)
const url = `https://www.glassdoor.com/Salaries/${skill}-salary-SRCH_KO0,${skill.length}.htm`;
```

---

## Priority 4: Paid APIs (Worth It)

### 12. RapidAPI Job Search ⭐⭐⭐⭐
**Why**: Aggregates multiple job boards

- **JSearch API**: $0-50/month
- **LinkedIn API (unofficial)**: $20-100/month
- **Indeed API (unofficial)**: $20-100/month

### 13. SerpAPI ⭐⭐⭐⭐
**Why**: Google search results as JSON

```bash
GET https://serpapi.com/search.json?q=python+developer+jobs&api_key=YOUR_KEY
```

**Cost:** $50/month (5,000 searches)

### 14. Payscale API ⭐⭐⭐⭐⭐
**Why**: Accurate salary data

**Cost:** Contact for pricing (likely $500+/month)
**Alternative:** Scrape their public pages initially

---

## Recommended Implementation Plan

### Week 1: Free APIs Only
```typescript
// Skill score calculation
const marketScore = {
  githubActivity: 30%,      // GitHub API
  stackOverflowQuestions: 20%,  // SO API
  googleTrends: 20%,        // Trends API
  hackerNewsM entions: 15%,  // HN API
  redditDiscussions: 15%    // Reddit API
};
```

### Week 2: Add Job Data
```typescript
// Job openings from Adzuna
const jobOpenings = await fetch(
  `https://api.adzuna.com/v1/api/jobs/us/search/1?what=${skill}`
);

// Supplement with Remotive for remote jobs
const remoteJobs = await fetch(
  `https://remotive.com/api/remote-jobs?search=${skill}`
);
```

### Week 3: Add Salary Data
```typescript
// Salary from Adzuna histogram
const salaryData = await fetch(
  `https://api.adzuna.com/v1/api/jobs/us/histogram?what=${skill}`
);

// Fallback: Scrape Glassdoor public pages
const glassdoorSalary = await scrapeGlassdoorSalary(skill);
```

### Week 4: Polish & Cache
```typescript
// Cache everything in Redis
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Cache for 24 hours
await redis.set(`skill:${slug}:data`, data, { ex: 86400 });
```

---

## Cost Breakdown

### Month 1 (Free Tier Only)
- GitHub API: Free
- Stack Overflow: Free
- Google Trends: Free
- Adzuna: Free
- **Total: $0**

### Month 2 (Add Paid Tools)
- Upstash Redis: $10/month
- SerpAPI: $50/month (optional)
- RapidAPI JSearch: $20/month
- **Total: $30-80/month**

### Month 3 (Scale)
- Vercel Pro: $20/month
- Redis Pro: $30/month
- SerpAPI: $50/month
- RapidAPI: $50/month
- **Total: $150/month**

---

## Legal & Ethical Considerations

### ✅ Safe to Use:
- Official APIs with documentation
- Public data with no login required
- Aggregate data (not user-specific)
- Data with proper attribution

### ⚠️ Gray Area:
- Web scraping (use rate limiting)
- Unofficial APIs on RapidAPI
- Data without clear ToS

### ❌ Avoid:
- Scraping behind login walls
- Violating rate limits
- Reselling data
- User-specific data without consent

---

## Example API Integration

```typescript
// app/api/skills/[slug]/market-data/route.ts

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Check cache first
  const cached = await redis.get(`skill:${slug}:market-data`);
  if (cached) return Response.json(cached);

  // Fetch from multiple sources
  const [github, stackoverflow, adzuna, trends] = await Promise.all([
    fetchGitHubActivity(slug),
    fetchStackOverflowQuestions(slug),
    fetchAdzunaJobs(slug),
    fetchGoogleTrends(slug),
  ]);

  // Calculate market score
  const marketScore = calculateMarketScore({
    githubStars: github.totalStars,
    soQuestions: stackoverflow.questionCount,
    jobOpenings: adzuna.count,
    searchInterest: trends.averageInterest,
  });

  const data = {
    marketScore,
    jobOpenings: adzuna.count,
    avgSalary: adzuna.salary?.median || null,
    trendData: trends.timeline,
    githubActivity: github,
    stackoverflow: stackoverflow,
  };

  // Cache for 24 hours
  await redis.set(`skill:${slug}:market-data`, data, { ex: 86400 });

  return Response.json(data);
}

function calculateMarketScore(metrics: any) {
  // Normalize each metric to 0-100 scale
  const normalized = {
    github: normalizeGitHubStars(metrics.githubStars),
    stackoverflow: normalizeSOQuestions(metrics.soQuestions),
    jobs: normalizeJobCount(metrics.jobOpenings),
    trends: metrics.searchInterest,
  };

  // Weighted average
  return (
    normalized.github * 0.3 +
    normalized.stackoverflow * 0.2 +
    normalized.jobs * 0.3 +
    normalized.trends * 0.2
  );
}
```

---

## Next Steps

1. **Sign up for free APIs** (30 minutes)
   - GitHub: https://github.com/settings/tokens
   - Adzuna: https://developer.adzuna.com/
   - Stack Overflow: https://api.stackexchange.com/

2. **Test with 1 skill** (1 hour)
   - Build API route for "React"
   - Fetch all data sources
   - Calculate market score
   - Display on frontend

3. **Scale to all skills** (1 day)
   - Loop through all mock skills
   - Fetch real data
   - Cache in Redis
   - Update UI

4. **Add NS integration** (2 days)
   - Connect ns.com/learn courses
   - Connect ns.com/earn jobs
   - Add UTM tracking
   - Test conversions

**Timeline:** Week 1 = Real data live!
