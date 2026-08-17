import { Link } from "react-router-dom";

export default function GuestPage() {
	return (
		<div>
			<h1>Welcome to dotworld</h1>
			<p>
				Create your own digital space, post your thoughts, interact with friends, or build
				your own trinkets to share your interests.
			</p>
			<Link to="/login">Login</Link>
			<Link to="/signup">Signup</Link>
		</div>
	);
}
