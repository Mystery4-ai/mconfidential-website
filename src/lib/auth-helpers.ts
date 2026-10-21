import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

/** For use inside server actions, where redirect() would be surprising. */
export async function requireUserAction() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session.user;
}

export async function requireAdminAction() {
  const user = await requireUserAction();
  if (user.role !== "ADMIN") throw new Error("Forbidden: admin only");
  return user;
}
