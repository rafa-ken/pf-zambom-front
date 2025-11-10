import React from "react";

export default function TripsTable({ trips, loading, onRefresh, onDelete, isAdmin }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>Lista de Viagens</h4>
        <div>
          <button onClick={onRefresh}>Atualizar</button>
        </div>
      </div>
      {loading ? <p>Carregando...</p> : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%", marginTop: 8 }}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Destino</th>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th>Preço</th>
              {isAdmin && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {(trips && trips.length > 0) ? trips.map((t) => {
              const id = t._id || t.id;
              const dataInicio = (t.data_inicio || t.start_date || "").toString().slice(0,10);
              const dataFim = (t.data_fim || t.end_date || "").toString().slice(0,10);
              return (
                <tr key={id}>
                  <td>{t.titulo || t.title}</td>
                  <td>{t.destino || t.destination}</td>
                  <td>{dataInicio}</td>
                  <td>{dataFim}</td>
                  <td>{t.preco}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => onDelete(id)}>Excluir</button>
                    </td>
                  )}
                </tr>
              );
            }) : (
              <tr><td colSpan={isAdmin ? 6 : 5}>Nenhuma viagem cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
