import { Database } from "@/utils/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST (request: Request) {
    const requestUrl = new URL(request.url);
    const formData = await request.formData();
    const year = Number(formData.get("year"));
    const ei_id = Number(formData.get("ei_id"));

    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=Could not authenticate user`,
          { // a 301 status is required to redirect from a POST to a GET route
            status: 301,
          })
    }
    
    const { error: err } = await supabase
        .from("students")
        .upsert({id: data.user.id, Year: year, ei_id: ei_id})
    
    if (err) {
        return NextResponse.redirect(
            `${requestUrl.origin}/hub/profile?error=Could not update profile`,
            { // a 301 status is required to redirect from a POST to a GET route
                status: 301,
            }
        )
    }

    return NextResponse.redirect(
        `${requestUrl.origin}/hub/profile`,
        { // a 301 status is required to redirect from a POST to a GET route
            status: 301,
        })
}