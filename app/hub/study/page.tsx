import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/utils/database.types";
import Content from "./content";

// Server Component with three interactive (client) components: Notes/Modules, Assignments, Break
export default async function Study() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase.auth.getUser();

    const { data: students, error } = await supabase.from("students").select("*").eq("id", data.user!.id);
    if (error) console.log("%cError: " + error, "color: red");

    return (
        <div className="center-pad flex flex-col gap-10">
            <div>
                <p className="lg:text-6xl text-3xl">
                    Welcome, <strong>{data.user!.user_metadata.full_name}</strong>.
                </p>
                <p className="opacity-75">Signed in as {data.user!.email}</p>
            </div>

            <Content doesExist={students?.at(0)?.id === data.user!.id} />
        </div>
    );
}
