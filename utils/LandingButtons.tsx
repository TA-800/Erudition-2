import Link from "next/link";

export default function LogoutButton() {
    return (
        <form action="/auth/sign-out" method="post">
            <button className="btn">Logout</button>
        </form>
    );
}

export function GoToHubButton() {
    return (
        <Link href="/hub/study" className="btn btn-primary">
            Go to hub
        </Link>
    );
}

export function LoginButton() {
    return (
        <Link href="/login" className="btn btn-primary">
            Login
        </Link>
    );
}
