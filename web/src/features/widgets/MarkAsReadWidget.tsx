import { TactileButton } from "../../components/buttons/TactileButton";

import widgetStyles from "./Widgets.module.css";

interface Props {
	markAsRead: () => void;
}

export function MarkAsReadWidget({ markAsRead }: Props) {
	return (
		<div className={widgetStyles.widget}>
			<h3 className={widgetStyles.widgetTitle}>Actions</h3>
			<div className={widgetStyles.widgetView}>
				<TactileButton
					colour="red"
					onRelease={markAsRead}>
					Read All
				</TactileButton>
			</div>
		</div>
	);
}
