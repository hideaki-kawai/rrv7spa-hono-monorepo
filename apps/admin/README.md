# React Router v7 SPA 管理画面

このディレクトリは、React Router v7をSPAモードで使用した管理画面アプリケーションです。

## 🚀 概要

React Router v7の最新機能を活用したシングルページアプリケーション（SPA）です。サーバーサイドレンダリング（SSR）を無効化し、クライアントサイドでのルーティングとデータ取得に特化しています。

## 📋 技術スタック

- **フレームワーク**: [React Router v7](https://reactrouter.com/) (SPAモード)
- **UI**: React v19
- **スタイリング**: Tailwind CSS v4
- **ビルドツール**: Vite
- **言語**: TypeScript
- **ミドルウェア**: クライアントミドルウェア対応

## 🛠️ セットアップ

```bash
# ルートディレクトリから
pnpm install

# このディレクトリのみの依存関係をインストール
pnpm --filter @rrv7-spa-hono-monorepo/admin install
```

## 📝 開発

### 開発サーバーの起動

```bash
# ルートディレクトリから
pnpm --filter @rrv7-spa-hono-monorepo/admin dev

# または、このディレクトリから
pnpm dev
```

開発サーバーはデフォルトでポート5173で起動します。

### ビルド

```bash
# ルートディレクトリから
pnpm --filter @rrv7-spa-hono-monorepo/admin build

# または、このディレクトリから
pnpm build
```

ビルド成果物は`build/client/`ディレクトリに出力されます。

### 型チェック

```bash
pnpm typecheck
```

## 🏗️ プロジェクト構成

```
admin/
├── app/
│   ├── routes/           # ルートコンポーネント
│   │   └── home.tsx      # ホームページ
│   ├── middleware/       # ミドルウェア
│   │   └── auth.ts       # 認証ミドルウェア
│   ├── welcome/          # コンポーネント
│   ├── entry.client.tsx  # クライアントエントリー
│   ├── entry.server.tsx  # サーバーエントリー（SPAモードでも必要）
│   ├── root.tsx          # ルートレイアウト
│   └── app.css          # グローバルスタイル
├── build/               # ビルド出力ディレクトリ
│   └── client/          # 静的ファイル
├── public/              # 静的アセット
├── react-router.config.ts # React Router設定
├── package.json
├── tsconfig.json
├── tailwind.config.ts   # Tailwind CSS設定
└── vite.config.ts       # Vite設定
```

## 🎨 主な機能

### SPAモード設定

`react-router.config.ts`で`ssr: false`を設定し、SPAモードを有効化しています：

```typescript
export default {
  ssr: false,
  future: {
    unstable_middleware: true,
  },
} satisfies Config;
```

### クライアントミドルウェア

認証などの共通処理をミドルウェアとして実装：

```typescript
// app/middleware/auth.ts
export const authMiddleware = async ({ context }, next) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const user = await fetchUser(token);
    context.set(userContext, user);
  }
  await next();
};
```

### HydrateFallback

初期ロード時の表示を改善：

```typescript
// app/root.tsx
export function HydrateFallback() {
  return <div>Loading...</div>;
}
```

### ClientLoader

クライアントサイドでのデータ取得：

```typescript
// app/routes/home.tsx
export async function clientLoader({ context }) {
  const user = context.get(userContext);
  const data = await fetchData();
  return { user, data };
}
```

## 🎯 開発のヒント

### 新しいルートの追加

1. `app/routes/`ディレクトリに新しいファイルを作成
2. React Routerのファイルベースルーティングに従って命名

```typescript
// app/routes/users.tsx
export default function Users() {
  return <div>ユーザー一覧</div>;
}

export async function clientLoader() {
  const users = await fetch('/api/users').then(r => r.json());
  return { users };
}
```

### 認証保護されたルート

```typescript
// app/routes/admin.tsx
export async function clientLoader({ context }) {
  const user = context.get(userContext);
  if (!user) {
    throw redirect('/login');
  }
  return { user };
}
```

### API通信

```typescript
// app/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5173';

export async function apiClient(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('authToken');
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options?.headers,
    },
  });
}
```

## 🚀 デプロイ

### 静的ホスティング

ビルド後の`build/client/`ディレクトリを静的ホスティングサービスにデプロイします。

#### Netlify

`_redirects`ファイルを`public/`に追加：
```
/* /index.html 200
```

#### Vercel

`vercel.json`を追加：
```json
{
  "routes": [
    { "src": "/[^.]+", "dest": "/", "status": 200 }
  ]
}
```

#### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 環境変数

`.env`ファイルで環境変数を設定：

```bash
VITE_API_URL=https://api.example.com
```

## 🔍 トラブルシューティング

### ルーティングが動作しない

SPAモードでは、すべてのルートを`index.html`に転送する設定が必要です。

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf .react-router build node_modules
pnpm install
pnpm build
```

### 型エラー

```bash
# 型定義を再生成
pnpm typecheck
```

## 📚 参考リンク

- [React Router v7 日本語ドキュメント](https://react-router-docs-ja.techtalk.jp/)
- [React Router SPA ガイド](https://react-router-docs-ja.techtalk.jp/how-to/spa)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)