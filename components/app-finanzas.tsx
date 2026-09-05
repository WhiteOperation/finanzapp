"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  toDateKey,
  type Transaccion,
} from "@/lib/finanzas"
import { ResumenMes } from "@/components/resumen-mes"
import { CalendarioMes } from "@/components/calendario-mes"
import { DetalleDia } from "@/components/detalle-dia"
import { ModalAgregar } from "@/components/modal-agregar"

const supabase = createClient()

function rangoMes(year: number, month: number) {
  const inicio = `${year}-${String(month + 1).padStart(2, "0")}-01`
  const finDate = new Date(year, month + 1, 1)
  const fin = toDateKey(finDate)
  return { inicio, fin }
}

async function fetchMes([, year, month]: [string, number, number]): Promise<Transaccion[]> {
  const { inicio, fin } = rangoMes(year, month)
  const { data, error } = await supabase
    .from("transacciones")
    .select("id, fecha, concepto, monto, tipo, categoria, created_at")
    .gte("fecha", inicio)
    .lt("fecha", fin)
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map((t) => ({ ...t, monto: Number(t.monto) })) as Transaccion[]
}

export function AppFinanzas() {
  const hoy = new Date()
  const hoyKey = toDateKey(hoy)
  const [year, setYear] = useState(hoy.getFullYear())
  const [month, setMonth] = useState(hoy.getMonth())
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(hoyKey)
  const [modalAbierto, setModalAbierto] = useState(false)

  const { data: transacciones = [], mutate, isLoading } = useSWR(
    ["mes", year, month],
    fetchMes,
    { revalidateOnFocus: false },
  )

  const transaccionesPorDia = useMemo(() => {
    const mapa = new Map<string, Transaccion[]>()
    for (const t of transacciones) {
      const lista = mapa.get(t.fecha) ?? []
      lista.push(t)
      mapa.set(t.fecha, lista)
    }
    return mapa
  }, [transacciones])

  const { ingresos, gastos } = useMemo(() => {
    let ingresos = 0
    let gastos = 0
    for (const t of transacciones) {
      if (t.tipo === "ingreso") ingresos += t.monto
      else gastos += t.monto
    }
    return { ingresos, gastos }
  }, [transacciones])

  const cambiarMes = (delta: number) => {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
    setDiaSeleccionado(null)
  }

  const seleccionarDia = (dia: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
    setDiaSeleccionado((prev) => (prev === key ? null : key))
  }

  const guardar = async (t: Omit<Transaccion, "id" | "created_at">) => {
    const { error } = await supabase.from("transacciones").insert(t)
    if (error) throw error
    await mutate()
    // Asegurar que el día del movimiento quede visible
    const [ty, tm] = t.fecha.split("-").map(Number)
    if (ty === year && tm - 1 === month) setDiaSeleccionado(t.fecha)
  }

  const eliminar = async (id: string) => {
    await mutate(
      transacciones.filter((t) => t.id !== id),
      { revalidate: false },
    )
    const { error } = await supabase.from("transacciones").delete().eq("id", id)
    if (error) await mutate()
  }

  const fechaModal = diaSeleccionado ?? hoyKey

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 pb-28 pt-6">
      <header className="mb-5">
        <p className="text-sm text-muted-foreground">Finanzas en pareja</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Nuestras Finanzas</h1>
      </header>

      <div className="space-y-4">
        <ResumenMes ingresos={ingresos} gastos={gastos} />

        <CalendarioMes
          year={year}
          month={month}
          transaccionesPorDia={transaccionesPorDia}
          hoyKey={hoyKey}
          diaSeleccionado={diaSeleccionado}
          onSeleccionarDia={seleccionarDia}
          onCambiarMes={cambiarMes}
        />

        {diaSeleccionado && (
          <DetalleDia
            diaKey={diaSeleccionado}
            transacciones={transaccionesPorDia.get(diaSeleccionado) ?? []}
            onEliminar={eliminar}
            onAgregar={() => setModalAbierto(true)}
          />
        )}

        {isLoading && (
          <p className="text-center text-sm text-muted-foreground">Cargando movimientos...</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setModalAbierto(true)}
        aria-label="Añadir transacción"
        className="fixed bottom-6 left-1/2 z-40 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
      >
        <Plus className="size-7" />
      </button>

      <ModalAgregar
        abierto={modalAbierto}
        fechaKey={fechaModal}
        onCerrar={() => setModalAbierto(false)}
        onGuardar={guardar}
      />
    </main>
  )
}
