import { useLocation, useNavigate } from "react-router-dom";
import pageStyles from "../../styles/MainPage.module.css";
import { LoginSignupBar } from "./LoginSignupBar";
import SignupPage from "../auth/SignupPage";
import LoginPage from "../auth/LoginPage";

type GetStartedTab = "signup" | "login";

export function GetStartedPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const activeTab: GetStartedTab = location.pathname.includes("signup") ? "signup" : "login";

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>
					{activeTab === "signup" ? "Sign Up" : "Log In"}
				</h1>
				<div className={pageStyles.viewBar}>
					<LoginSignupBar
						activeTab={activeTab}
						setActiveTab={(nextTab) => navigate(`/${nextTab}`)}
					/>
				</div>
			</div>

			<div className={pageStyles.pageMain}>
				{activeTab === "signup" ? <SignupPage /> : <LoginPage />}
			</div>
		</div>
	);
}
