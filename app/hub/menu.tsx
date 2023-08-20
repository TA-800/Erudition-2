"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function HamburgerMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const closeMenuOnEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            if (open) setOpen(false);
        }
    };

    // If is open and escape is pressed, close the menu
    useEffect(() => {
        document.addEventListener("keydown", closeMenuOnEscape);
        return () => document.removeEventListener("keydown", closeMenuOnEscape);
    }, [open]);

    return (
        <>
            <button onClick={() => setOpen(!open)} className="btn bg-zinc-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            {open && (
                <div
                    ref={ref}
                    className="absolute top-20 right-0 bg-zinc-900 border-l border-white/20 w-48 h-[calc(100vh-80px)] flex flex-col justify-center items-center">
                    <div className="flex flex-col gap-4">
                        <CustomLink href="/hub/study">Study</CustomLink>
                        <CustomLink href="/hub/discussions">Discussions</CustomLink>
                        <CustomLink href="/hub/profile">Profile</CustomLink>
                    </div>
                </div>
            )}
        </>
    );
}

export function CustomLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
    const router = useRouter();

    return (
        <button onClick={() => router.push(href)} className={`btn bg-zinc-800 text-xl ${className ?? ""}`}>
            {children}
        </button>
    );
}
