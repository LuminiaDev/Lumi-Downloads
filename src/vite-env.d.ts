/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LUMI_ARTIFACT_ID?: string;
  readonly VITE_LUMI_GROUP_ID?: string;
  readonly VITE_LUMI_REPOSILITE_URL?: string;
  readonly VITE_LUMI_STABLE_REPOSITORY?: string;
  readonly VITE_LUMI_DEV_REPOSITORY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
