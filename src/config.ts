interface Window {
    config: {
        BACKEND_BASE_URL: string;
    };
}

declare var window: Window;

export const serviceUrl = window.config?.BACKEND_BASE_URL ?? "";
