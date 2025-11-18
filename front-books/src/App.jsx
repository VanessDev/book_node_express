import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/monapi";

function App() {
  const [token, setToken] = useState(null);
  const [view, setView] = useState("login"); // 'login' | 'register' | 'books'

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setView("books");
    }
  }, []);

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
    setView("login");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Books App</h1>
        {token && (
          <button className="btn btn-secondary" onClick={handleLogout}>
            Se déconnecter
          </button>
        )}
      </header>

      <main className="app-main">
        {!token && view === "login" && (
          <LoginForm
            onSuccess={(tok) => {
              setToken(tok);
              localStorage.setItem("token", tok);
              setView("books");
            }}
            switchToRegister={() => setView("register")}
          />
        )}

        {!token && view === "register" && (
          <RegisterForm switchToLogin={() => setView("login")} />
        )}

        {token && view === "books" && <BooksPage token={token} />}
      </main>
    </div>
  );
}

/* ------------------ FORMULAIRE LOGIN ------------------ */

function LoginForm({ onSuccess, switchToRegister }) {
  const [email, setEmail] = useState("admin@site.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur de connexion");
      }

      const data = await res.json();
      if (!data.token) {
        throw new Error("Token manquant dans la réponse");
      }

      onSuccess(data.token);
    } catch (err) {
      console.error("Erreur fetch login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="small">
        Pas de compte ?
        <button className="link-button" onClick={switchToRegister}>
          S&apos;inscrire
        </button>
      </p>
    </section>
  );
}

/* ------------------ FORMULAIRE REGISTER ------------------ */

function RegisterForm({ switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur à l'inscription");
      }

      setFeedback("Inscription réussie ! Tu peux te connecter.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Erreur fetch register:", err);
      setFeedback(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nom
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {feedback && <p className="info">{feedback}</p>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <p className="small">
        Déjà un compte ?
        <button className="link-button" onClick={switchToLogin}>
          Se connecter
        </button>
      </p>
    </section>
  );
}

/* ------------------ PAGE BOOKS (PROTÉGÉE) ------------------ */

function BooksPage({ token }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchBooks() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || "Erreur lors de la récupération des livres"
        );
      }

      const data = await res.json();
      console.log("Réponse /books :", data);

      // On essaie de trouver le tableau de livres :
      // - soit la réponse est déjà un tableau
      // - soit c'est dans data.data
      // - soit dans data.books
      const booksArray = Array.isArray(data)
        ? data
        : data.data && Array.isArray(data.data)
        ? data.data
        : data.books && Array.isArray(data.books)
        ? data.books
        : [];

      setBooks(booksArray);
    } catch (err) {
      console.error("Erreur fetch books:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      body: JSON.stringify({ title, author, typeId: 1 }), // ou l'ID qui existe en BDD

      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || "Erreur lors de la création du livre"
        );
      }

      setTitle("");
      setAuthor("");
      await fetchBooks();
    } catch (err) {
      console.error("Erreur create book:", err);
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <h2>Mes livres</h2>

      <form className="form form-inline" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Auteur"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button className="btn" type="submit">
          Ajouter
        </button>
      </form>

      {loading && <p>Chargement des livres...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="book-list">
        {Array.isArray(books) &&
          books.map((b) => (
            <li key={b.id} className="book-item">
              <strong>{b.title}</strong>
              {b.author && <span> — {b.author}</span>}
            </li>
          ))}

        {Array.isArray(books) && books.length === 0 && !loading && (
          <p>Aucun livre pour le moment.</p>
        )}
      </ul>
    </section>
  );
}

export default App;
