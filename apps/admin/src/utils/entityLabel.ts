// TUIUIUMOB/apps/admin/src/utils/entityLabel.ts

/** Best-effort label for populated Mongoose refs or raw ids. */
export function labelRef(
  ref: unknown,
  key: "name" | "email" | "plate" = "name",
): string {
  if (ref && typeof ref === "object") {
    const o = ref as Record<string, unknown>;
    const v = o[key];
    if (typeof v === "string" && v.length > 0) return v;
    if (o.plate && typeof o.plate === "string") return o.plate as string;
    if (o._id) return String(o._id);
  }
  if (typeof ref === "string" && ref.length > 0) return ref;
  return "—";
}

export function idRef(ref: unknown): string {
  if (ref && typeof ref === "object" && "_id" in (ref as object)) {
    return String((ref as { _id: string })._id);
  }
  if (typeof ref === "string") return ref;
  return "—";
}
