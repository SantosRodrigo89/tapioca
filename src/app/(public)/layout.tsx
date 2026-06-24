import { Inter } from "next/font/google";
import "./public-menu.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`public-menu min-h-screen ${inter.className}`}>{children}</div>;
}
