import { signOut } from "@/auth";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/admin/login" });
      }}
    >
      <button
        type="submit"
        className="text-sm text-charcoal-soft hover:text-charcoal transition-colors"
      >
        Déconnexion
      </button>
    </form>
  );
}
