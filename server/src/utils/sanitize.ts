// TUIUIUMOB/server/src/utils/sanitize.ts

/** Remove passwordHash from a plain user/driver object for JSON responses. */
export function stripPassword<T extends { passwordHash?: string }>(
  doc: T | null | undefined,
): Omit<T, "passwordHash"> | null | undefined {
  if (!doc) return doc;
  const { passwordHash: _p, ...rest } = doc;
  return rest as Omit<T, "passwordHash">;
}

export function stripPasswordMany<T extends { passwordHash?: string }>(
  docs: T[],
): Omit<T, "passwordHash">[] {
  return docs.map((d) => stripPassword(d)!) as Omit<T, "passwordHash">[];
}

export function pickAllowedKeys<T extends Record<string, unknown>>(
  body: T,
  allowed: readonly (keyof T)[],
): Partial<T> {
  const out: Partial<T> = {};
  for (const key of allowed) {
    if (key in body && body[key] !== undefined) {
      out[key] = body[key];
    }
  }
  return out;
}
