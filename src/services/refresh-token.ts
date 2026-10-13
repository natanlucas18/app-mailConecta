import { BackendLoginResponse } from "../types/backend-login-response";

export async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh token inválido");

    const data = (await res.json()) as BackendLoginResponse;

    return {
      ...token,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken ?? token.refreshToken,
      accessTokenExpiresAt: Date.now() + Number(data.data.expiresIn) * 1000,
      error: null,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
