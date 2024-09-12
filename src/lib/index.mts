import Base from "./base.mts";
import { Options } from "../types/index.ts";

class FindReplaceInFiles extends Base {
	constructor(options: Options) {
		super(options);
	}
	async call(): Promise<{ [key: string]: number | string[] } | undefined> {
		return await super.render(this._options).then((result) => {
			this.log(result?.matchFound, result?.numberOfFiles);
			return { ...result };
		});
	}
}

export const findReplaceInFiles = (options: Options) => new FindReplaceInFiles(options).call();
