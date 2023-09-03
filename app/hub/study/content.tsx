"use client";

import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";
import CourseList from "./courseList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Toolbar from "./toolbar";
import NotesEditor from "./notesEditor";

export type Course = Database["public"]["Tables"]["courses"]["Row"];

export default function Content({ doesExistInStudentData, userId }: { doesExistInStudentData: boolean; userId: string }) {
    const supabase = createClientComponentClient<Database>();
    const [selected, setSelected] = useState<Course | null>(null);
    const changeSelected = (course: Course) => setSelected(course);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true); // Loading state for CourseList
    const [search, setSearch] = useState("");
    const [content, setContent] = useState<"Modules" | "Assignments">("Modules");

    const changeContent = (value: "Modules" | "Assignments") => setContent(value);
    const changeSearch = (value: string) => setSearch(value);

    // Fetch courses for student
    const fetchCoursesForStudent = async () => {
        // Use userId to get the courses that the user is enrolled in
        const { data: courses, error } = await supabase.rpc("getstudentcourses", {
            student_id_input: userId,
        });
        if (error) console.log(error);
        if (courses) setCourses(courses as Course[]);
    };

    useEffect(() => {
        fetchCoursesForStudent().finally(() => setLoading(false));
    }, []);

    if (!doesExistInStudentData) {
        return (
            <div className="w-full h-96 bg-zinc-900 rounded border border-white/10 p-4">
                <p>You have not saved your student data in Profile.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-fit flex lg:flex-row flex-col gap-4">
            {/* Left side (courses) */}
            <CourseList courses={courses} selected={selected} changeSelected={changeSelected} loading={loading} userId={userId} />

            {/* Right side (content) */}
            <div className="bg-black/10 rounded border border-white/10 p-4 flex flex-col w-full gap-2">
                <Toolbar states={{ search, content }} setters={{ changeSearch, changeContent }} />
                {/* Modules + Editor wrapper */}
                <div className="w-full grid gap-1 lg:grid-cols-3 lg:grid-rows-none">
                    {/* Modules */}
                    <div className="border border-white/20 rounded w-full h-96 lg:h-full"></div>
                    {/* Editor */}
                    <div className="w-full rounded lg:col-span-2">
                        <NotesEditor />
                    </div>
                </div>
            </div>
        </div>
    );
}
