interface Window {
    config: {
        apiUrl: string;
    };
}

declare var window: Window & typeof globalThis;

const apiUrl = window?.config?.apiUrl ? window.config.apiUrl : "/";

export { apiUrl };