export function rotatePost(postId: number): number {
	// 1. Get the last two digits (0 - 99) mapped to a scale of 1 - 10
	const lastTwoDigits = Math.abs(postId) % 100;
	const angle = (lastTwoDigits % 10) + 1; // Produces degrees 1 through 10

	// 2. Even IDs get positive degrees (+1° to +10°), Odd IDs get negative (-1° to -10°)
	const isEven = postId % 2 === 0;
	return isEven ? angle : -angle;
}
