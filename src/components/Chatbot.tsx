import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { buildIndex, formatAnswer, searchFAQ, type FaqIndex, type QuickReplies } from "@/chatbot/engine";
import logo from "@/assets/uecampus-logo.png";
import { useContent } from "@/cms/useContent";

type Msg = { role: "user" | "bot"; text?: string; html?: string; suggestions?: string[] };

type ChatCopy = ReturnType<typeof useContent<"overlays">>["chat"];

// Every message and the whole FAQ knowledge base come from the CMS "overlays"
// entry (src/cms/defaults/overlays.ts holds the defaults; /admin/pages/overlays
// edits them). The search index is rebuilt whenever the FAQ list changes.
function respond(query: string, chat: ChatCopy, index: FaqIndex, replies: QuickReplies): Msg {
  const results = searchFAQ(query, index, replies);

  if (results.length === 0) {
    return { role: "bot", html: chat.noAnswer, suggestions: chat.noAnswerSuggestions };
  }

  const best = results[0];
  if (best.score >= 0.25) {
    const related = results.slice(1, 4).map((r) => r.faq.question).filter(Boolean);
    return { role: "bot", html: formatAnswer(best.faq.answer), suggestions: related };
  }

  const guesses = results.slice(0, 4).map((r) => r.faq.question).filter(Boolean);
  return { role: "bot", html: chat.unsure, suggestions: guesses };
}

const Chatbot = () => {
  const { chat } = useContent("overlays");
  const index = useMemo(
    () => buildIndex(chat.faqs.map((f, i) => ({ id: i + 1, ...f }))),
    [chat.faqs],
  );
  const replies = useMemo<QuickReplies>(
    () => ({ greeting: chat.greeting, thanks: chat.thanks, goodbye: chat.goodbye }),
    [chat.greeting, chat.thanks, chat.goodbye],
  );

  const [open, setOpen] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const openChat = () => {
    setOpen(true);
    if (!welcomed) {
      setWelcomed(true);
      setMessages([{ role: "bot", html: chat.welcome, suggestions: chat.welcomeSuggestions }]);
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = respond(text, chat, index, replies);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, reply]);
    }, 550);
  };

  return (
    <>
      <style>{`
        .chat-html ul { list-style: disc; padding-left: 1.1rem; margin: 0.4rem 0; }
        .chat-html ol { list-style: decimal; padding-left: 1.2rem; margin: 0.4rem 0; }
        .chat-html li { margin: 0.15rem 0; }
        .chat-html h4 { font-weight: 600; margin: 0.55rem 0 0.2rem; font-size: 0.95em; }
        .chat-html p { margin: 0.3rem 0; }
        .chat-html a { color: hsl(var(--plum)); text-decoration: underline; }
        .chat-html .fee { font-weight: 600; color: hsl(var(--plum)); }
        .chat-html .duration { color: hsl(var(--ink-mute)); font-size: 0.85em; }
        .chat-dot { width: 6px; height: 6px; border-radius: 9999px; background: hsl(var(--ink-mute)); display: inline-block; animation: chatBlink 1.2s infinite ease-in-out; }
        .chat-dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes chatBlink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
      `}</style>

      {/* Launcher */}
      {!open && (
        <button
          onClick={openChat}
          aria-label={chat.launcher || "Chat with us"}
          className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 bg-aubergine text-white pl-3 pr-5 py-3 shadow-pill transition-smooth hover:bg-plum"
        >
          <span className="h-9 w-9 rounded-full bg-white text-aubergine flex items-center justify-center">
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
          </span>
          {chat.launcher && (
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]">{chat.launcher}</span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[min(92vw,380px)] h-[min(80vh,560px)] bg-paper border border-rule shadow-pill rounded-lg overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between bg-aubergine text-white px-4 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="bg-white rounded-md px-2 py-1.5 flex items-center">
                <img src={logo} alt="UeCampus" className="h-5 w-auto" />
              </span>
              <div>
                <p className="font-serif text-[15px] leading-none">{chat.title}</p>
                {chat.status && (
                  <p className="text-[11px] text-white/70 mt-1.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                    {chat.status}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-snap"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-paper-soft">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] bg-aubergine text-white text-[14px] leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-br-sm break-words">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col items-start gap-2">
                  <div
                    className="chat-html max-w-[88%] bg-white border border-rule text-ink text-[14px] leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-bl-sm break-words"
                    dangerouslySetInnerHTML={{ __html: m.html || "" }}
                  />
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-col items-start gap-1.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-left text-[13px] text-plum border border-plum/30 hover:bg-plum/5 rounded-full px-3 py-1.5 transition-snap"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            {typing && (
              <div className="flex items-center gap-1 bg-white border border-rule w-fit px-3 py-3 rounded-2xl rounded-bl-sm">
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-rule px-3 py-3 bg-paper shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chat.placeholder}
              className="flex-1 bg-transparent outline-none text-[14px] text-ink placeholder:text-ink-mute py-1"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim()}
              className="h-9 w-9 rounded-full bg-aubergine text-white flex items-center justify-center transition-snap hover:bg-plum disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
