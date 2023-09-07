"use client";

import CheckIcon from "@/utils/checkIcon";
import { Database } from "@/utils/database.types";
import DeleteIcon from "@/utils/deleteIcon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AssignmentProps } from "./content";

const supabase = createClientComponentClient<Database>();

export default function CompleteAssignmentButton({
    allAssignments,
    selectedAssignments,
    updateAllAssignmentCompletionStatus,
}: {
    allAssignments: AssignmentProps[];
    updateAllAssignmentCompletionStatus: (toMark: boolean) => void;
    selectedAssignments: AssignmentProps[];
}) {
    // Get the first assignment in the array and check if it's completed. If not, all selected assignments are to be marked as complete, and vice versa.
    const toMark = selectedAssignments.length > 0 ? !selectedAssignments[0].completed : false;
    console.log(selectedAssignments.map((assignment) => ({ id: assignment.id, completed: toMark })));

    const updateCompletionStatusOfSelectedAssignments = async () => {
        // TODO: Update assignments using remote procedure call
        const { data, error } = await supabase.rpc("updateassignments", {
            toMark,
            assignments: selectedAssignments.map((assignment) => assignment.id),
        });

        if (!data || error) {
            alert("Error updating assignment(s). " + error?.message ?? "");
            return;
        }

        // Update allAssignments state
        updateAllAssignmentCompletionStatus(toMark);
    };

    return (
        <button onClick={updateCompletionStatusOfSelectedAssignments} className="btn bg-green-800 lg:px-4 px-2">
            <CheckIcon />
        </button>
    );
}

export function DeleteAssignmentButton() {
    return (
        <button className="btn bg-red-800 lg:px-4 px-2">
            <DeleteIcon />
        </button>
    );
}
