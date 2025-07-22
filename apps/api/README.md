# Hono APIサーバー

このディレクトリは、Honoフレームワークを使用したAPIサーバーアプリケーションです。

## 🚀 概要

高速で軽量なWebフレームワークであるHonoを使用して構築されたAPIサーバーです。Viteによるビルドシステムを採用し、開発効率と本番環境でのパフォーマンスを両立しています。

## 📋 技術スタック

- **フレームワーク**: [Hono](https://hono.dev/) - 高速なWebフレームワーク
- **ビルドツール**: Vite + @hono/vite-build
- **開発サーバー**: @hono/vite-dev-server
- **言語**: TypeScript
- **ランタイム**: Node.js

## 🛠️ セットアップ

```bash
# ルートディレクトリから
pnpm install

# このディレクトリのみの依存関係をインストール
pnpm --filter @rrv7-spa-hono-monorepo/api install
```

## 📝 開発

### 開発サーバーの起動

```bash
# ルートディレクトリから
pnpm --filter @rrv7-spa-hono-monorepo/api dev

# または、このディレクトリから
pnpm dev
```

開発サーバーはデフォルトでポート5173で起動します。

### ビルド

```bash
# ルートディレクトリから
pnpm --filter @rrv7-spa-hono-monorepo/api build

# または、このディレクトリから
pnpm build
```

ビルド成果物は`dist/`ディレクトリに出力されます。

### 本番サーバーの起動

```bash
# ビルド後に本番サーバーを起動
# ルートディレクトリから
pnpm --filter @rrv7-spa-hono-monorepo/api start

# または、このディレクトリから
pnpm start
```

### 型チェック

```bash
pnpm typecheck
```

## 🏗️ プロジェクト構成

```
api/
├── src/
│   └── index.ts      # メインエントリーポイント
├── dist/             # ビルド出力ディレクトリ
├── package.json
├── tsconfig.json
└── vite.config.ts    # Vite設定ファイル
```

## 🔧 API構成

### ミドルウェア

- **Logger**: リクエストのロギング
- **CORS**: Cross-Origin Resource Sharing対応

### エンドポイント

#### `GET /`
基本的なヘルスチェックエンドポイント

**レスポンス例**:
```json
{
  "message": "Hello from Hono API!"
}
```

#### `GET /api/health`
詳細なヘルスチェックエンドポイント

**レスポンス例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 開発のヒント

### 新しいエンドポイントの追加

```typescript
// src/index.tsに追加
app.get('/api/users', async (c) => {
  // データベースからユーザー情報を取得
  const users = await fetchUsers();
  return c.json(users);
});

app.post('/api/users', async (c) => {
  const body = await c.req.json();
  // ユーザーを作成
  const newUser = await createUser(body);
  return c.json(newUser, 201);
});
```

### ミドルウェアの追加

```typescript
// 認証ミドルウェアの例
import { bearerAuth } from 'hono/bearer-auth';

app.use('/api/*', bearerAuth({ token: 'your-secret-token' }));
```

### 環境変数の使用

```typescript
// .envファイルから環境変数を読み込む
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
```

## 🚀 デプロイ

### Node.js環境

```bash
# ビルド
pnpm build

# 実行
node dist/index.js
```

### Dockerコンテナ

```dockerfile
FROM node:23.9.0-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/index.js"]
```

### 環境変数

本番環境で設定が必要な環境変数：

- `PORT`: サーバーのポート番号（デフォルト: 3000）
- `NODE_ENV`: 実行環境（production/development）

## 🔍 トラブルシューティング

### ビルドエラーが発生する場合

```bash
# node_modulesとキャッシュをクリア
rm -rf node_modules .turbo
pnpm install
```

### 型エラーが発生する場合

```bash
# TypeScriptの設定を確認
pnpm typecheck
```

## 📚 参考リンク

- [Hono公式ドキュメント](https://hono.dev/)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [@hono/vite-build](https://github.com/honojs/vite-plugins/tree/main/packages/build)