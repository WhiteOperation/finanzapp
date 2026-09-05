"use client"

import { useEffect, useState } from "react"
import { X, Delete, Check } from "lucide-react"
import { IconoCategoria } from "@/components/icono-categoria"
import { CATEGORIAS, type Tipo, type Transaccion } from "@/lib/finanzas"
import { cn } from "@/lib/utils"

interface Props {
  abierto: boolean
  fechaKey: string
  onCerrar: () => void
  onGuardar: (t: Omit<Transaccion, "id" | "created_at">) => Promise<void>
}

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"]

export function ModalAgregar({ abierto, fechaKey, onCerrar, onGuardar }: Props) {
  const [importe, setImporte] = useState("0")
  const [tipo, setTipo] = useState<Tipo>("gasto")
  const [categoria, setCategoria] = useState(CATEGORIAS[0].nombre)
  const [concepto, setConcepto] = useState("")
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (abierto) {
      setImporte("0")
      setTipo("gasto")
      setCategoria(CATEGORIAS[0].nombre)
      setConcepto("")
      setGuardando(false)
    }
  }, [abierto])

  if (!abierto) return null

  const pulsar = (tecla: string) => {
    setImporte((prev) => {
      if (tecla === "del") {
        const next = prev.slice(0, -1)
        return next === "" ? "0" : next
      }
      if (tecla === ".") {
        return prev.includes(".") ? prev : prev + "."
      }
      // limitar a 2 decimales
      if (prev.includes(".") && prev.split(".")[1]?.length >= 2) return prev
      if (prev === "0") return tecla
      return prev + tecla
    })
  }

  const valor = Number.parseFloat(importe) || 0

  const guardar = async () => {
    if (valor <= 0 || guardando) return
    setGuardando(true)
    try {
      await onGuardar({
        fecha: fechaKey,
        concepto: concepto.trim(),
        monto: Number(valor.toFixed(2)),
        tipo,
        categoria,
      })
      onCerrar()
    } catch {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Nueva transacción">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative mx-auto w-full max-w-md rounded-t-[2rem] border-t border-border bg-popover p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Nueva transacción</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Selector de tipo */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          {(["gasto", "ingreso"] as Tipo[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={cn(
                "rounded-xl py-2.5 text-sm font-medium capitalize transition-colors",
                tipo === t
                  ? t === "ingreso"
                    ? "bg-success text-primary-foreground"
                    : "bg-destructive text-white"
                  : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Importe */}
        <div className="mb-4 text-center">
          <p
            className={cn(
              "font-mono text-5xl font-semibold tabular-nums",
              tipo === "ingreso" ? "text-success" : "text-destructive",
            )}
          >
            {tipo === "ingreso" ? "+" : "-"}
            {importe}
            <span className="text-2xl text-muted-foreground"> €</span>
          </p>
        </div>

        {/* Categorías */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIAS.map((c) => (
            <button
              key={c.nombre}
              type="button"
              onClick={() => setCategoria(c.nombre)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                categoria === c.nombre
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              <IconoCategoria icon={c.icon} className="size-4" />
              {c.nombre}
            </button>
          ))}
        </div>

        {/* Concepto */}
        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Concepto (opcional)"
          className="mb-4 w-full rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-2">
          {TECLAS.map((tecla) => (
            <button
              key={tecla}
              type="button"
              onClick={() => pulsar(tecla)}
              className="flex h-14 items-center justify-center rounded-2xl bg-secondary text-xl font-medium text-foreground transition-colors active:bg-accent"
            >
              {tecla === "del" ? <Delete className="size-5" /> : tecla}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={guardar}
          disabled={valor <= 0 || guardando}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
        >
          <Check className="size-5" />
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  )
}
