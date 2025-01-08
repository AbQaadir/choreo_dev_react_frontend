interface Window {
    configs: {
        serviceUrl: string;
    };
}

declare var window: Window & typeof globalThis;

export const serviceUrl = window?.configs?.serviceUrl ?? "";
