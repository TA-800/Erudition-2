"use client";

import { CourseListWrapper } from "./courseList";
import { SectionWrapper, ContentPanelWrapper } from "./overview";

import { useState } from "react";
import Trivia from "./games/trivia";
import Misc from "./games/misc";
import Hangman from "./games/hang";

export default function Respite() {
    const [game, setGame] = useState<"trivia" | "hangman" | "misc">("hangman");

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
                <button className={`btn ${game === "misc" ? "btn-active" : ""}`} onClick={() => setGame("misc")}>
                    MISC
                </button>
            </CourseListWrapper>
            <ContentPanelWrapper className={`${game === "misc" && "pt-0.5"}`}>
                {game === "trivia" && <Trivia />}
                {game === "hangman" && <Hangman />}
                {game === "misc" && <Misc />}
            </ContentPanelWrapper>
        </SectionWrapper>
    );
}
