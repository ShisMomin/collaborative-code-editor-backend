import { file as fileTable } from '@/db/schema/files-schema';

type FileInsert = Omit<typeof fileTable.$inferInsert, 'projectId' | 'parentId'>;

export type Language = (typeof fileTable.$inferInsert)['language'];
export interface TemplateNode extends FileInsert {
    children?: TemplateNode[];
}
