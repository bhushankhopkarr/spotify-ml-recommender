import Recommendations from "../src/pages/Recommendations";

const DEFAULT_USER_ID = "offline-user";

export default function RecommendationsPage() {
  return <Recommendations userId={DEFAULT_USER_ID} />;
}
