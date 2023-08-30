"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Course } from "./content";
import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

export default function CourseList({
    courses,
    selected,
    changeSelected,
    loading,
}: {
    courses: Course[];
    selected: Course | null;
    changeSelected: (course: Course) => void;
    loading: boolean;
}) {
    return (
        <div className="bg-black/10 border border-white/10 rounded p-4 lg:w-48 w-full flex flex-col gap-4">
            {/* Skeleton loader */}
            {loading && Array.from({ length: 2 }).map((_, i) => <div key={i} className="btn animate-pulse"></div>)}
            {/* Show list of courses after loading */}
            {!loading &&
                courses.map((course) => (
                    <button
                        onClick={() => changeSelected(course)}
                        key={course.id}
                        className={`btn ${selected?.id === course.id ? "font-black text-xl border-2 border-white/20" : ""}`}>
                        <span>{course.code}</span>
                    </button>
                ))}
            {/* Show Add button after loading */}
            {!loading && <AddCourseDialog courses={courses} />}
        </div>
    );
}

function AddCourseDialog({ courses }: { courses: Course[] }) {
    const supabase = createClientComponentClient<Database>();
    const [list, setList] = useState<Course[]>([]);
    const [manual, setManual] = useState(false);

    const getCourses = async () => {
        const { data, error } = await supabase.from("courses").select("*");
        if (error) console.log(error);
        if (data) {
            const filtered = data.filter((course) => !courses.some((c) => c.id === course.id));
            setList(filtered);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <Dialog.Root>
            <Dialog.Trigger className="btn lg:mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>Add</span>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
                    <div className="flex flex-row justify-between items-center">
                        <Dialog.Title className="text-2xl font-bold text-black/100">Add Course</Dialog.Title>
                        <Dialog.Close className="opacity-30 hover:opacity-75">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="opacity-75">
                        Select pre-registered courses or add a new one if you can't find yours.
                    </Dialog.Description>
                    <button onClick={() => setManual(!manual)} className="my-5 underline">
                        {manual ? "Select" : "Manual"}
                    </button>
                    <div>
                        {manual ? (
                            <form className="flex flex-col gap-2">
                                <div>
                                    <label htmlFor="code">Course Code</label>
                                    <input type="text" name="code" className="p-2 bg-zinc-200 rounded w-full" />
                                </div>
                                <div>
                                    <label htmlFor="name">Course Name</label>
                                    <input type="text" name="name" className="p-2 bg-zinc-200 rounded w-full" />
                                </div>
                                <button className="btn">Create New</button>
                            </form>
                        ) : (
                            <select className="w-full rounded p-2 bg-zinc-200">
                                {list.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.code}: {course.name ?? "N/A"}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}