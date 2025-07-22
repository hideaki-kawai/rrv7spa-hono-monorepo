import { unstable_createContext } from "react-router";

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export const userContext = unstable_createContext<AppUser | null>();

// クライアントミドルウェアはnext関数を受け取る形式に変更
export const authMiddleware = async (
  { context }: { context: any },
  next: () => Promise<void>
) => {
  console.log("[Client Middleware] test");
  // SPAモードではクライアントサイドでの認証チェック
  // 実際の実装では、localStorageやsessionStorageから認証情報を取得
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  if (token) {
    // トークンが存在する場合、ユーザー情報を設定
    // 実際の実装では、APIを呼び出してユーザー情報を取得
    const user: AppUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    };
    context.set(userContext, user);
  } else {
    context.set(userContext, null);
  }

  // 次のミドルウェアまたはローダーを呼び出す
  await next();
};
