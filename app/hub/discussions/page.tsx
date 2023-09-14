import { Database } from "@/utils/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import CreatePostButton from "./newPost";
import PostWrapper from "./post";

export type Post = Database["public"]["Functions"]["getpostswithcommentnumber"]["Returns"][0];

async function getDiscussionsForEI() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data } = await supabase.auth.getUser();

    const { data: students, error } = await supabase.from("students").select("*").eq("id", data.user!.id);
    if (error) return 1;
    if (students === null || students.at(0)?.id !== data.user!.id) return 2;

    const { data: posts, error: postsError } = await supabase.rpc("getpostswithcommentnumber", {
        ei_id_input: students.at(0)!.ei_id!,
    });

    if (postsError || posts === null) {
        console.error(postsError || "posts is null");
        return 3;
    }

    // Return posts
    return posts;
}

export default async function Discussions() {
    const posts = await getDiscussionsForEI();

    if (typeof posts === "number") {
        return (
            <div className="w-full h-96 bg-zinc-900 rounded border border-white/10 p-4">
                <p>
                    {posts === 1 && "There was an error fetching your data."}
                    {posts === 2 && "You have not saved your student data in Profile."}
                    {posts === 3 && "Error fetching posts, please try again later!"}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="center-pad mb-5">
                <h1 className="lg:text-6xl text-3xl text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="lg:w-16 lg:h-16 w-8 h-8 inline -translate-y-0.5">
                        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                    </svg>

                    <span className="lg:ml-2 ml-1">DISCUSSIONS</span>
                </h1>
                <p className="opacity-75">
                    Welcome to the Discussions page! Here, you can post questions, and answer other people's questions.
                </p>
            </div>
            <div className="center-pad">
                <div className="border border-white/20 p-4 rounded flex flex-col gap-2">
                    <CreatePostButton />
                    {posts
                        ?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((post) => (
                            <PostWrapper key={post.id} post={post} />
                        ))}
                </div>
            </div>
        </>
    );
}
