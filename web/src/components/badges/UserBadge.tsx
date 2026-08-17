import type { PublicUser } from "@shared/types";
import styles from "./UserBadge.module.css";
import { Link } from "react-router-dom";

interface Props {
	user: PublicUser;
	children?: React.ReactNode;
}

export function UserBadge({ user, children }: Props) {
	return (
		<div className={styles.badge}>
			<Link
				to={`/${user.username}`}
				className="styles.link">
				{user.photograph_url ? (
					<img
						src={user.photograph_url}
						alt=""
						className={styles.avatar}
					/>
				) : (
					<span className={styles.initials}>{user.username[0]}</span>
				)}
				<div>
					<p className={styles.name}>{user.name}</p>
					<p className={styles.username}>{user.username}</p>
				</div>
			</Link>
			{children}
		</div>
	);
}
