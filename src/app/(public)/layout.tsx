import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./public-menu.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`public-menu min-h-screen ${plusJakarta.className} ${inter.variable} ${plusJakarta.variable}`}
    >
      {children}
    </div>
  );
}
