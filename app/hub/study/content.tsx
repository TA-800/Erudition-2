"use client";

import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";
import CourseList from "./courseList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type Course = Database["public"]["Tables"]["courses"]["Row"];

export default function Content({ doesExistInStudentData, userId }: { doesExistInStudentData: boolean; userId: string }) {
    const supabase = createClientComponentClient<Database>();
    const [selected, setSelected] = useState<Course | null>(null);
    const changeSelected = (course: Course) => setSelected(course);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

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
            <div className="bg-black/10 w-full rounded border border-white/10 p-4 grid lg:grid-cols-3 lg:grid-rows-none grid-rows-3"></div>
        </div>
    );
}
