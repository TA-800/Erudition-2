import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Server Component with three interactive (client) components: Notes/Modules, Assignments, Break
export default async function Study() {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/");

    return <h1 className="text-6xl text-center text-white">Study</h1>;
}
