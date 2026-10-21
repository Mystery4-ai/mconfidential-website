import { cn } from "@/lib/cn";
import {
  availabilityLabels,
  inquiryStatusLabels,
  propertyStatusLabels,
} from "@/lib/labels";
import { Availability, InquiryStatus, PropertyStatus } from "@prisma/client";

const dotColor: Record<string, string> = {
  DRAFT: "bg-status-draft",
  PENDING_APPROVAL: "bg-status-pending",
  PUBLISHED: "bg-status-published",
  UNPUBLISHED: "bg-status-draft",
  ARCHIVED: "bg-status-archived",
  AVAILABLE: "bg-status-published",
  UNDER_OFFER: "bg-status-pending",
  SOLD: "bg-status-sold",
  RENTED: "bg-status-sold",
  NEW: "bg-status-pending",
  CONTACTED: "bg-olive-soft",
  VISIT_PLANNED: "bg-olive",
  COMPLETED: "bg-status-published",
  CLOSED: "bg-status-draft",
  LOST: "bg-status-archived",
};

function Badge({ label, statusKey }: { label: string; statusKey: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-charcoal-soft">
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[statusKey])} />
      {label}
    </span>
  );
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge label={propertyStatusLabels[status]} statusKey={status} />;
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  return <Badge label={availabilityLabels[availability]} statusKey={availability} />;
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return <Badge label={inquiryStatusLabels[status]} statusKey={status} />;
}
