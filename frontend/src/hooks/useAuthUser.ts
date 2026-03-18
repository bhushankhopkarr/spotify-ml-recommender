import { useEffect, useState } from "react";

export default function useAuthUser() {
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("user_id");

    if (idFromUrl) {
      sessionStorage.setItem("spotify_user_id", idFromUrl);
      setUserId(idFromUrl);

      const url = new URL(window.location.href);
      url.searchParams.delete("user_id");
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState({}, "", nextUrl);
    } else {
      setUserId(sessionStorage.getItem("spotify_user_id") || null);
    }

    setReady(true);
  }, []);

  const logout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("spotify_user_id");
    }
    setUserId(null);
  };

  return { userId, ready, logout, setUserId };
}
