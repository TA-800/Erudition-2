"use client";

type ToolbarProps =
    | {
          type: "all";
          states: {
              search: string;
              content: string;
          };
          setters: {
              changeSearch: (value: string) => void;
              changeContent: (value: "Modules" | "Assignments") => void;
          };
          children: React.ReactNode;
      }
    | {
          type: "assignments";
          states?: never;
          setters?: never;
          children: React.ReactNode;
      };

export default function Toolbar({ type, states, setters, children }: ToolbarProps) {
    return (
        <div className="w-full flex flex-row flex-wrap lg:flex-nowrap gap-y-2 gap-x-px lg:gap-2 justify-between">
            {type === "all" && (
                <>
                    {/* Input search bar */}
                    <input
                        className="ipt"
                        type="text"
                        value={states.search}
                        onChange={(e) => setters.changeSearch(e.target.value)}
                        placeholder="🔍 Search"
                    />
                    <select
                        className="slct"
                        value={states.content}
                        onChange={(e) => setters.changeContent(e.target.value as "Modules" | "Assignments")}>
                        <option value="Modules">Modules</option>
                        <option value="Assignments">Assignments</option>
                    </select>
                </>
            )}
            {/* Add + Delete button */}
            {children}
        </div>
    );
}
