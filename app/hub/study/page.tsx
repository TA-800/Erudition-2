import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/utils/database.types";
import Content from "./overview";
import WeeklyContent from "./weekly";
import Respite from "./break";

// Server Component with three interactive (client) components: Notes/Modules, Assignments, Respite
export default async function Study() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase.auth.getUser();
    let doesExistInStudentData = false;

    const { data: students, error } = await supabase.from("students").select("*").eq("id", data.user!.id);
    if (error) {
        alert("Error fetching student data. Please try again later.\n" + error.message);
        return <div>Error fetching student data.</div>;
    } else doesExistInStudentData = students?.at(0)?.id === data.user!.id;

    return (
        <div className="center-pad flex flex-col gap-10">
            <div>
                <p className="lg:text-5xl text-2xl">Welcome,</p>
                <div className="flex flex-row gap-3 items-center">
                    <img
                        src={data.user!.user_metadata.avatar_url}
                        className="lg:w-16 w-12 lg:h-16 h-12 rounded border border-white/20 inline-block"
                    />
                    <span className="lg:text-6xl text-3xl text-white tracking-tight font-bold">
                        {data.user!.user_metadata.full_name}
                    </span>
                </div>
                <p className="opacity-75">Signed in as {data.user!.email}</p>
            </div>

            {/* Pass in userId to avoid calling supabase.auth.getUser() everytime in each comp. Context is overkill. */}
            <Content doesExistInStudentData={doesExistInStudentData} userId={data.user!.id} />
            {doesExistInStudentData && <WeeklyContent userId={data.user!.id} />}
            <Respite />
        </div>
    );
}
