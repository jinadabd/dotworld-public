import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PlaybackState {
	currentTrackId: number | null;
	isPlaying: boolean;
	currentTime: number;
	src: string | null;
}

const initialState: PlaybackState = {
	currentTrackId: null,
	isPlaying: false,
	currentTime: 0,
	src: null,
};

const playbackSlice = createSlice({
	name: "playback",
	initialState,
	reducers: {
		play: (state, action: PayloadAction<number>) => {
			state.currentTrackId = action.payload;
			state.isPlaying = true;
		},

		pause: (state) => {
			state.isPlaying = false;
		},

		setCurrentTime: (state, action: PayloadAction<number>) => {
			state.currentTime = action.payload;
		},
	},
});

export const { play, pause, setCurrentTime } = playbackSlice.actions;
export default playbackSlice.reducer;
