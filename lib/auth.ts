export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export type SessionUser = Omit<User, "passwordHash">;

const USERS_KEY = "dogworld_users";
const SESSION_KEY = "dogworld_session";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function findUser(email: string, password: string): Promise<User | null> {
  const hash = await hashPassword(password);
  const users = getUsers();
  return (
    users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash
    ) || null
  );
}

export function emailExists(email: string): boolean {
  return getUsers().some((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setSession(user: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
