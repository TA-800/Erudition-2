import { Database } from "@/utils/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
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
            <h1 className="lg:text-6xl text-3xl center-pad text-white mb-5">Discussions</h1>
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
