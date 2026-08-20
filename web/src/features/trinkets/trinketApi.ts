import type {
	CreateTrinketInput,
	TrinketRow,
	TrinketItemRow,
	EditTrinketInput,
	CreateTrinketItemInput,
	PaginatedTrinkets,
} from "@shared/types";
import { api } from "../../services/api";

export const trinketApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTrinket: builder.query<
			{ trinket: TrinketRow; trinketItems: TrinketItemRow[] },
			{ trinketId: number }
		>({
			query: ({ trinketId }) => `/trinkets/${trinketId}`,
			providesTags: (result, error, { trinketId }) => [{ type: "Trinket", id: trinketId }],
		}),
		getUserTrinkets: builder.query<TrinketRow[], { username: string }>({
			query: ({ username }) => `/${username}/trinkets`,
			providesTags: (result, error, { username }) => [
				{ type: "Trinket", id: `USER_${username}` },
			],
		}),
		getCommunityTrinkets: builder.query<TrinketRow[], void>({
			query: () => `/trinkets/community`,
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({
								type: "Trinket" as const,
								id: id,
							})),
							{ type: "Trinket", id: "COMMUNITYTRINKETS" },
						]
					: [{ type: "Trinket", id: "COMMUNITYTRINKETS" }],
		}),
		getFriendsTrinkets: builder.query<PaginatedTrinkets, { page?: number; limit?: number }>({
			query: ({ page = 1, limit = 25 }) => `/trinkets/friends?page=${page}&limit=${limit}`,
			providesTags: (result) =>
				result
					? [
							...result.trinkets.map(({ id }) => ({
								type: "Trinket" as const,
								id: id,
							})),
							{ type: "Trinket", id: "FRIENDTRINKETS" },
						]
					: [{ type: "Trinket", id: "FRIENDTRINKETS" }],
		}),

		createTrinket: builder.mutation<TrinketRow, CreateTrinketInput>({
			query: (input: CreateTrinketInput) => ({
				url: "/trinkets",
				method: "POST",
				body: input,
			}),
			invalidatesTags: ["Trinket"],
		}),
		editTrinket: builder.mutation<TrinketRow, { trinketId: number; input: EditTrinketInput }>({
			query: ({ trinketId, input }) => ({
				url: `/trinkets/${trinketId}`,
				method: "PATCH",
				body: input,
			}),
			invalidatesTags: (result, error, { trinketId }) => [{ type: "Trinket", id: trinketId }],
		}),
		deleteTrinket: builder.mutation<TrinketRow, { trinketId: number }>({
			query: ({ trinketId }) => ({
				url: `/trinkets/${trinketId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, { trinketId }) => [{ type: "Trinket", id: trinketId }],
		}),

		// =============================== TRINKET ITEM ===============================

		getTrinketItem: builder.query<TrinketItemRow, { trinketId: number; trinketItemId: number }>(
			{
				query: ({ trinketId, trinketItemId }) => `/trinkets/${trinketId}/${trinketItemId}`,
				providesTags: (result, error, { trinketItemId }) => [
					{ type: "TrinketItem", id: `${trinketItemId}` },
				],
			},
		),
		createTrinketItem: builder.mutation<
			TrinketItemRow,
			{ trinketId: number; input: CreateTrinketItemInput }
		>({
			query: ({ trinketId, input }) => ({
				url: `/trinkets/${trinketId}`,
				method: "POST",
				body: input,
			}),
			invalidatesTags: (result, error, { trinketId }) => [{ type: "Trinket", id: trinketId }],
		}),
		deleteTrinketItem: builder.mutation<
			TrinketItemRow,
			{ trinketId: number; trinketItemId: number }
		>({
			query: ({ trinketId, trinketItemId }) => ({
				url: `/trinkets/${trinketId}/${trinketItemId}`,
				method: "DELETE",
			}),

			invalidatesTags: (result, error, { trinketId, trinketItemId }) => [
				{ type: "Trinket", id: trinketId },
				{ type: "TrinketItem", id: trinketItemId },
			],
		}),
	}),
});

export const {
	useGetTrinketQuery,
	useGetUserTrinketsQuery,
	useGetCommunityTrinketsQuery,
	useGetFriendsTrinketsQuery,
	useCreateTrinketMutation,
	useEditTrinketMutation,
	useDeleteTrinketMutation,

	useGetTrinketItemQuery,
	useCreateTrinketItemMutation,
	useDeleteTrinketItemMutation,
} = trinketApi;
