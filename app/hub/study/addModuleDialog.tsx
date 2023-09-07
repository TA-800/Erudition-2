"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";
import { Course, Module } from "./content";
import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import PlusIcon from "@/utils/plusIcon";

export default function AddModuleDialog({
    userId,
    selectedCourse,
    addNewModuleToState,
}: {
    userId: string;
    selectedCourse: Course | null;
    addNewModuleToState: (newModule: Module) => void;
}) {
    const supabase = createClientComponentClient<Database>();
    const [submitting, setSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleNewModuleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const name = String(data.name);

        // Create new module
        const { data: enrollData, error: enrollDataError } = await supabase
            .from("enrollment")
            .select("id")
            .match({
                course_id: selectedCourse!.id,
                student_id: userId,
            })
            .single();

        if (!enrollData || enrollDataError) {
            console.log(enrollDataError ?? "enrollData was null.");
            return;
        }

        const { data: newModule, error: newModuleError } = await supabase
            .from("modules")
            .insert({
                name,
                enroll_id: enrollData.id,
            })
            .select()
            .single();

        if (!newModule || newModuleError) {
            console.log(newModuleError ?? "newModule was null.");
        } else {
            // Add new module to modules state
            addNewModuleToState(newModule);
        }
        // Change submit button back to normal
        setSubmitting(false);
        // Close dialog
        setDialogOpen(false);
    };

    return (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger disabled={selectedCourse === null} className="btn lg:px-4 px-3">
                <PlusIcon />
            </Dialog.Trigger>
            <Dialog.Portal>
                {/* z-50 to make it appear above sticky navbar */}
                <Dialog.Overlay className="fixed z-50 inset-0 bg-black/50" />
                <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
                    <div className="flex flex-row justify-between items-center">
                        <Dialog.Title className="text-2xl font-bold text-black/100">
                            Add Module To {selectedCourse?.code}
                        </Dialog.Title>
                        <Dialog.Close className="opacity-30 hover:opacity-75">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="opacity-75">Create new module for selected course.</Dialog.Description>
                    <div className="mt-5">
                        <form onSubmit={handleNewModuleSubmit} className="flex flex-col gap-2">
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
