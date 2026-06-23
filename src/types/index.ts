import { auth } from '@/lib/auth';

type SessionUser = typeof auth.$Infer.Session.user;
type SessionData = typeof auth.$Infer.Session.session;
type RequestLogger = typeof import('../lib/logger').logger;

export type AppContext = {
    Variables: {
        user: SessionUser | null;
        session: SessionData | null;
        logger: RequestLogger | null;
    };
};

export type Result<T> =
    | {
          ok: true;
          data: T;
      }
    | {
          ok: false;
          error: unknown;
      };
