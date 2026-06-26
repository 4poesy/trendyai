module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-charcoal':  '#111111',
        'brand-black':     '#0d0d0d',
        'brand-card':      '#1a1a1a',
        'brand-card-hover':'#222222',
        'brand-yellow':    '#facc15',
        'brand-yellow-soft':'rgba(250, 204, 21, 0.12)',
        'brand-blue':      '#2563eb',
        'brand-blue-soft': 'rgba(37, 99, 235, 0.15)',
        'text-primary':    '#f5f5f5',
        'text-secondary':  '#888888',
        'text-muted':      '#555555',
        primary: '#facc15', // Yellow
        dark: '#111111',   // Charcoal dark bg
        secondary: '#00B342', // Mint Green
        white: '#ffffff',
        cyan: {
          100: '#E6FFFF',
          200: '#B3FFFF',
          300: '#80FFFF',
          400: '#4DFFFF',
          500: '#00E5FF', // Brand cyan
          600: '#00CCCC',
          700: '#009999',
          800: '#006666',
          900: '#003333',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#0A1E3F', // Brand navy
        },
        green: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        red: {
          100: '#fee2e2',
          400: '#f87171',
          500: '#ef4444',
          800: '#991b1b',
        },
        yellow: {
          100: '#fef3c7',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          800: '#92400e',
        },
        blue: {
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(0, 255, 255, 0.12), 0 1.5px 4px 0 rgba(0, 255, 255, 0.10)',
        'brand-glow': '0 0 15px rgba(0, 255, 255, 0.5)',
        'navy': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'navy-hover': '0 8px 25px rgba(0, 255, 255, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};