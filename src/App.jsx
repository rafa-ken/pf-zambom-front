import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import InvestorsForm from "./components/InvestorsForm";
import TripsForm from "./components/TripsForm";
import TripsTable from "./components/TripsTable";

const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [trips, setTrips] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          if (token) {
            const payload = jwtDecode(token);
            const perms = payload.permissions || [];
            const roles = payload.roles || payload.role || [];
            let admin = false;
            if (Array.isArray(perms) && (perms.includes("delete:trip") || perms.includes("delete:investor"))) admin = true;
            if (Array.isArray(roles) && roles.some(r => String(r).toLowerCase() === "admin")) admin = true;
            for (const k of Object.keys(payload)) {
              if (k.endsWith("/roles")) {
                const v = payload[k];
                if (Array.isArray(v) && v.some(x => String(x).toLowerCase() === "admin")) admin = true;
              }
            }
            setIsAdmin(admin);
          }
        } catch (e) {
          console.warn("Erro ao obter token para determinar admin:", e);
          setIsAdmin(false);
        }
      })();
      fetchTrips();
    } else {
      setTrips([]);
      setIsAdmin(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function fetchTrips() {
    setLoadingTrips(true);
    try {
      const token = isAuthenticated ? await getAccessTokenSilently() : null;
      const res = await fetch(`${BACKEND}/trips`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        console.error("Erro fetch trips", await res.text());
        setTrips([]);
      } else {
        const data = await res.json();
        setTrips(data || []);
      }
    } catch (e) {
      console.error(e);
      setTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  }

  async function handleDeleteTrip(id) {
    if (!isAdmin) {
      alert("Apenas administradores podem excluir.");
      return;
    }
    if (!confirm("Deseja realmente excluir essa viagem?")) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${BACKEND}/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTrips(trips.filter(t => (t._id || t.id) !== id));
      } else {
        const txt = await res.text();
        alert("Erro ao excluir: " + txt);
      }
    } catch (e) {
      alert("Erro ao excluir: " + e.message);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", fontFamily: "Inter, Roboto, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>PF Zambom — Frontend</h2>
        <div>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()}>Login</button>
          ) : (
            <>
              <span style={{ marginRight: 12 }}>Olá, {user?.name || user?.email}</span>
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
            </>
          )}
        </div>
      </header>

      <section style={{ marginTop: 20 }}>
        <h3>Investidores</h3>
        <p>Cadastre investidores (qualquer usuário autenticado pode cadastrar e listar).</p>
        <InvestorsForm backend={BACKEND} getAccessToken={getAccessTokenSilently} />
      </section>

      <hr style={{ margin: "24px 0" }} />

      <section>
        <h3>Viagens</h3>
        <p>Cadastre viagens e veja a lista abaixo. Apenas admins veem o botão de excluir.</p>
        <TripsForm backend={BACKEND} getAccessToken={getAccessTokenSilently} onCreated={fetchTrips} />
        <TripsTable trips={trips} loading={loadingTrips} onRefresh={fetchTrips} onDelete={handleDeleteTrip} isAdmin={isAdmin} />
      </section>
    </div>
  );
}

export default App;
