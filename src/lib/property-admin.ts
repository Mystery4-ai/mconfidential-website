import { db } from "@/lib/db";
import slugify from "slugify";

export async function generateReference(): Promise<string> {
  const last = await db.property.findFirst({
    orderBy: { createdAt: "desc" },
    select: { reference: true },
  });
  const lastNum = last ? parseInt(last.reference.replace("MC-", ""), 10) || 0 : 0;
  return `MC-${String(lastNum + 1).padStart(5, "0")}`;
}

export async function generateUniqueSlug(title: string, city: string): Promise<string> {
  const base = slugify(`${title} ${city}`, { lower: true, strict: true }).slice(0, 70);
  let slug = base;
  let suffix = 1;
  while (await db.property.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

type ScopeUser = { id: string; role: "ADMIN" | "CONSULTANT" };

export function propertyOwnerWhere(user: ScopeUser, propertyId: string) {
  return user.role === "ADMIN"
    ? { id: propertyId }
    : { id: propertyId, consultantId: user.id };
}
