import { useState } from 'react'
import Landing from '../landing-v6.jsx'
import Generador from './components/Generador.jsx'
import FichaTrabajo from './components/FichaTrabajo.jsx'

export default function App() {
  const [vista, setVista] = useState('landing')
  const [fichaData, setFichaData] = useState(null)
  const [registroData, setRegistroData] = useState(null)
  const [validacionData, setValidacionData] = useState(null)

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
        onNueva={() => setVista('generador')}
        onInicio={() => setVista('landing')}
      />
    )
  }

  return <Landing onEmpezar={() => setVista('generador')} />
}
