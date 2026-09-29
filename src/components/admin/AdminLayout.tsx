import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Inbox,
  MessageSquare,
  UserCheck,
  Newspaper,
  FileText,
  Globe,
  LogOut,
  ExternalLink,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { getAdminToken, setAdminToken } from "@/lib/api";

type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

/** Every section of the console. Add a page here and it appears in the sidebar. */
const NAV: NavItem[] = [
  { to: "/admin", label: "Enquiries", icon: Inbox, end: true },
  { to: "/admin/contact", label: "Contact enquiries", icon: MessageSquare },
  { to: "/admin/signins", label: "Sign-ins", icon: UserCheck },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/pages", label: "Pages & content", icon: FileText },
  { to: "/admin/seo", label: "SEO tags", icon: Globe },
];

type AdminLayoutProps = {
  /** Section name — shown in the sidebar rail and the page heading. */
  title: string;
  /** Small line under the heading, e.g. a record count. */
  subtitle?: ReactNode;
  /** Buttons rendered at the top right of the page header. */
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * The shell every admin page renders inside: sidebar navigation, page header,
 * and the shared "must be signed in" guard. One portal, one login, one nav.
 */
const AdminLayout = ({ title, subtitle, actions, children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.title = `${title} · UeCampus CMS`;
  }, [title]);

  // Central auth guard: no token means every section is unreachable anyway.
  useEffect(() => {
    if (!getAdminToken()) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const logout = () => {
    setAdminToken(null);
    navigate("/admin/login", { replace: true });
  };

  const nav = (
    <nav className="flex-1 px-3 py-5 space-y-1">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 px-3 pb-2">
        Manage
      </p>
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setNavOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 text-[14px] rounded-sm transition-snap ${
              isActive
                ? "bg-white/12 text-white font-medium"
                : "text-white/65 hover:text-white hover:bg-white/[0.06]"
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className="px-6 h-[68px] flex items-center border-b border-white/10 shrink-0">
        <NavLink to="/admin" className="font-serif text-[19px] text-white">
          UeCampus <span className="text-white/50">CMS</span>
        </NavLink>
      </div>

      {nav}

      <div className="px-3 pb-5 pt-4 border-t border-white/10 space-y-1 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/55 hover:text-white transition-snap"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" /> View site
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/55 hover:text-white transition-snap"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-paper-soft text-ink">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[232px] bg-aubergine flex-col z-30">
        {sidebarInner}
      </aside>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setNavOpen(false)}
            aria-hidden
          />
          <aside className="relative w-[232px] bg-aubergine flex flex-col">
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
              className="absolute top-5 right-4 text-white/60 hover:text-white transition-snap"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarInner}
          </aside>
        </div>
      )}

      <div className="lg:pl-[232px]">
        <header className="bg-paper border-b border-rule sticky top-0 z-20">
          <div className="px-5 md:px-8 min-h-[68px] py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setNavOpen(true)}
                aria-label="Open navigation"
                className="lg:hidden text-ink-mute hover:text-ink transition-snap"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="font-serif text-[19px] leading-tight truncate">{title}</h1>
                {subtitle && (
                  <p className="text-[12.5px] text-ink-mute truncate mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
          </div>
        </header>

        <main className="px-5 md:px-8 py-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
