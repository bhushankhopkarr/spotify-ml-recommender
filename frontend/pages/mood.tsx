import MoodPage from "../src/pages/MoodPage";

const DEFAULT_USER_ID = "offline-user";

export default function MoodRoutePage() {
  return <MoodPage userId={DEFAULT_USER_ID} />;
}
