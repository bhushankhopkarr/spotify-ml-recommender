// src/components/Nav.js
import { useRouter } from "next/router";

const LINKS = [
  { path: "/dashboard",       label: "Dashboard",    key: "dashboard" },
  { path: "/recommendations", label: "For You",      key: "recommendations" },
  { path: "/mood",            label: "Mood",         key: "mood" },
  { path: "/clusters",        label: "Clusters",     key: "clusters" },
];

type NavProps = {
  userId?: string | null;
  onLogout?: () => void;
  active?: string;
};

export default function Nav({ onLogout, active }: NavProps) {
  const router = useRouter();

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <div className="nav__logo" onClick={() => router.push("/dashboard")} style={{ cursor: "pointer" }}>
          <span className="nav__logo-dot" />
          SoundML
        </div>

        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.key}>
              <button
                className={`nav__link ${active === link.key ? "active" : ""}`}
                onClick={() => router.push(link.path)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {onLogout && (
          <button className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }} onClick={onLogout}>
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
