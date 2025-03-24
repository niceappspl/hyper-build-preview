export interface SnackFile {
  type: 'CODE' | 'ASSET';
  contents: string;
}

export interface SnackFiles {
  [path: string]: SnackFile;
}

export interface SnackDependencies {
  [packageName: string]: string;
}

export interface CreateSnackOptions {
  files: SnackFiles;
  dependencies?: SnackDependencies;
  sdkVersion?: string;
  name?: string;
  description?: string;
}

export interface SnackResponse {
  snackId: string;
  snackUrl: string;
  snackEmbedUrl: string;
  snackMobileUrl?: string;
  qrCodeUrl?: string;
}

export interface UpdateSnackOptions {
  projectId: string;
  files?: SnackFiles;
  dependencies?: SnackDependencies;
  name?: string;
  description?: string;
} 