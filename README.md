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
├── packages/         # 共有パッケージ（今後追加可能）
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

## 🤝 貢献

プルリクエストや課題の報告を歓迎します！

## 📄 ライセンス

ISC