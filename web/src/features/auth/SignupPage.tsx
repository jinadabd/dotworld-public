import { useDispatch } from "react-redux";
import { useSignupMutation } from "./authApi";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { useState } from "react";
import { extractErrorMessage } from "../../utils/errors";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [signup, { isLoading, error }] = useSignupMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		const session = await signup({ name, username, email, password }).unwrap();
		dispatch(setCredentials(session));
		navigate("/");
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="name"
			/>
			<input
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="username"
			/>
			<input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="email"
			/>
			<input
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				type="password"
				placeholder="password"
			/>
			<button
				type="submit"
				disabled={isLoading}>
				Sign up
			</button>
			{error && <p>{extractErrorMessage(error)}</p>}
			<p>
				Already have an account?<Link to="/login">Login</Link>
			</p>
		</form>
	);
}
