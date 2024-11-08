/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_SERVER_API_URL: string;
    readonly AUTH_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module 'moment/locale/fr';
declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.json';
declare module '*.mp4';