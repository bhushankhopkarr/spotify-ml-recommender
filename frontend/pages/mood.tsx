import { useEffect } from "react";
import { useRouter } from "next/router";
import MoodPage from "../src/pages/MoodPage";
import useAuthUser from "../src/hooks/useAuthUser";

export default function MoodRoutePage() {
  const router = useRouter();
  const { userId, ready } = useAuthUser();

  useEffect(() => {
    if (ready && !userId) {
      router.replace("/");
    }
  }, [ready, userId, router]);

  if (!ready) return null;
  if (!userId) return null;

  return <MoodPage userId={userId} />;
}
