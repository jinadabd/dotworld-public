export function formatDate(dateInput: string | Date | number): string {
	const postDate = new Date(dateInput);
	const now = new Date();

	const isToday =
		postDate.getFullYear() === now.getFullYear() &&
		postDate.getMonth() === now.getMonth() &&
		postDate.getDate() === now.getDate();

	if (isToday) {
		const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return "just now";
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		return `${diffInHours}h ago`;
	}

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	}).format(postDate);
}
