// Coolors Color Palette: https://coolors.co/007f5f-2b9348-55a630-80b918-aacc00-bfd200-d4d700-dddf00-eeef20-ffff3f

export const colors = {
  // Base palette
  darkTeal: '#007f5f',      // Dark teal for text
  green: '#2b9348',         // Green
  lime: '#55a630',          // Lime
  brightLime: '#80b918',    // Bright lime (primary)
  yellowGreen: '#aacc00',   // Yellow-green
  chartreuse: '#bfd200',    // Chartreuse
  yellow: '#d4d700',        // Yellow (secondary)
  brightYellow: '#dddf00',  // Bright yellow
  neonYellow: '#eeef20',    // Neon yellow
  pureYellow: '#ffff3f',    // Pure yellow (accent)

  // Semantic colors
  primary: '#80b918',       // Bright lime
  secondary: '#d4d700',     // Yellow
  accent: '#ffff3f',        // Pure yellow
  success: '#2b9348',       // Green
  warning: '#aacc00',       // Yellow-green

  // Light mode
  light: {
    background: '#fffef0',     // Soft cream/yellow background
    foreground: '#007f5f',     // Dark teal text
    muted: '#f5f5dc',          // Beige
    mutedForeground: '#2b9348', // Green for muted text
  },

  // Dark mode
  dark: {
    background: '#001a14',     // Very dark teal
    foreground: '#eeef20',     // Neon yellow text
    muted: '#003d2e',          // Dark teal muted
    mutedForeground: '#bfd200', // Chartreuse for muted text
  },

  // Chart colors
  chart: {
    1: '#80b918', // Bright lime
    2: '#2b9348', // Green
    3: '#d4d700', // Yellow
    4: '#eeef20', // Neon yellow
    5: '#aacc00', // Yellow-green
  },
};

// HSL conversions for CSS variables
export const hslColors = {
  light: {
    background: '60 100% 97%',     // Soft yellow/cream
    foreground: '164 100% 25%',    // Dark teal
    card: '60 40% 98%',
    cardForeground: '164 100% 25%',
    primary: '95 100% 36%',        // Bright lime
    primaryForeground: '0 0% 100%',
    secondary: '64 100% 42%',      // Yellow (darker for visibility)
    secondaryForeground: '164 100% 25%',
    muted: '60 30% 92%',
    mutedForeground: '164 50% 35%',
    accent: '60 100% 62%',         // Pure yellow
    accentForeground: '164 100% 25%',
    success: '137 55% 41%',        // Green
    successForeground: '0 0% 100%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    border: '60 20% 85%',
    input: '60 20% 85%',
    ring: '95 100% 36%',
  },
  dark: {
    background: '164 100% 5%',     // Very dark teal
    foreground: '60 100% 80%',     // Bright neon yellow
    card: '164 100% 8%',
    cardForeground: '60 100% 80%',
    primary: '95 100% 55%',        // Brighter lime for dark mode
    primaryForeground: '164 100% 5%',
    secondary: '64 100% 50%',      // Brighter yellow
    secondaryForeground: '164 100% 5%',
    muted: '164 40% 15%',
    mutedForeground: '64 60% 70%',
    accent: '60 100% 62%',
    accentForeground: '164 100% 5%',
    success: '137 55% 50%',
    successForeground: '164 100% 5%',
    destructive: '0 62% 50%',
    destructiveForeground: '0 0% 100%',
    border: '164 40% 20%',
    input: '164 40% 20%',
    ring: '95 100% 55%',
  },
};
