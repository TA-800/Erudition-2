import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Erudition",
    description: "Manage your studies, assignments, and more.",
};
// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="font-mono tracking-tighter bg-zinc-800 text-zinc-300">
                <main>{children}</main>
            </body>
        </html>
    );
}
