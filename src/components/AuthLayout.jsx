import logoDark from '../assets/logo-dark.png'
import logoGold from '../assets/logo-gold.png'

export default function AuthLayout({ titulo, subtitulo, children, pie }) {
  return (
    <div className="auth">
      <div className="auth-lado">
        <img className="lgl" src={logoDark} alt="Gold Metals App" />
        <img className="lgd" src={logoDark} alt="Gold Metals App" />
        <h2>Un sistema, toda tu operación</h2>
        <p>Donde tu oro y tus materiales polimetálicos cobran forma.</p>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h1>{titulo}</h1>
          <p className="s">{subtitulo}</p>
          {children}
          {pie && <div className="auth-pie">{pie}</div>}
        </div>
      </div>
    </div>
  )
}