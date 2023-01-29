import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { type TSESLint } from '@typescript-eslint/utils';
import { format, resolveConfig } from 'prettier';

const prettierConfig = resolveConfig.sync(__dirname);

export type LinterConfig = TSESLint.Linter.Config;

const addAutoGeneratedComment = (code: string) =>
	[
		'// THIS CODE WAS AUTOMATICALLY GENERATED',
		'// DO NOT EDIT THIS CODE BY HAND',
		'// YOU CAN REGENERATE IT USING npm run generate:configs',
		'',
		code,
	].join('\n');

/**
 * Helper function writes configuration.
 */
export const writeConfig = (config: LinterConfig, configName: string): void => {
	// note: we use `export =` because ESLint will import these configs via a commonjs import
	const code = `export = ${JSON.stringify(config)};`;
	const configStr = format(addAutoGeneratedComment(code), {
		parser: 'typescript',
		...prettierConfig,
	});
	const filePath = resolve(__dirname, `../../lib/configs/${configName}.ts`);

	writeFileSync(filePath, configStr);
};
