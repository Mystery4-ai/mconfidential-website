"use server";

import { submitInquiry, InquiryFormState } from "@/lib/inquiries";
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
