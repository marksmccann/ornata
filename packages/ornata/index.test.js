import { describe, it, expect } from "vitest";
import ornata from "./index.js";

describe("ornata", () => {
  it("exports a function", () => {
    expect(ornata).toBeTypeOf("function");
  });
});
