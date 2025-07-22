import { hc } from "hono/client";
import type { ApiType } from "@rrv7-spa-hono-monorepo/api";

// API のベース URL を環境に応じて設定
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5174"
  : window.location.origin;

// 型安全な API クライアントを作成
export const client = hc<ApiType>(API_BASE_URL);
