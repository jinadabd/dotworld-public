import { Link } from "react-router-dom";
import type { PublicUser, TrinketRow, TrinketWithAuthor } from "@shared/types";

import trinketStyles from "./Trinkets.module.css";
import { TrinketBadge } from "./TrinketBadge";
import { TrinketCoverIcon } from "../../components/buttons/icons/TrinketCoverIcon";
import { useMemo } from "react";
import { generateTrinketCover } from "../../utils/genereateTrinketCover";

export function TrinketCard({
	trinket,
	author,
}: {
	trinket: TrinketRow | TrinketWithAuthor;
	author: PublicUser;
}) {
	const seal = useMemo(() => {
		return generateTrinketCover(
			trinket.id.toString() || trinket.title || author.username || author.id.toString(),
		);
	}, [trinket.id, trinket.title, author.username, author.id]);

	return (
		<Link
			className={trinketStyles.trinketCard}
			to={`/trinkets/${trinket.id}`}>
			{trinket.cover_url ? (
				<div className={trinketStyles.coverWindow}>
					<img
						className={trinketStyles.trinketCover}
						src={trinket.cover_url}
						alt={trinket.title}
					/>
				</div>
			) : (
				<div className={trinketStyles.trinketCoverContainer}>
					<TrinketCoverIcon
						className={trinketStyles.trinketCoverEmbossed}
						seal={seal}
					/>
				</div>
			)}
			{/* <h3 className={trinketStyles.trinketTitle}>{trinket.title}</h3> */}

			<div className={trinketStyles.trinketBadge}>
				<TrinketBadge
					trinket={trinket}
					user={author}
				/>
			</div>
		</Link>
	);
}
