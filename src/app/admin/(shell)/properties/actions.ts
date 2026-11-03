"use server";

import { db } from "@/lib/db";
import { requireUserAction, requireAdminAction } from "@/lib/auth-helpers";
import { generateReference, generateUniqueSlug, propertyOwnerWhere } from "@/lib/property-admin";
import { saveUploadedImage, deleteUploadedImage } from "@/lib/storage";
import { propertyFormSchema, numOrUndefined } from "./schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PropertyFormState = { error?: string };

function parseFeatures(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
    .map((f) => f.trim())
    .filter(Boolean);
}

function extractFormValues(formData: FormData) {
  // formData.get() returns null for absent fields (e.g. consultantId, which
  // only admins see); zod's .optional() only accepts undefined, not null.
  const str = (key: string) => formData.get(key) ?? undefined;
  return {
    title: str("title"),
    description: str("description"),
    transactionType: str("transactionType"),
    propertyType: str("propertyType"),
    price: str("price"),
    city: str("city"),
    neighborhood: str("neighborhood"),
    address: str("address"),
    features: str("features"),
    consultantId: str("consultantId"),
  };
}

export async function createProperty(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const user = await requireUserAction();
  const parsed = propertyFormSchema.safeParse(extractFormValues(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const consultantId =
    user.role === "ADMIN" && parsed.data.consultantId ? parsed.data.consultantId : user.id;

  const [reference, slug] = await Promise.all([
    generateReference(),
    generateUniqueSlug(parsed.data.title, parsed.data.city),
  ]);

  const property = await db.property.create({
    data: {
      reference,
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      transactionType: parsed.data.transactionType,
      propertyType: parsed.data.propertyType,
      price: parsed.data.price,
      city: parsed.data.city,
      neighborhood: parsed.data.neighborhood || null,
      address: parsed.data.address || null,
      surfaceArea: numOrUndefined(formData.get("surfaceArea")),
      landArea: numOrUndefined(formData.get("landArea")),
      bedrooms: numOrUndefined(formData.get("bedrooms")),
      bathrooms: numOrUndefined(formData.get("bathrooms")),
      parkingSpaces: numOrUndefined(formData.get("parkingSpaces")),
      yearBuilt: numOrUndefined(formData.get("yearBuilt")),
      features: parseFeatures(parsed.data.features),
      consultantId,
      status: "DRAFT",
      featured: user.role === "ADMIN" && formData.get("featured") === "on",
      isNewDevelopment: formData.get("isNewDevelopment") === "on",
    },
  });

  revalidatePath("/admin/properties");
  redirect(`/admin/properties/${property.id}/edit`);
}

export async function updateProperty(
  propertyId: string,
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const user = await requireUserAction();
  const existing = await db.property.findFirst({ where: propertyOwnerWhere(user, propertyId) });
  if (!existing) return { error: "Bien introuvable ou accès refusé." };

  const parsed = propertyFormSchema.safeParse(extractFormValues(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const consultantId =
    user.role === "ADMIN" && parsed.data.consultantId ? parsed.data.consultantId : existing.consultantId;

  await db.property.update({
    where: { id: propertyId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      transactionType: parsed.data.transactionType,
      propertyType: parsed.data.propertyType,
      price: parsed.data.price,
      city: parsed.data.city,
      neighborhood: parsed.data.neighborhood || null,
      address: parsed.data.address || null,
      surfaceArea: numOrUndefined(formData.get("surfaceArea")),
      landArea: numOrUndefined(formData.get("landArea")),
      bedrooms: numOrUndefined(formData.get("bedrooms")),
      bathrooms: numOrUndefined(formData.get("bathrooms")),
      parkingSpaces: numOrUndefined(formData.get("parkingSpaces")),
      yearBuilt: numOrUndefined(formData.get("yearBuilt")),
      features: parseFeatures(parsed.data.features),
      consultantId,
      isNewDevelopment: formData.get("isNewDevelopment") === "on",
      ...(user.role === "ADMIN" ? { featured: formData.get("featured") === "on" } : {}),
    },
  });

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${existing.slug}`);
  return {};
}

async function assertOwnedOrAdmin(propertyId: string) {
  const user = await requireUserAction();
  const property = await db.property.findFirst({ where: propertyOwnerWhere(user, propertyId) });
  if (!property) throw new Error("Bien introuvable ou accès refusé.");
  return { user, property };
}

export async function submitForApproval(propertyId: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  if (property.status !== "DRAFT" && property.status !== "UNPUBLISHED") return;
  await db.property.update({ where: { id: propertyId }, data: { status: "PENDING_APPROVAL" } });
  revalidatePath("/admin/properties");
}

export async function publishProperty(propertyId: string) {
  await requireAdminAction();
  const property = await db.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Bien introuvable.");
  await db.property.update({
    where: { id: propertyId },
    data: { status: "PUBLISHED", publishedAt: property.publishedAt ?? new Date() },
  });
  revalidatePath("/admin/properties");
  revalidatePath(`/biens/${property.slug}`);
  revalidatePath("/biens");
}

export async function rejectProperty(propertyId: string) {
  await requireAdminAction();
  await db.property.update({ where: { id: propertyId }, data: { status: "DRAFT" } });
  revalidatePath("/admin/properties");
}

export async function unpublishProperty(propertyId: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  await db.property.update({ where: { id: propertyId }, data: { status: "UNPUBLISHED" } });
  revalidatePath("/admin/properties");
  revalidatePath(`/biens/${property.slug}`);
  revalidatePath("/biens");
}

export async function archiveProperty(propertyId: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  await db.property.update({ where: { id: propertyId }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/properties");
  revalidatePath(`/biens/${property.slug}`);
  revalidatePath("/biens");
}

export async function setAvailability(propertyId: string, availability: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  if (!["AVAILABLE", "UNDER_OFFER", "SOLD", "RENTED"].includes(availability)) return;
  await db.property.update({
    where: { id: propertyId },
    data: { availability: availability as "AVAILABLE" | "UNDER_OFFER" | "SOLD" | "RENTED" },
  });
  revalidatePath("/admin/properties");
  revalidatePath(`/biens/${property.slug}`);
}

export async function uploadImages(propertyId: string, formData: FormData) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return;

  const existingCount = await db.image.count({ where: { propertyId } });

  let position = existingCount;
  for (const file of files) {
    const url = await saveUploadedImage(file);
    await db.image.create({
      data: { propertyId, url, altText: property.title, position: position++ },
    });
  }

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
}

export async function deleteImage(propertyId: string, imageId: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  const image = await db.image.findFirst({ where: { id: imageId, propertyId } });
  if (!image) return;

  await db.image.delete({ where: { id: imageId } });
  await deleteUploadedImage(image.url);

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
}

export async function reorderImages(propertyId: string, orderedIds: string[]) {
  await assertOwnedOrAdmin(propertyId);
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.image.update({ where: { id }, data: { position: index } })
    )
  );
  revalidatePath(`/admin/properties/${propertyId}/edit`);
}

export async function uploadBrochure(propertyId: string, formData: FormData) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  const file = formData.get("brochure");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await saveUploadedImage(file, "documents");
  if (property.brochureUrl) await deleteUploadedImage(property.brochureUrl);
  await db.property.update({ where: { id: propertyId }, data: { brochureUrl: url } });

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
}

export async function deleteBrochure(propertyId: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  if (!property.brochureUrl) return;

  await deleteUploadedImage(property.brochureUrl);
  await db.property.update({ where: { id: propertyId }, data: { brochureUrl: null } });

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
}

export async function uploadFloorPlans(propertyId: string, formData: FormData) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  const files = formData.getAll("floorPlans").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return;

  const existingCount = await db.floorPlan.count({ where: { propertyId } });

  let position = existingCount;
  for (const file of files) {
    const url = await saveUploadedImage(file, "floor-plans");
    const label = file.name.replace(/\.pdf$/i, "").trim();
    await db.floorPlan.create({
      data: { propertyId, url, label: label || "Plan", position: position++ },
    });
  }

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
}

export async function deleteFloorPlan(propertyId: string, floorPlanId: string) {
  const { property } = await assertOwnedOrAdmin(propertyId);
  const plan = await db.floorPlan.findFirst({ where: { id: floorPlanId, propertyId } });
  if (!plan) return;

  await db.floorPlan.delete({ where: { id: floorPlanId } });
  await deleteUploadedImage(plan.url);

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
}

export type UnitsFormState = { error?: string; success?: boolean };

/**
 * Parses the bulk "one lot per line" textarea format:
 * étage | lot | surface (m²) | terrasse (m², optional) | prix (MAD)
 * Replaces the full lot grid for the property on each save — matches how
 * agencies actually maintain these (re-pasting an updated price list).
 */
export async function saveProjectUnits(
  propertyId: string,
  _prevState: UnitsFormState,
  formData: FormData
): Promise<UnitsFormState> {
  const { property } = await assertOwnedOrAdmin(propertyId);
  const raw = String(formData.get("units") || "");

  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const units: {
    floorLabel: string;
    lotNumber: number;
    surfaceArea: number;
    terraceArea: number | null;
    price: number;
  }[] = [];

  for (const line of lines) {
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length !== 5) {
      return {
        error: `Ligne invalide : "${line}". Format attendu (5 champs) : étage | lot | surface | terrasse | prix`,
      };
    }
    const [floorLabel, lotNumberRaw, surfaceRaw, terraceRaw, priceRaw] = parts;
    const lotNumber = Number(lotNumberRaw);
    const surfaceArea = Number(surfaceRaw);
    const terraceArea = terraceRaw ? Number(terraceRaw) : null;
    const price = Number(priceRaw);
    if (!floorLabel || !Number.isFinite(lotNumber) || !Number.isFinite(surfaceArea) || !Number.isFinite(price)) {
      return {
        error: `Ligne invalide : "${line}". Format attendu (5 champs) : étage | lot | surface | terrasse | prix`,
      };
    }
    units.push({ floorLabel, lotNumber, surfaceArea, terraceArea, price });
  }

  await db.$transaction([
    db.projectUnit.deleteMany({ where: { propertyId } }),
    db.projectUnit.createMany({
      data: units.map((u, i) => ({ propertyId, ...u, position: i })),
    }),
  ]);

  revalidatePath(`/admin/properties/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
  return { success: true };
}
