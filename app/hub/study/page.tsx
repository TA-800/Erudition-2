import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Server Component with three interactive (client) components: Notes/Modules, Assignments, Break
export default async function Study() {
    const supabase = createServerComponentClient({ cookies });
    const { data } = await supabase.auth.getUser();

    return (
        <>
            <h1 className="lg:text-6xl text-3xl px-4 lg:px-64 text-white min-h-screen">
                Welcome, <strong>{data.user!.user_metadata.full_name}</strong>
            </h1>
        </>
    );
}
