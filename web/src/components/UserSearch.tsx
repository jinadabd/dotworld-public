import { useState } from "react";
import type { PublicUser } from "@shared/types";

interface UserSearchProps {
	onSelectUser?: (user: PublicUser) => void;
}

export function UserSearch({ onSelectUser }: UserSearchProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<PublicUser[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!query.trim()) return;

		setIsSearching(true);
		try {
			const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
			const data = await res.json();
			setResults(data);
		} catch {
			setResults([]);
		} finally {
			setIsSearching(false);
		}
	}

	return (
		<div>
			<form onSubmit={handleSearch}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search users by username..."
				/>
				<button
					type="submit"
					disabled={isSearching}>
					{isSearching ? "Searching..." : "Search"}
				</button>
			</form>

			{results.length > 0 && (
				<ul>
					{results.map((user) => (
						<li
							key={user.username}
							onClick={() => onSelectUser?.(user)}
							style={{ cursor: "pointer" }}>
							{user.photograph_url && (
								<img
									src={user.photograph_url}
									alt={user.username}
									width={24}
									height={24}
								/>
							)}
							<span>
								{user.name ?? user.username} (@{user.username})
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
