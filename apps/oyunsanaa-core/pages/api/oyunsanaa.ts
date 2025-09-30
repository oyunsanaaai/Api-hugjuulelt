import { useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || pending) return;

    setPending(true);
    setReply(null);

    try {
      const r = await fetch("/api/oyunsanaa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg.trim(),
          deep: false,
          age_category: "26-40",
        }),
      });
      const data = await r.json();
      setReply(data.ok ? data.reply : `Алдаа: ${data.error ?? r.statusText}`);
    } catch (err: any) {
      setReply("Сүлжээний алдаа.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Оюунсанаа — Чат (Single-submit)</h2>

      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Асуултаа бич…"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={pending || !msg.trim()}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: pending ? "#aaa" : "#052F5D",
            color: "#fff",
            cursor: pending ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "Илгээж байна…" : "Илгээх"}
        </button>
      </form>

      {reply && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f5f5f5",
            borderRadius: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {reply}
        </div>
      )}
    </main>
  );
}
