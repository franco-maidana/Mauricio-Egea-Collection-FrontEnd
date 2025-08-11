import { useNavigate } from 'react-router-dom'
import InicioSession from '../../perfil/InicioSession'
import './LoginModal.css'

export default function LoginModal() {
  const navigate = useNavigate()
  const cerrar = () => navigate(-1)

  return (
    <div className="drawerOverlay" onClick={cerrar}>
      <aside className="drawerPanel" onClick={(e) => e.stopPropagation()}>
        <button className="drawerClose" onClick={cerrar} aria-label="Cerrar">×</button>
        {/* Pasamos la prop para que se cierre solo al loguear */}
        <InicioSession onSuccessClose closeDelayMs={3000} />
      </aside>
    </div>
  )
}
