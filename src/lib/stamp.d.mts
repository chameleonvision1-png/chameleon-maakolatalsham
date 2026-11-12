export function stampLogo(
  input: Buffer | string,
  logo: Buffer | string,
  opts?: { maxWidth?: number; ratio?: number; quality?: number; position?: "left" | "right" | "top-left" | "top-right" },
): Promise<Buffer>;
