import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/utils/database.types";

// Server Component with three interactive (client) components: Notes/Modules, Assignments, Break
export default async function Study() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase.auth.getUser();

    const { data: students, error } = await supabase.from("students").select("*").eq("id", data.user!.id);
    if (error) console.log("%cError: " + error, "color: red");

    return (
        <>
            <div className="center-pad flex flex-col gap-10">
                <div>
                    <p className="lg:text-6xl text-3xl">
                        Welcome, <strong>{data.user!.user_metadata.full_name}</strong>.
                    </p>
                    <p className="opacity-75">Signed in as {data.user!.email}</p>
                </div>
                <div className="w-full h-96 bg-zinc-900 rounded border border-white/10 p-4">
                    {students?.length ? (
                        <p>You have successfully saved your student data in Profile.</p>
                    ) : (
                        <p>You have not saved your student data in Profile.</p>
                    )}
                </div>
            </div>
        </>
    );
}
