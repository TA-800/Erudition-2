"use client";

import CheckIcon from "@/utils/checkIcon";
import { Database } from "@/utils/database.types";
import DeleteIcon from "@/utils/deleteIcon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AssignmentProps } from "./overview";

const supabase = createClientComponentClient<Database>();

export default function CompleteAssignmentButton({ selectedAssignments }: { selectedAssignments: AssignmentProps[] }) {
    const updateCompletionStatusOfSelectedAssignments = async () => {
        if (!selectedAssignments.length) return;

        // Get the first assignment in the array and check if it's completed. If not, all selected assignments are to be marked as complete, and vice versa.
        const toMark = !selectedAssignments[0].completed;
        const { data, error } = await supabase.rpc("updateassignmentscompletionstatus", {
            tomark: toMark,
            id_array: selectedAssignments.map((assignment) => assignment.id),
        });

        if (data !== "success" || error) {
            alert("Error updating assignments" + error?.message ?? "");
            return;
        }
    };

    return (
        <button
            disabled={selectedAssignments.length < 1}
            onClick={updateCompletionStatusOfSelectedAssignments}
            className="btn lg:px-4 px-2">
            <CheckIcon />
        </button>
    );
}

export function DeleteAssignmentButton({ selectedAssignments }: { selectedAssignments: AssignmentProps[] }) {
    const deleteSelectedAssignments = async () => {
        if (!selectedAssignments.length) return;

        const { error } = await supabase
            .from("assignments")
            .delete()
            .in(
                "id",
                selectedAssignments.map((assignment) => assignment.id)
            );

        if (error) {
            alert("Error deleting assignments" + error.message);
            return;
        }
    };
    return (
        <button
            disabled={selectedAssignments.length < 1}
            onClick={deleteSelectedAssignments}
            className="btn bg-red-800 lg:px-4 px-2">
            <DeleteIcon />
        </button>
    );
}
