import { useState } from 'react'

const STORAGE_KEY = 'tiza_onboarding_seen'

const C = {
  acento: '#00c48c',
  btn: '#004733',
  fondo: '#F0F4F2',
  texto: '#2B2B2B',
  muted: '#4a6b60',
  lbg: '#E6FAF3',
  border: '#D9D9D9',
}

const pasos = [
  { num: '1', label: 'Elegís grado, área y contenido' },
  { num: '2', label: 'Claude genera la ficha al instante' },
  { num: '3', label: 'Editás, descargás en PDF o Word, e imprimís' },
  { num: '4', label: 'Guardás tus fichas en la biblioteca (con cuenta)' },
]

export default function OnboardingModal({ onEmpezar }) {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(STORAGE_KEY)
  )

  if (!visible) return null

  function cerrar() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function empezar() {
    cerrar()
    onEmpezar()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.25rem',
        padding: '2rem 2rem 1.75rem',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        position: 'relative',
      }}>
        <button
          onClick={cerrar}
          aria-label="Cerrar"
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.25rem', color: C.muted, lineHeight: 1,
          }}
        >×</button>

        <div style={{
          display: 'inline-block',
          background: C.lbg,
          color: C.btn,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.25rem 0.65rem',
          borderRadius: '0.35rem',
          marginBottom: '0.75rem',
        }}>
          Bienvenido/a a tiza.
        </div>

        <h2 style={{
          fontSize: '1.3rem', fontWeight: 800,
          color: C.texto, margin: '0 0 0.5rem',
          lineHeight: 1.25,
        }}>
          Fichas pedagógicas listas en segundos
        </h2>

        <p style={{
          fontSize: '0.9rem', color: C.muted,
          margin: '0 0 1.5rem', lineHeight: 1.55,
        }}>
          Seleccioná un contenido del Diseño Curricular PBA y la IA genera
          una ficha lista para usar en el aula.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
          {pasos.map(p => (
            <div key={p.num} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '0.4rem',
                background: C.lbg, color: C.btn,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.85rem', flexShrink: 0,
              }}>{p.num}</div>
              <span style={{ fontSize: '0.9rem', color: C.texto }}>{p.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={empezar}
          style={{
            width: '100%',
            background: C.acento,
            color: '#fff',
            border: 'none',
            borderRadius: '0.65rem',
            padding: '0.8rem 1rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '0.65rem',
          }}
        >
          Empezá eligiendo tu grado →
        </button>

        <button
          onClick={cerrar}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: C.muted,
            fontSize: '0.82rem',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          Explorar primero
        </button>
      </div>
    </div>
  )
}
