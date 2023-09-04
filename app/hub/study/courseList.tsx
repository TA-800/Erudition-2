"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";
import { Course } from "./content";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import PlusIcon from "@/utils/plusIcon";

export default function CourseList({
    courses,
    selected,
    changeSelected,
    loading,
    userId,
}: {
    courses: Course[];
    selected: Course | null;
    changeSelected: (course: Course) => void;
    loading: boolean;
    userId: string;
}) {
    return (
        <div className="bg-black/10 border border-white/10 rounded p-4 lg:w-48 w-full flex flex-col gap-4">
            <p className="text-3xl tracking-wide font-black text-center">COURSES</p>
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
            {!loading && (
                <div className="lg:mt-auto">
                    <div className="flex flex-row justify-between">
                        <AddCourseDialog courses={courses} userId={userId} />
                        <DeleteSelectedCourseDialog
                            selected={selected}
                            changeToRandomAfterDel={() => changeSelected(courses.at(0)!)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function DeleteSelectedCourseDialog({
    selected,
    changeToRandomAfterDel,
}: {
    selected: Course | null;
    changeToRandomAfterDel: () => void;
}) {
    const supabase = createClientComponentClient<Database>();

    const unenrollFromSelectedCourse = async () => {
        if (!selected) return;
    };

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger disabled={selected === null} className="btn bg-red-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                </svg>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed z-10 inset-0 bg-black/50" />
                <AlertDialog.Content className="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
                    <AlertDialog.Title className="text-2xl font-bold text-black/100">
                        Unenroll from <span>{selected?.code}</span>?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="opacity-75">
                        You will lose all your created modules and assignments.
                    </AlertDialog.Description>
                    <div className="mt-5 flex justify-end gap-6">
                        <AlertDialog.Cancel className="btn">Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action onClick={unenrollFromSelectedCourse} className="btn bg-red-800">
                            Unenroll
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}

function AddCourseDialog({ courses, userId }: { courses: Course[]; userId: string }) {
    const supabase = createClientComponentClient<Database>();
    const [list, setList] = useState<Course[]>([]);
    const [manual, setManual] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const getEIOfStudent = async () => {
        const { data: students, error } = await supabase.from("students").select("*").eq("id", userId);
        if (error) console.log(error);
        if (students?.length) return students.at(0)?.ei_id;
        return null;
    };

    const getAllButEnrolledCoursesForStudent = async (ei_id: number) => {
        const enrolledArray = `(${courses.map((course) => course.id).join(",")})`;
        const { data: fetchedCourses, error } = await supabase
            .from("courses")
            .select("*")
            .not("id", "in", enrolledArray)
            .eq("ei_id", ei_id);

        if (error || !fetchedCourses.length) {
            console.log(error ?? "Error fetching courses");
            return;
        }
        setList(fetchedCourses as Course[]);
    };

    const handleNewCourseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        // Get form data
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.select) {
            const code = Number(data.select);

            const { data: newEnrollData, error } = await supabase
                .from("enrollment")
                .insert({
                    course_id: code,
                    student_id: userId,
                })
                .select();

            // If any error or no data, alert user
            if (error || !newEnrollData.length)
                alert("Couldn't enroll in course. Please try again later.\n" + (error ? error.message : ""));
            else {
                setSubmitting(false);
                window.location.reload();
            }
        } else {
            const code = String(data.code).toUpperCase();
            const name = String(data.name);

            // Reject if code or name is empty
            if (!code || !name) {
                alert("Please fill in all fields.");
                setSubmitting(false);
                return;
            }

            const { data: newCourseAndEnrollData, error } = await supabase.rpc("createnewcourseandenroll", {
                student_id_input: userId,
                code_input: code,
                name_input: name,
            });

            // If any error or no data, alert user
            if (error || !newCourseAndEnrollData.length)
                alert("Couldn't create new course. Please try again later.\n" + (error ? error.message : ""));
            else {
                setSubmitting(false);
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        getEIOfStudent().then((ei_id_response: number | null | undefined) => {
            if (!ei_id_response) {
                alert("Could not find your EI ID. Please save your student data in Profile and try again.");
                return;
            }
            getAllButEnrolledCoursesForStudent(ei_id_response);
        });
    }, []);

    return (
        <Dialog.Root>
            <Dialog.Trigger className="btn">
                <PlusIcon />
            </Dialog.Trigger>
            <Dialog.Portal>
                {/* z-10 to make it appear above Editor sticky toolbar */}
                <Dialog.Overlay className="fixed z-10 inset-0 bg-black/50" />
                <Dialog.Content className="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
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
                        <form onSubmit={handleNewCourseSubmit}>
                            {manual ? (
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <label htmlFor="code">Course Code</label>
                                        <input required type="text" name="code" className="ipt bg-zinc-200" />
                                    </div>
                                    <div>
                                        <label htmlFor="name">Course Name</label>
                                        <input required type="text" name="name" className="ipt bg-zinc-200" />
                                    </div>
                                </div>
                            ) : (
                                <select required name="select" className="w-full rounded p-2 bg-zinc-200">
                                    {list.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.code}: {course.name ?? "N/A"}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button className="btn mt-2 w-full">
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
