"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { buildCalendario, DIAS_SEMANA, MESES, formatMonedaCorta, type Transaccion } from "@/lib/finanzas"
import { cn } from "@/lib/utils"

interface Props {
  year: number
  month: number
  transaccionesPorDia: Map<string, Transaccion[]>
  hoyKey: string
  diaSeleccionado: string | null
  onSeleccionarDia: (dia: number) => void
  onCambiarMes: (delta: number) => void
}

export function CalendarioMes({
  year,
  month,
  transaccionesPorDia,
  hoyKey,
  diaSeleccionado,
  onSeleccionarDia,
  onCambiarMes,
}: Props) {
  const celdas = buildCalendario(year, month)

  const balanceDia = (dia: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
    const txs = transaccionesPorDia.get(key)
    if (!txs || txs.length === 0) return null
    return txs.reduce((acc, t) => acc + (t.tipo === "ingreso" ? t.monto : -t.monto), 0)
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-3">
      <header className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-base font-semibold text-foreground">
          {MESES[month]} <span className="text-muted-foreground">{year}</span>
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onCambiarMes(-1)}
            aria-label="Mes anterior"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onCambiarMes(1)}
            aria-label="Mes siguiente"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </header>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="py-1 text-center text-[0.7rem] font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={i} className="aspect-square" />
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
          const balance = balanceDia(dia)
          const esHoy = key === hoyKey
          const seleccionado = key === diaSeleccionado

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSeleccionarDia(dia)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border text-sm transition-colors",
                seleccionado
                  ? "border-primary bg-primary/15"
                  : "border-transparent hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-[0.8rem] tabular-nums",
                  esHoy ? "bg-primary font-semibold text-primary-foreground" : "text-foreground",
                )}
              >
                {dia}
              </span>
              {balance !== null && (
                <span
                  className={cn(
                    "font-mono text-[0.6rem] font-medium leading-none tabular-nums",
                    balance > 0 ? "text-success" : balance < 0 ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {formatMonedaCorta(balance)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
