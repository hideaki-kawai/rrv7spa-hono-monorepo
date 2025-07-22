# React Router v7 (SPA) + Hono モノレポテンプレート

このリポジトリは、React Router v7（SPAモード）とHonoを使用したモノレポのテンプレートです。

## 🚀 はじめに

このテンプレートを使用すると、フロントエンド（React Router v7 SPA）とバックエンド（Hono）を統合的に管理できるモノレポ環境を素早く構築できます。

## 📋 必要な環境

- Node.js v23.9.0以上
- pnpm v9.7.0以上

## 🛠️ セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd rrv7-spa-hono-monorepo

# 依存関係をインストール
pnpm install
```

## 🏗️ プロジェクト構成

```
.
├── apps/
│   ├── api/          # Hono APIサーバー
│   └── admin/        # React Router v7 SPAアプリケーション
├── packages/         
│   └── api-client/   # 共有APIクライアント
├── .github/
│   ├── workflows/    # GitHub Actions設定
│   └── renovate.json # Renovate設定
├── turbo.json        # Turborepo設定
├── pnpm-workspace.yaml
└── tsconfig.json     # 共通TypeScript設定
```

### apps/api - Hono APIサーバー

Honoを使用した高速なAPIサーバーです。

- **ビルドツール**: Vite（@hono/vite-build）
- **主な機能**: CORS対応、ロギング機能
- **エンドポイント例**: `/`, `/api/health`

### apps/admin - React Router v7 SPAアプリケーション

React Router v7をSPAモードで使用した管理画面アプリケーションです。

- **SPAモード**: `ssr: false`設定
- **クライアントミドルウェア**: 認証処理の実装例付き
- **スタイリング**: Tailwind CSS v4
- **ビルドツール**: Vite

## 📝 開発コマンド

### 全体の操作

```bash
# 開発サーバーを起動（api + admin）
pnpm dev

# ビルド（全アプリケーション）
pnpm build

# 型チェック（全アプリケーション）
pnpm typecheck

# リンター（型チェック）
pnpm lint
```

### 個別アプリケーションの操作

ルートディレクトリから各アプリケーションを個別に操作できます：

#### APIサーバー (Hono)

```bash
# 開発サーバー起動
pnpm dev:api

# ビルド
pnpm build:api

# 本番サーバー起動（ビルド後）
pnpm start:api

# プレビュー（ビルド後の確認）
pnpm preview:api

# 型チェック
pnpm typecheck:api
```

#### 管理画面 (React Router v7)

```bash
# 開発サーバー起動
pnpm dev:admin

# ビルド
pnpm build:admin

# プレビュー（ビルド後の確認）
pnpm preview:admin

# 型チェック
pnpm typecheck:admin
```

## 🔌 フロントエンドからHono APIを呼び出す方法

このプロジェクトでは、Hono RPCを使用した型安全なAPI呼び出しが実装されています。

### 基本的な使い方

#### 1. APIクライアントの使用（共有パッケージから）

```typescript
// packages/api-client から import
import { client } from "@rrv7-spa-hono-monorepo/api-client";

// カスタムURLが必要な場合
import { createApiClient } from "@rrv7-spa-hono-monorepo/api-client";
const customClient = createApiClient("https://api.example.com");
```

#### 2. React Router v7のclientLoaderでの使用例

```typescript
import { client } from "@rrv7-spa-hono-monorepo/api-client";

