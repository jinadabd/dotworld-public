import type { IslandRow, CreateIslandInput, EditIslandInput } from "@shared/types";
import { api } from "../../services/api";

export const islandApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getIslandByUsername: builder.query<IslandRow, { username: string }>({
			query: ({ username }) => `/${username}`,
			transformResponse: (response: { island: IslandRow } | IslandRow) =>
				"island" in response ? response.island : response,
			providesTags: (result, error, { username }) => [{ type: "Island", id: username }],
		}),

		// getIslandbyUserId: builder.query<IslandRow, { userId: number }>({
		// 	query: ({ userId }) => `/${userId}`,
		// 	providesTags: (result, error, { userId }) => [{ type: "Island", id: userId }],
		// }),

		createIsland: builder.mutation<IslandRow, { username: string; input: CreateIslandInput }>({
			query: ({ username, input }) => ({
				url: `/${username}`,
				method: "POST",
				body: input,
			}),
			invalidatesTags: (result, error, { username }) => [{ type: "Island", id: username }],
		}),
		editIsland: builder.mutation<IslandRow, { username: string; input: EditIslandInput }>({
			query: ({ username, input }) => ({
				url: `/${username}`,
				method: "PATCH",
				body: input,
			}),
			invalidatesTags: (result, error, { username }) => [{ type: "Island", id: username }],
		}),
		deleteIsland: builder.mutation<IslandRow, { username: string }>({
			query: ({ username }) => ({
				url: `/${username}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, { username }) => [{ type: "Island", id: username }],
		}),
	}),
});

export const {
	useGetIslandByUsernameQuery,
	useCreateIslandMutation,
	useEditIslandMutation,
	useDeleteIslandMutation,
} = islandApi;
