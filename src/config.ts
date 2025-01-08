interface Window {
    configs: {
        apiUrl: string;
    };
}

declare var window: Window & typeof globalThis;

export const apiUrl = window?.configs?.apiUrl ?? "";
