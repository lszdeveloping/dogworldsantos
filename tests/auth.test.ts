import { describe, expect, it } from "vitest";
import { toSessionUser } from "../lib/auth";

describe("toSessionUser", () => {
  it("uses Supabase name metadata when available", () => {
    const user = toSessionUser({
      id: "user-1",
      email: "ana@example.com",
      user_metadata: { name: "Ana Santos" },
    });

    expect(user).toEqual({
      id: "user-1",
      name: "Ana Santos",
      email: "ana@example.com",
    });
  });

  it("falls back to the email name when metadata has no name", () => {
    const user = toSessionUser({
      id: "user-2",
      email: "bruno@example.com",
      user_metadata: {},
    });

    expect(user).toEqual({
      id: "user-2",
      name: "bruno",
      email: "bruno@example.com",
    });
  });
});
