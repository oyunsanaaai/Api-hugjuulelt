import { useState } from "react";
const OY_API = process.env.NEXT_PUBLIC_OY_API || "https://api-hugjuulelt-bice.vercel.app/api/oyunsanaa";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  async function send(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(OY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg, history: [] })
    });
    const { reply: text, error } = await r.json();
    setReply(error ? `Алдаа: ${error}` : (text || "Хариу хоосон байна"));
  }
  return (
    <main style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Оюунсанаа — Чат</h2>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="мэссэжээ бичээд Илгээх" style={{ flex: 1, padding: 10 }} />
        <button type="submit">Илгээх</button>
      </form>
      <div style={{ marginTop: 16, padding: 12, background: "#f6f6f6", whiteSpace: "pre-wrap" }}>{reply}</div>
    </main>
  );
}
