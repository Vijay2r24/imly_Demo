// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "custom-yellow":'#f9eb28',
        'custom-red': '#F24F4B',
        'custom-heading':"#667649",
        'custom-blue':"#0021A6",
        'custom-brown':"#632E0F",
        'custom-darkblue':"#00246B",
        'custom-lightblue':"#CADCFC",
        'custom-maroon':"#fafafa",
        'custom-lightbrown': "#C07A50",
      },
    },
  },
  plugins: [],
}
