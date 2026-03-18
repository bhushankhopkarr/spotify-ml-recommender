import ClusterPage from "../src/pages/ClusterPage";

const DEFAULT_USER_ID = "offline-user";

export default function ClustersRoutePage() {
  return <ClusterPage userId={DEFAULT_USER_ID} />;
}
