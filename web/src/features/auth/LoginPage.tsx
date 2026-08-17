import { useState } from "react";
import { useLoginMutation } from "./authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { LoginMethod } from "@shared/types";
import { extractErrorMessage } from "../../utils/errors";

export default function LoginPage() {
	const [identification, setIdentification] = useState("");
	const [password, setPassword] = useState("");
	const [login, { isLoading, error }] = useLoginMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const session = await login({
				login_method: detectLoginMethod(identification),
				identification,
				password,
			}).unwrap();
			dispatch(setCredentials(session));
			navigate("/");
		} catch {}
	}

	function detectLoginMethod(value: string): LoginMethod {
		return value.includes("@") ? LoginMethod.email : LoginMethod.username;
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				value={identification}
				onChange={(e) => setIdentification(e.target.value)}
				placeholder="username or email"
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
				Log in
			</button>
			{error && <p>{extractErrorMessage(error)}</p>}
		</form>
	);
}
