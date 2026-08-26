import { useDispatch } from "react-redux";
import { useSignupMutation } from "./authApi";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { useState, useMemo } from "react";
import { extractErrorMessage } from "../../utils/errors";
import { RESERVED_USERNAMES } from "@shared/businessLogic";

import formStyles from "../../styles/Form.module.css";
import authStyles from "./Auth.module.css";
import { TactileButton } from "../../components/buttons/TactileButton";
import { DynamicDotMatrix } from "./DynamicDotMatrix";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [signup, { isLoading, error }] = useSignupMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Field-level validations
	const isUsernameReserved = useMemo(
		() => RESERVED_USERNAMES.has(username.trim().toLowerCase()),
		[username],
	);

	const isUsernameValid =
		username.trim().length >= 3 && username.trim().length <= 20 && !isUsernameReserved;

	const isPasswordValid = password.length >= 8 || true;
	const isNameValid = name.trim().length > 0;
	const isEmailValid = email.trim().length > 0 && email.includes("@");

	const isFormValid = isNameValid && isUsernameValid && isPasswordValid && isEmailValid;

	const combinedInput = `${name}${username}${email}${password}`;

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		if (!isFormValid) return;

		const session = await signup({
			name: name.trim(),
			username: username.trim(),
			email: email.trim(),
			password,
		}).unwrap();

		dispatch(setCredentials(session));
		navigate("/");
	}

	return (
		<div className={authStyles.authView}>
			<DynamicDotMatrix inputText={combinedInput} />
			<form onSubmit={handleSubmit}>
				<input
					className={formStyles.textInput}
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="What should we call you?"
				/>

				<input
					className={formStyles.textInput}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Pick a username (3-20 chars)"
				/>
				{username.length > 0 && isUsernameReserved && (
					<span className={formStyles.errorHint}>
						This username is reserved. Pick another one :D
					</span>
				)}

				<input
					className={formStyles.textInput}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Enter a valid email."
				/>

				<input
					className={formStyles.textInput}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password (min 8 chars)"
				/>

				<div className={formStyles.submitButton}>
					<TactileButton
						type="submit"
						colour="yellow"
						disabled={!isFormValid || isLoading}>
						Join
					</TactileButton>
				</div>

				{error && <p className={formStyles.errorMessage}>{extractErrorMessage(error)}</p>}
			</form>
		</div>
	);
}
