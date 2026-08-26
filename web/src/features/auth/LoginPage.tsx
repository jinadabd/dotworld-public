import { useState } from "react";
import { useLoginMutation } from "./authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { LoginMethod } from "@shared/types";
import { extractErrorMessage } from "../../utils/errors";

import authStyles from "./Auth.module.css";
import formStyles from "../../styles/Form.module.css";
import { TactileButton } from "../../components/buttons/TactileButton";
import { DynamicDotMatrix } from "./DynamicDotMatrix";

export default function LoginPage() {
	const [identification, setIdentification] = useState("");
	const [password, setPassword] = useState("");
	const [login, { isLoading, error }] = useLoginMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Validation checks (longer than 3 characters)
	const isIdentificationValid = identification.trim().length > 3;
	const isPasswordValid = password.length > 3;
	const isFormValid = isIdentificationValid && isPasswordValid;

	const combinedInput = `${identification}${password}`;

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!isFormValid) return;

		try {
			const session = await login({
				login_method: detectLoginMethod(identification.trim()),
				identification: identification.trim(),
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
		<div className={authStyles.authView}>
			<DynamicDotMatrix inputText={combinedInput} />
			<form onSubmit={handleSubmit}>
				<input
					className={formStyles.textInput}
					value={identification}
					onChange={(e) => setIdentification(e.target.value)}
					placeholder="Your username or email"
				/>

				<input
					className={formStyles.textInput}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>

				<div className={formStyles.submitButton}>
					<TactileButton
						type="submit"
						disabled={!isFormValid || isLoading}>
						Enter
					</TactileButton>
				</div>

				{error && <p className={formStyles.errorMessage}>{extractErrorMessage(error)}</p>}
			</form>
		</div>
	);
}
