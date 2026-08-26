import type { PublicUser } from "@shared/types";
import { SealKeycap } from "../../components/buttons/SealKeycap";
import pageStyles from "../../styles/MainPage.module.css";
import formStyles from "../../styles/Form.module.css";
import blankStyles from "./Island.module.css";

interface Props {
	user: PublicUser;
}

export function BlankIsland({ user }: Props) {
	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>{`${user.name}'s Island`}</h1>
			</div>

			<div className={pageStyles.pageMain}>
				<div className={formStyles.welcomeCard}>
					<div className={blankStyles.sealWrapper}>
						<SealKeycap
							seed={user.id.toString()}
							colour="yellow"
						/>
					</div>

					<h2 className={formStyles.welcomeTitle}>Uncharted Island</h2>

					<p className={formStyles.welcomeText}>
						{`${user.name} hasn't built their Island yet.\n\nCheck back in later.`}
					</p>
				</div>
			</div>
		</div>
	);
}
