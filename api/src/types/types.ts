const PostType = {
	text: "text",
	image: "image",
	video: "video",
	audio: "audio",
} as const;

export type PostType = (typeof PostType)[keyof typeof PostType];

const TrinketType = {
	playlist: "playlist",
	gallery: "gallery",
	collection: "collection",
} as const;

export type TrinketType = (typeof TrinketType)[keyof typeof TrinketType];

export const FriendshipStatus = {
	pending: "pending",
	friends: "friends",
} as const;

export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus];

const BubbleMemberStatus = {
	pending: "pending",
	member: "member",
} as const;

export type BubbleMemberStatus = (typeof BubbleMemberStatus)[keyof typeof BubbleMemberStatus];

const IslandVisibility = {
	world: "world",
	friends: "friends",
} as const;

export type IslandVisibility = (typeof IslandVisibility)[keyof typeof IslandVisibility];

const PostVisibility = {
	friends: "friends",
	bubble: "bubble",
	self: "self",
} as const;

export type PostVisibility = (typeof PostVisibility)[keyof typeof PostVisibility];

const TrinketVisibility = {
	world: "world",
	friends: "friends",
	// bubble: "bubble",
	self: "self",
} as const;

export type TrinketVisibility = (typeof TrinketVisibility)[keyof typeof TrinketVisibility];

export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONValue[]
	| { [key: string]: JSONValue };

// ==================== User ====================

export interface UserRow {
	id: number;
	name: string;
	username: string;
	email: string;
	password_hash: string;
	photograph_url?: string;
	seal_url?: string;
	storage_used_bytes: number;
	created_at: Date;
}

export type PublicUser = Omit<UserRow, "password_hash">;

export interface SignupInput {
	name: string;
	username: string;
	email: string;
	password: string;
}

export const LoginMethod = {
	email: "email",
	username: "username",
} as const;

export type LoginMethod = (typeof LoginMethod)[keyof typeof LoginMethod];

export interface LoginInput {
	login_method: LoginMethod;
	identification: string;
	password: string;
}

export interface MediaInput {
	media_url: string;
	media_size_bytes: number;
}

// ==================== Island ====================

export interface IslandRow {
	id: number;
	user_id: number;
	island_visibility: IslandVisibility;
	name?: string;
	description?: string;
	cover_url?: string;
	metadata?: JSONValue;
	created_at: Date;
}

export interface IslandWithContent {
	island: IslandRow;
	user: PublicUser;
	featured_trinkets: TrinketRow[];
	locked: false;
	// featured_posts: PostWithAuthor[];
}

export interface IslandPreview {
	island: Omit<IslandRow, "name" | "description" | "cover_url" | "metadata">;
	user: PublicUser;
	friendship_status: FriendshipStatus | null;
	locked: true;
}

export interface IslandNotCreated {
	island: null;
	user: PublicUser;
	friendship_status: FriendshipStatus | null;
	locked: true;
}

export interface CreateIslandInput {
	island_visibility: IslandVisibility;
	name?: string;
	description?: string;
	cover_url?: string;
	metadata?: JSONValue;
}

export interface EditIslandInput {
	island_id: number;
	options: EditIslandOptions[];
	island_visibility?: IslandVisibility;
	name?: string;
	description?: string;
	cover_url?: string;
	metadata?: JSONValue;
}

export const EditIslandOptions = {
	change_island_visibility: "change_island_visibility",
	edit_name: "edit_name",
	delete_name: "delete_name",
	edit_description: "edit_description",
	delete_description: "delete_description",
	edit_cover_url: "edit_cover_url",
	delete_cover_url: "delete_cover_url",
	edit_metadata: "edit_metadata",
	delete_metadata: "delete_metadata",
} as const;

export type EditIslandOptions = (typeof EditIslandOptions)[keyof typeof EditIslandOptions];

// ==================== Post ====================

export interface PostRow {
	id: number;
	user_id: number;
	post_visibility: PostVisibility;
	post_type: PostType;
	featured: boolean;
	body_text?: string;
	edited: boolean;
	media_url?: string;
	file_size_bytes: number;
	created_at: Date;
}

export interface PostWithAuthor {
	post: PostRow;
	author: PublicUser;
}

export interface PaginatedPosts {
	posts: PostWithAuthor[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalPosts: number;
		hasMore: boolean;
	};
}

