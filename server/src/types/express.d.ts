// TUIUIUMOB/server/src/types/express.d.ts

import type { AuthPayload } from "../auth/types.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export {};
