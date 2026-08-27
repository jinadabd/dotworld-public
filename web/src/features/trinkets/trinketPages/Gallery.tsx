import { useParams } from "react-router-dom";
import { useGetTrinketQuery } from "../trinketApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { TrinketCoverIcon } from "../../../components/buttons/icons/TrinketCoverIcon";
import { generateTrinketCover } from "../../../utils/genereateTrinketCover";
import { useMemo, useState } from "react";

import trinketStyles from "./Gallery.module.css";
import { CreateTrinketItemToolbar } from "./CreateTrinketItemToolbar";
import { CreateTrinketItemForm } from "./CreateTrinketItemForm";
import { useCreateTrinketItem } from "../../../hooks/useCreateTrinketItem";
import { EditTrinketWidget } from "../../widgets/EditTrinketWidget";
import { useSetSidebar } from "../../../hooks/useSetSidebar";

export function Gallery() {
	const { trinketId: trinketParam } = useParams<{ trinketId: string }>();
	const trinketId = Number(trinketParam);

	const [isOpen, setIsOpen] = useState(false);
	const [stackOrder, setStackOrder] = useState<number[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const { data, isLoading, error } = useGetTrinketQuery({ trinketId }, { skip: !trinketId });

	const { id: myId } = useSelector((state: RootState) => state.auth.user!);

	const seal = useMemo(() => {
		if (!data?.trinket) return null;
		const { trinket } = data;
		return generateTrinketCover(
			trinket.id.toString() || trinket.title || trinket.user_id.toString(),
		);
	}, [data]);

	const trinketItems = data?.trinketItems ?? [];

	const create = useCreateTrinketItem({
		trinketId,
		nextOrder: trinketItems.length + 1,
	});

	async function handleSubmit() {
		const success = await create.submit();
		if (success) setIsCreating(false);
	}

	const { trinket } = data || {};
	const isOwnTrinket = trinket ? trinket.user_id === myId : false;

	const toggleEditMode = () => {
		setIsEditing((prev) => {
			const next = !prev;
			if (!next) setIsCreating(false);
			return next;
		});
	};

	// Sidebar Node definition
	const sidebarNode = isOwnTrinket ? (
		<EditTrinketWidget
			isEditing={isEditing}
			onToggleEdit={toggleEditMode}
			onSave={handleSubmit}
			isBusy={create.isBusy}
			isEmpty={!create.hasContent}
			hasBeenEdited={create.hasContent}
		/>
	) : null;

	useSetSidebar(sidebarNode);

	if (isLoading) return <p>Loading trinket...</p>;
	if (error || !data || !trinket) return <p>Trinket not found.</p>;

	const inBoxOffsets = [
		{ rot: -6, tx: -20, ty: -20 },
		{ rot: 8, tx: 20, ty: 15 },
		{ rot: -4, tx: -8, ty: 20 },
		{ rot: 10, tx: 25, ty: -20 },
		{ rot: -12, tx: -25, ty: 0 },
		{ rot: 5, tx: 12, ty: -25 },
	];

	const leftStackOffsets = [
		{ rot: -2, tx: 0, ty: 0 },
		{ rot: 4, tx: 8, ty: -6 },
		{ rot: -5, tx: -10, ty: 8 },
		{ rot: 3, tx: 6, ty: 10 },
		{ rot: -3, tx: -6, ty: -8 },
	];

	const handleBoxClick = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest(`.${trinketStyles.polaroidCard}`)) {
			return;
		}
		if (isOpen) {
			setStackOrder([]);
		}
		setIsOpen((prev) => !prev);
	};

	const handleCardClick = (itemId: number) => {
		setStackOrder((prev) => {
			if (prev.includes(itemId)) {
				return prev.filter((id) => id !== itemId);
			}
			return [...prev, itemId];
		});
	};

	return (
		<div
			className={trinketStyles.trinketContainer}
			data-type="gallery">
			<div className={trinketStyles.pageHeader}>
				<div className={trinketStyles.headerLeft}>
					<h1 className={trinketStyles.pageTitle}>{trinket.title}</h1>
				</div>

				{trinket.description && (
					<p className={trinketStyles.pageDescription}>{trinket.description}</p>
				)}

				{isOwnTrinket && isEditing && (
					<CreateTrinketItemToolbar
						isCreating={isCreating}
						onToggleCreate={() => setIsCreating((prev) => !prev)}
						onSubmit={handleSubmit}
						hasContent={create.hasContent}
						isBusy={create.isBusy}
					/>
				)}
			</div>

			{isEditing && (
				<div
					className={trinketStyles.createDrawer}
					data-expanded={isCreating}>
					<div className={trinketStyles.drawerInner}>
						<CreateTrinketItemForm createItem={create} />
					</div>
				</div>
			)}

			<div className={trinketStyles.boxStage}>
				<div
					className={`${trinketStyles.photoBox} ${isOpen ? trinketStyles.boxOpen : ""}`}
					onClick={handleBoxClick}
					role="button"
					tabIndex={0}>
					<div className={trinketStyles.boxTray}>
						{trinketItems.length === 0 ? (
							<div className={trinketStyles.emptyTray}>No photos inside</div>
						) : (
							trinketItems.slice(0, 6).map((item, idx) => {
								const stackIndex = stackOrder.indexOf(item.id);
								const isStacked = stackIndex !== -1;

								const boxOffset = inBoxOffsets[idx % inBoxOffsets.length];
								const stackOffset = isStacked
									? leftStackOffsets[stackIndex % leftStackOffsets.length]
									: { rot: 0, tx: 0, ty: 0 };

								return (
									<div
										key={item.id}
										onClick={(e) => {
											e.stopPropagation();
											handleCardClick(item.id);
										}}
										className={`${trinketStyles.polaroidCard} ${
											isStacked ? trinketStyles.stackedCard : ""
										}`}
										style={
											{
												zIndex: isStacked ? 20 + stackIndex : idx + 1,
												"--box-rot": `${boxOffset.rot}deg`,
												"--box-tx": `${boxOffset.tx}px`,
												"--box-ty": `${boxOffset.ty}px`,
												"--stack-rot": `${stackOffset.rot}deg`,
												"--stack-tx": `${stackOffset.tx}px`,
												"--stack-ty": `${stackOffset.ty}px`,
											} as React.CSSProperties
										}>
										<div className={trinketStyles.polaroidWindow}>
											{item.media_url ? (
												<img
													src={item.media_url}
													alt={item.title || "Gallery photo"}
												/>
											) : (
												<div className={trinketStyles.placeholderPhoto}>
													<span>
														{item.title || `#${item.item_order}`}
													</span>
												</div>
											)}
										</div>
										<span className={trinketStyles.polaroidCaption}>
											{item.title || `Photo #${item.item_order}`}
										</span>
									</div>
								);
							})
						)}
					</div>

					<div className={trinketStyles.boxLid}>
						<div className={trinketStyles.lidInlay}>
							{trinket.cover_url ? (
								<img
									className={trinketStyles.trinketCover}
									src={trinket.cover_url}
									alt={trinket.title}
								/>
							) : (
								seal && (
									<TrinketCoverIcon
										className={trinketStyles.trinketCoverEmbossed}
										seal={seal}
									/>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
