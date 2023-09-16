import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LogoutButton, { GoToHubButton, LoginButton } from "@/utils/LandingButtons";
import { Inter } from "next/font/google";

export const dynamic = "force-dynamic";
const inter = Inter({ subsets: ["latin"] });

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
                                <GoToHubButton />
                                <LogoutButton />
                            </div>
                        ) : (
                            <LoginButton />
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex flex-col gap-14 max-w-4xl py-16 lg:py-24">
                <div className="flex flex-col gap-4">
                    <h1 className={`${inter.className} text-4xl lg:text-5xl font-black uppercase text-center`}>
                        Looking for a better way to manage your studies?
                    </h1>
                    <p className="text-center opacity-75">
                        Erudition is a study management website that helps you keep track of your assignments, notes, and more.
                    </p>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-center">Features</h2>
                    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 justify-center lg:items-stretch items-center">
                        <FeatureBox title="Study">Keep track of your assignments, notes, and more.</FeatureBox>
                        <FeatureBox title="Break">
                            Take a break from studying with a collection of games and other fun activities.
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
