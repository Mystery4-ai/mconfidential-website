import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const sessionUser = await requireUser();
  const user = await db.user.findUniqueOrThrow({ where: { id: sessionUser.id } });

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-2xl">Mon profil</h1>
      <p className="mt-1 text-sm text-charcoal-soft">
        {user.name} — {user.email}
      </p>

      <div className="mt-8 max-w-xl">
        <ProfileForm
          initialValues={{
            title: user.title,
            phone: user.phone,
            whatsapp: user.whatsapp,
            bio: user.bio,
            schedulingUrl: user.schedulingUrl,
          }}
        />
      </div>
    </div>
  );
}
