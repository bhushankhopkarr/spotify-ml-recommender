import Dashboard from "../src/pages/Dashboard";

const DEFAULT_USER_ID = "offline-user";

export default function DashboardPage() {
  return <Dashboard userId={DEFAULT_USER_ID} />;
}
