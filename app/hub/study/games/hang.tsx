"use client";
import { generate } from "random-words";
import { useState } from "react";

export default function Hangman() {
    const [word, setWord] = useState(generate(1).at(0));
    const [chances, setChances] = useState(6);
    const [lettersGuessed, setLettersGuessed] = useState<string[]>(
        // choose one random letter from the word to start with
        [word!.at(Math.floor(Math.random() * word!.length))!]
    );
    const [gameOver, setGameOver] = useState(false);

    const reset = () => {
        const newWord = generate(1).at(0);
        const hint = newWord!.at(Math.floor(Math.random() * newWord!.length));
        setWord(newWord);
        setChances(6);
        setLettersGuessed([hint!]);
        setGameOver(false);
    };

    const handleLetterClick = (letter: string) => {
        let newLettersGuessed = [...lettersGuessed, letter];

        setLettersGuessed(newLettersGuessed);

        // If the letter guessed was wrong
        if (!word!.includes(letter)) {
            let newChances = chances - 1;
            setChances(newChances);
            if (newChances === 0) setGameOver(true);
        }

        // If the letter guessed was right and the word is complete
        if (word!.split("").every((ltr) => newLettersGuessed.includes(ltr))) setGameOver(true);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <span className="inline-flex gap-3">
                    {word!.split("").map((letter, index) => {
                        return (
                            <span className="text-3xl font-black" key={index}>
                                {gameOver ? letter : lettersGuessed.includes(letter) ? letter : "_"}
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
