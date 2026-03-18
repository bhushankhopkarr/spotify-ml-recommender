import { useEffect } from "react";
import { useRouter } from "next/router";
import ClusterPage from "../src/pages/ClusterPage";
import useAuthUser from "../src/hooks/useAuthUser";

export default function ClustersRoutePage() {
  const router = useRouter();
  const { userId, ready } = useAuthUser();

  useEffect(() => {
    if (ready && !userId) {
      router.replace("/");
    }
  }, [ready, userId, router]);

  if (!ready) return null;
  if (!userId) return null;

  return <ClusterPage userId={userId} />;
}
