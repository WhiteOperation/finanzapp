"use client"

import { TrendingUp, TrendingDown, Scale } from "lucide-react"
import { formatMoneda } from "@/lib/finanzas"
import { cn } from "@/lib/utils"

interface Props {
  ingresos: number
  gastos: number
}

export function ResumenMes({ ingresos, gastos }: Props) {
  const balance = ingresos - gastos

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-3xl border border-border p-5",
          balance >= 0 ? "bg-success/10" : "bg-destructive/10",
        )}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Scale className="size-4" />
          <span className="text-xs font-medium uppercase tracking-wide">Balance del mes</span>
        </div>
        <p
          className={cn(
            "mt-2 font-mono text-4xl font-semibold tabular-nums text-balance",
            balance >= 0 ? "text-success" : "text-destructive",
          )}
        >
          {balance >= 0 ? "+" : ""}
          {formatMoneda(balance)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-success">
            <TrendingUp className="size-4" />
            <span className="text-xs font-medium">Ingresos</span>
          </div>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
            {formatMoneda(ingresos)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5 text-destructive">
            <TrendingDown className="size-4" />
            <span className="text-xs font-medium">Gastos</span>
          </div>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
            {formatMoneda(gastos)}
          </p>
        </div>
      </div>
    </div>
  )
}
