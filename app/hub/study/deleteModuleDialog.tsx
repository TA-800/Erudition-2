"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/utils/database.types";
import { Module } from "./content";
import DeleteIcon from "@/utils/deleteIcon";

export default function DeleteModuleDialog({
    selectedModule,
    deleteModuleFromState,
}: {
    selectedModule: Module | null;
    deleteModuleFromState: (moduleToDelete: Module) => void;
}) {
    const supabase = createClientComponentClient<Database>();

    const deleteSelectedModule = async () => {
        if (!selectedModule) return;

        // Delete module
        const { error } = await supabase.from("modules").delete().match({ id: selectedModule.id });

        if (error) {
            alert("Error deleting module." + error?.message ?? "");
            return;
        }

        deleteModuleFromState(selectedModule);
    };

    return (
        <button className="btn bg-red-800 lg:px-4 px-3" onClick={deleteSelectedModule} disabled={selectedModule === null}>
            <DeleteIcon />
        </button>
    );
}
