import type { PublicUser } from "@shared/types";
import defaultStyle from "./UserBadge.module.css";
import { Link } from "react-router-dom";

interface Props {
	user: PublicUser;
	children?: React.ReactNode;
	style?: CSSModuleClasses;
}

export function UserBadge({ user, children, style }: Props) {
	const usedStyle = style ?? defaultStyle;
	return (
		<div className={usedStyle.badgeWithChildren}>
			<Link
				to={`/${user.username}`}
				className={usedStyle.badge}>
				{user.photograph_url ? (
					<img
						src={user.photograph_url}
						alt=""
						className={usedStyle.photograph}
					/>
				) : (
					<span className={usedStyle.initials}>{user.username[0]}</span>
				)}
				<div>
					<p className={usedStyle.name}>{user.name}</p>
					<p className={usedStyle.username}>{user.username}</p>
				</div>
			</Link>
			{children}
		</div>
	);
}
