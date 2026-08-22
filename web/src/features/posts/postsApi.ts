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

		getUserPosts: builder.query<
			PaginatedPosts,
			{ username: string; page?: number; limit?: number }
		>({
			query: ({ username, page = 1, limit = 25 }) =>
				`/${username}/posts?page=${page}&limit=${limit}`,
			providesTags: (result) => {
				const authorId = result?.posts[0]?.post.user_id;

				return result
					? [
							...result.posts.map(({ post }) => ({
								type: "Post" as const,
								id: post.id,
							})),
							{ type: "Post", id: "USER_POSTS" },
							...(authorId
								? [{ type: "Post" as const, id: `CHATTER-${authorId}` }]
								: []),
						]
					: [{ type: "Post", id: "USER_POSTS" }];
			},
		}),

		getChatter: builder.query<PaginatedPosts, { page?: number; limit?: number }>({
			query: ({ page = 1, limit = 25 }) => `/chatter?page=${page}&limit=${limit}`,
			providesTags: (result) =>
				result
					? [
							...result.posts.map(({ post }) => ({
								type: "Post" as const,
								id: post.id,
							})),
							{ type: "Post", id: "CHATTER" },
						]
					: [{ type: "Post", id: "CHATTER" }],
		}),

		createPost: builder.mutation<PostRow, ComposePostInput>({
			query: (body) => ({
				url: "/compose",
				method: "POST",
				body,
			}),
			invalidatesTags: (result) => [
				{ type: "Post", id: "CHATTER" },
				{ type: "Post", id: "USER_POSTS" },
				...(result ? [{ type: "Post" as const, id: `CHATTER-${result.user_id}` }] : []),
			],
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
			invalidatesTags: (result, error, { postId }) => [
				{ type: "Post", id: postId },
				{ type: "Post", id: "CHATTER" },
				{ type: "Post", id: "USER_POSTS" },
			],
		}),
	}),
});

export const {
	useGetPostQuery,
	useGetUserPostsQuery,
	useGetChatterQuery,
	useCreatePostMutation,
	useEditPostMutation,
	useDeletePostMutation,
} = postApi;
