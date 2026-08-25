import { useState } from "react";
import { useLazySearchUsersQuery } from "../features/users/userApi";

export function useSearchUsers() {
	const [input, setInput] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const [hasSearched, setHasSearched] = useState(false);

	const [trigger, { isFetching, error }] = useLazySearchUsersQuery();

	const hasContent = input.trim().length >= 4;
	const isBusy = isFetching;

	const handleInputChange = (value: string) => {
		setInput(value);
		setHasSearched(false);
	};

	const resetSearch = () => {
		setInput("");
		setResults([]);
		setHasSearched(false);
	};

	async function submit() {
		if (!hasContent || isBusy) return false;

		try {
			const res = await trigger(input.trim(), false).unwrap();
			setResults(res || []);
			setHasSearched(true);
			return true;
		} catch {
			setResults([]);
			setHasSearched(true);
			return false;
		}
	}

	return {
		input,
		setInput: handleInputChange,
		results,
		hasResults: results.length > 0,
		hasSearched,
		hasContent,
		isBusy,
		error,
		submit,
		resetSearch,
	};
}

export type UseSearchUsersReturn = ReturnType<typeof useSearchUsers>;