export interface ComposePostInput {
	post_visibility: PostVisibility;
	post_type: PostType;
	body_text?: string;
	media_url?: string;
	file_size_bytes: number;
	post_bubbles?: number[];
}

export const EditPostOptions = {
	change_post_visibility: "change_post_visibility",
	edit_body_text: "edit_body_text",
	delete_body_text: "delete_body_text",
	add_post_bubbles: "add_post_bubbles",
	remove_post_bubbles: "remove_post_bubbles",
} as const;

export type EditPostOptions = (typeof EditPostOptions)[keyof typeof EditPostOptions];

export interface EditPostInput {
	post_id: number;
	edit_options: EditPostOptions[];
	post_visibility?: PostVisibility;
	body_text?: string;
	post_bubbles?: number[];
}

export interface PostBubble {
	post_id: number;
	bubble_id: number;
}

// ==================== Trinket ====================

export interface TrinketRow {
	id: number;
	user_id: number;
	trinket_visibility: TrinketVisibility;
	trinket_type: TrinketType;
	featured: boolean;
	title: string;
	description?: string;
	cover_url?: string;
	metadata: JSONValue;
	file_size_bytes: number;
	created_at: Date;
	updated_at: Date;
}

export interface PaginatedTrinkets {
	trinkets: TrinketWithAuthor[];
	pagination: {
		currentPage: number;
		totalPages: number;
		totalTrinkets: number;
		hasMore: boolean;
	};
}

export interface CreateTrinketInput {
	trinket_visibility: TrinketVisibility;
	trinket_type: TrinketType;
	title: string;
	description?: string;
	cover_url?: string;
	// trinket_bubbles?: number[];
	metadata?: JSONValue;
	file_size_bytes: number;
}

export interface EditTrinketInput {
	trinket_id: number;
	options: EditTrinketOptions[];
	visibility?: TrinketVisibility;
	title?: string;
	description?: string;
	cover_url?: string;
	metadata?: string;
	file_size_bytes: number;
}

export const EditTrinketOptions = {
	change_visibility: "change_visibility",
	change_title: "change_title",
	feature: "feature",
	unfeature: "unfeature",
	change_description: "change_description",
	delete_description: "delete_description",
	change_cover: "change_cover",
	delete_cover: "delete_cover",
	change_metadata: "change_metadata",
	delete_metadata: "delete_metadata",
} as const;

export type EditTrinketOptions = (typeof EditTrinketOptions)[keyof typeof EditTrinketOptions];

export interface TrinketWithAuthor extends Omit<TrinketRow, "user_id"> {
	user: PublicUser;
}

export interface TrinketBubbles {
	post_id: number;
	trinket_id: number;
}

export interface TrinketWithItems extends TrinketWithAuthor {
	trinket_items: TrinketItemRow[];
}

export interface TrinketItemRow {
	id: number;
	trinket_id: number;
	item_type: PostType;
	item_order: number;
	file_size_bytes: number;
	title?: string;
	description?: string;
	media_url?: string;
	metadata?: JSONValue;
	created_at: Date;
}

export interface TrinketItemReorder {
	item_id: number;
	item_order: number;
}

export interface CreateTrinketItemInput {
	trinket_id: number;
	item_type: PostType;
	item_order: number;
	file_size_bytes: number;
	title?: string;
	description?: string;
	media_url?: string;
	metadata?: JSONValue;
}

// ==================== Friendship ====================

export interface FriendshipRow {
	id: number;
	user_id: number;
	friend_id: number;
	friendship_status: FriendshipStatus;
	created_at: Date;
}

export interface Friendship extends Omit<FriendshipRow, "user_id" | "friend_id"> {
	users: [PublicUser, PublicUser];
}

export const ChangeStatusOptions = {
	cancel: "cancel",
	reject: "reject",
	accept: "accept",
} as const;

export type ChangeStatusOptions = (typeof ChangeStatusOptions)[keyof typeof ChangeStatusOptions];

// ==================== Bubble ====================

export interface BubbleRow {
	id: number;
	user_id: number;
	name?: string;
	created_at: Date;
}

export interface BubbleMemberRow {
	id: number;
	bubble_id: number;
	user_id: number;
	member_status: BubbleMemberStatus;
	created_at: Date;
}

export interface BubbleWithMembers extends Omit<BubbleRow, "user_id"> {
	user: PublicUser;
	members: PublicUser[];
}
