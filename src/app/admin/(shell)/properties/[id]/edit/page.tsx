import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { propertyOwnerWhere } from "@/lib/property-admin";
import { PropertyForm } from "../../property-form";
import { updateProperty } from "../../actions";
import { ImageManager } from "./image-manager";
import { StatusActions } from "./status-actions";
import { PropertyStatusBadge } from "@/components/ui/status-badge";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const property = await db.property.findFirst({
    where: propertyOwnerWhere(user, id),
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!property) notFound();

  const consultants =
    user.role === "ADMIN"
      ? await db.user.findMany({
          where: { active: true },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : undefined;

  const boundUpdate = updateProperty.bind(null, property.id);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl">{property.title.slice(0, 50)}</h1>
            <PropertyStatusBadge status={property.status} />
          </div>
          <p className="mt-1 text-sm text-charcoal-soft">{property.reference}</p>
        </div>
        <Link
          href={`/biens/${property.slug}${property.status === "PUBLISHED" ? "" : "?preview=1"}`}
          target="_blank"
          className="text-sm text-charcoal underline underline-offset-4"
        >
          Aperçu public
        </Link>
      </div>

      <div className="mt-6 border border-border bg-white/40 p-5">
        <StatusActions
          propertyId={property.id}
          status={property.status}
          availability={property.availability}
          isAdmin={user.role === "ADMIN"}
        />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-lg">Photos</h2>
        <div className="mt-4">
          <ImageManager propertyId={property.id} images={property.images} />
        </div>
      </div>

      <div className="mt-10 max-w-3xl">
        <h2 className="font-serif text-lg">Modifier les informations</h2>
        <div className="mt-4">
          <PropertyForm
            action={boundUpdate}
            isAdmin={user.role === "ADMIN"}
            consultants={consultants}
            initialValues={{
              ...property,
              features: Array.isArray(property.features) ? (property.features as string[]) : [],
            }}
            submitLabel="Enregistrer les modifications"
          />
        </div>
      </div>
    </div>
  );
}
