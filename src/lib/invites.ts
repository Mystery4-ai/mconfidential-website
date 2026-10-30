import { randomBytes } from "crypto";

export const INVITE_TTL_DAYS = 7;

export function generateInviteToken() {
  return randomBytes(24).toString("base64url");
}

export function inviteExpiresAt() {
  return new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
}
