/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // BRAND / STRATEGIC COLORS
        // Use for main identity elements (logo, primary actions, highlights)
        primary: {
          50:  '#eef7ff',
          100: '#d9ecff',
          200: '#b3d9ff',
          300: '#84c2ff',
          400: '#4da6ff',
          500: '#1a8cff',   // MAIN brand color (default button, links, key actions)
          600: '#006fd6',   // Hover / Active shade
          700: '#0054a3',
          800: '#003b73',
          900: '#00264d',
        },

        // Secondary brand usage — alternative accents or less dominant actions
        secondary: {
          50: '#f8f4ff',
          100: '#eee3ff',
          200: '#d6c2ff',
          300: '#b899ff',
          400: '#9966ff',
          500: '#7a33ff',   // Secondary button background
          600: '#661fd6',   // Hover
          700: '#4d18a3',
          800: '#351173',
          900: '#230b4d',
        },

        // STATUS / FEEDBACK COLORS (Semantic Use Only)
        // Success — confirmations, completed status, positive feedback
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',  // Main success usage
          600: '#059669',  // Hover
        },

        // Warning — caution messages, non-critical alerts
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',  // Main warning usage
          600: '#d97706',
        },

        // Danger — destructive actions or errors
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',  // Delete buttons, error alerts
          600: '#dc2626',
        },

        // Info — neutral notifications or updates
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Info badges or banners
          600: '#2563eb',
        },

        // NEUTRALS / STRUCTURE
        // Use for text, borders, background hierarchy
        gray: {
          50:  '#f9fafb',   // Background
          100: '#f3f4f6',   // Subtle dividers
          200: '#e5e7eb',   // Borders
          300: '#d1d5db', 
          400: '#9ca3af',   // Placeholder text
          500: '#6b7280',   // Secondary text
          600: '#4b5563',   // Body text
          700: '#374151',   // Headings
          800: '#1f2937',
          900: '#111827',
        },

        // Surfaces — structural backgrounds (cards, sections)
        surface: {
          DEFAULT: '#ffffff', // Light mode card background
          muted: '#f8f9fa',   // Light gray surfaces
          dark: '#1f2937',    // Dark mode surface
        },
      }
    }
  }
}
