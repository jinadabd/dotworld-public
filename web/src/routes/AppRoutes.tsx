import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { HomeRoute } from "./HomeRoute";
import SignupPage from "../features/auth/SignupPage";
import { AppLayout } from "../layout/AppLayout";
import { IslandPage } from "../features/island/IslandPage";
import { TrinketsPage } from "../features/trinkets/TrinketsPage";
import { FriendsPage } from "../features/friends/FriendsPage";
import { ChatterPage } from "../features/chatter/ChatterPage";
import { TrinketSinglePage } from "../features/trinkets/TrinketSinglePage";

export function AppRoutes() {
	return (
		<Routes>
			{/* ======== PUBLIC ========= */}
			<Route
				path="/login"
				element={<LoginPage />}
			/>
			<Route
				path="/signup"
				element={<SignupPage />}
			/>
			<Route
				path="/"
				element={<HomeRoute />}
			/>

			{/* ======== PROTECTED ========= */}
			<Route element={<ProtectedRoute />}>
				<Route element={<AppLayout />}>
					<Route
						path="/:username"
						element={<IslandPage />}
					/>
					<Route
						path="/trinkets"
						element={<TrinketsPage />}
					/>
					<Route
						path="/trinkets/:trinketId"
						element={<TrinketSinglePage />}
					/>
					<Route
						path="/friends"
						element={<FriendsPage />}
					/>
					<Route
						path="/chatter"
						element={<ChatterPage />}
					/>
				</Route>
			</Route>
		</Routes>
	);
}
