import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthBootstrap } from "./features/auth/AuthBootstrap";

export default function App() {
	return (
		<BrowserRouter>
			<AuthBootstrap>
				<AppRoutes />
			</AuthBootstrap>
		</BrowserRouter>
	);
}
