import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./lib/site-policy.mjs";

// No redirects here. The old host-based rules that lived in skill.supply's
// config (skillmarketcap.com -> skill.supply/skills) died with the split;
// this project IS skillmarketcap.com now, and carrying those rules over
// would have redirected the site's own domain into a loop.
const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./data/market-public.json"],
    "/data": ["./data/market-public.json"],
    "/learn": ["./data/market-public.json"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...SECURITY_HEADERS],
      },
    ];
  },
};

export default nextConfig;