export async function clientLoader() {
  try {
    // 型安全なAPI呼び出し（自動補完が効きます）
    const [healthRes, usersRes, statsRes] = await Promise.all([
      client.api.health.$get(),
      client.api.users.$get(),
      client.api.stats.$get(),
    ]);

    // レスポンスの確認
    if (!healthRes.ok || !usersRes.ok || !statsRes.ok) {
      throw new Error("API request failed");
    }

    // JSONデータの取得
    const health = await healthRes.json();
    const users = await usersRes.json();
    const stats = await statsRes.json();

    return { health, users, stats };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

#### 3. コンポーネントでのデータ使用

```typescript
import { useLoaderData } from "react-router";

export default function Home() {
  const data = useLoaderData<typeof clientLoader>();
  
  return (
    <div>
      <h1>ユーザー一覧</h1>
      {data.users.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### APIエンドポイントの追加方法

#### 1. Hono側でエンドポイントを追加（`apps/api/src/index.ts`）

```typescript
const routes = app
  .get('/api/posts', (c) => {
    return c.json({ 
      posts: [
        { id: 1, title: "投稿1", content: "内容1" },
        { id: 2, title: "投稿2", content: "内容2" }
      ]
    })
  })
  // 既存のルート...
```

#### 2. フロントエンドから呼び出し

```typescript
// 型補完により、新しいエンドポイントが自動的に利用可能
const postsRes = await client.api.posts.$get();
const posts = await postsRes.json();
```

### 開発時のポート設定

- **Admin（React Router v7）**: http://localhost:5173
- **API（Hono）**: http://localhost:5174

### メリット

- ✅ **型安全**: APIの型定義が自動的にフロントエンドに反映
- ✅ **自動補完**: エンドポイントやレスポンスの型が補完される
- ✅ **リファクタリング**: APIの変更が即座に型エラーとして検出
- ✅ **開発効率**: 手動での型定義が不要

## 📦 パッケージの追加方法

### ワークスペース全体に追加

```bash
# 開発依存関係として追加
pnpm add -D -w <package-name>

# 本番依存関係として追加
pnpm add -w <package-name>
```

### 特定のアプリケーションに追加

```bash
# APIサーバーに追加
pnpm --filter @rrv7-spa-hono-monorepo/api add <package-name>

# 管理画面に追加
pnpm --filter @rrv7-spa-hono-monorepo/admin add <package-name>
```

## 🔧 カスタマイズ

### 新しいアプリケーションの追加

1. `apps/`ディレクトリに新しいアプリケーションを作成
2. `package.json`の`name`フィールドを`@rrv7-spa-hono-monorepo/<app-name>`形式で設定
3. 必要に応じて`tsconfig.json`でルートの設定を継承

### 共有パッケージの作成

1. `packages/`ディレクトリに新しいパッケージを作成
2. 各アプリケーションから`workspace:*`プロトコルで参照

```json
{
  "dependencies": {
    "@rrv7-spa-hono-monorepo/shared": "workspace:*"
  }
}
```

## 🚀 デプロイ

### APIサーバー（Hono）

ビルド後の`apps/api/dist/index.js`をNode.jsが動作する環境にデプロイします。

```bash
# ビルド
pnpm --filter @rrv7-spa-hono-monorepo/api build

# 実行
node apps/api/dist/index.js
```

### 管理画面（React Router v7 SPA）

ビルド後の`apps/admin/build/client/`ディレクトリを静的ホスティングサービスにデプロイします。

```bash
# ビルド
pnpm --filter @rrv7-spa-hono-monorepo/admin build
```

**重要**: SPAモードのため、すべてのURLを`index.html`に転送する設定が必要です。

例（Netlify）:
```
/* /index.html 200
```

## 🔄 自動更新（Renovate）

このリポジトリはRenovateが設定されており、依存関係の自動更新が有効です。

- マイナー・パッチ更新は自動マージ
- メジャー更新は手動レビューが必要
- 更新スケジュール: 平日22時〜5時、週末

## 🧪 CI/CD

GitHub Actionsによる自動テストが設定されています。

- プッシュ/プルリクエスト時に実行
- ビルドと型チェックを実行
- Node.js v23.9.0、pnpm v9.7.0を使用

## 📚 参考リンク

- [React Router v7 ドキュメント（日本語）](https://react-router-docs-ja.techtalk.jp/)
- [Hono ドキュメント](https://hono.dev/)
- [Turborepo ドキュメント](https://turbo.build/)
- [pnpm ドキュメント](https://pnpm.io/)

ISC