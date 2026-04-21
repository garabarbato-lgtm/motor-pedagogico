import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Landing from './components/Landing.jsx'
import Generador from './components/Generador.jsx'
import FichaTrabajo from './components/FichaTrabajo.jsx'
import DevTestFichas from './components/DevTestFichas.jsx'

export default function App() {
  const [vista, setVista] = useState('landing')
  const [fichaData, setFichaData] = useState(null)
  const [registroData, setRegistroData] = useState(null)
  const [validacionData, setValidacionData] = useState(null)

  if (new URLSearchParams(window.location.search).get("dev") === "fichas") {
    return (
      <>
        <DevTestFichas />
        <Analytics />
      </>
    );
  }

  if (vista === 'generador') {
    return (
      <>
        <Generador
          onFichaGenerada={(ficha, registro, validacion) => {
            setFichaData(ficha)
            setRegistroData(registro)
            setValidacionData(validacion)
            setVista('ficha')
          }}
          onVolver={() => setVista('landing')}
        />
        <Analytics />
      </>
    )
  }

  if (vista === 'ficha') {
    return (
      <>
        <FichaTrabajo
          ficha={fichaData}
          registro={registroData}
          validacion={validacionData}
          onNueva={() => setVista('generador')}
          onInicio={() => setVista('landing')}
        />
        <Analytics />
      </>
    )
  }

  return (
    <>
      <Landing onEmpezar={() => setVista('generador')} />
      <Analytics />
    </>
  )
}
