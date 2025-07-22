import { hc } from "hono/client";
import type { ApiType } from "@rrv7-spa-hono-monorepo/api";

/**
 * API クライアントを作成する関数
 * @param baseUrl - APIのベースURL（省略時は環境に応じて自動設定）
 * @returns 型安全なAPIクライアント
 */
export function createApiClient(baseUrl?: string) {
  // カスタムURLが指定されていればそれを使用
  if (baseUrl) {
    return hc<ApiType>(baseUrl);
  }

  // デフォルトは開発環境のURL
  // 本番環境では環境変数などで明示的に設定することを推奨
  const API_BASE_URL = "http://localhost:5174";
  
  return hc<ApiType>(API_BASE_URL);
}

// デフォルトのクライアントインスタンス
export const client = createApiClient();