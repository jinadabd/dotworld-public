import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type PublicUser } from "@shared/types";

interface AuthState {
	token: string | null;
	user: PublicUser | null;
}

const initialState: AuthState = {
	token: localStorage.getItem("token"),
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<{ token: string; user: PublicUser }>) => {
			state.token = action.payload.token;
			state.user = action.payload.user;
			localStorage.setItem("token", action.payload.token);
		},

		logout: (state) => {
			state.token = null;
			state.user = null;
			localStorage.removeItem("token");
		},
	},
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
