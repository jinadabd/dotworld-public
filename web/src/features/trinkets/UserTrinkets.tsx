import { useGetUserTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import type { TrinketType } from "@shared/types";

import trinketStyles from "./Trinkets.module.css";

interface Props {
	username: string;
	filter: TrinketType | "all";
}

export function UserTrinkets({ username, filter }: Props) {
	const user = useSelector((state: RootState) => state.auth.user!);

	const { data: trinkets, isLoading, error } = useGetUserTrinketsQuery({ username });

	if (isLoading) return <p>Loading Trinkets...</p>;
	if (error || !trinkets) return <p>Failed to load Trinkets.</p>;

	const filteredTrinkets =
		filter === "all" ? trinkets : trinkets.filter((trinket) => trinket.trinket_type === filter);

	return (
		<>
			{isLoading ? (
				<p>Loading your trinkets...</p>
			) : error || !filteredTrinkets || filteredTrinkets.length === 0 ? (
				<p>No trinkets found. Create some :D</p>
			) : (
				<div className={trinketStyles.trinketView}>
					{filteredTrinkets.map((trinket) => (
						<TrinketCard
							key={trinket.id}
							trinket={trinket}
							author={user}
						/>
					))}
				</div>
			)}
		</>
	);
}
