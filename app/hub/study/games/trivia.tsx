"use client";
import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

function htmlDecode(input: string) {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

type Question = {
    category: string;
    difficulty: string;
    question: string;
} & (
    | {
          type: "multiple";
          correct_answer: string;
          incorrect_answers: string[];
      }
    | {
          type: "boolean";
          correct_answer: "True" | "False";
          //   Array with one element that is either "True" or "False"
          incorrect_answers: ["True" | "False"];
      }
);

export default function Trivia() {
    const [sessionToken, setSessionToken] = useSessionStorage("triviaSessionToken", "");
    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchQuestions = async () => {
        fetch(`https://opentdb.com/api.php?amount=4&difficulty=easy&token=${sessionToken}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.response_code === 4) fetchSSNToken().then(() => fetchQuestions());
                else setQuestions(data.results);
            });
    };

    const fetchSSNToken = async () => {
        fetch("https://opentdb.com/api_token.php?command=request")
            .then((res) => res.json())
            .then((data) => setSessionToken(data.token));
    };

    useEffect(() => {
        // If session token is not set, get one
        if (!sessionToken) fetchSSNToken();
        if (sessionToken)
            // If session token is set, get questions
            fetchQuestions();
    }, [sessionToken]);

    return (
        <div className="flex flex-col gap-3">
            {questions.map((question) => {
                return <Question question={question} key={question.question} />;
            })}
            <p onClick={fetchQuestions} className="underline underline-offset-2 text-right cursor-pointer">
                Reset
            </p>
        </div>
    );
}

function Question({ question }: { question: Question }) {
    // State of the question
    const [answered, setAnswered] = useState(false);
    // Need state for shuffled answers because when clicked on an answer, the order of the answers should not change
    const [shuffledAnswers, _setShuffledAnswers] = useState(() =>
        [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
    );

    const AnsBtn = ({ answer }: { answer: string }) => {
        return (
            <button
                className={`ans-btn ${answered ? (answer === question.correct_answer ? "bg-green-800" : "bg-red-800") : ""}`}
                onClick={() => setAnswered(true)}
                disabled={answered}>
                {htmlDecode(answer)}
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-1 items-center" key={question.question}>
            <p>{htmlDecode(question.question)}</p>
            <div className="flex flex-row flex-wrap justify-center gap-3">
                {shuffledAnswers.map((answer) => (
                    <AnsBtn answer={answer} key={answer} />
                ))}
            </div>
        </div>
    );
}
