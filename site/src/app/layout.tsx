import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Doges Gallery",
  description: "Browse all 10,000 Doginal Mini Doges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-white min-h-screen">
        <header className="border-b border-white/10 sticky top-0 z-50 bg-bg/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80">
              <img
                src="/images/1.png"
                alt="Mini Doge"
                className="pixelated w-10 h-10 rounded"
              />
              <h1 className="text-xl font-bold">
                Mini Doges{" "}
                <span className="text-gold font-normal text-sm">
                  10,000 Doginals
                </span>
              </h1>
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
