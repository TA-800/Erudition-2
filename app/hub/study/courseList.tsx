"use client";

import { Course } from "./overview";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import PlusIcon from "@/utils/plusIcon";
import DeleteIcon from "@/utils/deleteIcon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";

export default function CourseList({
    courses,
    selected,
    changeSelected,
    loading,
    userId,
    deleteCourseFromState,
    addCourseToState,
}: {
    courses: Course[];
    selected: Course | null;
    changeSelected: (course: Course) => void;
    loading: boolean;
    userId: string;
    deleteCourseFromState: () => void;
    addCourseToState: (newCourse: Course) => void;
}) {
    return (
        <CourseListWrapper>
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
                        <AddCourseDialog courses={courses} userId={userId} addCourseToState={addCourseToState} />
                        <DeleteSelectedCourseDialog selected={selected} deleteCourseFromState={deleteCourseFromState} />
                    </div>
                </div>
            )}
        </CourseListWrapper>
    );
}

function DeleteSelectedCourseDialog({
    selected,
    deleteCourseFromState,
}: {
    selected: Course | null;
    deleteCourseFromState: () => void;
}) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger disabled={selected === null} className="btn bg-red-800">
                <DeleteIcon />
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed z-50 inset-0 bg-black/50" />
                <AlertDialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
                    <AlertDialog.Title className="text-2xl font-bold text-black/100">
                        Unenroll from <span>{selected?.code}</span>?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="opacity-75">
                        You will lose all your created modules and assignments.
                    </AlertDialog.Description>
                    <div className="mt-5 flex justify-end gap-6">
                        <AlertDialog.Cancel className="btn">Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action onClick={deleteCourseFromState} className="btn bg-red-800">
                            Unenroll
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}

function AddCourseDialog({
    courses,
    userId,
    addCourseToState,
}: {
    courses: Course[];
    userId: string;
    addCourseToState: (newCourse: Course) => void;
}) {
    const supabase = createClientComponentClient<Database>();
    const [list, setList] = useState<Course[]>([]);
    const [manual, setManual] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

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
                .select()
                .single();

            // If any error or no data, alert user
            if (error || !newEnrollData) alert("Couldn't enroll in course. Please try again later.\n" + (error?.message ?? ""));
            else {
                const { data: newCourseData, error } = await supabase.from("courses").select("*").eq("id", code).single();
                if (error || !newCourseData)
                    alert("Couldn't fetch new course. Please try again later.\n" + (error?.message ?? ""));
                else addCourseToState(newCourseData as Course);
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
                const { data: newCourseData, error } = await supabase.from("courses").select("*").eq("code", code).single();
                if (error || !newCourseData)
                    alert("Couldn't fetch new course. Please try again later.\n" + (error?.message ?? ""));
                else addCourseToState(newCourseData as Course);
            }
        }

        setSubmitting(false);
        setDialogOpen(false);
    };

    // Update getAllButEnrolledCoursesForStudent when courses state changes (e.g. when a course is deleted)
    useEffect(() => {
        if (courses.length === 0) return;

        getEIOfStudent().then((ei_id_response: number | null | undefined) => {
            if (!ei_id_response) {
                alert("Could not find your EI ID. Please save your student data in Profile and try again.");
                return;
            }
            getAllButEnrolledCoursesForStudent(ei_id_response);
        });
    }, [courses]);

    return (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger className="btn">
                <PlusIcon />
            </Dialog.Trigger>
            <Dialog.Portal>
                {/* z-50 to make it appear above sticky navbar */}
                <Dialog.Overlay className="fixed z-50 inset-0 bg-black/50" />
                <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-white text-black/75 lg:p-6 p-4 lg:w-1/3 w-full">
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
                                        <input required maxLength={8} type="text" name="code" className="ipt bg-zinc-200" />
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

export function CourseListWrapper({ children }: { children: React.ReactNode }) {
    return <div className="bg-black/10 border border-white/10 rounded p-4 lg:w-48 w-full flex flex-col gap-4">{children}</div>;
}
