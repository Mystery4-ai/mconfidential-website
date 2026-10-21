"use server";

import { db } from "@/lib/db";
import { requireUserAction, requireAdminAction } from "@/lib/auth-helpers";
import { InquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

function inquiryOwnerWhere(user: { id: string; role: "ADMIN" | "CONSULTANT" }, inquiryId: string) {
  return user.role === "ADMIN"
    ? { id: inquiryId }
    : { id: inquiryId, assignedConsultantId: user.id };
}

export async function updateInquiryStatus(inquiryId: string, status: string) {
  const user = await requireUserAction();
  const inquiry = await db.inquiry.findFirst({ where: inquiryOwnerWhere(user, inquiryId) });
  if (!inquiry) throw new Error("Demande introuvable ou accès refusé.");

  const valid: InquiryStatus[] = ["NEW", "CONTACTED", "VISIT_PLANNED", "COMPLETED", "CLOSED", "LOST"];
  if (!valid.includes(status as InquiryStatus)) return;

  await db.inquiry.update({ where: { id: inquiryId }, data: { status: status as InquiryStatus } });
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function updateInquiryNotes(inquiryId: string, notes: string) {
  const user = await requireUserAction();
  const inquiry = await db.inquiry.findFirst({ where: inquiryOwnerWhere(user, inquiryId) });
  if (!inquiry) throw new Error("Demande introuvable ou accès refusé.");

  await db.inquiry.update({ where: { id: inquiryId }, data: { internalNotes: notes } });
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}

export async function reassignInquiry(inquiryId: string, consultantId: string) {
  await requireAdminAction();
  await db.inquiry.update({
    where: { id: inquiryId },
    data: { assignedConsultantId: consultantId || null },
  });
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
}
