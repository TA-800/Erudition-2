import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../utils/LogoutButton";

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
                                Hey, {user.user_metadata.name}!
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

            <div className="flex flex-col gap-14 max-w-4xl py-16 lg:py-24">
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl font-bold text-center">
                        Looking for a better way to manage your studies? <br />
                        <span className="text-3xl font-normal">Erudition is here to help.</span>
                    </h1>
                    <p className="text-center opacity-75">
                        Erudition is a study management tool that helps you keep track of your assignments, notes, and more.
                    </p>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-center">Features</h2>
                    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 justify-center">
                        <FeatureBox title="Study">Keep track of your assignments, notes, and more.</FeatureBox>
                        <FeatureBox title="Break">
                            Take a break from studying with our collection of games and other fun activities.
                        </FeatureBox>

                        <FeatureBox title="Profile">Profile page where you can manage your student data.</FeatureBox>
                        <FeatureBox title="Discussion">
                            Discussion board where you can ask questions and answer other people's questions.
                        </FeatureBox>
                    </div>
                </div>

                <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}

function FeatureBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 p-4 border border-white/10 bg-black/20 rounded-lg lg:w-96 w-80">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="opacity-75">{children}</p>
        </div>
    );
}
