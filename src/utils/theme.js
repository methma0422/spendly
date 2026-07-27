export const theme = {
  colors: {
    background: '#060511',      // Sphiria Digital midnight deep black-violet
    surface: '#0c0b1e',         // Sphiria Digital midnight card surface
    surfaceLight: '#181635',    // Focus state card surface
    primary: '#00A39A',          // Sphiria Digital main branding Teal
    primaryDark: '#00827B',
    primaryLight: '#00FFF1',     // Neon Cyan / Electric Blue highlight
    secondary: '#00FFF1',        // Secondary Cyan
    accent: '#00FFF1',           // Accent glow
    error: '#f43f5e',            // Rose error
    success: '#00FFF1',          // Teal-Cyan success
    warning: '#f59e0b',          // Amber warning
    border: '#1c1a40',           // Deep midnight border
    cardBorder: 'rgba(0, 163, 154, 0.15)', // Neon Teal translucent border
    
    // Text colors
    text: '#fafbfc',             // White/Slate 50
    textSecondary: '#a5a6c5',    // Slate secondary
    textMuted: '#686a95',        // Slate muted
    textDark: '#060511',
    
    // Category colors (updated to match Sphiria's high-tech palette)
    categories: {
      Food: '#00FFF1',          // Cyan
      Transport: '#00A39A',     // Teal
      Shopping: '#ec4899',      // Hot Pink
      Bills: '#f43f5e',         // Rose Red
      Health: '#10b981',        // Emerald Green
      Education: '#8b5cf6',     // Violet Purple
      Entertainment: '#f59e0b',  // Yellow Amber
      Other: '#686a95'          // Slate Grey
    },
    
    // Category background tints
    categoryTints: {
      Food: 'rgba(0, 255, 241, 0.12)',
      Transport: 'rgba(0, 163, 154, 0.15)',
      Shopping: 'rgba(236, 72, 153, 0.12)',
      Bills: 'rgba(244, 63, 94, 0.12)',
      Health: 'rgba(16, 185, 129, 0.12)',
      Education: 'rgba(139, 92, 246, 0.12)',
      Entertainment: 'rgba(245, 158, 11, 0.12)',
      Other: 'rgba(104, 106, 149, 0.12)'
    }
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999
  },
  
  typography: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
    huge: 36
  },
  
  shadows: {
    sm: {
      shadowColor: '#00FFF1',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#00FFF1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#00FFF1',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 5,
    }
  }
};
