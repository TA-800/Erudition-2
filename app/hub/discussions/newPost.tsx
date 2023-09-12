"use client";

import { Database } from "@/utils/database.types";
import PlusIcon from "@/utils/plusIcon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function CreatePostButton() {
    const supabase = createClientComponentClient<Database>();
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNewPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Get form data
        const formData = new FormData(e.currentTarget);
        const title = String(formData.get("title"));
        const description = String(formData.get("description"));

        // Create new post
        const { data } = await supabase.auth.getUser();
        const { data: student, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("id", data.user!.id)
            .single();

        // Id(s) has(/have) been checked to death, has to exist
        const { data: insertData, error: insertError } = await supabase
            .from("posts")
            .insert({
                title,
                description,
                author: student!.id,
                ei_id: student!.ei_id!,
            })
            .select();

        if (insertError || insertData === null) {
            alert("There was an error creating your post. Please try again later.");
            return;
        }

        setIsCreating(false);
    };

    return (
        <>
            <button className="btn" onClick={() => setIsCreating(!isCreating)}>
                {isCreating ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Cancel New</span>
                    </>
                ) : (
                    <>
                        <PlusIcon />
                        <span>Create New</span>
                    </>
                )}
            </button>

            {isCreating && (
                <form onSubmit={handleNewPostSubmit} className="border border-white/10 rounded p-2 lg:p-4 flex flex-col gap-1">
                    <input name="title" className="ipt" type="text" placeholder="Title" />
                    <textarea name="description" className="ipt" placeholder="Description" />
                    <button className="btn">Create</button>
                </form>
            )}
        </>
    );
}
