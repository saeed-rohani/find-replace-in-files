# find-replace-in-files

Simple and lightweight package that finds the text in files in the directories and replaces it with new content.

## Installation

You will need Node.js 18+ and npm installed on your local development machine.

```shell
npm i find-replace-in-files
```

## Usage

### basic usage

This package is an [ESM-only](https://nodejs.org/docs/latest/api/esm.html) module and you are not able to import it with require().
The library's return is an object with the following properties 'matchFound', 'numberOfFiles' and 'filesList' which are determined operations in files.

```ts
import { findReplaceInFiles } from "find-replace-in-files";

const result = await findReplaceInFiles({
	dirPath: "./src",
	find: /foo/g,
	replace: "bar"
});

console.log(result); // result returns an object with { matchFound, numberOfFiles, filesList } properties
```

### Options

| Name    |        Type        | Description                                                                                                                                                                                                                                                                                                                                     | Requirement |
| :------ | :----------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------: |
| dirPath |      `string`      | Path to find all the files in the directory and subdirectories.                                                                                                                                                                                                                                                                                 |  Required   |
| find    | `RegExp`or`string` | Regex or string to find. Note that if a string is used, only the first match in each file will be replaced. To replace all occurrences of a pattern within a string using a regular expression, add the 'g' flag to the end of your regex pattern.                                                                                              |  Required   |
| replace |      `string`      | The string will be used as a replacement for the original string. string.                                                                                                                                                                                                                                                                       |  Required   |
| files   |      `array`       | An array of strings used to locate specific files. It can be used to search for files by extension, filename, or part of a filename.                                                                                                                                                                                                            |  Optional   |
| log     | `string` or `null` | By default, after completing the operation, the library generates a log indicating the number of matches and changed files with the list of array of file names modified. To customize this message, provide a string that will be logged upon successful completion of the replacement. To disable logging entirely, pass `null` as the value. |  Optional   |

### Example with required and optional arguments

```ts
import { findReplaceInFiles } from "find-replace-in-files";

const result = await findReplaceInFiles({
	dirPath: "./dist/folder",
	find: /foo/g, // Or string to replace first occurrence. example: "foo"
	replace: "bar",
	filse: [".js", ".ts", ".html", ".txt", ".docx", "file.jsx", "filenames", "index.min.js"],
	log: null // Or string to override default message. example: "Files have been successfully replaced."
});
```

## License

(MIT License)

Copyright 2024, Saeed Rohani

## Issues/Requests

Feel free to submit questions at:<br>
[github.com/saeed-rohani/find-replace-in-files/issues](https://github.com/saeed-rohani/find-replace-in-files/issues)
