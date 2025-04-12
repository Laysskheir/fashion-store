import { Cinzel_Decorative, Raleway } from "next/font/google";

export const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  fallback: ['Arial', 'sans-serif']
});

export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ['Arial', 'sans-serif'],
  display: 'swap'
});
