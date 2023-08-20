import Link from "next/link";

export default function HubLayout({ children }: { children: React.ReactNode }) {
    // Links to the various pages in the hub: study, discussions, profile

    // Nav bar to the top of the page with Erudition text to the left, and the three links to the right
    // Children content is the page content (depending on which link is clicked)
    return (
        <>
            <nav className="w-full flex items-center gap-2 border-b border-b-white/10 h-16">
                <div className="font-mono text-2xl">Erudition</div>
                <Link href="/hub/study" className="py-2 px-4 rounded font-mono bg-white text-black ml-auto">
                    Study
                </Link>
                <Link href="/hub/discussions" className="py-2 px-4 rounded font-mono bg-white text-black">
                    Discussions
                </Link>
                <Link href="/hub/profile" className="py-2 px-4 rounded font-mono bg-white text-black">
                    Profile
                </Link>
            </nav>
            {children}
        </>
    );
}
