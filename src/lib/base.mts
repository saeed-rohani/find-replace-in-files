import fs from "node:fs";
import path from "node:path";
import { Options } from "../types/index.ts";

export default abstract class Base {
	protected constructor(protected readonly _options: Options) {
		this.checkValidEntry(this._options);
	}
	private checkType<V, T>(key: string, value: V, type: T | T[]): void {
		if (value === null || value === undefined) throw new Error(`${key} is null or undefined`);
		if (Array.isArray(type)) {
			if (
				!type.some((t) => {
					if (typeof value === t || (typeof t === "function" && value instanceof t)) return true;
					return false;
				})
			)
				throw new Error(`Entry of ${key} must be one of the following types: ${type.join(", ")}`);
		} else if (type === "array") {
			if (!Array.isArray(value)) throw new Error(`Entry of ${key} must be an array`);
		} else if (typeof value !== type) throw new Error(`Entry of ${key} must be ${type}`);
	}
	private checkValidEntry(options: Options) {
		if (!options.dirPath || !options.find || options.replace === undefined)
			throw new Error("dirPath, find and replace is required field");
		for (let i = 0, arr = Object.keys(options); i < arr.length; i++) {
			const key = arr[i] as string;
			const value = options[key as keyof Options];
			switch (key) {
				case "dirPath":
					if (!value) throw new Error(`${key} is required fields in options`);
					this.checkType(key, value, "string");
					break;
				case "find":
					if (!value) throw new Error(`${key} is required fields in options`);
					this.checkType(key, value, ["string", RegExp]);
					break;
				case "replace":
					this.checkType(key, value, "string");
					break;
				case "files":
					this.checkType(key, value, "array");
					if (value instanceof Array && value.length < 0) {
						throw new Error(`Entry of ${key} must be a non-empty array`);
					} else if (value instanceof Array && !value.every((item: string) => typeof item === "string"))
						throw new Error(`Entry of ${key} must be an array of string`);
					break;
				case "log":
					this.checkType(key, value, "string");
					break;
				default:
					throw new Error(`Entry ${key} is not valid`);
			}
		}
	}
	private getFiles(dirPath: string, allFiles: string[] = []): string[] {
		const files = fs.readdirSync(dirPath);
		for (const file of files) {
			const fullPath = path.join(dirPath, file);
			if (fs.statSync(fullPath).isDirectory()) {
				if (fullPath !== dirPath) {
					this.getFiles(fullPath, allFiles);
				}
			} else {
				allFiles.push(fullPath);
			}
		}
		return allFiles;
	}
	private sanitize(options: Options): string[] {
		const files = this.getFiles(options.dirPath);
		return !options.files
			? files
			: files.filter((file) =>
					options?.files?.some((filter) =>
						filter.startsWith(".") ? path.extname(file) === filter : path.basename(file).includes(filter)
					)
			  );
	}
	protected async render(
		options: Options,
		numberOfFiles = 0,
		matchFound = 0,
		filesList: string[] = []
	): Promise<{ matchFound: number; numberOfFiles: number; filesList: string[] } | undefined> {
		const files = this.sanitize(options);
		if (!files.length) return;
		for (const file of files) {
			try {
				const data = await fs.promises.readFile(file, "utf8");
				const matched = data.match(options.find);
				if (matched) {
					const replacedData = data.replace(options.find, options.replace);
					await fs.promises.writeFile(file, replacedData, "utf8").then(() => {
						matchFound += matched.length;
						numberOfFiles++;
						filesList.push(file);
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.message.includes("ENOENT: no such file or directory")) {
						console.warn(`File not found: ${file}`);
					} else {
						console.error(error);
					}
				} else {
					console.error("An unknown error has occurred:", error);
				}
			}
		}
		return { matchFound, numberOfFiles, filesList };
	}
	protected log(matchFound = 0, numberOfFiles = 0): void {
		if (!numberOfFiles) {
			console.warn("No files were found to replace the content.");
			return;
		} else {
			const logMessage =
				this._options.log ??
				`${matchFound} match${matchFound > 1 ? "es" : ""} found in ${numberOfFiles} file${
					numberOfFiles > 1 ? "s" : ""
				} were replaced.`;
			logMessage && console.log(logMessage);
		}
	}
}
