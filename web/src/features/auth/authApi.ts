import type { RootState } from "../../app/store";
import { api } from "../../services/api";
import type { LoginInput, SignupInput, PublicUser } from "@shared/types";
import { logout, setCredentials } from "./authSlice";

interface Session {
	token: string;
	user: PublicUser;
}

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<Session, LoginInput>({
			query: (body) => ({ url: "/auth/login", method: "POST", body }),
		}),
		signup: builder.mutation<Session, SignupInput>({
			query: (body) => ({ url: "/auth/signup", method: "POST", body }),
		}),
		me: builder.query<PublicUser, void>({
			query: () => "/auth/me",
			async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
				try {
					const { data: user } = await queryFulfilled;
					const token = (getState() as RootState).auth.token!;
					dispatch(setCredentials({ token, user }));
				} catch {
					dispatch(logout());
				}
			},
		}),
	}),
});

export const { useLoginMutation, useSignupMutation, useMeQuery } = authApi;
