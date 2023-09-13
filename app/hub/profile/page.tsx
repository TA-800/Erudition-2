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
            <div className="center-pad mb-5">
                <h1 className="lg:text-6xl text-3xl text-white">PROFILE</h1>
                <p className="opacity-75">
                    Change your student data on this page here. You can change your education institution, and your current year.
                </p>
            </div>

            <form action="/hub/profile/api" method="post" className="center-pad flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-xl">Current education institution:</p>
                    {/* Custom client comp. because fetching may take a long time for a long list of EIs.
                    Only fetch data when clicked on. */}
                    <SelectEI name="ei_id" eiId={students?.length ? students.at(0)!.ei_id : null} />
                    <p className="md:text-sm text-xs opacity-75">
                        Changing E.I. will unenroll you from all courses, and your modules & assignments will be lost.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-xl">Year</p>
                    <input type="number" name="year" className="ipt" defaultValue={students?.length ? students.at(0)!.Year : 0} />
                </div>
                <button className="btn btn-primary mt-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <span>Save</span>
                </button>
                <ProfileErrorMessages />
            </form>
            <form className="center-pad mt-5" action="/auth/sign-out" method="post">
                <button className="btn w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                            fillRule="evenodd"
                            d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                            clipRule="evenodd"
                        />
                        <path
                            fillRule="evenodd"
                            d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Logout</span>
                </button>
            </form>
        </>
    );
}
