module.exports = {
  // IMPORTANT: This 'content' array tells Tailwind where to look for class names.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // KTM Orange & Black racing theme
      colors: {
        ktm: {
          orange: '#FF6900',
          'orange-dark': '#E55A00',
          'orange-light': '#FF8533',
          'orange-bright': '#FF7A1A',
          black: '#000000',
          'black-light': '#1A1A1A',
          'black-medium': '#2D2D2D',
          'gray-dark': '#333333',
          'gray-medium': '#666666',
          'gray-light': '#F5F5F5',
          white: '#FFFFFF',
        },
        // Override default orange with KTM orange
        orange: {
          50: '#FFF4E6',
          100: '#FFE4CC',
          200: '#FFCC99',
          300: '#FFB366',
          400: '#FF9A33',
          500: '#FF6900', // KTM primary orange
          600: '#E55A00', // KTM dark orange
          700: '#CC4D00',
          800: '#B33F00',
          900: '#993300',
        },
      },
      fontFamily: {
        'ktm': ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
