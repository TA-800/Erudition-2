"use client";

import { Database } from "@/utils/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Post } from "../page";
import PostWrapper from "../post";

export default function PostPage() {
    const [post, setPost] = useState<Post | null>(null);
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
    const { id } = useParams();

    const getPost = async () => {
        const { data } = await supabase
            .rpc("getpostswithcommentnumber", {
                post_id_input: Number(id),
            })
            .single();

        if (data === null) {
            alert("Error fetching post. Please try again later.");
            router.push("/hub/discussions");
        }

        setPost(data as Post);
    };

    useEffect(() => {
        getPost();
    }, []);

    if (post === null) return <div className="center-pad">Loading...</div>;

    return <div className="center-pad">{post && <PostWrapper post={post} />}</div>;
}
