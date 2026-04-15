import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Indian Pulse — Your Daily News Destination",
  description:
    "The Indian Pulse delivers the latest breaking news, in-depth analysis, and trending stories across Sports, Entertainment, Business, World, Politics, and Technology.",
  keywords: [
    "Indian news",
    "breaking news",
    "sports",
    "politics",
    "technology",
    "business",
    "entertainment",
    "world news",
  ],
  openGraph: {
    title: "The Indian Pulse",
    description: "Your Daily News Destination",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
