import { api } from "../../services/api";

export const uploadApi = api.injectEndpoints({
	endpoints: (builder) => ({
		signUpload: builder.mutation<
			{
				uploadURL: string;
				publicURL: string;
			},
			{ category: string; contentType: string; fileSizeBytes: number }
		>({
			query: (body) => ({ url: "/uploads/sign", method: "POST", body }),
		}),
	}),
});

export const { useSignUploadMutation } = uploadApi;
