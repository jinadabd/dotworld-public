import { useState } from "react";
import { useGetUserTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";
import { CreateTrinketForm } from "./CreateTrinketForm";
import { CreateTrinketToolbar } from "./CreateTrinketToolbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useCreateTrinket } from "../../hooks/useCreateTrinket";
import type { TrinketType } from "@shared/types";

import trinketStyles from "./Trinkets.module.css";

interface Props {
	username: string;
	filter: TrinketType | "all";
}

export function UserTrinkets({ username, filter }: Props) {
	const user = useSelector((state: RootState) => state.auth.user!);
	const isOwnIsland = username === user.username;

	const [isCreating, setIsCreating] = useState(false);
	const create = useCreateTrinket();

	async function handleSubmit() {
		const success = await create.submit();
		if (success) setIsCreating(false);
	}

	const { data: trinkets, isLoading, error } = useGetUserTrinketsQuery({ username });

	if (isLoading) return <p>Loading Trinkets...</p>;
	if (error || !trinkets) return <p>Failed to load Trinkets.</p>;

	const filteredTrinkets =
		filter === "all" ? trinkets : trinkets.filter((trinket) => trinket.trinket_type === filter);

	return (
		<>
			<div className={trinketStyles.headerRow}>
				<h2 className={trinketStyles.sectionTitle}>
					{isOwnIsland ? "My Trinkets" : `${username}'s Trinkets`}
				</h2>
				{isOwnIsland && (
					<CreateTrinketToolbar
						isCreating={isCreating}
						onToggleCreate={() => setIsCreating((prev) => !prev)}
						onSubmit={handleSubmit}
						hasTitle={create.hasTitle}
						isBusy={create.isBusy}
					/>
				)}
			</div>

			<div
				className={trinketStyles.createDrawer}
				data-expanded={isCreating}>
				<div className={trinketStyles.drawerInner}>
					<CreateTrinketForm create={create} />
				</div>
			</div>

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
