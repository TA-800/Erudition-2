import "./globals.css";
import { Metadata } from "next";

// https://github.com/vercel/next.js/issues/49373
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
    title: "Erudition",
    description: "Manage your studies, assignments, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="font-mono tracking-tighter bg-zinc-800 text-zinc-300">
                <main>{children}</main>
            </body>
        </html>
    );
}
