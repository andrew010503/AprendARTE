import React, { useEffect, useMemo, useState } from 'react';
import '@google/model-viewer/dist/model-viewer.min.js';
import './App.css';

const modulos = [
  {
    titulo: 'Renaissance Art',
    tipo: 'Interactive module',
    progreso: 78,
    detalle: 'Explore artworks, artists, and visual concepts through multimedia resources.',
  },
  {
    titulo: 'Immersive Museums',
    tipo: 'Virtual tour',
    progreso: 46,
    detalle: 'Visit guided rooms with featured pieces and observation prompts.',
  },
  {
    titulo: '3D Simulations',
    tipo: 'Visual lab',
    progreso: 62,
    detalle: 'Manipulate composition, volume, light, and perspective in educational scenes.',
  },
];

const salasMuseo = [
  'Painting Gallery',
  'Classical Sculpture',
  'Multimedia Gallery',
  'Analysis Workshop',
];

const modeloEstatua = '/models/MDL_Statua_Apolo.glb';

function App() {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('inicio');
  const [form, setForm] = useState({ titulo: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);

  const totalPreguntas = useMemo(
    () => cuestionarios.reduce((total, item) => total + (item.preguntas?.length || 0), 0),
    [cuestionarios]
  );

  const cargarCuestionarios = () => {
    setCargando(true);
    fetch('/api/cuestionarios')
      .then((res) => {
        if (!res.ok) throw new Error('The API could not be reached');
        return res.json();
      })
      .then((data) => {
        setCuestionarios(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch(() => {
        setError('The quizzes could not be loaded from the server.');
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarCuestionarios();
  }, []);

  useEffect(() => {
    const viewer = document.querySelector('[data-model-viewer="estatua-apolo"]');
    if (viewer) {
      viewer.setAttribute('src', modeloEstatua);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({ titulo: '', descripcion: '' });
    setEditandoId(null);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError('Complete the quiz title and description.');
      return;
    }

    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `/api/cuestionarios/${editandoId}` : '/api/cuestionarios';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Save failed');
        return res.json();
      })
      .then(() => {
        cargarCuestionarios();
        limpiarFormulario();
      })
      .catch(() => setError('The quiz could not be saved.'));
  };

  const editarCuestionario = (cuestionario) => {
    setForm({
      titulo: cuestionario.titulo || '',
      descripcion: cuestionario.descripcion || '',
    });
    setEditandoId(cuestionario._id);
    setVistaActiva('cuestionarios');
    setError(null);
  };

  const eliminarCuestionario = (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    fetch(`/api/cuestionarios/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        return res.json();
      })
      .then(() => cargarCuestionarios())
      .catch(() => setError('The quiz could not be deleted.'));
  };

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-block">
          <img
            className="brand-logo"
            src={`${process.env.PUBLIC_URL}/models/Logo_AprendARTE.png`}
            alt="Logo AprendARTE"
          />
          <div>
            <p>AprendARTE</p>
          </div>
        </div>

        <nav className="nav-list">
          {[
            ['inicio', 'Home'],
            ['modulos', 'Modules'],
            ['museo', 'Virtual museum'],
            ['cuestionarios', 'Quizzes'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={vistaActiva === id ? 'nav-button active' : 'nav-button'}
              type="button"
              onClick={() => setVistaActiva(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="content-area">
        {vistaActiva === 'inicio' && (
          <section className="dashboard-grid">
            <article
              className="experience-panel"
              style={{ '--inicio-bg': `url(${process.env.PUBLIC_URL}/models/BG.jpg)` }}
            >
              <div className="panel-copy">
                <p className="eyebrow">Digital learning environment</p>
                <h2>Art, multimedia, and interaction in one journey.</h2>
                <p>
                  Explore content, visual pieces and 3D experiences.
                </p>
                <button type="button" onClick={() => setVistaActiva('modulos')}>
                  Explore modules
                </button>
              </div>
              <div className="model-stage" aria-label="3D statue viewer">
                <model-viewer
                  data-model-viewer="estatua-apolo"
                  data-src={modeloEstatua}
                  poster="/logo512.png"
                  alt="3D statue model for AprendARTE"
                  camera-controls
                  auto-rotate
                  auto-rotate-delay="900"
                  rotation-per-second="24deg"
                  shadow-intensity="0.85"
                  exposure="0.9"
                  environment-image="neutral"
                  camera-orbit="35deg 70deg 3m"
                  field-of-view="32deg"
                  interaction-prompt="auto"
                  ar
                >
                  <div className="model-placeholder" slot="poster">
                    <strong>3D statue model</strong>
                    <span>Loading Apollo statue from the 3D gallery</span>
                  </div>
                  <div className="model-error" slot="error">
                    The 3D model was not found at public/models/MDL_Statua_Apolo.glb.
                  </div>
                </model-viewer>
              </div>
            </article>

            <div className="metric-row">
              <article>
                <div>
                  <strong>{modulos.length}</strong>
                  <span>active modules</span>
                </div>
                <img
                  src={`${process.env.PUBLIC_URL}/models/Active_Modules.png`}
                  alt=""
                  aria-hidden="true"
                />
              </article>
              <article>
                <div>
                  <strong>{cuestionarios.length}</strong>
                  <span>quizzes</span>
                </div>
                <img
                  src={`${process.env.PUBLIC_URL}/models/Quizzes.png`}
                  alt=""
                  aria-hidden="true"
                />
              </article>
              <article>
                <div>
                  <strong>{totalPreguntas}</strong>
                  <span>multimedia questions</span>
                </div>
                <img
                  src={`${process.env.PUBLIC_URL}/models/Multimedia_Questions.png`}
                  alt=""
                  aria-hidden="true"
                />
              </article>
            </div>
          </section>
        )}

        {vistaActiva === 'modulos' && (
          <section className="section-stack">
            <div className="section-heading">
              <p className="eyebrow">Learning path</p>
              <h2>Interactive modules</h2>
            </div>
            <div className="module-grid">
              {modulos.map((modulo) => (
                <article className="module-card" key={modulo.titulo}>
                  <span>{modulo.tipo}</span>
                  <h3>{modulo.titulo}</h3>
                  <p>{modulo.detalle}</p>
                  <div className="progress-track">
                    <div style={{ width: `${modulo.progreso}%` }} />
                  </div>
                  <small>{modulo.progreso}% completed</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {vistaActiva === 'museo' && (
          <section className="museum-layout">
            <div className="section-heading">
              <p className="eyebrow">Virtual tour</p>
              <h2>AprendARTE Museum</h2>
            </div>
            <div
              className="museum-map"
              style={{ '--museo-bg': `url(${process.env.PUBLIC_URL}/models/BG_Museo_Virtual.jpg)` }}
            >
              {salasMuseo.map((sala, index) => (
                <button className="room-node" type="button" key={sala}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{sala}</span>
                </button>
              ))}
            </div>
            <article className="feedback-panel">
              <h3>Guided feedback</h3>
              <p>
                Each room can be connected to resources, questions, achievements, and
                comments to strengthen self-directed learning.
              </p>
            </article>
          </section>
        )}

        {vistaActiva === 'cuestionarios' && (
          <section className="quiz-layout">
            <form className="quiz-form" onSubmit={handleSubmit}>
              <div className="section-heading compact">
                <p className="eyebrow">API RESTful</p>
                <h2>{editandoId ? 'Edit quiz' : 'Create quiz'}</h2>
              </div>

              {error && <p className="error-message">{error}</p>}

              <label>
                Title
                <input
                  type="text"
                  name="titulo"
                  placeholder="Ex. Renaissance quiz"
                  value={form.titulo}
                  onChange={handleChange}
                />
              </label>

              <label>
                Description
                <textarea
                  name="descripcion"
                  placeholder="Describe the educational goal of the quiz"
                  value={form.descripcion}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">
                {editandoId ? 'Update quiz' : 'Save quiz'}
              </button>
              {editandoId && (
                <button className="secondary-button" type="button" onClick={limpiarFormulario}>
                  Cancel editing
                </button>
              )}
            </form>

            <div className="quiz-list">
              {cargando ? (
                <p className="empty-state">Loading quizzes...</p>
              ) : cuestionarios.length === 0 ? (
                <p className="empty-state">There are no registered quizzes yet.</p>
              ) : (
                cuestionarios.map((q) => (
                  <article className="quiz-card" key={q._id}>
                    <div>
                      <h3>{q.titulo}</h3>
                      <p>{q.descripcion}</p>
                    </div>
                    <div className="quiz-actions">
                      <button type="button" onClick={() => editarCuestionario(q)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => eliminarCuestionario(q._id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
