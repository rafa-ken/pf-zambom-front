import React, { useState } from "react";

export default function InvestorsForm({ backend, getAccessToken }) {
  const [form, setForm] = useState({ name: "", corretora: "", valor_investido: "", perfil: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${backend}/investors`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        alert("Erro: " + txt);
      } else {
        alert("Investidor criado!");
        setForm({ name: "", corretora: "", valor_investido: "", perfil: "" });
      }
    } catch (e) {
      alert("Erro: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(4, 1fr)", alignItems: "end" }}>
      <div>
        <label>Nome</label><br/>
        <input name="name" value={form.name} onChange={onChange} required />
      </div>
      <div>
        <label>Corretora</label><br/>
        <input name="corretora" value={form.corretora} onChange={onChange} required />
      </div>
      <div>
        <label>Valor Investido</label><br/>
        <input name="valor_investido" value={form.valor_investido} onChange={onChange} required />
      </div>
      <div>
        <label>Perfil</label><br/>
        <input name="perfil" value={form.perfil} onChange={onChange} required />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <button type="submit" disabled={busy}>Cadastrar Investidor</button>
      </div>
    </form>
  );
}
