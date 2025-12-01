import { describe, it, expect } from "vitest";
import { initChatDemo } from "./chat-demo";

describe("Chat Demo Script", () => {
    it("should export initChatDemo function", () => {
        expect(typeof initChatDemo).toBe("function");
    });
});
