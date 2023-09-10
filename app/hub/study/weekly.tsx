"use client";

import { startOfWeek } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";
import { AssignmentProps, AssignmentWrapper, ContentPanelWrapper, Course, SectionWrapper } from "./overview";
import { CourseListWrapper } from "./courseList";
import Toolbar from "./toolbar";
import CompleteAssignmentButton, { DeleteAssignmentButton } from "./assignmentCompDel";

import { useEffect, useState } from "react";
import AddAssignmentDialog from "./addAssignmentDialog";
import Assignment from "./assignment";

export default function WeeklyContent({ userId }: { userId: string }) {
    const supabase = createClientComponentClient<Database>();
    // Courses
    const [courses, setCourses] = useState<Course[]>([]);
    // Assignments
    const [assignments, setAssignments] = useState<AssignmentProps[]>([]);
    const [selectedAssignments, setSelectedAssignments] = useState<AssignmentProps[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false); // Loading state for Assignments
    // Filters
    const [week, setWeek] = useState<"this" | "next" | "custom">("this");
    const [date, setDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const dateSetter = (weekToSet: "this" | "next") => {
        switch (weekToSet) {
            case "this":
                setWeek("this");
                setDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
                break;
            case "next":
                // Next week
                let nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setWeek("next");
                setDate(startOfWeek(nextWeek, { weekStartsOn: 1 }));
                break;
            // case "custom": handled by input
        }
    };

    // Fetch courses for student
    const fetchCoursesForStudent = async () => {
        // Use userId to get the courses that the user is enrolled in
        const { data: courses, error } = await supabase.rpc("getstudentcourses", {
            student_id_input: userId,
        });
        if (error) console.log(error);
        if (courses) setCourses(courses as Course[]);
    };

    // Fetch assignments for a course for a student
    const fetchAllAssignmentsForStudent = async () => {
        const { data: assignments, error: assignmentsError } = await supabase.rpc("getallassignmentsforstudent", {
            student_id_input: userId,
        });

        if (assignmentsError || assignments === null) {
            alert("Error fetching assignments for course." + assignmentsError?.message ?? "");
            return;
        }

        setAssignments(assignments as AssignmentProps[]);
    };

    // update selectedAssignments list state with params: assignment and "add" | "remove"
    const updateSelectedAssignments = (assignment: AssignmentProps, action: "add" | "remove") => {
        if (action === "add") setSelectedAssignments((prev) => [...prev, assignment]);
        else setSelectedAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
    };

    useEffect(() => {
        setLoadingAssignments(true);
        fetchCoursesForStudent()
            .then(() => fetchAllAssignmentsForStudent())
            .then(() => setLoadingAssignments(false));

        // Set up listener for new assignments
        const assigmentsTableListener = supabase
            .channel("assignments_table_changes_weekly")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "assignments",
                },
                (payload) => {
                    // reset some states
                    setSelectedAssignments([]);
                    setLoadingAssignments(true);
                    fetchAllAssignmentsForStudent().then(() => setLoadingAssignments(false));
                }
            )
            .subscribe();

        return () => {
            assigmentsTableListener.unsubscribe();
        };
    }, []);

    return (
        <SectionWrapper>
            {/* Same wrapper for wrapping the left panel */}
            <CourseListWrapper>
                <p className="text-3xl tracking-wide font-black text-center">BY WEEK</p>
                {/* Three options: This week, next week, choose week */}
                <button className={`btn ${week === "this" ? "btn-active" : ""}`} onClick={() => dateSetter("this")}>
                    This Week
                </button>
                <button className={`btn ${week === "next" ? "btn-active" : ""}`} onClick={() => dateSetter("next")}>
                    Next Week
                </button>
                <div>
                    <input
                        type="date"
                        onClick={() => setWeek("custom")}
                        className={`btn ${week === "custom" ? "btn-active" : ""} w-full lg:w-32`}
                        onChange={(e) => setDate(new Date(e.target.value))}
                    />
                    <p className="text-sm opacity-75 lg:text-center text-right">Choose custom week</p>
                </div>
            </CourseListWrapper>
            <ContentPanelWrapper>
                <Toolbar type="assignments">
                    <AddAssignmentDialog userId={userId} courses={courses} />
                    <CompleteAssignmentButton selectedAssignments={selectedAssignments} />
                    <DeleteAssignmentButton selectedAssignments={selectedAssignments} />
                </Toolbar>
                <AssignmentWrapper>
                    {loadingAssignments && <p className="col-span-4">Loading assignments...</p>}
                    {/* If we have no assignments */}
                    {!loadingAssignments && assignments.length === 0 && <p className="col-span-4">No assignments.</p>}
                    {/* If we have assignments */}
                    {!loadingAssignments &&
                        assignments
                            .filter(
                                // Only those assignments after selected date and before end of week
                                (assignment) => {
                                    let assignmentDate = new Date(assignment.deadline);
                                    let startDate = new Date(date);
                                    let endDate = new Date(startDate);
                                    endDate.setDate(endDate.getDate() + 7);

                                    return assignmentDate >= startDate && assignmentDate < endDate;
                                }
                            )
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
            </ContentPanelWrapper>
        </SectionWrapper>
    );
}
