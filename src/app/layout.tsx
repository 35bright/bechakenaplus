import type { Metadata } from "next";
import { Poppins, Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | bechakena+",
    default: "bechakena+ — Better Products. Happier You.",
  },
  description: "Discover carefully curated products, top deals, and verified quality picks for electronics, lifestyle, fashion, and home in Bangladesh.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bechakena.plus'),
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "/",
    siteName: "bechakena+",
    title: "bechakena+ — Better Products. Happier You.",
    description: "Quality picks, great prices and a little extra — always.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bechakena+ — Better Products. Happier You.",
    description: "Quality picks, great prices and a little extra — always.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <ToastProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
