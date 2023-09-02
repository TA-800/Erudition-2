"use client";

import PlusIcon from "@/utils/plusIcon";

export default function Toolbar({
    states,
    setters,
}: {
    states: {
        search: string;
        content: string;
    };
    setters: {
        changeSearch: (value: string) => void;
        changeContent: (value: "Modules" | "Assignments") => void;
    };
}) {
    // destructuring
    const { search, content } = states;
    const { changeSearch, changeContent } = setters;

    return (
        <div className="w-full h-14 flex flex-row gap-2 justify-between">
            {/* Input search bar + an add button (functionality todo later) + dropdown (modules or assignments) */}
            <input
                className="ipt"
                type="text"
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="🔍 Search"
            />
            <button className="btn ml-auto">
                <PlusIcon />
                <span>Add</span>
            </button>
            <select className="slct" value={content} onChange={(e) => changeContent(e.target.value as "Modules" | "Assignments")}>
                <option value="Modules">Modules</option>
                <option value="Assignments">Assignments</option>
            </select>
        </div>
    );
}
