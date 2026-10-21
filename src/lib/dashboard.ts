import { db } from "@/lib/db";

type ScopeUser = { id: string; role: "ADMIN" | "CONSULTANT" };

function propertyScope(user: ScopeUser) {
  return user.role === "ADMIN" ? {} : { consultantId: user.id };
}

function inquiryScope(user: ScopeUser) {
  return user.role === "ADMIN" ? {} : { assignedConsultantId: user.id };
}

export async function getDashboardStats(user: ScopeUser) {
  const pScope = propertyScope(user);
  const iScope = inquiryScope(user);

  const [total, published, draft, pending, recentInquiries, upcomingVisits] = await Promise.all([
    db.property.count({ where: pScope }),
    db.property.count({ where: { ...pScope, status: "PUBLISHED" } }),
    db.property.count({ where: { ...pScope, status: "DRAFT" } }),
    db.property.count({ where: { ...pScope, status: "PENDING_APPROVAL" } }),
    db.inquiry.findMany({
      where: iScope,
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { property: { select: { title: true, slug: true } } },
    }),
    db.inquiry.findMany({
      where: {
        ...iScope,
        type: "VISIT",
        status: { in: ["NEW", "CONTACTED", "VISIT_PLANNED"] },
        preferredDate: { not: null },
      },
      orderBy: { preferredDate: "asc" },
      take: 6,
      include: { property: { select: { title: true, slug: true } } },
    }),
  ]);

  return { total, published, draft, pending, recentInquiries, upcomingVisits };
}
