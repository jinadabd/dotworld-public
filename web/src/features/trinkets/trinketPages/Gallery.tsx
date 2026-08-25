import { useParams } from "react-router-dom";
import { useGetTrinketQuery } from "../trinketApi";
import { CreateTrinketItemForm } from "../CreateTrinketItemForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { TrinketCoverIcon } from "../../../components/buttons/icons/TrinketCoverIcon";
import { generateTrinketCover } from "../../../utils/genereateTrinketCover";
import { useMemo, useState } from "react";

import trinketStyles from "./Collection.module.css";
import { useCreateTrinketItem } from "../../../hooks/useCreateTrinketItem";
// import { CreateTrinketItemToolbar } from "./CreateTrinketItemToolbar";

export function Gallery() {
	const { trinketId: trinketParam } = useParams<{ trinketId: string }>();
	const trinketId = Number(trinketParam);

	const { data, isLoading, error } = useGetTrinketQuery(
		{ trinketId: trinketId },
		{ skip: !trinketId },
	);

	const { id: myId } = useSelector((state: RootState) => state.auth.user!);

	const [isCreating, setIsCreating] = useState(false);

	const isOwnTrinket = data?.trinket.user_id === myId;
	const trinketItems = data?.trinketItems ?? [];

	const create = useCreateTrinketItem({
		trinketId,
		nextOrder: trinketItems.length + 1,
	});

	async function handleSubmit() {
		const success = await create.submit();
		if (success) setIsCreating(false);
	}

	const seal = useMemo(() => {
		if (!data?.trinket) return "";
		return generateTrinketCover(
			data.trinket.id.toString() || data.trinket.title || data.trinket.user_id.toString(),
		);
	}, [data?.trinket]);

	if (isLoading) return <p>Loading trinket...</p>;
	if (error || !data) return <p>Trinket not found.</p>;

	const { trinket } = data;

	return (
		<div
			className={trinketStyles.trinketContainer}
			data-type="collection">
			{/* Page Header Area */}
			<div className={trinketStyles.headerRow}>
				<div className={trinketStyles.pageHeader}>
					<h1 className={trinketStyles.pageTitle}>{trinket.title}</h1>
					<div className={trinketStyles.trinketCoverContainer}>
						{trinket.cover_url ? (
							<img
								className={trinketStyles.trinketCover}
								src={trinket.cover_url}
								alt={trinket.title}
							/>
						) : (
							// <TrinketCoverIcon
							// 	className={trinketStyles.trinketCoverEmbossed}
							// 	seal={seal}
							// />
							<div />
						)}
					</div>
				</div>

				{isOwnTrinket && (
					// <CreateTrinketItemToolbar
					// 	isCreating={isCreating}
					// 	onToggleCreate={() => setIsCreating((prev) => !prev)}
					// 	onSubmit={handleSubmit}
					// 	hasTitle={create.hasContent}
					// 	isBusy={create.isBusy}
					// />
					<div />
				)}
			</div>

			{/* Collapsible Drawer for Creating Trinket Items */}
			{isOwnTrinket && (
				<div
					className={trinketStyles.createDrawer}
					data-expanded={isCreating}>
					<div className={trinketStyles.drawerInner}>
						<CreateTrinketItemForm createItem={create} />
					</div>
				</div>
			)}

			{/* Trinket Details */}
			{trinket.description && (
				<p className={trinketStyles.pageDescription}>{trinket.description}</p>
			)}
			<p>Type: {trinket.trinket_type}</p>

			{/* Trinket Items List Section */}
			<h2 className={trinketStyles.sectionTitle}>Items ({trinketItems.length})</h2>

			{trinketItems.length === 0 ? (
				<p>No items in this trinket yet.</p>
			) : (
				<ul className={trinketStyles.itemList}>
					{trinketItems.map((item) => (
						<li
							key={item.id}
							className={trinketStyles.itemCard}>
							<h4>{item.title ?? `Item #${item.item_order}`}</h4>
							{item.description && <p>{item.description}</p>}
							{item.media_url && (
								<a
									href={item.media_url}
									target="_blank"
									rel="noreferrer">
									View Media
								</a>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
