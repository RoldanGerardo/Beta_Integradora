import crypto from "crypto";
const SECRET = process.env.AUTH_SECRET || "beta-dev-secret-cambiar-en-produccion";
const EXPIRACION_MS = 8 * 60 * 60 * 1000; // 8 horas

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verificarPassword(password: string, passwordHash: string): boolean {
  const [salt, hashGuardado] = passwordHash.split(":");
  const hashIntento = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hashGuardado), Buffer.from(hashIntento));
}

interface Payload {
  id: number;
  rol: string;
  exp: number;
}

function firmar(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function generarToken(id: number, rol: string): string {
  const payload: Payload = { id, rol, exp: Date.now() + EXPIRACION_MS };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const firma = firmar(payloadBase64);
  return `${payloadBase64}.${firma}`;
}

export function verificarToken(token: string): Payload | null {
  const [payloadBase64, firma] = token.split(".");
  if (!payloadBase64 || !firma) return null;
  if (firmar(payloadBase64) !== firma) return null;

  const payload: Payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString());
  if (payload.exp < Date.now()) return null;
  return payload;
}