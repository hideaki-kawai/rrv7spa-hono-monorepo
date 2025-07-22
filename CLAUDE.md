# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要な注意事項

このリポジトリで作業する際は、必ず以下の点に留意してください：

1. **日本語での対応**: ユーザーへの回答やコメントは日本語で行ってください
2. **モノレポ構造**: このプロジェクトはpnpmとTurborepoを使用したモノレポです
3. **型安全性**: `any`や`unknown`型は絶対に使用しないでください。必ず適切な型定義を行ってください
4. **READMEの参照**: 作業前に必ずREADME.mdを読み、プロジェクトの構造とコマンドを理解してください

## プロジェクト構造

```
apps/
├── api/          # Hono APIサーバー (ポート: 5174)
└── admin/        # React Router v7 SPAアプリケーション (ポート: 5173)
packages/
└── api-client/   # 共有APIクライアント (Hono RPC)
```

## 開発コマンド

### 全体操作
```bash
pnpm dev          # 全アプリケーション起動
pnpm build        # 全アプリケーションビルド
pnpm typecheck    # 全アプリケーション型チェック
pnpm lint         # 全アプリケーションリント
```

### 個別操作
```bash
pnpm dev:api      # APIサーバーのみ起動
pnpm dev:admin    # 管理画面のみ起動
pnpm build:api    # APIサーバーのみビルド
pnpm build:admin  # 管理画面のみビルド
```

## アーキテクチャの重要ポイント

### React Router v7 (SPAモード)
- **設定ファイル**: `apps/admin/react-router.config.ts`
  - `ssr: false` でSPAモード
  - `unstable_middleware: true` でクライアントミドルウェア有効
- **エントリーファイルは不要**: SPA モードでは `entry.client.tsx` や `entry.server.tsx` は使用しない
- **HydrateFallbackは不要**: SPA モードでは不要

### Hono API
- **型エクスポート**: `apps/api/src/index.ts` で `ApiType` をエクスポート
- **ルート定義**: 単一の `routes` 変数にチェーンして定義
- **バリデーション**: zodを使用した型安全なバリデーション

### 型安全なAPI通信 (Hono RPC)
- **共有クライアント**: `packages/api-client` で管理
- **使用方法**: 
  ```typescript
  import { client } from "@rrv7-spa-hono-monorepo/api-client";
  const response = await client.api.users.$get();
  ```
- **型の自動推論**: APIの変更が自動的にフロントエンドの型に反映

### ミドルウェアの注意点
- `apps/admin/app/middleware/auth.ts` の `context` パラメータに `any` 型が使用されている
- React Router の型定義が不足している場合は、適切な型を調査して使用すること

## 開発時の注意事項

1. **相対パスの禁止**: パッケージ間のインポートは必ず `@rrv7-spa-hono-monorepo/*` 形式を使用
2. **ポート番号**: 
   - Admin: 5173
   - API: 5174
3. **環境変数**: 本番環境では明示的にAPI URLを設定する必要がある
4. **404ページ**: `apps/admin/app/routes/$.tsx` がキャッチオールルート

## パッケージ管理

```bash
# ワークスペース全体に追加
pnpm add -D -w <package-name>

# 特定アプリケーションに追加
pnpm --filter @rrv7-spa-hono-monorepo/api add <package-name>
pnpm --filter @rrv7-spa-hono-monorepo/admin add <package-name>
```

## TypeScript設定

- ルートの `tsconfig.json` が共通設定
- 各アプリケーションで継承して使用
- `strict: true` が有効なので、型安全性を保つこと