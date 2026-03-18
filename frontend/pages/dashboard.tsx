import { useEffect } from "react";
import { useRouter } from "next/router";
import Dashboard from "../src/pages/Dashboard";
import useAuthUser from "../src/hooks/useAuthUser";

export default function DashboardPage() {
  const router = useRouter();
  const { userId, ready, logout } = useAuthUser();

  useEffect(() => {
    if (ready && !userId) {
      router.replace("/");
    }
  }, [ready, userId, router]);

  if (!ready) return null;
  if (!userId) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return <Dashboard userId={userId} onLogout={handleLogout} />;
}
