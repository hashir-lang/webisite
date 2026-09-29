import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SignInPopup from "@/components/SignInPopup.tsx";
import { ContentProvider } from "@/cms/ContentProvider";
// Public, indexable routes are imported eagerly so the prerendered HTML
// hydrates without a loading flash.
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Programmes from "./pages/Programmes.tsx";
import Fees from "./pages/Fees.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import Courses from "./pages/Courses.tsx";
import Scholarship from "./pages/Scholarship.tsx";
import Contact from "./pages/Contact.tsx";
import Apply from "./pages/Apply.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import Partners from "./pages/Partners.tsx";
import PartnerDetail from "./pages/PartnerDetail.tsx";
import FAQs from "./pages/FAQs.tsx";
// Our Team page is hidden — see the commented-out /team route below.
// import Team from "./pages/Team.tsx";
import NotFound from "./pages/NotFound.tsx";

// The admin console (and its heavy table/chart dependencies) is never
// prerendered or indexed, so it is code-split into its own lazy chunk and
// kept out of the main bundle that public visitors download.
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminLeads = lazy(() => import("./pages/AdminLeads.tsx"));
const AdminSignins = lazy(() => import("./pages/AdminSignins.tsx"));
const AdminContact = lazy(() => import("./pages/AdminContact.tsx"));
const AdminBlog = lazy(() => import("./pages/AdminBlog.tsx"));
const AdminBlogEditor = lazy(() => import("./pages/AdminBlogEditor.tsx"));
const AdminPages = lazy(() => import("./pages/AdminPages.tsx"));
const AdminPageEditor = lazy(() => import("./pages/AdminPageEditor.tsx"));
const AdminSeo = lazy(() => import("./pages/AdminSeo.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
   {/* CMS copy + SEO overrides, fetched once and laid over the compiled
       defaults — see src/cms/. Wraps everything so <Seo> and every page can
       read it. */}
   <ContentProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SignInPopup />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/programmes/:slug" element={<CourseDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/enquire-now" element={<Apply />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/accreditation-and-partners" element={<Partners />} />
          {/* EIE's canonical partner page lives at this custom URL. */}
          <Route
            path="/program/european-business-school-eie"
            element={<PartnerDetail slug="eie" />}
          />
          {/* Legacy EIE URL — redirect to the canonical /program/… path. */}
          <Route path="/partners/eie" element={<Navigate to="/program/european-business-school-eie" replace />} />
          <Route path="/partners/:slug" element={<PartnerDetail />} />
          <Route path="/faqs" element={<FAQs />} />
          {/* Our Team page hidden — /team now falls through to the 404 route.
              Restore this line, the Team import above, the nav entry in
              Header.tsx and "/team" in scripts/routes.mjs to unhide it. */}
          {/* <Route path="/team" element={<Team />} /> */}
          {/* Admin console — one portal for leads, sign-ins and the blog.
              React UI, PHP JSON backend. Lazy-loaded, never indexed. */}
          <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
          <Route path="/admin" element={<Suspense fallback={null}><AdminLeads /></Suspense>} />
          <Route path="/admin/signins" element={<Suspense fallback={null}><AdminSignins /></Suspense>} />
          <Route path="/admin/contact" element={<Suspense fallback={null}><AdminContact /></Suspense>} />
          <Route path="/admin/blog" element={<Suspense fallback={null}><AdminBlog /></Suspense>} />
          <Route path="/admin/blog/new" element={<Suspense fallback={null}><AdminBlogEditor /></Suspense>} />
          <Route path="/admin/blog/:id" element={<Suspense fallback={null}><AdminBlogEditor /></Suspense>} />
          <Route path="/admin/pages" element={<Suspense fallback={null}><AdminPages /></Suspense>} />
          {/* Splat, not :key — record pages are addressed by their own URL
              path (/admin/pages/programmes/<slug>), which contains a slash. */}
          <Route path="/admin/pages/*" element={<Suspense fallback={null}><AdminPageEditor /></Suspense>} />
          <Route path="/admin/seo" element={<Suspense fallback={null}><AdminSeo /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
   </ContentProvider>
  </QueryClientProvider>
);

export default App;
