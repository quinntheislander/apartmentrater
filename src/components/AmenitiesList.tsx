import {
  Waves,
  Dumbbell,
  Car,
  WashingMachine,
  Utensils,
  Snowflake,
  Home,
  Dog,
  DoorOpen,
  ArrowUpDown,
  Package,
  Sun,
  TreePine,
  Bike,
  Mail
} from 'lucide-react'

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Pool': <Waves className="h-4 w-4" />,
  'Gym': <Dumbbell className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
  'Laundry': <WashingMachine className="h-4 w-4" />,
  'Dishwasher': <Utensils className="h-4 w-4" />,
  'AC': <Snowflake className="h-4 w-4" />,
  'Balcony': <Home className="h-4 w-4" />,
  'Pet Friendly': <Dog className="h-4 w-4" />,
  'Doorman': <DoorOpen className="h-4 w-4" />,
  'Elevator': <ArrowUpDown className="h-4 w-4" />,
  'Storage': <Package className="h-4 w-4" />,
  'Rooftop': <Sun className="h-4 w-4" />,
  'Courtyard': <TreePine className="h-4 w-4" />,
  'Bike Storage': <Bike className="h-4 w-4" />,
  'Package Room': <Mail className="h-4 w-4" />
}

interface AmenitiesListProps {
  amenities: string
}

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  let amenityList: string[] = []

  try {
    amenityList = JSON.parse(amenities)
  } catch {
    return null
  }

  if (!Array.isArray(amenityList) || amenityList.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {amenityList.map((amenity) => (
        <span
          key={amenity}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
        >
          {AMENITY_ICONS[amenity] || null}
          {amenity}
        </span>
      ))}
    </div>
  )
}
