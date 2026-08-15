import type { NextConfig } from "next";

// No redirects here. The old host-based rules that lived in skill.supply's
// config (skillmarketcap.com -> skill.supply/skills) died with the split;
// this project IS skillmarketcap.com now, and carrying those rules over
// would have redirected the site's own domain into a loop.
const nextConfig: NextConfig = {};

export default nextConfig;
