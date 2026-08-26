import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@shared/types": path.resolve(import.meta.dirname, "../api/src/types/types.ts"),
			"@shared/ServerErrorCode": path.resolve(
				import.meta.dirname,
				"../api/src/errors/ServerError.ts",
			),
			"@shared/businessLogic": path.resolve(
				import.meta.dirname,
				"../api/src/constants/businessLogic.ts",
			),
		},
	},
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
