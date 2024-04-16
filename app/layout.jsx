import { Inter } from "next/font/google";
import Navbar from "./components/Navbar/Navbar";
import Notification from "./components/Notification/Notification";
import GlobalState from "./context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Notification/>
        <GlobalState>
          <Navbar/>
          <main className="flex h-screen flex-col mt-[75px]">
            {children}
          </main>
        </GlobalState>
      </body>
    </html>
  );
}
