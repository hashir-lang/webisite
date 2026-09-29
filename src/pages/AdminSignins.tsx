import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RefreshCw, Loader2, Inbox } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchSignins, UnauthorizedError, type Signin } from "@/lib/api";

const CSV_COLS: (keyof Signin)[] = ["id", "created_at", "name", "email", "phone", "ip"];

const fmtDate = (utc: string) => {
  if (!utc) return "—";
  const d = new Date(utc.replace(" ", "T") + "Z");
  return isNaN(d.getTime())
    ? utc
    : d.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const downloadCsv = (signins: Signin[]) => {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [CSV_COLS.join(","), ...signins.map((s) => CSV_COLS.map((c) => esc(s[c])).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "uecampus-signins.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const AdminSignins = () => {
  const navigate = useNavigate();
  const [signins, setSignins] = useState<Signin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSignins(await fetchSignins());
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load sign-ins");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminLayout
      title="Sign-ins"
      subtitle={
        loading ? "Loading…" : `${signins.length} ${signins.length === 1 ? "sign-in" : "sign-ins"} captured`
      }
      actions={
        <>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => downloadCsv(signins)}
            disabled={!signins.length}
            className="inline-flex items-center gap-2 bg-aubergine text-white px-4 py-2.5 text-[13px] font-medium hover:bg-plum transition-snap disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </>
      }
    >
      {error && (
        <div className="bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-paper border border-rule overflow-x-auto">
          {loading ? (
            <div className="py-20 flex items-center justify-center text-ink-mute">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : signins.length === 0 ? (
            <div className="py-20 text-center text-ink-mute text-[14px]">
              <Inbox className="h-6 w-6 mx-auto mb-3 opacity-60" />
              No sign-ins yet. Details from the welcome popup will appear here.
            </div>
          ) : (
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-paper-soft text-left">
                  {["#", "Received", "Name", "Email", "Phone", "IP"].map((h) => (
                    <th key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute font-semibold px-3.5 py-3 border-b border-rule whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signins.map((s) => (
                  <tr key={s.id} className="border-b border-rule last:border-b-0 hover:bg-paper-soft/60 align-top">
                    <td className="px-3.5 py-3 text-ink-mute">{s.id}</td>
                    <td className="px-3.5 py-3 text-ink-mute whitespace-nowrap">{fmtDate(s.created_at)}</td>
                    <td className="px-3.5 py-3 font-medium">{s.name || "—"}</td>
                    <td className="px-3.5 py-3"><a href={`mailto:${s.email}`} className="text-plum hover:underline">{s.email || "—"}</a></td>
                    <td className="px-3.5 py-3">{s.phone ? <a href={`tel:${s.phone}`} className="text-plum hover:underline">{s.phone}</a> : "—"}</td>
                    <td className="px-3.5 py-3 text-ink-mute">{s.ip || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </AdminLayout>
  );
};

export default AdminSignins;
