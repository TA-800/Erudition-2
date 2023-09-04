"use client";

import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";
import CourseList from "./courseList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Toolbar from "./toolbar";
import NotesEditor from "./notesEditor";
import AddModuleDialog from "./addModuleDialog";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];

export default function Content({ doesExistInStudentData, userId }: { doesExistInStudentData: boolean; userId: string }) {
    const supabase = createClientComponentClient<Database>();
    // Courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const changeSelected = (course: Course) => setSelectedCourse(course);
    const [loadingCourses, setLoadingCourses] = useState(true); // Loading state for CourseList
    // Modules
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const changeSelectedModule = (module: Module) => setSelectedModule(module);
    const [loadingModules, setLoadingModules] = useState(false); // Loading state for Modules
    // Filters
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

    // Fetch modules for course
    const fetchModulesForCourse = async (selectedCourseId: Number) => {
        if (!selectedCourse) return;

        // Get enroll ID for course
        const { data: enrollData, error: enrollDataError } = await supabase
            .from("enrollment")
            .select("id")
            .match({ course_id: selectedCourseId, student_id: userId })
            .single();

        if (!enrollData || enrollDataError) {
            alert("Error fetching enroll ID for course.");
            return;
        }

        // Use enrollId to get the modules for the course
        const { data: modules, error: modulesError } = await supabase
            .from("modules")
            .select("*")
            .match({ enroll_id: enrollData.id });

        if (modulesError || modules === null) {
            alert("Error fetching modules for course.");
            return;
        }

        setModules(modules as Module[]);
        setLoadingModules(false);
    };

    useEffect(() => {
        fetchCoursesForStudent().finally(() => setLoadingCourses(false));
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        setLoadingModules(true);
        // Fetch modules for course
        fetchModulesForCourse(selectedCourse.id).then(() => setLoadingModules(false));
    }, [selectedCourse]);

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
            <CourseList
                courses={courses}
                selected={selectedCourse}
                changeSelected={changeSelected}
                loading={loadingCourses}
                userId={userId}
            />

            {/* Right side (content) */}
            <div className="bg-black/10 rounded border border-white/10 p-4 flex flex-col w-full gap-2">
                {/* Toolbar (top) */}
                <Toolbar states={{ search, content }} setters={{ changeSearch, changeContent }}>
                    <AddModuleDialog userId={userId} selectedCourse={selectedCourse} />
                </Toolbar>
                {/* Modules + Editor wrapper */}
                <div className="w-full grid gap-1 lg:grid-cols-3 lg:grid-rows-none">
                    {/* Modules */}
                    <div className="flex flex-col p-2 border border-white/20 rounded w-full h-96 lg:h-full">
                        {modules.map((module) => {
                            if (loadingModules) return <p>Loading...</p>;
                            if (modules.length === 0) return <p>No modules.</p>;
                            return (
                                <div key={module.id}>
                                    <p>{module.name}</p>
                                </div>
                            );
                        })}
                    </div>
                    {/* Editor */}
                    <div className="w-full rounded lg:col-span-2">
                        <NotesEditor />
                    </div>
                </div>
            </div>
        </div>
    );
}
