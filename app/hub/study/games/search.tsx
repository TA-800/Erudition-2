"use client";
import { generate } from "random-words";
import { useState } from "react";

export default function Search() {
    const [word, setWord] = useState(generate(1).at(0));
    const [chances, setChances] = useState(6);
    const [revealed, setRevealed] = useState<string[]>([]);
    const [lettersGuessed, setLettersGuessed] = useState<string[]>([]);
    const [gameOver, setGameOver] = useState(false);

    const reset = () => {
        setWord(generate(1).at(0));
        setChances(6);
        setRevealed([]);
        setLettersGuessed([]);
        setGameOver(false);
    };

    const handleLetterClick = (letter: string) => {
        if (word!.includes(letter)) {
            setRevealed([...revealed, letter]);
        } else {
            setChances(chances - 1);
        }

        setLettersGuessed([...lettersGuessed, letter]);

        if (chances === 1) setGameOver(true);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <span className="inline-flex gap-3">
                    {word!.split("").map((letter, index) => {
                        return (
                            <span className="text-3xl font-black" key={index}>
                                {gameOver ? letter : revealed.includes(letter) ? letter : "_"}
                            </span>
                        );
                    })}
                </span>
                <span>{6 - chances} / 6</span>
            </div>
            <div className="flex flex-wrap gap-4">
                {Array.from("abcdefghijklmnopqrstuvwxyz").map((letter) => (
                    <button
                        onClick={() => handleLetterClick(letter)}
                        className={`ltr-btn ${lettersGuessed.includes(letter) ? "ltr-btn-clicked" : ""}`}
                        key={letter}
                        disabled={lettersGuessed.includes(letter) || gameOver}>
                        {letter}
                    </button>
                ))}
            </div>
            <p onClick={reset} className="underline underline-offset-2 text-right cursor-pointer">
                Reset
            </p>
        </div>
    );
}
