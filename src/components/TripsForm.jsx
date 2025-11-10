import React, { useState } from "react";

export default function TripsForm({ backend, getAccessToken, onCreated }) {
  const [form, setForm] = useState({ titulo: "", destino: "", data_inicio: "", data_fim: "", preco: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${backend}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        alert("Erro: " + txt);
      } else {
        alert("Viagem criada!");
        setForm({ titulo: "", destino: "", data_inicio: "", data_fim: "", preco: "" });
        if (onCreated) onCreated();
      }
    } catch (e) {
      alert("Erro: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(5, 1fr)", alignItems: "end" }}>
      <div>
        <label>Título</label><br/>
        <input name="titulo" value={form.titulo} onChange={onChange} required />
      </div>
      <div>
        <label>Destino</label><br/>
        <input name="destino" value={form.destino} onChange={onChange} required />
      </div>
      <div>
        <label>Data Início (YYYY-MM-DD)</label><br/>
        <input name="data_inicio" value={form.data_inicio} onChange={onChange} placeholder="2025-01-01" required />
      </div>
      <div>
        <label>Data Fim (YYYY-MM-DD)</label><br/>
        <input name="data_fim" value={form.data_fim} onChange={onChange} placeholder="2025-01-10" required />
      </div>
      <div>
        <label>Preço</label><br/>
        <input name="preco" value={form.preco} onChange={onChange} required />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <button type="submit" disabled={busy}>Cadastrar Viagem</button>
      </div>
    </form>
  );
}
