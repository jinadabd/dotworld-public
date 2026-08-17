import type { PublicUser } from "@shared/types";
import { api } from "../../services/api";

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query<PublicUser, number>({
			query: (userId) => `/users/${userId}`,
			providesTags: (result, error, userId) => [{ type: "User", id: userId }],
		}),
	}),
});

export const { useGetUserQuery } = userApi;
