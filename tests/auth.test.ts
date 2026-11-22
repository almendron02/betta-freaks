import { describe, expect, it } from "vitest";

import { parseProfileForm } from "@/lib/auth/profile";
import { getSafeNextPath } from "@/lib/auth/redirect";

describe("auth redirect boundary", () => {
  it("accepts local paths", () => {
    expect(getSafeNextPath("/account?from=checkout")).toBe("/account?from=checkout");
  });

  it("rejects absolute and protocol-relative redirects", () => {
    expect(getSafeNextPath("https://example.com")).toBe("/account");
    expect(getSafeNextPath("//example.com")).toBe("/account");
  });
});

describe("customer profile boundary", () => {
  it("normalizes optional account details", () => {
    const form = new FormData();
    form.set("fullName", "  River Keeper  ");
    form.set("phone", " +1 (334) 555-0188 ");

    const result = parseProfileForm(form);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      fullName: "River Keeper",
      phone: "+1 (334) 555-0188",
    });
  });

  it("rejects phone-like fields containing markup", () => {
    const form = new FormData();
    form.set("phone", "<script>alert(1)</script>");
    expect(parseProfileForm(form).success).toBe(false);
  });
});
