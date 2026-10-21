"use server";

import { submitInquiry, InquiryFormState } from "@/lib/inquiries";

export async function requestVisitAction(
  propertyId: string,
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  return submitInquiry("VISIT", propertyId, formData);
}
