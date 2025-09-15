/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER1_USERNAME: string
  readonly VITE_USER1_DISPLAYNAME: string
  readonly VITE_USER1_ROLE: string
  readonly VITE_USER1_PASSWORD_HASH: string
  readonly VITE_USER2_USERNAME: string
  readonly VITE_USER2_DISPLAYNAME: string
  readonly VITE_USER2_ROLE: string
  readonly VITE_USER2_PASSWORD_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
