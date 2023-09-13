import { Database } from "@/utils/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { Post } from "../page";
import PostWrapper from "../post";
import Image from "next/image";
import Link from "next/link";
import NewComment from "./newComment";

const getPost = async (id: Number) => {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { data, error } = await supabase
        .rpc("getpostswithcommentnumber", {
            post_id_input: Number(id),
        })
        .single();

    if (data === null || error) {
        alert("Error fetching post. Please try again later." + error?.message ?? "");
        redirect("/hub/discussions");
    }

    return data as Post;
};

const getComments = async (id: Number) => {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { data, error } = await supabase.rpc("getcommentswithextrainfo", {
        post_id_input: Number(id),
    });

    if (data === null || error) {
        alert("Error fetching comments. Please try again later." + error?.message ?? "");
        redirect("/hub/discussions");
    }

    return data;
};

export default async function PostPage({ params }: { params: { id: Number } }) {
    const post = await getPost(params.id);
    const comments = await getComments(params.id);

    return (
        <div className="center-pad">
            <Link href="/hub/discussions">
                {/* Back arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline">
                    <path
                        fillRule="evenodd"
                        d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                        clipRule="evenodd"
                    />
                </svg>

                <span>Back to Discussions</span>
            </Link>
            {post && (
                <div className="my-2">
                    <PostWrapper post={post} isInPage />
                    {comments
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((comment) => (
                            <div className="border border-white/20 p-4 rounded mt-2" key={comment.id}>
                                <p className="flex flex-row gap-2">
                                    <Image
                                        src={comment.avatar_url}
                                        className="rounded border border-white/10"
                                        width={32}
                                        height={32}
                                        alt={`${comment.author} picture`}
                                    />
                                    <span className="opacity-75">{comment.author}</span>
                                </p>
                                <p>{comment.comment}</p>
                            </div>
                        ))}
                </div>
            )}
            <NewComment postId={params.id} />
        </div>
    );
}
