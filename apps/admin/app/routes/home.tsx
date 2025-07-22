import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// SPAモードでのclientLoaderの例
export async function clientLoader() {
  console.log("clientLoader executed");
  
  // クライアントサイドでのデータ取得処理
  // 実際の実装では、APIを呼び出してデータを取得
  return {
    timestamp: new Date().toISOString(),
  };
}

export default function Home() {
  return <Welcome />;
}
