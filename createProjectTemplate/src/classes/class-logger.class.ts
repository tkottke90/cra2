export type ClassLogger = {
  log: (level: any, message: string, data?: Record<string, any>) => void;
}