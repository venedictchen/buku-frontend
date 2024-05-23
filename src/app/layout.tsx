import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Buku.ID | Toko Buku Online Terlengkap di Indonesia",
  description: "Discover Worlds Between Pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Montserrat, sans-serif" }}>
        <Navbar />
        <main className="bg-primary min-h-screen">{children}</main>
      </body>
    </html>
  );
}
