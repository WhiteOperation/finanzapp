import {
  Utensils,
  Home,
  Gamepad2,
  Car,
  Heart,
  ShoppingBag,
  Wallet,
  Tag,
  type LucideIcon,
} from "lucide-react"

const MAPA: Record<string, LucideIcon> = {
  utensils: Utensils,
  home: Home,
  gamepad: Gamepad2,
  car: Car,
  heart: Heart,
  bag: ShoppingBag,
  wallet: Wallet,
  tag: Tag,
}

export function IconoCategoria({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const Icon = MAPA[icon] ?? Tag
  return <Icon className={className} aria-hidden="true" />
}
