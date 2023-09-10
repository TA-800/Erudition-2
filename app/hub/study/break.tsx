"use client";

import { CourseListWrapper } from "./courseList";
import { SectionWrapper, ContentPanelWrapper } from "./overview";

import { useState } from "react";
import Trivia from "@/utils/games/trivia";
import Hangman from "@/utils/games/hang";
import Search from "@/utils/games/search";

export default function Respite() {
    const [game, setGame] = useState<"trivia" | "hangman" | "search">("trivia");

    return (
        <SectionWrapper>
            <CourseListWrapper>
                <p className="text-3xl tracking-wide font-black text-center">RESPITE</p>
                <button className={`btn ${game === "trivia" ? "btn-active" : ""}`} onClick={() => setGame("trivia")}>
                    TRIVIA
                </button>
                <button className={`btn ${game === "hangman" ? "btn-active" : ""}`} onClick={() => setGame("hangman")}>
                    HANGMAN
                </button>
                <button className={`btn ${game === "search" ? "btn-active" : ""}`} onClick={() => setGame("search")}>
                    SEARCH
                </button>
            </CourseListWrapper>
            <ContentPanelWrapper>
                {game === "trivia" && <Trivia />}
                {game === "hangman" && <Hangman />}
                {game === "search" && <Search />}
            </ContentPanelWrapper>
        </SectionWrapper>
    );
}
