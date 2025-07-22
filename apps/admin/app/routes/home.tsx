import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { client } from "../lib/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Admin Dashboard powered by Hono RPC" },
  ];
}

// SPAモードでのclientLoaderの例
export async function clientLoader() {
  console.log("clientLoader executed");

  try {
    // Hono RPC を使った型安全な API 呼び出し
    const [healthRes, usersRes, statsRes] = await Promise.all([
      client.api.health.$get(),
      client.api.users.$get(),
      client.api.stats.$get(),
    ]);

    if (!healthRes.ok || !usersRes.ok || !statsRes.ok) {
      throw new Error("API request failed");
    }

    const health = await healthRes.json();
    const users = await usersRes.json();
    const stats = await statsRes.json();

    return {
      health,
      users,
      stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: "Failed to fetch data",
      timestamp: new Date().toISOString(),
    };
  }
}

export default function Home() {
  const data = useLoaderData<typeof clientLoader>();

  if ("error" in data) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <h1>エラー</h1>
        <p>{data.error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>

      {/* API ヘルスチェック */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f0f9ff",
          borderRadius: "8px",
          border: "1px solid #e0f2fe",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>
          API Status
        </h2>
        <p
          style={{
            margin: 0,
            color: data.health.status === "ok" ? "green" : "red",
          }}
        >
          Status: <strong>{data.health.status}</strong>
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
          Last checked:{" "}
          {new Date(data.health.timestamp).toLocaleString("ja-JP")}
        </p>
      </div>

      {/* 統計情報 */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f0fdf4",
          borderRadius: "8px",
          border: "1px solid #d1fae5",
        }}
      >
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>統計情報</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              総ユーザー数
            </p>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {data.stats.stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              アクティブユーザー
            </p>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {data.stats.stats.activeUsers.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              総投稿数
            </p>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {data.stats.stats.totalPosts.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              今日の投稿数
            </p>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
              {data.stats.stats.todayPosts.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ユーザー一覧 */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#fefce8",
          borderRadius: "8px",
          border: "1px solid #fef08a",
        }}
      >
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>
          ユーザー一覧 ({data.users.total}名)
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "0.5rem", textAlign: "left" }}>ID</th>
              <th style={{ padding: "0.5rem", textAlign: "left" }}>名前</th>
              <th style={{ padding: "0.5rem", textAlign: "left" }}>メール</th>
              <th style={{ padding: "0.5rem", textAlign: "left" }}>ロール</th>
            </tr>
          </thead>
          <tbody>
            {data.users.users.map(
              (user: {
                id: number;
                name: string;
                email: string;
                role: string;
              }) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "0.5rem" }}>{user.id}</td>
                  <td style={{ padding: "0.5rem" }}>{user.name}</td>
                  <td style={{ padding: "0.5rem" }}>{user.email}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        background:
                          user.role === "admin" ? "#dc2626" : "#3b82f6",
                        color: "white",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.875rem", color: "#666" }}>
        データ取得時刻: {new Date(data.timestamp).toLocaleString("ja-JP")}
      </p>
    </div>
  );
}
