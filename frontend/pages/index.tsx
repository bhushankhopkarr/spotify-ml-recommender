import { useEffect } from "react";
import { useRouter } from "next/router";
import Landing from "../src/pages/Landing";
import useAuthUser from "../src/hooks/useAuthUser";

export default function HomePage() {
  const router = useRouter();
  const { userId, ready } = useAuthUser();

  useEffect(() => {
    if (ready && userId) {
      router.replace("/dashboard");
    }
  }, [ready, userId, router]);

  if (!ready) return null;
  if (userId) return null;

  return <Landing />;
}
