import { useEffect, useState } from 'react'
import { formatoPrecio } from '../src/catalogUtils.js'
import { obtenerOrden } from '../services/api.js'

function PedidoConfirmacion() {
  const orderId = new URLSearchParams(window.location.search).get('order')
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState(orderId ? 'loading' : 'error')
  const [error, setError] = useState(orderId ? '' : 'No se indicó un número de orden.')

  useEffect(() => {
    let active = true
    if (!orderId) {
      return () => {
        active = false
      }
    }

    obtenerOrden(orderId)
      .then(result => {
        if (active) {
          setOrder(result)
          setStatus('ready')
        }
      })
      .catch(loadError => {
        if (active) {
          setError(loadError.message)
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [orderId])

  return (
<div className={"bg-background text-on-surface min-h-screen flex flex-col selection:bg-primary-container selection:text-surface-container-lowest antialiased"}>
  <div className={"flex-1 flex"}>
    <main className={"flex-1 w-full max-w-7xl mx-auto px-space-md lg:px-space-xl py-space-lg pt-16"}>
      <div className={"flex flex-col w-full"}>
        <div className={"w-full bg-surface-container-lowest rounded-xl p-space-sm mb-space-lg shadow-xl relative overflow-hidden"}>
        </div>
        {status === 'loading' && <p className={"bg-surface-container-low rounded-xl p-space-md text-center"} role="status">Consultando los datos de tu orden...</p>}
        {status === 'error' && <div className={"bg-surface-container-low rounded-xl p-space-md border border-error/50 text-center"} role="alert"><h1 className={"font-headline-lg text-headline-lg text-error"}>No se pudo cargar la orden</h1><p className={"font-body-md text-body-md text-on-surface-variant mt-2"}>{error}</p><a className={"inline-flex mt-space-md px-space-md py-2 rounded bg-surface-container-high text-on-surface"} href={"/carrito"}>Volver al carrito</a></div>}
        <div className={status === 'ready' ? "flex flex-col gap-space-lg" : "hidden flex-col gap-space-lg"} id={"view-success"}>
          <div className={"relative bg-surface-container-low rounded-xl p-space-md lg:p-space-xl overflow-hidden shadow-2xl border border-outline-variant/60 flex flex-col items-center text-center"}>
            <div className={"absolute -top-24 -left-24 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"}>
            </div>
            <div className={"absolute -bottom-24 -right-24 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"}>
            </div>
            <div className={"relative z-10 flex flex-col items-center max-w-2xl mx-auto"}>
              <div className={"w-16 h-16 rounded-2xl bg-secondary-container/15 flex items-center justify-center text-secondary-container mb-space-md shadow-[0_0_24px_rgba(52,255,141,0.35)] border border-secondary-container/30"}>
                <span className={"material-symbols-outlined text-4xl font-bold"}>
                  check_circle
                </span>
              </div>
              <div className={"flex flex-wrap items-center justify-center gap-space-xs mb-space-sm"}>
                <span className={"px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container font-label-sm text-label-sm uppercase tracking-wider font-bold flex items-center gap-1.5"}>
                  <span className={"w-2 h-2 rounded-full bg-secondary-container animate-pulse"}>
                  </span>
                  {' '}Simulación de Pago{' '}
                </span>
                <span className={"px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm"}>
                  {' '}Sin cargo ni transacción real{' '}
                </span>
              </div>
              <h1 className={"font-headline-lg text-headline-lg text-secondary tracking-tight mb-space-sm"}>
                {' '}Simulación de Confirmación de Orden{' '}
              </h1>
              <p className={"font-body-lg text-body-lg text-on-surface-variant mb-space-lg max-w-xl"}>
                {' '}La compra académica se registró sin realizar un cobro real y las keys disponibles se asignaron a tu{' '}
                <span className={"text-primary font-semibold"}>
                  Bóveda / Historial de Compras
                </span>
                .{' '}
              </p>
              <div className={"w-full bg-surface-container-lowest/90 rounded-xl p-space-md border border-outline-variant/60 backdrop-blur-md mb-space-lg shadow-lg"}>
                <div className={"grid grid-cols-2 md:grid-cols-4 gap-space-md text-left"}>
                  <div className={"flex flex-col gap-1"}>
                    <span className={"font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
                      N° de Orden
                    </span>
                    <span className={"font-headline-sm text-headline-sm text-primary-container font-bold font-mono tracking-wider break-all"}>
                      #{order?.order_number}
                    </span>
                  </div>
                  <div className={"flex flex-col gap-1"}>
                    <span className={"font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
                      Fecha y Hora
                    </span>
                    <span className={"font-label-md text-label-md text-on-surface flex items-center gap-1 mt-0.5"}>
                      <span className={"material-symbols-outlined text-sm text-outline"}>
                        schedule
                      </span>
                      {' '}{order?.created_at ? new Date(order.created_at).toLocaleString('es-MX') : ''}{' '}
                    </span>
                  </div>
                  <div className={"flex flex-col gap-1"}>
                    <span className={"font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
                      Método de Pago
                    </span>
                    <span className={"font-label-md text-label-md text-on-surface flex items-center gap-1 mt-0.5"}>
                      <span className={"material-symbols-outlined text-sm text-outline"}>
                        verified
                      </span>
                      {' '}Simulado{' '}
                    </span>
                  </div>
                  <div className={"flex flex-col gap-1 sm:text-right"}>
                    <span className={"font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
                      Monto Total
                    </span>
                    <div className={"flex items-baseline sm:justify-end gap-1 mt-0.5"}>
                      <span className={"font-headline-md text-headline-md text-primary font-extrabold"}>
                        {order ? formatoPrecio(order.total) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={"w-full bg-surface-container-lowest/90 rounded-xl p-space-md border border-outline-variant/60 backdrop-blur-md mb-space-lg shadow-lg text-left"}>
                <h2 className={"font-headline-sm text-headline-sm text-on-surface mb-space-sm"}>Productos adquiridos</h2>
                <div className={"flex flex-col divide-y divide-outline-variant"}>
                  {(order?.items || []).map((item, index) => (
                    <div className={"py-space-sm flex flex-wrap items-center justify-between gap-space-sm"} key={`${item.game_title}-${index}`}>
                      <div>
                        <strong>{item.game_title}</strong>
                        <p className={"font-body-sm text-body-sm text-on-surface-variant"}>{item.platform_name} · {item.region_name} · {item.edition || 'Estándar'} · Cantidad: {item.quantity}</p>
                      </div>
                      <strong>{formatoPrecio(item.subtotal)}</strong>
                    </div>
                  ))}
                </div>
                {order?.discount > 0 && <p className={"font-body-sm text-body-sm text-secondary-container text-right mt-space-sm"}>Descuento: -{formatoPrecio(order.discount)}</p>}
              </div>
              <div className={"flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-lg"}>
                <a className={"w-full sm:w-auto flex-1 px-space-xl py-3 rounded-lg bg-primary-container text-surface-container-lowest font-label-lg text-label-lg font-bold text-center hover:bg-primary-fixed-dim transition-all shadow-[0_0_16px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 active:scale-[0.98]"} data-path={"mi-boveda"} href={"/claves"}>
                  <span className={"material-symbols-outlined text-xl"}>
                    vpn_key
                  </span>
                  <span>
                    Ver mis Claves en la Bóveda de Licencias
                  </span>
                </a>
                <button className={"w-full sm:w-auto px-space-md py-3 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"}>
                  <span className={"material-symbols-outlined text-lg"}>
                    download
                  </span>
                  <span>
                    Descargar Comprobante PDF
                  </span>
                </button>
              </div>
              <div className={"mt-space-md"}>
                <a className={"font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"} data-path={"catalogo"} href={"/catalogo"}>
                  <span className={"material-symbols-outlined text-sm"}>
                    arrow_back
                  </span>
                  <span>
                    Volver a la Tienda &amp; Explorar Catálogo
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-space-md max-w-3xl mx-auto w-full"}>
            <div className={"bg-surface-container rounded-xl p-space-md flex items-center gap-space-sm border border-outline-variant/40 shadow-sm"}>
              <div className={"w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-container shrink-0"}>
                <span className={"material-symbols-outlined text-xl"}>
                  shield_locked
                </span>
              </div>
              <div className={"text-left"}>
                <h4 className={"font-headline-sm text-headline-sm text-on-surface"}>
                  Licencias Protegidas
                </h4>
                <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                  Tus keys asignadas están disponibles en Mi Bóveda.
                </p>
              </div>
            </div>
            <div className={"bg-surface-container rounded-xl p-space-md flex items-center gap-space-sm border border-outline-variant/40 shadow-sm"}>
              <div className={"w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary-container shrink-0"}>
                <span className={"material-symbols-outlined text-xl"}>
                  verified_user
                </span>
              </div>
              <div className={"text-left"}>
                <h4 className={"font-headline-sm text-headline-sm text-on-surface"}>
                  Garantía de Activación
                </h4>
                <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                  Soporte técnico directo y reemplazo automático si surge algún incidente de canje.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={"hidden flex-col gap-space-lg"} id={"view-pending"}>
          <div className={"relative bg-surface-container-low rounded-xl p-space-md lg:p-space-xl overflow-hidden shadow-2xl"}>
            <div className={"absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"}>
            </div>
            <div className={"relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md"}>
              <div className={"flex items-start gap-space-md"}>
                <div className={"w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_24px_rgba(245,158,11,0.35)]"}>
                  <span className={"material-symbols-outlined text-3xl animate-spin"}>
                    sync
                  </span>
                </div>
                <div className={"flex flex-col gap-1"}>
                  <div className={"flex flex-wrap items-center gap-space-xs"}>
                    <span className={"px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-label-sm text-label-sm uppercase tracking-wider font-bold"}>
                      {' '}Validación en Proceso{' '}
                    </span>
                    <span className={"px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm"}>
                      {' '}Enlace Bancario Pendiente{' '}
                    </span>
                  </div>
                  <h1 className={"font-headline-lg text-headline-lg text-on-surface tracking-tight"}>
                    Pago en Proceso de Aprobación
                  </h1>
                  <p className={"font-body-md text-body-md text-on-surface-variant"}>
                    {' '}Tu pasarela de pago o banco emisor está procesando la autorización de fondos. No recargues la página.{' '}
                  </p>
                </div>
              </div>
              <div className={"flex flex-col items-start md:items-end bg-surface-container-lowest/80 p-space-md rounded-xl backdrop-blur-md shrink-0"}>
                <span className={"font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
                  Orden en Cola
                </span>
                <span className={"font-headline-md text-headline-md text-amber-400 font-bold tracking-wider"}>
                  #NX-984210
                </span>
                <span className={"font-label-sm text-[11px] text-on-surface-variant mt-1"}>
                  Tiempo est: 5 - 15 minutos
                </span>
              </div>
            </div>
          </div>
          <div className={"grid grid-cols-1 md:grid-cols-3 gap-space-md"}>
            <div className={"bg-surface-container rounded-xl p-space-md flex flex-col gap-2"}>
              <div className={"w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-primary-container"}>
                <span className={"material-symbols-outlined text-lg"}>
                  timelapse
                </span>
              </div>
              <h4 className={"font-headline-sm text-headline-sm text-on-surface"}>
                1. Espera de Seguridad
              </h4>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}Las redes bancarias internacionales aplican validaciones 3D Secure que pueden demorar hasta 15 minutos.{' '}
              </p>
            </div>
            <div className={"bg-surface-container rounded-xl p-space-md flex flex-col gap-2"}>
              <div className={"w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-primary-container"}>
                <span className={"material-symbols-outlined text-lg"}>
                  mail
                </span>
              </div>
              <h4 className={"font-headline-sm text-headline-sm text-on-surface"}>
                2. Despacho Automático
              </h4>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}Tan pronto como se apruebe, las claves se inyectarán en 'Mi Bóveda' y recibirás un aviso urgente por email.{' '}
              </p>
            </div>
            <div className={"bg-surface-container rounded-xl p-space-md flex flex-col gap-2"}>
              <div className={"w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-primary-container"}>
                <span className={"material-symbols-outlined text-lg"}>
                  no_accounts
                </span>
              </div>
              <h4 className={"font-headline-sm text-headline-sm text-on-surface"}>
                3. No Dupliques la Orden
              </h4>
              <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                {' '}Evita realizar una nueva compra con el mismo juego para prevenir cobros dobles en tu estado de cuenta.{' '}
              </p>
            </div>
          </div>
          <div className={"flex flex-col sm:flex-row items-center gap-space-sm"}>
            <button className={"w-full sm:w-auto px-space-lg py-3 rounded-lg bg-primary-container text-surface-container-lowest font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all cursor-pointer"}>
              <span className={"material-symbols-outlined text-xl"}>
                refresh
              </span>
              <span>
                Revalidar Estado de Pago
              </span>
            </button>
            <a className={"w-full sm:w-auto px-space-lg py-3 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 hover:bg-surface-bright transition-colors"} href={"/claves"}>
              <span className={"material-symbols-outlined text-xl"}>
                history
              </span>
              <span>
                Ver en Historial de Transacciones
              </span>
            </a>
          </div>
        </div>
        <div className={"hidden flex-col gap-space-lg"} id={"view-failed"}>
          <div className={"relative bg-surface-container-low rounded-xl p-space-md lg:p-space-xl overflow-hidden shadow-2xl"}>
            <div className={"absolute -top-24 -left-24 w-80 h-80 bg-error/15 rounded-full blur-3xl pointer-events-none"}>
            </div>
            <div className={"relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md"}>
              <div className={"flex items-start gap-space-md"}>
                <div className={"w-14 h-14 rounded-xl bg-error/20 flex items-center justify-center text-error shrink-0 shadow-[0_0_24px_rgba(239,68,68,0.35)]"}>
                  <span className={"material-symbols-outlined text-3xl font-bold"}>
                    cancel
                  </span>
                </div>
                <div className={"flex flex-col gap-1"}>
                  <div className={"flex flex-wrap items-center gap-space-xs"}>
                    <span className={"px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm uppercase tracking-wider font-bold"}>
                      {' '}Transacción Declinada{' '}
                    </span>
                    <span className={"px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm"}>
                      {' '}Código Error: #BANK_ERR_DECLINE_04{' '}
                    </span>
                  </div>
                  <h1 className={"font-headline-lg text-headline-lg text-error tracking-tight"}>
                    Pago No Autorizado por el Emisor
                  </h1>
                  <p className={"font-body-md text-body-md text-on-surface-variant"}>
                    {' '}La entidad emisora de tu tarjeta o proveedor de cuenta rechazó la operación. No se ha aplicado ningún débito final.{' '}
                  </p>
                </div>
              </div>
              <div className={"flex flex-col items-start md:items-end bg-surface-container-lowest/80 p-space-md rounded-xl backdrop-blur-md shrink-0"}>
                <span className={"font-label-sm text-label-sm text-outline uppercase tracking-wider"}>
                  Orden Cancelada
                </span>
                <span className={"font-headline-md text-headline-md text-error font-bold tracking-wider"}>
                  #NX-984210
                </span>
                <span className={"font-label-sm text-[11px] text-on-surface-variant mt-1"}>
                  Fondos Reservados: $0.00 USD
                </span>
              </div>
            </div>
          </div>
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-space-md"}>
            <div className={"bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm"}>
              <div className={"flex items-center gap-space-xs text-error"}>
                <span className={"material-symbols-outlined"}>
                  help
                </span>
                <h3 className={"font-headline-sm text-headline-sm"}>
                  Causas Comunes de Rechazo
                </h3>
              </div>
              <ul className={"flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant"}>
                <li className={"flex items-start gap-2"}>
                  <span className={"material-symbols-outlined text-primary-container text-sm mt-0.5"}>
                    check_circle
                  </span>
                  <span>
                    Fondos insuficientes o límite de compras por internet superado.
                  </span>
                </li>
                <li className={"flex items-start gap-2"}>
                  <span className={"material-symbols-outlined text-primary-container text-sm mt-0.5"}>
                    check_circle
                  </span>
                  <span>
                    Bloqueo geográfico de transacciones internacionales (servidores de liquidación global).
                  </span>
                </li>
                <li className={"flex items-start gap-2"}>
                  <span className={"material-symbols-outlined text-primary-container text-sm mt-0.5"}>
                    check_circle
                  </span>
                  <span>
                    Fallo de verificación de token SMS / OTP / 3DSecure con la app del banco.
                  </span>
                </li>
              </ul>
            </div>
            <div className={"bg-surface-container rounded-xl p-space-md flex flex-col gap-space-sm justify-between"}>
              <div className={"flex flex-col gap-1"}>
                <div className={"flex items-center gap-space-xs text-primary-container"}>
                  <span className={"material-symbols-outlined"}>
                    lightbulb
                  </span>
                  <h3 className={"font-headline-sm text-headline-sm text-on-surface"}>
                    Solución Recomendada
                  </h3>
                </div>
                <p className={"font-body-sm text-body-sm text-on-surface-variant"}>
                  {' '}Puedes cambiar inmediatamente al nodo de pago alternativo vía PayPal o Criptoactivos (USDT / BTC) sin tener que rearmar tu carrito.{' '}
                </p>
              </div>
              <div className={"flex flex-wrap gap-2 pt-space-xs"}>
                <button className={"px-space-md py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-colors cursor-pointer"}>
                  <span className={"material-symbols-outlined text-base text-primary-container"}>
                    contactless
                  </span>
                  <span>
                    Pagar con PayPal
                  </span>
                </button>
                <button className={"px-space-md py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-colors cursor-pointer"}>
                  <span className={"material-symbols-outlined text-base text-secondary-container"}>
                    currency_bitcoin
                  </span>
                  <span>
                    Pagar con Cripto
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className={"flex flex-col sm:flex-row items-center gap-space-sm"}>
            <a className={"w-full sm:w-auto px-space-lg py-3 rounded-lg bg-error hover:bg-error-container text-surface-container-lowest hover:text-on-error-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(239,68,68,0.4)]"} href={"/carrito"}>
              <span className={"material-symbols-outlined text-xl"}>
                replay
              </span>
              <span>
                Reintentar Orden #NX-984210
              </span>
            </a>
            <a className={"w-full sm:w-auto px-space-lg py-3 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 hover:bg-surface-bright transition-colors"} href={"/carrito"}>
              <span className={"material-symbols-outlined text-xl"}>
                shopping_cart
              </span>
              <span>
                Modificar Carrito de Compras
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
  )
}

export default PedidoConfirmacion
