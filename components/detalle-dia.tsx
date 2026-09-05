"use client"

import { Trash2, Plus } from "lucide-react"
import { IconoCategoria } from "@/components/icono-categoria"
import {
  CATEGORIAS,
  fechaLegible,
  formatMoneda,
  type Transaccion,
} from "@/lib/finanzas"
import { cn } from "@/lib/utils"

interface Props {
  diaKey: string
  transacciones: Transaccion[]
  onEliminar: (id: string) => void
  onAgregar: () => void
}

const iconoDe = (categoria: string) =>
  CATEGORIAS.find((c) => c.nombre === categoria)?.icon ?? "tag"

export function DetalleDia({ diaKey, transacciones, onEliminar, onAgregar }: Props) {
  const total = transacciones.reduce(
    (acc, t) => acc + (t.tipo === "ingreso" ? t.monto : -t.monto),
    0,
  )

  return (
    <section className="rounded-3xl border border-border bg-card p-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold capitalize text-foreground">{fechaLegible(diaKey)}</h3>
          {transacciones.length > 0 && (
            <p
              className={cn(
                "font-mono text-sm tabular-nums",
                total >= 0 ? "text-success" : "text-destructive",
              )}
            >
              {total >= 0 ? "+" : ""}
              {formatMoneda(total)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onAgregar}
          className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          <Plus className="size-4" />
          Añadir
        </button>
      </header>

      {transacciones.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Sin movimientos este día.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {transacciones.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-3 rounded-2xl bg-secondary/50 p-3"
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full",
                  t.tipo === "ingreso" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
                )}
              >
                <IconoCategoria icon={iconoDe(t.categoria)} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {t.concepto || t.categoria}
                </p>
                <p className="truncate text-xs text-muted-foreground">{t.categoria}</p>
              </div>
              <span
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  t.tipo === "ingreso" ? "text-success" : "text-destructive",
                )}
              >
                {t.tipo === "ingreso" ? "+" : "-"}
                {formatMoneda(t.monto)}
              </span>
              <button
                type="button"
                onClick={() => onEliminar(t.id)}
                aria-label="Eliminar transacción"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
