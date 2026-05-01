import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  acento: '#00c48c',
  btn: '#004733',
  fondo: '#F0F4F2',
  texto: '#2B2B2B',
  muted: '#4a6b60',
  lbg: '#E6FAF3',
  border: '#D9D9D9',
  white: '#ffffff',
}

const TIPO_LABEL = {
  trabajo: 'Trabajo',
  practica: 'Práctica',
  cierre: 'Cierre',
  presentacion: 'Presentación',
}

export default function Biblioteca({ user, onVerFicha, onNueva, onInicio }) {
  const [fichas, setFichas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)

  useEffect(() => {
    async function cargar() {
      const { data, error } = await supabase
        .from('fichas')
        .select('id, created_at, titulo, area, grado, bloque, tipo_ficha')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) setError('No se pudieron cargar las fichas.')
      else setFichas(data)
      setLoading(false)
    }
    cargar()
  }, [user.id])

  async function eliminar(id) {
    await supabase.from('fichas').delete().eq('id', id)
    setFichas(f => f.filter(x => x.id !== id))
    setConfirmandoId(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.fondo, fontFamily: 'Lexend, sans-serif' }}>
      {/* Nav */}
      <div style={{ background: C.btn, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span onClick={onInicio} style={{ color: '#fff', fontWeight: 800, fontSize: 18, cursor: 'pointer', letterSpacing: '-0.5px' }}>tiza.</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
          )}
          <button
            onClick={onNueva}
            style={{ fontSize: 13, fontWeight: 700, padding: '9px 22px', borderRadius: 9, border: 'none', background: C.acento, color: C.btn, cursor: 'pointer' }}
          >
            Nueva ficha ✦
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: C.texto, margin: '0 0 8px' }}>Mis fichas</h1>
        <p style={{ color: C.muted, fontSize: '0.9rem', margin: '0 0 32px' }}>
          {user.user_metadata?.full_name || user.email}
        </p>

        {loading && (
          <p style={{ color: C.muted, textAlign: 'center', padding: '60px 0' }}>Cargando fichas...</p>
        )}

        {error && (
          <p style={{ color: '#e53e3e', textAlign: 'center', padding: '60px 0' }}>{error}</p>
        )}

        {!loading && !error && fichas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: C.muted, marginBottom: 24 }}>Todavía no guardaste ninguna ficha.</p>
            <button
              onClick={onNueva}
              style={{ background: C.acento, color: C.btn, border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Generar mi primera ficha
            </button>
          </div>
        )}

        {!loading && fichas.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fichas.map(f => (
              <div key={f.id} style={{
                background: C.white,
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: C.texto, fontSize: '0.95rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.titulo}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: C.muted }}>
                    {f.grado}° · {f.area} · {TIPO_LABEL[f.tipo_ficha] || f.tipo_ficha}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => onVerFicha(f.id)}
                    style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 7, border: `1px solid ${C.acento}`, background: C.lbg, color: C.btn, cursor: 'pointer', fontWeight: 600 }}
                  >
                    Ver
                  </button>
                  {confirmandoId === f.id ? (
                    <>
                      <button
                        onClick={() => eliminar(f.id)}
                        style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 7, border: '1px solid #fed7d7', background: '#c53030', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmandoId(null)}
                        style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.white, color: C.muted, cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmandoId(f.id)}
                      style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: 7, border: '1px solid #fed7d7', background: '#fff5f5', color: '#c53030', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
