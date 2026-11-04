import { describe, expect, it } from "vitest";
import { assertPublicUrl, guardedLookup, isPrivateAddress, safeFetch } from "./safeFetch.js";

describe("isPrivateAddress", () => {
  it("blocks loopback, private, link-local, metadata, CGNAT, multicast and v6 equivalents", () => {
    for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1", "::1", "::", "fc00::1", "fd12::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "64:ff9b::7f00:1"]) {
      expect(isPrivateAddress(ip), ip).toBe(true);
    }
  });
  it("allows public addresses", () => {
    for (const ip of ["8.8.8.8", "1.1.1.1", "172.32.0.1", "100.128.0.1", "2606:4700:4700::1111"]) expect(isPrivateAddress(ip), ip).toBe(false);
  });
});

describe("assertPublicUrl", () => {
  it("rejects internal hosts, odd encodings, credentials, ports and schemes", () => {
    for (const u of ["http://localhost/", "http://foo.localhost/", "http://127.0.0.1/", "http://[::1]/", "http://2130706433/", "http://0x7f.0.0.1/", "http://0177.0.0.1/", "http://user:pw@example.com/", "http://example.com:6379/", "file:///etc/passwd", "gopher://example.com/", "http://metadata.google.internal/", "http://169.254.169.254/latest/meta-data/"]) {
      expect(() => assertPublicUrl(u), u).toThrow();
    }
  });
  it("enforces https when asked", () => {
    expect(() => assertPublicUrl("http://example.com/", { httpsOnly: true })).toThrow();
    expect(assertPublicUrl("https://example.com/x").hostname).toBe("example.com");
  });
});

describe("guardedLookup", () => {
  const fake = (answers: { address: string; family: number }[]) => ((_h: string, _o: unknown, cb: (e: null, a: unknown) => void) => cb(null, answers)) as never;
  it("refuses a hostname that resolves to a private address", async () => {
    const err = await new Promise((res) => guardedLookup("evil.example", { all: true }, (e) => res(e), fake([{ address: "93.184.216.34", family: 4 }, { address: "127.0.0.1", family: 4 }])));
    expect(String(err)).toMatch(/private address/);
  });
  it("passes public answers through", async () => {
    const addr = await new Promise((res) => guardedLookup("ok.example", {}, (_e, a) => res(a), fake([{ address: "93.184.216.34", family: 4 }])));
    expect(addr).toBe("93.184.216.34");
  });
});

describe("safeFetch", () => {
  it("never connects to loopback", async () => {
    await expect(safeFetch("http://127.0.0.1:80/")).rejects.toThrow(/not allowed/);
    await expect(safeFetch("http://localhost/")).rejects.toThrow(/not allowed/);
  });
});
