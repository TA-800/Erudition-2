import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HamburgerMenu, { CustomLink } from "./menu";

export default async function HubLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/");

    return (
        <>
            <nav className="bg-zinc-900 w-full fixed top-0 left-0 flex justify-end items-center border-b border-b-white/20 h-24 lg:px-32 px-4 z-50">
                <div className="lg:text-4xl text-3xl mr-auto">Erudition</div>
                <div className="flex-row gap-2 lg:flex hidden">
                    <CustomLink href="/hub/study">Study</CustomLink>
                    <CustomLink href="/hub/discussions">Discussions</CustomLink>
                    <CustomLink href="/hub/profile">Profile</CustomLink>
                </div>
                <div className="lg:hidden block">
                    <HamburgerMenu />
                </div>
            </nav>
            <div className="lg:mt-32 mt-28 pb-5">{children}</div>
        </>
    );
}
