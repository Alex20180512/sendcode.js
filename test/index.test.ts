import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SendCode } from "../src/index";

describe("SendCode", () => {
  let container: HTMLElement;
  let sendCode: SendCode;

  beforeEach(() => {
    container = document.createElement("div");
    sendCode = new SendCode(container);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  test("Constructor should initialize correctly", () => {
    expect(sendCode).toBeInstanceOf(SendCode);
    expect(container.textContent).toBe("");
  });

  test("start method should update container text and begin countdown", () => {
    vi.useFakeTimers();
    sendCode.start();
    expect(container.textContent).toBe("重新发送（60s）");

    vi.advanceTimersByTime(1000);
    expect(container.textContent).toBe("重新发送（59s）");

    vi.advanceTimersByTime(59000);
    expect(container.textContent).toBe("");
  });

  test("Multiple calls to start method should only initiate countdown once", () => {
    vi.useFakeTimers();
    sendCode.start();
    sendCode.start();
    vi.advanceTimersByTime(1000);
    expect(container.textContent).toBe("重新发送（59s）");
  });

  test("onEnd callback should be called when countdown ends", () => {
    const onEnd = vi.fn();
    sendCode = new SendCode(container, { onEnd });

    vi.useFakeTimers();
    sendCode.start();
    vi.advanceTimersByTime(60000);

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  test("Custom wait time should take effect correctly", () => {
    sendCode = new SendCode(container, { wait: 30 });

    vi.useFakeTimers();
    sendCode.start();
    expect(container.textContent).toBe("重新发送（30s）");

    vi.advanceTimersByTime(30000);
    expect(container.textContent).toBe("");
  });

  test("Custom text should take effect correctly", () => {
    sendCode = new SendCode(container, {
      customText: (wait) => `Resend in (${wait}s)`,
      wait: 60,
    });

    vi.useFakeTimers();
    sendCode.start();
    expect(container.textContent).toBe("Resend in (60s)");
  });
});
