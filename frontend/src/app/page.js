import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="text-center">
        <h1>Train Seat Reservation System</h1>
        <Link href="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
        <br />
        <Link href="/signup">
          <button className="btn btn-primary">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
