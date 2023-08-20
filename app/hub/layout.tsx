import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HubLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/");
    // Links to the various pages in the hub: study, discussions, profile

    // Nav bar to the top of the page with Erudition text to the left, and the three links to the right
    // Children content is the page content (depending on which link is clicked)
    return (
        <>
            <nav className="w-full flex justify-end items-center border-b border-b-white/10 h-16 lg:px-32 px-4">
                <div className="font-mono text-2xl mr-auto">Erudition</div>
                <div className="flex-row gap-2 lg:flex hidden">
                    <CustomLink href="/hub/study">Study</CustomLink>
                    <CustomLink href="/hub/discussions">Discussions</CustomLink>
                    <CustomLink href="/hub/profile">Profile</CustomLink>
                </div>
                <div className="lg:hidden block">
                    <HamburgerMenu />
                </div>
            </nav>
            {children}
        </>
    );
}

function CustomLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
    return (
        <Link href={href} className={`py-2 px-4 rounded font-mono bg-white text-black ${className ?? ""}`}>
            {children}
        </Link>
    );
}

function HamburgerMenu() {
    return (
        <button className="btn">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
    );
}
