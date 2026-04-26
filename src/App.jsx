import { useState } from 'react'
import Landing from './components/Landing.jsx'
import Generador from './components/Generador.jsx'
import FichaTrabajo from './components/FichaTrabajo.jsx'
import DevTestFichas from './components/DevTestFichas.jsx'
import OnboardingModal from './components/OnboardingModal.jsx'
import Biblioteca from './components/Biblioteca.jsx'
import { useAuth } from './hooks/useAuth.js'
import { supabase } from './lib/supabase.js'

export default function App() {
  const [vista, setVista] = useState('landing')
  const [fichaData, setFichaData] = useState(null)
  const [registroData, setRegistroData] = useState(null)
  const [validacionData, setValidacionData] = useState(null)
  const { user, loading, loginConGoogle, logout } = useAuth()

  if (new URLSearchParams(window.location.search).get("dev") === "fichas") {
    return <DevTestFichas />;
  }

  if (vista === 'generador') {
    return (
      <Generador
        onFichaGenerada={(ficha, registro, validacion) => {
          setFichaData(ficha)
          setRegistroData(registro)
          setValidacionData(validacion)
          setVista('ficha')
        }}
        onVolver={() => setVista('landing')}
      />
    )
  }

  if (vista === 'ficha') {
    return (
      <FichaTrabajo
        ficha={fichaData}
        registro={registroData}
        validacion={validacionData}
        user={user}
        onNueva={() => setVista('generador')}
        onInicio={() => setVista('landing')}
      />
    )
  }

  if (vista === 'biblioteca') {
    return (
      <Biblioteca
        user={user}
        onVerFicha={async (id) => {
          const { data } = await supabase
            .from('fichas')
            .select('ficha_data, registro_data')
            .eq('id', id)
            .single()
          if (data) {
            setFichaData(data.ficha_data)
            setRegistroData(data.registro_data)
            setValidacionData(null)
            setVista('ficha')
          }
        }}
        onNueva={() => setVista('generador')}
        onInicio={() => setVista('landing')}
      />
    )
  }

  return (
    <>
      <OnboardingModal onEmpezar={() => setVista('generador')} />
      <Landing
        onEmpezar={() => setVista('generador')}
        user={user}
        onLogin={loginConGoogle}
        onLogout={logout}
        onBiblioteca={() => setVista('biblioteca')}
      />
    </>
  )
}
