import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { userContext } from "~/middleware/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// SPAモードでのclientLoaderの例
export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  // ミドルウェアで設定されたユーザー情報を取得
  const user = context.get(userContext);
  
  // クライアントサイドでのデータ取得処理
  // 実際の実装では、APIを呼び出してデータを取得
  return {
    user,
    timestamp: new Date().toISOString(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, timestamp } = loaderData;
  
  return (
    <div>
      {user && (
        <div style={{ padding: '1rem', background: '#f0f0f0', marginBottom: '1rem' }}>
          <p>ログイン中: {user.name} ({user.email})</p>
          <p>読み込み時刻: {timestamp}</p>
        </div>
      )}
      <Welcome />
    </div>
  );
}
