export interface SendCodeOptions {
  wait?: number;
  onEnd?: () => void;
}

const DefaultOptions: SendCodeOptions = {
  wait: 60,
};

export class SendCode {
  private container: HTMLElement;
  private options: SendCodeOptions;
  private timer: number = 0;
  private originalText: string = "";
  constructor(container: HTMLElement, options: SendCodeOptions = {}) {
    if (!container) {
      throw new Error("container is required");
    }

    this.container = container;
    this.originalText = container.textContent || "";
    this.options = Object.assign(DefaultOptions, options);
  }
  start() {
    if (this.timer) return;

    const container = this.container;
    let wait = this.options.wait!;

    const action = () => {
      if (wait <= 0) {
        container.textContent = this.originalText;
        wait = this.options.wait || DefaultOptions.wait!;
        this.timer = 0;
        if (this.options.onEnd) {
          this.options.onEnd();
        }
        return;
      }
      container.textContent = `重新发送（${wait}s）`;
      wait--;
      this.timer = window.setTimeout(action, 1000);
    };

    action();
  }
}
