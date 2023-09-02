"use client";

import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";
import CourseList from "./courseList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Toolbar from "./toolbar";

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
        <div className="w-full h-96 flex lg:flex-row flex-col gap-4">
            <CourseList courses={courses} selected={selected} changeSelected={changeSelected} loading={loading} userId={userId} />

            <div className="bg-black/10 rounded border border-white/10 p-4 flex flex-col w-full h-full gap-2">
                <Toolbar states={{ search, content }} setters={{ changeSearch, changeContent }} />
                <div className="w-full h-full grid lg:grid-cols-3 lg:grid-rows-none grid-rows-3"></div>
            </div>
        </div>
    );
}
