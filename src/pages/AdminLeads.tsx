import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchLeads, UnauthorizedError, type Lead } from "@/lib/api";

const CSV_COLS: (keyof Lead)[] = [
  "id", "created_at", "first_name", "last_name", "email", "phone", "country",
  "programme_title", "programme", "qualification", "intake", "message",
  "consent", "source", "ip",
];

const fmtDate = (utc: string) => {
  if (!utc) return "—";
  const d = new Date(utc.replace(" ", "T") + "Z");
  return isNaN(d.getTime())
    ? utc
    : d.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const downloadCsv = (leads: Lead[]) => {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [CSV_COLS.join(","), ...leads.map((l) => CSV_COLS.map((c) => esc(l[c])).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "uecampus-enquiries.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const AdminLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLeads(await fetchLeads());
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load leads");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminLayout
      title="Enquiries"
      subtitle={
        loading ? "Loading…" : `${leads.length} ${leads.length === 1 ? "enquiry" : "enquiries"} captured`
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
            onClick={() => downloadCsv(leads)}
            disabled={!leads.length}
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
          ) : leads.length === 0 ? (
            <div className="py-20 text-center text-ink-mute text-[14px]">
              No enquiries yet. Submissions from the Enquire&nbsp;Now form will appear here.
            </div>
          ) : (
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-paper-soft text-left">
                  {["#", "Received", "Name", "Email", "Phone", "Country", "Programme", "Qualification", "Intake", "Message", "Consent", "Source"].map((h) => (
                    <th key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute font-semibold px-3.5 py-3 border-b border-rule whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-rule last:border-b-0 hover:bg-paper-soft/60 align-top">
                    <td className="px-3.5 py-3 text-ink-mute">{l.id}</td>
                    <td className="px-3.5 py-3 text-ink-mute whitespace-nowrap">{fmtDate(l.created_at)}</td>
                    <td className="px-3.5 py-3 font-medium">{`${l.first_name ?? ""} ${l.last_name ?? ""}`.trim() || "—"}</td>
                    <td className="px-3.5 py-3"><a href={`mailto:${l.email}`} className="text-plum hover:underline">{l.email || "—"}</a></td>
                    <td className="px-3.5 py-3">{l.phone || "—"}</td>
                    <td className="px-3.5 py-3">{l.country || "—"}</td>
                    <td className="px-3.5 py-3">
                      {(l.programme_title || l.programme)
                        ? <span className="inline-block bg-plum-paper text-plum px-2.5 py-0.5 rounded-full text-[12px]">{l.programme_title || l.programme}</span>
                        : "—"}
                    </td>
                    <td className="px-3.5 py-3">{l.qualification || "—"}</td>
                    <td className="px-3.5 py-3">{l.intake || "—"}</td>
                    <td className="px-3.5 py-3 max-w-[280px] whitespace-pre-wrap">{l.message || <span className="text-ink-mute">—</span>}</td>
                    <td className="px-3.5 py-3">{Number(l.consent) ? <span className="text-emerald-700 font-medium">Yes</span> : <span className="text-ember">No</span>}</td>
                    <td className="px-3.5 py-3 text-ink-mute">{l.source || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
