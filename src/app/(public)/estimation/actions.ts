"use server";

import { submitInquiry, InquiryFormState } from "@/lib/inquiries";

export async function valuationAction(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const address = String(formData.get("address") || "").trim();
  const propertyType = String(formData.get("propertyType") || "").trim();
  const originalMessage = String(formData.get("message") || "").trim();

  const context = [
    address && `Bien à estimer : ${address}`,
    propertyType && `Type de bien : ${propertyType}`,
  ]
    .filter(Boolean)
    .join("\n");

  const combined = [context, originalMessage].filter(Boolean).join("\n\n");
  formData.set("message", combined);

  return submitInquiry("VALUATION", null, formData);
}
