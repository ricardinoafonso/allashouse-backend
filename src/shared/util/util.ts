import { compare, hash } from "bcrypt";
import { verify, sign } from "jsonwebtoken";
import { z } from "zod";
const { KEY_JWT } = process.env;

export async function passwordCompare(
  pass: string,
  password?: string
): Promise<boolean> {
  return compare(`${pass}`, `${password}`);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 8);
}

export async function token(params: string) {
  return sign({}, `${KEY_JWT}`, {
    expiresIn: "7days",
    algorithm: "HS256",
    subject: params,
  });
}

export function verify_token(token: string) :any {
  return verify(token, `${KEY_JWT}`);
}

export function token_refresh(params: string) {
  return sign({}, `${KEY_JWT}`, {
    expiresIn: "30days",
    algorithm: "HS256",
    subject: params,
  });
}

export function userParserData() {
  return z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    adress: z.string(),
    contact: z.string().min(9).max(9)
  });
}

export function parseId(id_: string) {
  const parserIdZod = z.object({
    id: z.string(),
  });
  const { id } = parserIdZod.parse({ id: id_ });
  return id;
}
