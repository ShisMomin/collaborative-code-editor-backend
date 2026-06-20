import { pgEnum } from 'drizzle-orm/pg-core';

export const visibilityEnum = pgEnum('visibility', ['PRIVATE', 'PUBLIC']);
export const projectMemberRoleEnum = pgEnum('project_member_role', [
    'OWNER',
    'EDITO',
]);
export const invitationStatusEnum = pgEnum('invitation_status', [
    'PENDING',
    'ACCEPTED',
    'REJECTED',
]);

export const activityTypeEnum = pgEnum('activity_type', [
    'PROJECT_CREATED',
    'PROJECT_UPDATED',
    'PROJECT_DELETED',

    'MEMBER_JOINED',
    'MEMBER_LEFT',

    'INVITATION_SENT',
    'INVITATION_ACCEPTED',
    'INVITATION_REJECTED',

    'FILE_CREATED',
    'FILE_UPDATED',
    'FILE_DELETED',

    'MESSAGE_SENT',
]);

export const fileTypeEnum = pgEnum('file_type', ['FILE', 'FOLDER']);

export const fileLanguageEnum = pgEnum('file_language', [
    'TYPESCRIPT',
    'JAVASCRIPT',
    'TSX',
    'JSX',
    'CSS',
    'HTML',
    'JSON',
    'MARKDOWN',
    'OTHER',
]);
