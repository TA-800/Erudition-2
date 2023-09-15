"use client";

import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

export default function Miscellaneous() {
    const [content, setContent] = useState<"joke" | "quote">("joke");
    const [dark, setDark] = useState(false);

    return (
        <>
            <div className="flex justify-around items-end">
                <div>
                    <input type="checkbox" name="dark" id="dark" className="w-3 h-3" onChange={() => setDark(!dark)} />
                    <label htmlFor="dark" className="ml-2 text-sm opacity-75">
                        Dark
                    </label>
                    <button className={`btn ${content === "joke" && "btn-active"}`} onClick={() => setContent("joke")}>
                        Joke
                    </button>
                </div>
                <button className={`btn ${content === "quote" && "btn-active"}`} onClick={() => setContent("quote")}>
                    Quote
                </button>
            </div>
            {content === "joke" ? <Joke dark={dark} /> : <Quote />}
        </>
    );
}

export function Quote() {
    const [quote, setQuote] = useSessionStorage<{
        quote: string;
        author: string;
        category: string;
    } | null>("quote", null);

    const getQuote = async () => {
        fetch("https://api.api-ninjas.com/v1/quotes?category=success", {
            headers: { "X-Api-Key": "9lgtIIQP5oPOVheLNXThVQ==lA9RjBnxgYZLOXOW" },
        })
            .then((res) => res.json())
            .then((data) => {
                setQuote(data.at(0));
            });
    };

    useEffect(() => {
        if (!quote) getQuote();
    }, []);

    return (
        <div className="h-full flex flex-col justify-between border border-white/10 lg:p-4 p-2 rounded tracking-tighter">
            <p className="text-xl">{quote?.quote}</p>
            <p className="opacity-75">~ {quote?.author}</p>
        </div>
    );
}

export function Joke({ dark }: { dark: boolean }) {
    const [joke, setJoke] = useState<any>("");

    const getJoke = async () => {
        const fetchResource = dark
            ? "https://v2.jokeapi.dev/joke/Any"
            : "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

        fetch(fetchResource)
            .then((res) => res.json())
            .then((data) => setJoke(data));
    };

    useEffect(() => {
        getJoke();
    }, []);

    return (
        <div className="h-full flex flex-col justify-between border border-white/10 lg:p-4 p-2 rounded tracking-tighter">
            {joke &&
                (joke.type === "single" ? (
                    <p className="lg:text-2xl text-xl">{joke.joke}</p>
                ) : (
                    <div>
                        <p className="lg:text-2xl text-xl">{joke.setup}</p>
                        <p className="opacity-75">{joke.delivery}</p>
                    </div>
                ))}
            <p onClick={getJoke} className="underline underline-offset-2 cursor-pointer self-end mt-auto">
                Reset
            </p>
        </div>
    );
}
