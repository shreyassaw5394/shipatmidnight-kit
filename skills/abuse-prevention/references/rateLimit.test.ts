import { describe, expect, it } from "vitest";
import { MemoryStore, checkLimit, rateLimitHeaders, type CounterStore } from "./rateLimit.js";

describe("checkLimit", () => {
  it("allows exactly `limit` requests per window, then refuses", async () => {
    const store = new MemoryStore(() => 0);
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await checkLimit(store, "ip:1", 3, 60));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[3].remaining).toBe(0);
    expect(rateLimitHeaders(results[3])["Retry-After"]).toBe("60");
    expect(rateLimitHeaders(results[0])["Retry-After"]).toBeUndefined();
  });

  it("starts a new window after it expires", async () => {
    let t = 0;
    const store = new MemoryStore(() => t);
    await checkLimit(store, "k", 1, 10);
    expect((await checkLimit(store, "k", 1, 10)).allowed).toBe(false);
    t = 10_000;
    expect((await checkLimit(store, "k", 1, 10)).allowed).toBe(true);
  });

  it("keeps buckets separate", async () => {
    const store = new MemoryStore(() => 0);
    await checkLimit(store, "a", 1, 60);
    expect((await checkLimit(store, "b", 1, 60)).allowed).toBe(true);
  });

  it("fails open when the store is down", async () => {
    const broken: CounterStore = { increment: async () => { throw new Error("down"); } };
    const r = await checkLimit(broken, "x", 1, 60);
    expect(r.allowed).toBe(true);
    expect(r.storeError).toBeInstanceOf(Error);
  });

  it("does not grow without bound", async () => {
    const store = new MemoryStore(() => 0, 3);
    for (let i = 0; i < 10; i++) await checkLimit(store, `k${i}`, 1, 60);
    expect((store as unknown as { windows: Map<string, unknown> }).windows.size).toBeLessThanOrEqual(3);
  });
});
