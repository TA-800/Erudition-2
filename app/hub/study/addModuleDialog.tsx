"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";
import { Course } from "./content";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import PlusIcon from "@/utils/plusIcon";

export default function AddModuleDialog({
    userId,
    selectedCourse,
    triggerStyle,
}: {
    userId: string;
    selectedCourse: Course | null;
    triggerStyle?: string;
}) {
    const supabase = createClientComponentClient<Database>();
    const [submitting, setSubmitting] = useState(false);

    const handleNewCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger disabled={selectedCourse === null} className={`btn px-1 ${triggerStyle ?? ""}`}>
                <PlusIcon />
            </Dialog.Trigger>
            <Dialog.Portal>
                {/* z-10 to make it appear above Editor sticky toolbar */}
                <Dialog.Overlay className="fixed z-10 inset-0 bg-black/50" />
                <Dialog.Content className="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
                    <div className="flex flex-row justify-between items-center">
                        <Dialog.Title className="text-2xl font-bold text-black/100">Add Module</Dialog.Title>
                        <Dialog.Close className="opacity-30 hover:opacity-75">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="opacity-75">Create a new module for your course.</Dialog.Description>
                    <div className="mt-5">
                        <form onSubmit={handleNewCourseSubmit} className="flex flex-col gap-2">
                            {/* label + input for module name */}
                            <label htmlFor="name">Module Name</label>
                            <input required type="text" name="name" className="ipt bg-zinc-200" />
                            <button className="btn">
                                {submitting && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 animate-spin opacity-50">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                    </svg>
                                )}
                                <span>Create New</span>
                            </button>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
