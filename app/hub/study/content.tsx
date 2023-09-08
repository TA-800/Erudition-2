"use client";

import { Database } from "@/utils/database.types";
import { useEffect, useState } from "react";
import CourseList from "./courseList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Toolbar from "./toolbar";
import NotesEditor from "./notesEditor";
import AddModuleDialog from "./addModuleDialog";
import DeleteModuleDialog from "./deleteModuleDialog";
import Assignment from "./assignment";
import AddAssignmentDialog from "./addAssignmentDialog";
import CompleteAssignmentButton, { DeleteAssignmentButton } from "./assignmentCompDel";

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type AssignmentProps = Database["public"]["Functions"]["getassignmentsforcourse"]["Returns"][0];

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
    const [loadingModules, setLoadingModules] = useState(false); // Loading state for Modules
    // Assignments
    const [assignments, setAssignments] = useState<AssignmentProps[]>([]);
    const [selectedAssignments, setSelectedAssignments] = useState<AssignmentProps[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false); // Loading state for Assignments
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
            console.log(enrollDataError ?? "enrollData was null.");
            return;
        }

        // Use enrollId to get the modules for the course
        const { data: modules, error: modulesError } = await supabase
            .from("modules")
            .select("*")
            .match({ enroll_id: enrollData.id });

        if (modulesError || modules === null) {
            alert("Error fetching modules for course." + modulesError?.message ?? "");
            return;
        }

        setModules(modules as Module[]);
        setLoadingModules(false);
    };

    // Add course to courses state
    const addCourseToState = (newCourse: Course) => {
        setCourses((prev) => [...prev, newCourse]);
    };

    // Delete course from courses state (don't need to pass in course param because selectedCourse will be the one to delete, which we already have)
    const deleteCourseFromState = async () => {
        if (!selectedCourse) return;

        const { error } = await supabase.from("enrollment").delete().match({
            course_id: selectedCourse.id,
            student_id: userId,
        });

        if (error) {
            alert("Couldn't unenroll from course. Please try again later.\n" + (error?.message ?? ""));
            return;
        }

        // Remove course from courses state
        setCourses((prev) => prev.filter((course) => course.id !== selectedCourse.id));
        // Change selectedCourse state
        setSelectedCourse(null);
    };

    // Add new module to modules list state
    const addNewModuleToState = (newModule: Module) => {
        setModules((prev) => [...prev, newModule]);
    };

    // Delete module from modules list state
    const deleteModuleFromState = (moduleToDelete: Module) => {
        // Change selectedModule state if it is the module that is being deleted
        if (selectedModule?.id === moduleToDelete.id) setSelectedModule(null);
        setModules((prev) => prev.filter((module) => module.id !== moduleToDelete.id));
    };

    // Update notes for module
    const updateNotes = async (notes: string) => {
        const { data: updatedModule, error: updatedModuleError } = await supabase
            .from("modules")
            .update({ notes })
            .match({ id: selectedModule!.id })
            .select()
            .single();

        if (!updatedModule || updatedModuleError) {
            alert("Error updating module notes." + updatedModuleError?.message ?? "");
            return;
        }

        // Update modules state
        setModules((prev) => {
            const index = prev.findIndex((module) => module.id === updatedModule.id);
            const newModules = [...prev];
            newModules[index] = updatedModule;
            return newModules;
        });

        // Update selectedModule state
        setSelectedModule(updatedModule);
    };

    // Fetch assignments for a course for a student
    const fetchAssignmentsForCourse = async (courseId: number) => {
        const { data: enrollData, error: enrollDataError } = await supabase
            .from("enrollment")
            .select("id")
            .match({
                course_id: courseId,
                student_id: userId,
            })
            .single();

        if (!enrollData || enrollDataError) {
            console.log(enrollDataError ?? "enrollData was null.");
            return;
        }

        const { data: assignments, error: assignmentsError } = await supabase.rpc("getassignmentsforcourse", {
            enroll_id_input: enrollData.id,
        });

        if (assignmentsError || assignments === null) {
            alert("Error fetching assignments for course." + assignmentsError?.message ?? "");
            return;
        }

        setAssignments(assignments as AssignmentProps[]);
    };

    // Add new assignment to assignments list state (!= selectedAssignments)
    const addNewAssignmentToState = (newAssignment: AssignmentProps) => {};

    // update selectedAssignments list state with params: assignment and "add" | "remove"
    const updateSelectedAssignments = (assignment: AssignmentProps, action: "add" | "remove") => {
        if (action === "add") setSelectedAssignments((prev) => [...prev, assignment]);
        else setSelectedAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
    };

    // Update all assignments completion status (STATE only)
    const updateAllAssignmentsStateCompletionStatus = (toMark: boolean) => {
        // In the assignments state, find the assignments that are selected and update their completion status
        setAssignments((prev) =>
            prev.map((assignment) => {
                if (selectedAssignments.find((a) => a.id === assignment.id)) {
                    return {
                        ...assignment,
                        completed: toMark,
                    };
                }
                return assignment;
            })
        );
    };

    // Remove deleted assignments from assignments state
    const removeDeletedAssignmentsFromState = () => {
        setAssignments((prev) => prev.filter((assignment) => !selectedAssignments.find((a) => a.id === assignment.id)));
    };

    useEffect(() => {
        fetchCoursesForStudent().finally(() => setLoadingCourses(false));
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        if (content === "Modules") {
            setSelectedModule(null);
            setLoadingModules(true);
            // Fetch modules for course
            fetchModulesForCourse(selectedCourse.id).then(() => setLoadingModules(false));
        } else {
            // Fetch assignments for course
            setLoadingAssignments(true);
            fetchAssignmentsForCourse(selectedCourse.id).then(() => setLoadingAssignments(false));
        }
    }, [selectedCourse, content]);

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
                deleteCourseFromState={deleteCourseFromState}
                addCourseToState={addCourseToState}
            />

            {/* Right side (content) */}
            <div className="bg-black/10 rounded border border-white/10 p-4 flex flex-col w-full gap-2">
                {/* Toolbar (top) */}
                <Toolbar states={{ search, content }} setters={{ changeSearch, changeContent }}>
                    {content === "Modules" ? (
                        <>
                            <AddModuleDialog
                                userId={userId}
                                selectedCourse={selectedCourse}
                                addNewModuleToState={addNewModuleToState}
                            />
                            <DeleteModuleDialog selectedModule={selectedModule} deleteModuleFromState={deleteModuleFromState} />
                        </>
                    ) : (
                        <>
                            <AddAssignmentDialog
                                userId={userId}
                                courses={courses}
                                addNewAssignmentToState={addNewAssignmentToState}
                            />
                            <CompleteAssignmentButton
                                selectedAssignments={selectedAssignments}
                                updateAllAssignmentCompletionStatus={updateAllAssignmentsStateCompletionStatus}
                            />
                            <DeleteAssignmentButton
                                removeDeletedAssignmentsFromState={removeDeletedAssignmentsFromState}
                                selectedAssignments={selectedAssignments}
                            />
                        </>
                    )}
                </Toolbar>
                {/* Modules + Editor wrapper */}
                {content === "Modules" && (
                    <div className="w-full grid gap-1 lg:grid-cols-3 lg:grid-rows-none">
                        {/* Modules */}
                        <div className="flex flex-col gap-4 p-2 border border-white/20 rounded w-full h-96 lg:h-full overflow-y-scroll">
                            {loadingModules && <p>Loading modules...</p>}
                            {/* If we have no modules */}
                            {!loadingModules && modules.length === 0 && <p>No modules found.</p>}
                            {/* If we have >= 1 module */}
                            {!loadingModules &&
                                modules.length > 0 &&
                                modules
                                    .sort(
                                        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() // Sort by created_at
                                    )
                                    .map((module, i) => (
                                        <div
                                            key={module.id}
                                            onClick={() => setSelectedModule(module)}
                                            className={`${
                                                selectedModule?.id === module.id ? "underline-offset-4 underline" : ""
                                            } hover:text-white cursor-pointer`}>
                                            <p>
                                                {i + 1}. {module.name}
                                            </p>
                                        </div>
                                    ))}
                        </div>
                        {/* Editor */}
                        <div className="w-full rounded lg:col-span-2">
                            {selectedModule && (
                                <NotesEditor key={selectedModule.id} selectedModule={selectedModule} updateNotes={updateNotes} />
                            )}
                        </div>
                    </div>
                )}
                {/* Assignments */}
                {content === "Assignments" && (
                    <AssignmentWrapper>
                        {assignments
                            .sort((a, b) =>
                                // Incomplete assignments first, then completed assignments
                                // Then sort by deadline
                                a.completed === b.completed
                                    ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
                                    : a.completed
                                    ? 1
                                    : -1
                            )
                            .map((assignment) => (
                                <Assignment
                                    key={assignment.id}
                                    assignment={assignment}
                                    updateSelectedAssignments={updateSelectedAssignments}
                                />
                            ))}
                    </AssignmentWrapper>
                )}
            </div>
        </div>
    );
}

export function AssignmentWrapper({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-4 gap-1 border border-white/10 rounded p-1 lg:p-4">{children}</div>;
}
