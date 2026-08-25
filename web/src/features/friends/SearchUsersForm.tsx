import type { UseSearchUsersReturn } from "../../hooks/useSearchUsers";
import { UserBadgeKeycap } from "../../components/buttons/KeycapUserBadge";
import formStyles from "../../styles/Form.module.css";

interface Props {
	search: UseSearchUsersReturn;
}

export function SearchUsersForm({ search }: Props) {
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		await search.submit();
	}

	return (
		<form
			id="search-users-form"
			onSubmit={handleSubmit}
			className={formStyles.searchForm}>
			<input
				className={formStyles.textInput}
				type="text"
				value={search.input}
				onChange={(e) => {
					search.setInput(e.target.value);
				}}
				placeholder="Search users..."
			/>

			{search.isBusy && <p className={formStyles.statusText}>Searching...</p>}

			{/* Only show after hitting Search button */}
			{search.hasSearched && search.results.length === 0 && !search.isBusy && (
				<p className={formStyles.statusText}>No users found.</p>
			)}

			{search.hasResults && (
				<ul className={formStyles.resultsList}>
					{search.results.map((user) => (
						<li
							key={user.id}
							className={formStyles.resultItem}>
							<UserBadgeKeycap
								user={user}
								mode="row"
							/>
						</li>
					))}
				</ul>
			)}
		</form>
	);
}
