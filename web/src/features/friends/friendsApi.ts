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
			providesTags: (result) =>
				result
					? [
							...result.map(({ friend_id }) => ({
								type: "Friendship" as const,
								id: friend_id,
							})),
							{ type: "Friendship", id: "FRIENDS" },
						]
					: [{ type: "Friendship", id: "FRIENDS" }],
		}),

		getFriendRequests: builder.query<FriendshipRow[], void>({
			query: () => "/friends/requests",
			providesTags: (result) =>
				result
					? [
							...result.map(({ user_id }) => ({
								type: "Friendship" as const,
								id: user_id,
							})),
							{ type: "Friendship", id: "REQUESTS" },
						]
					: [{ type: "Friendship", id: "REQUESTS" }],
		}),

		getFriendshipPending: builder.query<FriendshipRow[], void>({
			query: () => "/friends/pending",
			providesTags: (result) =>
				result
					? [
							...result.map(({ friend_id }) => ({
								type: "Friendship" as const,
								id: friend_id,
							})),
							{ type: "Friendship", id: "PENDING" },
						]
					: [{ type: "Friendship", id: "PENDING" }],
		}),

		sendFriendRequest: builder.mutation<FriendshipRow, { friendId: number }>({
			query: ({ friendId }) => ({ url: `/friends/${friendId}`, method: "POST" }),
			invalidatesTags: (result, error, { friendId }) => [
				{ type: "Friendship", id: friendId },
				{ type: "Friendship", id: "PENDING" },
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
				{ type: "Friendship", id: "FRIENDS" },
				{ type: "Friendship", id: "REQUESTS" },
				{ type: "Friendship", id: "PENDING" },
				{ type: "Post", id: "CHATTER" },
				{ type: "Post", id: `CHATTER-${friendId}` },
				{ type: "Post", id: "USER_POSTS" },
			],
		}),

		removeFriend: builder.mutation<FriendshipRow, { friendId: number }>({
			query: ({ friendId }) => ({
				url: `/friends/${friendId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, { friendId }) => [
				{ type: "Friendship", id: friendId },
				{ type: "Friendship", id: "FRIENDS" },
				{ type: "Post", id: "CHATTER" },
				{ type: "Post", id: `CHATTER-${friendId}` },
				{ type: "Post", id: "USER_POSTS" },
			],
		}),
	}),
});

export const {
	useGetFriendsQuery,
	useGetFriendshipPendingQuery,
	useGetFriendRequestsQuery,
	useGetFriendshipQuery,
	useSendFriendRequestMutation,
	useChangeFriendshipStatusMutation,
	useRemoveFriendMutation,
} = friendsApi;
