export type Tipo = "ingreso" | "gasto"

export interface Transaccion {
  id: string
  fecha: string // YYYY-MM-DD
  concepto: string
  monto: number
  tipo: Tipo
  categoria: string
  created_at?: string
}

export interface Categoria {
  nombre: string
  icon: string // lucide icon name key used in a map
}

export const CATEGORIAS: Categoria[] = [
  { nombre: "Alimentación", icon: "utensils" },
  { nombre: "Casa", icon: "home" },
  { nombre: "Ocio", icon: "gamepad" },
  { nombre: "Transporte", icon: "car" },
  { nombre: "Salud", icon: "heart" },
  { nombre: "Compras", icon: "bag" },
  { nombre: "Nómina", icon: "wallet" },
  { nombre: "Otros", icon: "tag" },
]

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"]

export function formatMoneda(valor: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

export function formatMonedaCorta(valor: number): string {
  const abs = Math.abs(valor)
  const signo = valor < 0 ? "-" : valor > 0 ? "+" : ""
  if (abs >= 1000) {
    return `${signo}${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`
  }
  return `${signo}${Math.round(abs)}`
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function fechaLegible(key: string): string {
  const [y, m, d] = key.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

/** Devuelve la matriz de días para un mes, comenzando en lunes. null = celda vacía. */
export function buildCalendario(year: number, month: number): (number | null)[] {
  const primerDia = new Date(year, month, 1)
  // getDay: 0=domingo ... convertir a lunes=0
  const offset = (primerDia.getDay() + 6) % 7
  const diasEnMes = new Date(year, month + 1, 0).getDate()
  const celdas: (number | null)[] = []
  for (let i = 0; i < offset; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)
  while (celdas.length % 7 !== 0) celdas.push(null)
  return celdas
}
