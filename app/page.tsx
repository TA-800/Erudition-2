import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import SupabaseLogo from "../components/SupabaseLogo";
import NextJsLogo from "../components/NextJsLogo";

export const dynamic = "force-dynamic";

export default async function Index() {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="w-full flex flex-col items-center">
            <nav className="w-full flex justify-center border-b border-b-white/10 h-16">
                <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    <div />
                    <div>
                        {user ? (
                            <div className="flex items-center gap-4">
                                Hey, {user.email}!
                                <LogoutButton />
                            </div>
                        ) : (
                            <Link href="/login" className="py-2 px-4 rounded-md no-underline bg-black hover:bg-gray-800">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex flex-col gap-14 max-w-4xl px-3 py-16 lg:py-24">
                <div className="flex flex-col items-center mb-4 lg:mb-12">
                    {user && (
                        <Link href="/hub/study" className="bg-white py-3 px-6 rounded-lg font-mono text-sm text-black">
                            <strong>{"->"} hub/study</strong>
                        </Link>
                    )}
                    <div className="flex gap-8 justify-center items-center">
                        <Link href="https://supabase.com/" target="_blank">
                            <SupabaseLogo />
                        </Link>
                        <span className="border-l rotate-45 h-6" />
                        <NextJsLogo />
                    </div>
                    <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
                        Landing page for Erudition, shown to users <strong>not logged in</strong>.
                    </p>
                    <div className="bg-white py-3 px-6 rounded-lg font-mono text-sm text-black">
                        Logged in users redirected to <strong>/hub/study, /hub/discussions, /hub/profile</strong>
                    </div>
                </div>

                <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}
