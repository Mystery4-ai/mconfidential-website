"use server";

import { cookies } from "next/headers";
import { submitInquiry, submitLeadGate, InquiryFormState, LeadGateState } from "@/lib/inquiries";
import { bookSlot } from "@/lib/availability";

export async function requestVisitAction(
  propertyId: string,
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  return submitInquiry("VISIT", propertyId, formData);
}

export async function bookSlotAction(
  propertyId: string,
  prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  return bookSlot(propertyId, prevState, formData);
}

export async function unlockLeadGateAction(
  propertyId: string,
  _prevState: LeadGateState,
  formData: FormData
): Promise<LeadGateState> {
  const result = await submitLeadGate(propertyId, formData);
  if (result.success) {
    const cookieStore = await cookies();
    // 1 year — once someone has given their details for this project, don't
    // ask again on repeat visits from the same browser.
    cookieStore.set(`lead_unlocked_${propertyId}`, "1", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }
  return result;
}
