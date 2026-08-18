import type {
	ComposePostInput,
	EditPostInput,
	PaginatedPosts,
	PostRow,
	PostWithAuthor,
} from "@shared/types";
import { api } from "../../services/api";

export const postApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Single post view (shareable link)
		getPost: builder.query<PostWithAuthor, { postId: number }>({
			query: ({ postId }) => `/posts/${postId}`,
			providesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
		}),

		getUserPosts: builder.query<PaginatedPosts, { username: string }>({
			query: ({ username }) => `/${username}/posts`,
			providesTags: (result, error, { username }) => [
				{ type: "Post", id: `USER_${username}` },
			],
		}),

		getChatterFeed: builder.query<PaginatedPosts, { page?: number; limit?: number }>({
			query: ({ page = 1, limit = 25 }) => `/chatter?page=${page}&limit=${limit}`,
			providesTags: (result) =>
				result
					? [
							...result.posts.map(({ id }) => ({ type: "Post" as const, id })),
							{ type: "Post", id: "FEED" },
						]
					: [{ type: "Post", id: "FEED" }],
		}),

		createPost: builder.mutation<PostRow, ComposePostInput>({
			query: (body) => ({
				url: "/posts",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Post"],
		}),

		editPost: builder.mutation<PostWithAuthor, { postId: number; body: EditPostInput }>({
			query: ({ postId, body }) => ({
				url: `/posts/${postId}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
		}),

		deletePost: builder.mutation<PostWithAuthor, { postId: number }>({
			query: ({ postId }) => ({
				url: `/posts/${postId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Post"],
		}),
	}),
});

export const {
	useGetPostQuery,
	useGetUserPostsQuery,
	useGetChatterFeedQuery,
	useCreatePostMutation,
	useEditPostMutation,
	useDeletePostMutation,
} = postApi;
