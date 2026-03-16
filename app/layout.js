import { DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cosechar — Temporada Argentina",
  description: "Frutas y verduras de temporada en Argentina. Guía para saber qué comer según la estación del año.",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
