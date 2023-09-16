import Link from "next/link";
import Messages from "./messages";

export default function Login() {
    return (
        <form className="flex flex-col h-screen justify-center items-center gap-4" action="/auth/sign-in" method="post">
            <p className="text-zinc-300">Sign in with your Google account to access Erudition.</p>
            <button className="btn btn-primary">
                <svg viewBox="0 0 128 128" height="24" width="24">
                    <path
                        fill="white"
                        d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path>
                </svg>
                <span className="ml-1">Sign in with Google</span>
            </button>
            <Link href="/">
                {/* Back arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline">
                    <path
                        fillRule="evenodd"
                        d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>Back</span>
            </Link>
            <Messages />
        </form>
    );
}
