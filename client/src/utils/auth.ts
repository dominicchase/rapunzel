// src/utils/auth.ts

const baseURL = import.meta.env.BASE_URL;

export const setAuthData = (
  accessToken: string,
  refreshToken: string,
  userId: string
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("userId", userId);
};

export const authData = {
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  userId: localStorage.getItem("userId"),
};

export const getAccessToken = (): string | null =>
  localStorage.getItem("accessToken");
export const getRefreshToken = (): string | null =>
  localStorage.getItem("refreshToken");
export const getUserId = (): string | null => localStorage.getItem("userId");

export const removeAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp < Date.now() / 1000;
};

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${baseURL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data: RefreshResponse = await response.json();
      setAuthData(data.accessToken, data.refreshToken, getUserId()!);
      return true;
    } else {
      removeAuthData();
      return false;
    }
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    removeAuthData();
    return false;
  }
};
