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
    // const [week, setWeek] = useState<"this" | "next" | "choose">("this");
    // const [date, setDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    // const dateSetter = (date: Date) => {
    //     setDate(startOfWeek(date, { weekStartsOn: 1 }));
    // };

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

    // Add new assignment to assignments list state (!= selectedAssignments)
    const addNewAssignmentToState = (newAssignment: AssignmentProps[]) => {
        setAssignments((prev) => [...prev, ...newAssignment]);
    };

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
        setLoadingAssignments(true);
        fetchCoursesForStudent()
            .then(() => fetchAllAssignmentsForStudent())
            .then(() => setLoadingAssignments(false));
    }, []);

    return (
        <SectionWrapper>
            {/* Same wrapper for wrapping the left panel */}
            <CourseListWrapper>
                <p className="text-3xl tracking-wide font-black text-center">BY WEEK</p>
                {/* Three options: This week, next week, choose week */}
                <button className="btn">Present</button>
                <button className="btn">Next</button>
                <button className="btn">Choose</button>
            </CourseListWrapper>
            <ContentPanelWrapper>
                <Toolbar type="assignments">
                    <AddAssignmentDialog userId={userId} courses={courses} addNewAssignmentToState={addNewAssignmentToState} />
                    <CompleteAssignmentButton
                        selectedAssignments={selectedAssignments}
                        updateAllAssignmentCompletionStatus={updateAllAssignmentsStateCompletionStatus}
                    />
                    <DeleteAssignmentButton
                        removeDeletedAssignmentsFromState={removeDeletedAssignmentsFromState}
                        selectedAssignments={selectedAssignments}
                    />
                </Toolbar>
                <AssignmentWrapper>
                    {loadingAssignments && <p className="col-span-4">Loading assignments...</p>}
                    {/* If we have no assignments */}
                    {!loadingAssignments && assignments.length === 0 && <p className="col-span-4">No assignments.</p>}
                    {/* If we have assignments */}
                    {!loadingAssignments &&
                        assignments
                            // .filter(
                            //     // Only those assignments whose deadline is in or after date state
                            //     (assignment) => new Date(assignment.deadline).getTime() >= date.getTime()
                            // )
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
