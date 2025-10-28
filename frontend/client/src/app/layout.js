import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "../context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GreenLens - Nairobi",
  description: "AI-powered sustainability insights for Nairobi",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/favicon-96x96.png", sizes: "96x96" },
      { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
