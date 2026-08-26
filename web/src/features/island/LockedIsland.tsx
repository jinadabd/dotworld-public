import type { FriendshipStatus, PublicUser } from "@shared/types";
import pageStyles from "../../styles/MainPage.module.css";
import formStyles from "../../styles/Form.module.css";
import lockedStyles from "./Island.module.css";
import { LockIcon } from "../../components/buttons/icons";
import { TactileButton } from "../../components/buttons/TactileButton";
import { FriendshipButton } from "../../components/buttons/FriendshipButton";

export function LockedIsland({ user, isIncoming }: { user: PublicUser; isIncoming: boolean }) {
	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>{`${user.username}'s Island`}</h1>
			</div>

			<div className={pageStyles.pageMain}>
				<div className={formStyles.welcomeCard}>
					<div className={lockedStyles.lockIconContainer}>
						<TactileButton
							colour="yellow"
							active={true}
							isMini={true}>
							<LockIcon />
						</TactileButton>
					</div>

					<h2 className={formStyles.welcomeTitle}>Island Locked</h2>

					<p className={formStyles.welcomeText}>
						{`${user.name}'s Island is private.\nBefriend them to unlock their Island.`}
					</p>

					<FriendshipButton
						userId={user.id}
						status={null}
						isIncoming={isIncoming}
					/>
				</div>
			</div>
		</div>
	);
}
