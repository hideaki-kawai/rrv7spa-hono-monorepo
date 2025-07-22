# @rrv7-spa-hono-monorepo/api-client

共有APIクライアントパッケージ。Hono RPCを使用した型安全なAPI呼び出しを提供します。

## インストール

```bash
pnpm add @rrv7-spa-hono-monorepo/api-client@workspace:^
```

## 使用方法

### 基本的な使い方

```typescript
import { client } from "@rrv7-spa-hono-monorepo/api-client";

// APIを呼び出す
const response = await client.api.users.$get();
const users = await response.json();
```

### カスタムベースURLを使用

```typescript
import { createApiClient } from "@rrv7-spa-hono-monorepo/api-client";

// カスタムURLでクライアントを作成
const customClient = createApiClient("https://api.example.com");
```

### React Router v7での使用例

```typescript
import { client } from "@rrv7-spa-hono-monorepo/api-client";

export async function clientLoader() {
  const response = await client.api.health.$get();
  const data = await response.json();
  return { data };
}
```

## 環境ごとの設定

デフォルトでは `http://localhost:5174` に接続します。

本番環境では、アプリケーション側で明示的にURLを設定してください：

```typescript
// 例: 環境変数を使用
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5174";
const client = createApiClient(apiUrl);
```

## 特徴

- ✅ 型安全なAPI呼び出し
- ✅ 自動的な環境判定（開発/本番）
- ✅ 複数のフロントエンドアプリケーション間で共有可能
- ✅ Hono RPCによる自動型推論