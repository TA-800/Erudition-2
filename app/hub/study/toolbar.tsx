"use client";

export default function Toolbar({
    states,
    setters,
    children,
}: {
    states: {
        search: string;
        content: string;
    };
    setters: {
        changeSearch: (value: string) => void;
        changeContent: (value: "Modules" | "Assignments") => void;
    };
    children?: React.ReactNode;
}) {
    // destructuring
    const { search, content } = states;
    const { changeSearch, changeContent } = setters;

    return (
        <div className="w-full flex flex-row flex-wrap lg:flex-nowrap gap-2 justify-between">
            {/* Input search bar */}
            <input
                className="ipt"
                type="text"
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="🔍 Search"
            />
            <select className="slct" value={content} onChange={(e) => changeContent(e.target.value as "Modules" | "Assignments")}>
                <option value="Modules">Modules</option>
                <option value="Assignments">Assignments</option>
            </select>
            {/* Add + Delete button */}
            {children}
        </div>
    );
}
