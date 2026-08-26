import { Navigate, Route, Routes } from "react-router-dom";
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
import { GetStartedPage } from "../features/guest/GetStartedPage";
import GuestPage from "../features/guest/GuestPage";

export function AppRoutes() {
	return (
		<Routes>
			{/* ======== PUBLIC ========= */}
			<Route
				path="/"
				element={<HomeRoute />}>
				<Route
					index
					element={<GuestPage />}
				/>
				<Route
					path="login"
					element={<GetStartedPage />}
				/>
				<Route
					path="signup"
					element={<GetStartedPage />}
				/>
			</Route>

			{/* ======== PROTECTED ========= */}
			<Route element={<ProtectedRoute />}>
				<Route element={<AppLayout />}>
					<Route
						path="/:username"
						element={<IslandPage />}>
						<Route
							path="chatter"
							element={<IslandPage />}
						/>
						<Route
							path="trinkets"
							element={<IslandPage />}
						/>
					</Route>

					<Route path="/trinkets">
						<Route
							index
							element={
								<Navigate
									to="self"
									replace
								/>
							}
						/>
						<Route
							path="self"
							element={<TrinketsPage />}
						/>
						<Route
							path="friends"
							element={<TrinketsPage />}
						/>
						<Route
							path="community"
							element={<TrinketsPage />}
						/>
						<Route
							path=":trinketId"
							element={<TrinketSinglePage />}
						/>
					</Route>

					<Route path="/friends">
						<Route
							index
							element={<FriendsPage />}
						/>
						<Route
							path="requests"
							element={<FriendsPage />}
						/>
						<Route
							path="pending"
							element={<FriendsPage />}
						/>
					</Route>

					<Route path="/chatter">
						<Route
							index
							element={
								<Navigate
									to="unread"
									replace
								/>
							}
						/>
						<Route
							path="unread"
							element={<ChatterPage />}
						/>
						<Route
							path="read"
							element={<ChatterPage />}
						/>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}
