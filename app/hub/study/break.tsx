"use client";

import { CourseListWrapper } from "./courseList";
import { SectionWrapper, ContentPanelWrapper } from "./overview";

import { useState } from "react";
import Trivia from "./trivia";

export default function Respite() {
    const [game, setGame] = useState<"trivia" | "hangman" | "wordsearch">("trivia");

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
                <button className={`btn ${game === "wordsearch" ? "btn-active" : ""}`} onClick={() => setGame("wordsearch")}>
                    WORDSEARCH
                </button>
            </CourseListWrapper>
            <ContentPanelWrapper>{game === "trivia" && <Trivia />}</ContentPanelWrapper>
        </SectionWrapper>
    );
}
