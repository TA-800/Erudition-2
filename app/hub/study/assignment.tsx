import { AssignmentProps } from "./overview";

export default function Assignment({
    assignment,
    updateSelectedAssignments,
}: {
    assignment: AssignmentProps;
    updateSelectedAssignments: (assignment: AssignmentProps, action: "add" | "remove") => void;
}) {
    let deadline = new Date(assignment.deadline);
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
    });
    const relativeFormatter = new Intl.RelativeTimeFormat("en-US");
    const completedStyle = assignment.completed ? "opacity-25" : "";

    return (
        <>
            <span className={`col-span-1 lg:border-b border-white/5 inline-flex items-center ${completedStyle}`}>
                {assignment.course_code}
            </span>
            <div className={`lg:col-span-1 col-span-3 lg:border-b border-white/5 inline-flex items-center ${completedStyle}`}>
                <input
                    type="checkbox"
                    onChange={(e) => {
                        if (e.target.checked) updateSelectedAssignments(assignment, "add");
                        else updateSelectedAssignments(assignment, "remove");
                    }}
                />
                <span className="break-all pl-1">{assignment.name}</span>
            </div>
            <span
                className={`lg:col-span-1 col-span-2 border-b border-white/5 lg:text-base text-xs opacity-75 ${completedStyle}`}>
                {timeFormatter.format(deadline)}
            </span>
            <span
                className={`lg:col-span-1 col-span-2 border-b border-white/5 lg:text-base text-xs opacity-75 inline-flex items-center justify-end ${completedStyle}`}>
                {relativeFormatter.format(Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), "day")}
            </span>
        </>
    );
}
