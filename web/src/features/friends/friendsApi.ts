import { ChangeStatusOptions, type FriendshipRow } from "@shared/types";
import { api } from "../../services/api";

export const friendsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getFriendship: builder.query<FriendshipRow | null, { friendId: number }>({
			query: ({ friendId }) => `/friends/${friendId}`,
			providesTags: (result, error, { friendId }) => [{ type: "Friendship", id: friendId }],
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
			invalidatesTags: (result, error, { friendId }) => [
				{ type: "Friendship", id: friendId },
			],
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
			invalidatesTags: (result, error, { friendId }) => [
				{ type: "Friendship", id: friendId },
			],
		}),

		removeFriend: builder.mutation<FriendshipRow, { friendId: number }>({
			query: ({ friendId }) => ({
				url: `/friends/${friendId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, { friendId }) => [
				{ type: "Friendship", id: friendId },
			],
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
