import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "@/components/Chatbot";
import CookieConsent from "@/components/CookieConsent";
import { useReveal } from "@/hooks/use-reveal";

interface Props {
  children: ReactNode;
  /** Retained for backward compatibility; the closing-remarks CTA banner has been removed. */
  hideCta?: boolean;
}

const PageLayout = ({ children }: Props) => {
  useReveal();
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
      <CookieConsent />
    </div>
  );
};

export default PageLayout;
