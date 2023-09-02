import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SelectEI from "./selectable";
import { Database } from "@/utils/database.types";
import { cookies } from "next/headers";
import ProfileErrorMessages from "./messages";

export default async function Profile() {
    // Get student data from students table using auth.getUser().id
    // If student data exists, populate the fields with the data
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase.auth.getUser();
    const { data: students, error } = await supabase.from("students").select("*").eq("id", data.user!.id);
    if (error) console.log(error);

    return (
        <>
            <h1 className="lg:text-6xl text-3xl px-4 lg:px-64 mb-5">Profile</h1>

            <form action="/hub/profile/api" method="post" className="px-4 lg:px-64 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-xl">Current education institution:</p>
                    {/* Custom client comp. because fetching may take a long time for a long list of EIs.
                    Only fetch data when clicked on. */}
                    <SelectEI name="ei_id" eiId={students?.length ? students.at(0)!.ei_id : null} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xl">Year</p>
                    <input type="number" name="year" className="ipt" defaultValue={students?.length ? students.at(0)!.Year : 0} />
                </div>
                <button className="btn bg-green-800 text-green-300 mt-8">Save</button>
                <ProfileErrorMessages />
            </form>
        </>
    );
}
