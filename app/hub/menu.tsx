"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function HamburgerMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const menuButtonRef = useRef(null);

    const closeMenuOnEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            if (open) setOpen(false);
        }
    };

    // Read hooks docs, handler is passed an event parameter
    const handleClickOutside = (event: MouseEvent) => {
        console.log(event.target !== menuButtonRef.current);
        if (open && event.target !== menuButtonRef.current) setOpen(false);
    };

    // If is open and escape is pressed, close the menu
    useEffect(() => {
        document.addEventListener("keydown", closeMenuOnEscape);
        return () => document.removeEventListener("keydown", closeMenuOnEscape);
    }, [open]);

    // https://usehooks-ts.com/react-hook/use-on-click-outside
    useOnClickOutside(ref, handleClickOutside, "mouseup");

    return (
        <>
            <button ref={menuButtonRef} onClick={() => setOpen(!open)} className="btn bg-zinc-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    // Give pointer-events-none so that the "insides" of the button are unclickable
                    className="w-6 h-6 pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            {open && (
                <div
                    ref={ref}
                    className="absolute top-24 right-0 bg-zinc-900 border-l border-white/20 w-48 h-[calc(100vh-96px)] flex flex-col justify-center items-center">
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
    const pathname = usePathname();
    let isActive = pathname === href;

    return (
        <button
            onClick={() => router.push(href)}
            className={`btn ${isActive ? "bg-zinc-700 font-bold" : "bg-zinc-800"} text-xl ${className ?? ""}`}>
            {children}
        </button>
    );
}
