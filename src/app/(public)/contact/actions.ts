"use server";

import { submitInquiry, InquiryFormState } from "@/lib/inquiries";

export async function contactAction(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  return submitInquiry("CONTACT", null, formData);
}
