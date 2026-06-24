import { extname, join } from 'node:path';
import type { Language, TemplateNode } from './template.types';
import { readdirSync, readFileSync, statSync } from 'node:fs';
const READ_ONLY_FILES = new Set([
    'package.json',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'eslint.config.js',
]);
// type Language =
// (typeof EXTENSION_TO_LANGUAGE)[keyof typeof EXTENSION_TO_LANGUAGE];
const isReadOnly = (fileName: string): boolean => {
    return READ_ONLY_FILES.has(fileName);
};
// const EXTENSION_TO_LANGUAGE = {
//     '.ts': 'TYPESCRIPT',
//     '.tsx': 'TYPESCRIPT',
//     '.js': 'JAVASCRIPT',
//     '.jsx': 'JAVASCRIPT',
//     '.json': 'JSON',
//     '.css': 'CSS',
//     '.html': 'HTML',
//     '.md': 'MARKDOWN',
//     '.txt': 'TEXT',
// } as const;
const EXTENSION_TO_LANGUAGE: Record<string, NonNullable<Language>> = {
    '.ts': 'TYPESCRIPT',
    '.tsx': 'TSX',
    '.js': 'JAVASCRIPT',
    '.jsx': 'JSX',
    '.json': 'JSON',
    '.css': 'CSS',
    '.html': 'HTML',
    '.md': 'MARKDOWN',
    '.txt': 'OTHER',
};
const getLanguage = (fileName: string): Language | null => {
    const extension = extname(fileName) as keyof typeof EXTENSION_TO_LANGUAGE;

    return EXTENSION_TO_LANGUAGE[extension] ?? null;
};
const buildTree = (directoryPath: string): TemplateNode[] => {
    const entries = readdirSync(directoryPath);
    // console.log(entries);
    return entries.map((entry) => {
        const fullPath = join(directoryPath, entry);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            return {
                name: entry,
                type: 'FOLDER',
                content: null,
                language: null,
                isReadOnly: false,
                children: buildTree(fullPath),
            };
        }
        return {
            name: entry,
            type: 'FILE',
            content: readFileSync(fullPath, 'utf-8'),
            language: getLanguage(entry),
            isReadOnly: isReadOnly(entry),
        };
    });
};

export const templateTreeService = {
    build(templatePath: string): TemplateNode[] {
        return buildTree(templatePath);
    },
};
