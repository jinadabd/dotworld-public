import { useEffect, useState } from "react";
import { useLazySearchUsersQuery } from "../users/userApi";
import { UserBadge } from "../../components/badges/UserBadge";

export function UserSearchWidget() {
	const [input, setInput] = useState("");
	const [trigger, { data: results, isFetching }] = useLazySearchUsersQuery();

	useEffect(() => {
		if (input.trim().length <= 3) return;
		const timeout = setTimeout(() => trigger(input.trim()), 300);
		return () => clearTimeout(timeout);
	}, [input, trigger]);

	return (
		<div>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Search username"
			/>
			{isFetching && <p>Searhing...</p>}
			{results?.length === 0 && input.trim().length >= 4 && <p>No users found.</p>}
			<ul>
				{results?.map((user) => (
					<li key={user.id}>
						<UserBadge user={user} />
					</li>
				))}
			</ul>
		</div>
	);
}
