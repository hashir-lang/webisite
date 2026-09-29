import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/447586797014"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 bg-aubergine text-white pl-3 pr-5 py-3 shadow-pill transition-smooth hover:bg-plum"
  >
    <span className="h-9 w-9 rounded-full bg-white text-aubergine flex items-center justify-center">
      <MessageCircle className="h-4 w-4 fill-aubergine" strokeWidth={1.5} />
    </span>
    <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
      Chat with us
    </span>
  </a>
);

export default WhatsAppButton;
