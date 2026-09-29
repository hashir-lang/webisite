/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the PHP enquiry API, e.g. https://uecampus.com/api */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
