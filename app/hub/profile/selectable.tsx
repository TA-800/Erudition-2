"use client";

import { Database } from "@/utils/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ComponentProps, forwardRef, useEffect, useRef, useState } from "react";

type EIs = Database["public"]["Tables"]["educational_institutions"]["Row"];

export default forwardRef<HTMLSelectElement, ComponentProps<"select"> & { eiId: number | null }>(function SelectEI(
    { eiId, ...rest },
    ref
) {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<EIs[]>([]);
    const supabase = createClientComponentClient<Database>();

    // Get list of EIs from database
    const getEI = async () => {
        // If list is already populated, don't fetch again
        if (list.length > 0) return;

        setLoading(true);
        const { data, error } = await supabase.from("educational_institutions").select("*");
        if (error) console.log("%cError: " + error, "color: red");
        else setList(data);
        setLoading(false);
    };

    useEffect(() => {
        if (eiId) getEI();
    }, []);

    return (
        <select ref={ref} {...rest} className="slct" onFocus={getEI}>
            {loading ? (
                // If loading, show loading option
                <option>Loading...</option>
            ) : (
                // else, show list of EIs
                list.map((ei) => (
                    <option key={ei.id} selected={eiId === ei.id} value={ei.id}>
                        {ei.name}
                    </option>
                ))
            )}
        </select>
    );
});
