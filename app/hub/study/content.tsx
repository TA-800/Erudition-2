"use client";

import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";
import CourseList from "./courseList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export type Course = Database["public"]["Tables"]["courses"]["Row"];

export default function Content({ doesExist }: { doesExist: boolean }) {
    const supabase = createClientComponentClient<Database>();
    const [selected, setSelected] = useState<Course | null>(null);
    const changeSelected = (course: Course) => setSelected(course);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        const { data, error } = await supabase.from("courses").select("*");
        if (error) console.log(error);
        if (data) setCourses(data);
    };

    useEffect(() => {
        fetchCourses().finally(() => setLoading(false));
    }, []);

    if (!doesExist) {
        return (
            <div className="w-full h-96 bg-zinc-900 rounded border border-white/10 p-4">
                <p>You have not saved your student data in Profile.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-96 flex lg:flex-row flex-col gap-4">
            <CourseList courses={courses} selected={selected} changeSelected={changeSelected} loading={loading} />
            <div className="bg-black/10 w-full rounded border border-white/10 p-4 grid lg:grid-cols-3 lg:grid-rows-none grid-rows-3"></div>
        </div>
    );
}
