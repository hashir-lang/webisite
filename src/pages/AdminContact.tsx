import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, RefreshCw, Loader2, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchContactMessages, UnauthorizedError, type ContactMessage } from "@/lib/api";

const CSV_COLS: (keyof ContactMessage)[] = [
  "id", "created_at", "name", "email", "phone", "subject", "message", "source", "ip",
];

const fmtDate = (utc: string) => {
  if (!utc) return "—";
  const d = new Date(utc.replace(" ", "T") + "Z");
  return isNaN(d.getTime())
    ? utc
    : d.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const downloadCsv = (messages: ContactMessage[]) => {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [CSV_COLS.join(","), ...messages.map((m) => CSV_COLS.map((c) => esc(m[c])).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "uecampus-contact-enquiries.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/** Messages sent from the public /contact-us form (api/contact.php). */
const AdminContact = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setMessages(await fetchContactMessages());
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load contact messages");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminLayout
      title="Contact enquiries"
      subtitle={
        loading ? "Loading…" : `${messages.length} ${messages.length === 1 ? "enquiry" : "enquiries"} received`
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
            onClick={() => downloadCsv(messages)}
            disabled={!messages.length}
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
        ) : messages.length === 0 ? (
          <div className="py-20 text-center text-ink-mute text-[14px]">
            <MessageSquare className="h-6 w-6 mx-auto mb-3 opacity-60" />
            No enquiries yet. Submissions from the Contact&nbsp;Us form will appear here.
          </div>
        ) : (
          <table className="w-full text-[13.5px] border-collapse">
            <thead>
              <tr className="bg-paper-soft text-left">
                {["#", "Received", "Name", "Email", "Phone", "Subject", "Message", "IP"].map((h) => (
                  <th key={h} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute font-semibold px-3.5 py-3 border-b border-rule whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b border-rule last:border-b-0 hover:bg-paper-soft/60 align-top">
                  <td className="px-3.5 py-3 text-ink-mute">{m.id}</td>
                  <td className="px-3.5 py-3 text-ink-mute whitespace-nowrap">{fmtDate(m.created_at)}</td>
                  <td className="px-3.5 py-3 font-medium">{m.name || "—"}</td>
                  <td className="px-3.5 py-3">
                    {m.email
                      ? <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "your message"}`)}`} className="text-plum hover:underline">{m.email}</a>
                      : "—"}
                  </td>
                  <td className="px-3.5 py-3">{m.phone ? <a href={`tel:${m.phone}`} className="text-plum hover:underline">{m.phone}</a> : "—"}</td>
                  <td className="px-3.5 py-3 max-w-[200px]">{m.subject || "—"}</td>
                  <td className="px-3.5 py-3 max-w-[360px] whitespace-pre-wrap">{m.message || <span className="text-ink-mute">—</span>}</td>
                  <td className="px-3.5 py-3 text-ink-mute">{m.ip || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
