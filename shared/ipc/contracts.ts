import { z } from "zod";

// Generic result wrapper
export const ResultSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.boolean(),
    data: data.optional(),
    error: z.string().optional(),
  });

// Channels enumeration (string literal union for safety)
export const channels = {
  OPEN_FILE: "fs:open-file",
  READ_FILE: "fs:read-file",
  THEME_GET: "theme:get",
  THEME_UPDATED: "theme:updated",
  APP_READY: "app:ready",
} as const;
export type Channel = (typeof channels)[keyof typeof channels];

// Schemas for requests/responses
export const OpenFileRequestSchema = z.object({
  filters: z
    .array(z.object({ name: z.string(), extensions: z.array(z.string()) }))
    .optional(),
  multiple: z.boolean().optional(),
});
export type OpenFileRequest = z.infer<typeof OpenFileRequestSchema>;

export const OpenFileResponseSchema = ResultSchema(
  z.object({
    cancelled: z.boolean(),
    filePaths: z.array(z.string()).optional(),
  })
);
export type OpenFileResponse = z.infer<typeof OpenFileResponseSchema>;

export const ReadFileRequestSchema = z.object({
  path: z.string(),
});
export type ReadFileRequest = z.infer<typeof ReadFileRequestSchema>;

export const ReadFileResponseSchema = ResultSchema(
  z.object({
    path: z.string(),
    content: z.string(),
  })
);
export type ReadFileResponse = z.infer<typeof ReadFileResponseSchema>;

export const ThemeGetResponseSchema = ResultSchema(
  z.object({
    theme: z.enum(["light", "dark", "system"]),
  })
);
export type ThemeGetResponse = z.infer<typeof ThemeGetResponseSchema>;

// App ready has no payload
export const AppReadySchema = z.object({});

// Helper type map for invocation
export interface IpcInvokeMap {
  "fs:open-file": { req: OpenFileRequest; res: OpenFileResponse };
  "fs:read-file": { req: ReadFileRequest; res: ReadFileResponse };
  "theme:get": { req: undefined; res: ThemeGetResponse };
  "app:ready": { req: undefined; res: { success: true } };
  "fs:stat-files": {
    req: { paths: string[] };
    res: {
      success: boolean;
      data?: {
        files: Array<{
          path: string;
          size: number;
          mtimeMs: number;
          isDir: boolean;
        }>;
      };
      error?: string;
    };
  };
}

// Events (one-way) map
export interface IpcEventMap {
  "theme:updated": { theme: "light" | "dark" };
}

export type IpcInvokeChannel = keyof IpcInvokeMap;
export type IpcEventChannel = keyof IpcEventMap;

export type InferInvokeReq<K extends IpcInvokeChannel> = IpcInvokeMap[K]["req"];
export type InferInvokeRes<K extends IpcInvokeChannel> = IpcInvokeMap[K]["res"];

export const isInvokeChannel = (value: string): value is IpcInvokeChannel => {
  return [
    "fs:open-file",
    "fs:read-file",
    "theme:get",
    "app:ready",
    "fs:stat-files",
  ].includes(value);
};

export const isEventChannel = (value: string): value is IpcEventChannel => {
  return ["theme:updated"].includes(value);
};
