"use client";

import { Database } from "@/utils/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewComment({ postId }: { postId: Number }) {
    const supabase = createClientComponentClient<Database>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const router = useRouter();

    const handleNewCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const comment = String(formData.get("comment"));

        const { data } = await supabase.auth.getUser();

        // Create new comment
        const { error } = await supabase.from("comments").insert({
            // don't know why ts errors if postId is not casted to Number
            post_id: Number(postId),
            comment,
            student_id: data.user!.id,
        });

        if (error) {
            alert("Error creating comment." + error?.message ?? "");
            return;
        }

        setIsSubmitting(false);
        setCommentContent("");
        router.refresh();
    };

    return (
        <form onSubmit={handleNewCommentSubmit} className="border border-white/20 rounded p-4 flex flex-col gap-1">
            <label htmlFor="comment" className="opacity-75 text-sm">
                Add your comments to this discussion
            </label>
            <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="ipt"
                name="comment"
                id="comment"
                placeholder="Type out your thoughts here!"
            />
            <button className="btn btn-primary">
                {isSubmitting && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 animate-spin opacity-50">
                        <path
                            fillRule="evenodd"
                            d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
                <span>Submit</span>
            </button>
        </form>
    );
}
