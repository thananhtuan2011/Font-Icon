/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/**/*.{html,ts}"],
  theme: {
    extend: {},
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "821px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }
    },
  },
  plugins: []
};
