import type { PublicUser } from "@shared/types";
import { api } from "../../services/api";

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query<PublicUser, number>({
			query: (userId) => `/users/${userId}`,
			providesTags: (result, error, userId) => [{ type: "User", id: userId }],
		}),

		searchUsers: builder.query<PublicUser[], string>({
			query: (q) => `/users/search?q=${encodeURIComponent(q)}`,
		}),
	}),
});

export const { useGetUserQuery, useLazySearchUsersQuery } = userApi;
