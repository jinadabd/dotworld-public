import { ChangeStatusOptions, type FriendshipRow } from "@shared/types";
import { api } from "../../services/api";

export const friendsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getFriendship: builder.query<FriendshipRow, { friendId: number }>({
			query: ({ friendId }) => `/friends/${friendId}`,
			providesTags: (result, error, { friendId }) => [{ type: "Friendship", id: "LIST" }],
		}),

		getFriends: builder.query<FriendshipRow[], void>({
			query: () => "/friends",
			providesTags: [{ type: "Friendship", id: "LIST" }],
		}),

		getPendingFriendRequests: builder.query<FriendshipRow[], void>({
			query: () => "/friends/requests",
			providesTags: [{ type: "Friendship", id: "LIST" }],
		}),

		sendFriendRequest: builder.mutation<FriendshipRow, { friendId: number }>({
			query: ({ friendId }) => ({ url: `/friends/${friendId}`, method: "POST" }),
			invalidatesTags: [{ type: "Friendship", id: "LIST" }],
		}),

		changeFriendshipStatus: builder.mutation<
			FriendshipRow,
			{ friendId: number; change: ChangeStatusOptions }
		>({
			query: ({ friendId, change }) => ({
				url: `/friends/${friendId}`,
				method: "PATCH",
				body: { change },
			}),
			invalidatesTags: [{ type: "Friendship", id: "LIST" }],
		}),

		removeFriend: builder.mutation<FriendshipRow, { friendId: number }>({
			query: ({ friendId }) => ({
				url: `/friends/${friendId}`,
				method: "DELETE",
			}),
			invalidatesTags: [{ type: "Friendship", id: "LIST" }],
		}),
	}),
});

export const {
	useGetFriendsQuery,
	useGetPendingFriendRequestsQuery,
	useGetFriendshipQuery,
	useSendFriendRequestMutation,
	useChangeFriendshipStatusMutation,
	useRemoveFriendMutation,
} = friendsApi;
