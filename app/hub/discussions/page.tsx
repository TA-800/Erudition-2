import { Database } from "@/utils/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getDiscussionsForEI() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase.auth.getUser();

    const { data: students, error } = await supabase.from("students").select("*").eq("id", data.user!.id);
    if (error || students === null || students?.at(0)?.id !== data.user!.id) return null;

    // TODO: Use rpc to get the discussions for the student
}

export default async function Discussions() {
    const discussions = await getDiscussionsForEI();

    return (
        <>
            <h1 className="lg:text-6xl text-3xl center-pad text-white mb-5">Discussions</h1>
            <div className="center-pad">
                <div className="bg-zinc-700 rounded p-4">{/* Link to page for each discussion */}</div>
            </div>
        </>
    );
}
