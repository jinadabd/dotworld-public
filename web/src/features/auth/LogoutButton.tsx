import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TactileButton } from "../../components/buttons/TactileButton";
import { logout } from "./authSlice";
import { api } from "../../services/api";

export function LogoutButton() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<TactileButton
			onRelease={() => {
				dispatch(logout());
				dispatch(api.util.resetApiState());
				navigate("/");
			}}>
			Log out
		</TactileButton>
	);
}
