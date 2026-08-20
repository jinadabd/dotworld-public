import { useEffect, useState } from "react";
import { useLazySearchUsersQuery } from "../users/userApi";
import { UserBadge } from "../../components/badges/UserBadge";
import styles from "./Widgets.module.css";
import badgeStyle from "./WidgetUserBadge.module.css";

export function UserSearchWidget() {
	const [input, setInput] = useState("");
	const [trigger, { data: results, isFetching }] = useLazySearchUsersQuery();

	useEffect(() => {
		if (input.trim().length <= 3) return;
		const timeout = setTimeout(() => trigger(input.trim()), 300);
		return () => clearTimeout(timeout);
	}, [input, trigger]);

	return (
		<div className={`${styles.widget} ${styles.userSearch}`}>
			<input
				className={styles.textInput}
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Search..."
			/>
			{isFetching && <p className={styles.statusText}>Searhing...</p>}
			{results?.length === 0 && input.trim().length >= 4 && (
				<p className={styles.statusText}>No users found.</p>
			)}
			<ul className={styles.resultsList}>
				{results?.map((user) => (
					<li
						className={styles.resultItem}
						key={user.id}>
						<UserBadge
							style={badgeStyle}
							user={user}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
