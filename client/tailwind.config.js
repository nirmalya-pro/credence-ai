/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Midnight Black palette
        midnight: {
          950: '#0B0B0C', // Signature Midnight Black
          900: '#121214', // Surface Dark
          850: '#17171A', // Elevated Dark Panel
          800: '#1E1E22', // Subtle Dark Element
          700: '#2A2A30', // Dark Border
          600: '#3D3D45',
        },
        // Lime Accent palette
        lime: {
          300: '#E2FBA0',
          400: '#D4F75E',
          500: '#C6F432', // Signature Accent Lime Green
          600: '#B0DE1E',
          700: '#92BC10',
        },
        // Slate neutrals
        slate: {
          50: '#F9FAFB',  // Clean canvas light
          100: '#F3F4F6', // Subtle container
          200: '#E5E7EB', // Card border
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(11, 11, 12, 0.04), 0 1px 2px -1px rgba(11, 11, 12, 0.03)',
        'card': '0 4px 20px -2px rgba(11, 11, 12, 0.05), 0 2px 6px -1px rgba(11, 11, 12, 0.02)',
        'card-hover': '0 10px 25px -3px rgba(11, 11, 12, 0.08), 0 4px 10px -2px rgba(11, 11, 12, 0.04)',
        'panel-elevated': '0 8px 30px rgba(11, 11, 12, 0.06)',
        'lime-sm': '0 2px 10px rgba(198, 244, 50, 0.3)',
        'lime-md': '0 4px 18px rgba(198, 244, 50, 0.45)',
        'depth-1': '0 1px 2px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
        'depth-card': '0 2px 4px -1px rgba(11, 11, 12, 0.06), 0 4px 12px -2px rgba(11, 11, 12, 0.04)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
