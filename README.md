# 📈 SkillMarketCap

> Track and rank professional skills like CoinMarketCap tracks cryptocurrencies

A Next.js application that provides real-time rankings, salary data, job openings, and market trends for professional skills. Built with a vibrant green/yellow neon color palette and inspired by levels.fyi's data-focused design.

## 🚀 Live Demo

- **Local**: http://localhost:3001
- **Production**: [Deploy to Vercel]

## ✨ Features

### Current (V1.0)
- ✅ **Real-time Rankings**: 20+ professional skills ranked by market score
- ✅ **Detailed Skill Pages**: Individual pages with salary trends, growth rates, and market insights
- ✅ **Interactive Charts**: 90-day salary trend visualization using Recharts
- ✅ **Search & Filter**: Real-time search with category filtering
- ✅ **Sortable Tables**: Click any column to sort rankings
- ✅ **Dark Mode**: Full theme support with next-themes
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Green/Yellow Theme**: Vibrant neon color palette from Coolors

### Coming Soon
- 🔜 Categories page
- 🔜 Trends & analytics page
- 🔜 Skill comparison tool
- 🔜 ns.com/learn integration
- 🔜 ns.com/earn job board integration
- 🔜 Real-time API data sources

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes
- **Fonts**: Inter (Google Fonts)

## 📂 Project Structure

```
skillmarketcap.com/
├── app/
│   ├── globals.css           # Global styles & theme
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   ├── icon.svg               # Favicon
│   └── skill/[slug]/
│       └── page.tsx           # Dynamic skill detail pages
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── input.tsx
│   ├── header.tsx             # Navigation header
│   ├── skill-table.tsx        # Sortable rankings table
│   ├── skill-search.tsx       # Search & filter component
│   ├── skill-chart.tsx        # Recharts line chart
│   ├── theme-provider.tsx     # Theme context
│   └── theme-toggle.tsx       # Dark mode toggle
├── data/
│   └── mockSkills.ts          # Mock skill data (20 skills)
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Utility functions
├── INTEGRATIONS.md            # API integration strategy
└── README.md                  # This file
```

## 🎨 Color Palette

Inspired by https://coolors.co/007f5f-2b9348-55a630-80b918-aacc00-bfd200-d4d700-dddf00-eeef20-ffff3f

### Light Mode
- Primary: `#80b918` (Bright Lime)
- Secondary: `#d4d700` (Yellow-Green)
- Accent: `#ffff3f` (Pure Yellow)
- Foreground: `#007f5f` (Dark Teal)
- Success: `#2b9348` (Green)

### Dark Mode
- Background: `#001a14` (Very Dark Teal)
- Foreground: `#eeef20` (Bright Yellow-Green)
- Primary: Brighter variations
- High contrast for accessibility

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/adamtpang/skillmarketcap.com.git
cd skillmarketcap.com

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Data Model

```typescript
interface Skill {
  id: string;
  rank: number;
  name: string;
  slug: string;
  category: string[];
  description: string;
  marketScore: number;          // 0-100
  avgSalary: number;
  salaryRange: { min: number; max: number };
  jobOpenings: number;
  growthRate: {
    day: number;
    week: number;
    month: number;
    year: number;
  };
  demandLevel: 'High' | 'Medium' | 'Low';
  trendData: { date: string; salary: number; openings: number }[];
  relatedSkills: string[];
  topCompanies: string[];
  learningResources?: { name: string; url: string }[];
}
```

## 🔗 API Integration Roadmap

See [INTEGRATIONS.md](./INTEGRATIONS.md) for detailed integration strategy.

### Phase 1: ns.com Ecosystem
- **ns.com/learn**: Course recommendations for each skill
- **ns.com/earn**: Job opportunities and earning potential
- Cross-platform user tracking
- Affiliate revenue via course enrollments

### Phase 2: Job Board APIs
- Indeed API for job counts
- LinkedIn Jobs for demand insights
- RemoteOK/Remotive for remote trends
- Real-time job opening aggregation

### Phase 3: Salary Data
- Payscale API integration
- Glassdoor data (partnership)
- levels.fyi inspiration
- User-submitted salary verification

### Phase 4: Learning Platforms
- Coursera API for course data
- Udemy affiliate links
- GitHub API for open-source trends
- Stack Overflow developer survey

## 🎯 Key Metrics

### Ranking Algorithm (Market Score)
```
marketScore = (
  salaryLevel * 0.30 +
  jobOpeningsVolume * 0.25 +
  growthRate * 0.25 +
  searchTrends * 0.20
)
```

### Update Frequencies (Future)
- Job Openings: Daily
- Salary Data: Weekly
- Market Score: Hourly
- Trend Charts: Real-time

## 🔐 Environment Variables

```bash
# Create .env.local file
NEXT_PUBLIC_SITE_URL=https://skillmarketcap.com

# Future API keys
INDEED_API_KEY=your_key_here
PAYSCALE_API_KEY=your_key_here
NS_LEARN_API_KEY=your_key_here
NS_EARN_API_KEY=your_key_here
```

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Design inspiration: [levels.fyi](https://levels.fyi), [CoinMarketCap](https://coinmarketcap.com)
- UI Components: [shadcn/ui](https://ui.shadcn.com)
- Color palette: [Coolors.co](https://coolors.co)
- Charts: [Recharts](https://recharts.org)

## 📧 Contact

- Website: [skillmarketcap.com](https://skillmarketcap.com)
- GitHub: [@adamtpang](https://github.com/adamtpang)
- Twitter: TBD

---

Built with ❤️ using Next.js 16 + Tailwind CSS
