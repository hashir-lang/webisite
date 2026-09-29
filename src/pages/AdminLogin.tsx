import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { adminLogin, getAdminToken } from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin sign in · UeCampus";
    if (getAdminToken()) navigate("/admin", { replace: true });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(username.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aubergine text-ink flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 hover:text-white transition-snap mb-6"
        >
          ← UeCampus
        </Link>

        <div className="bg-white border border-rule shadow-card-soft p-9 md:p-10">
          <p className="eyebrow eyebrow-plum">UeCampus CMS</p>
          <h1 className="mt-3 font-serif text-[30px] leading-tight text-ink">
            Admin sign in<span className="text-ember">.</span>
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
            Sign in to view enquiry leads and sign-ups, and to publish to the blog.
          </p>

          {error && (
            <div className="mt-6 bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-7 space-y-5" autoComplete="off">
            <div>
              <label htmlFor="username" className="eyebrow text-ink-mute">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="admin"
                className="mt-2 w-full bg-white border border-rule px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute outline-none focus:border-plum transition-snap"
              />
            </div>
            <div>
              <label htmlFor="password" className="eyebrow text-ink-mute">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-2 w-full bg-white border border-rule px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute outline-none focus:border-plum transition-snap"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 bg-aubergine text-white px-6 py-3.5 text-[13px] font-medium transition-smooth hover:bg-plum disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
