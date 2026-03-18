import { useEffect } from "react";
import { useRouter } from "next/router";
import Recommendations from "../src/pages/Recommendations";
import useAuthUser from "../src/hooks/useAuthUser";

export default function RecommendationsPage() {
  const router = useRouter();
  const { userId, ready } = useAuthUser();

  useEffect(() => {
    if (ready && !userId) {
      router.replace("/");
    }
  }, [ready, userId, router]);

  if (!ready) return null;
  if (!userId) return null;

  return <Recommendations userId={userId} />;
}
