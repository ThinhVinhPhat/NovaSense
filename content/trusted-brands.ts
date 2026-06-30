import type { IconType } from 'react-icons'
import {
  SiSamsung,
  SiLg,
  SiXiaomi,
  SiApple,
  SiGooglehome,
  SiPhilipshue,
  SiSonos,
  SiIkea,
  SiRing,
  SiArlo,
} from 'react-icons/si'

export interface Brand {
  name: string
  Icon: IconType
}

export const trustedBrands: Brand[] = [
  { name: 'Samsung', Icon: SiSamsung },
  { name: 'LG', Icon: SiLg },
  { name: 'Xiaomi', Icon: SiXiaomi },
  { name: 'Apple HomeKit', Icon: SiApple },
  { name: 'Google Home', Icon: SiGooglehome },
  { name: 'Philips Hue', Icon: SiPhilipshue },
  { name: 'Sonos', Icon: SiSonos },
  { name: 'IKEA Home Smart', Icon: SiIkea },
  { name: 'Ring', Icon: SiRing },
  { name: 'Arlo', Icon: SiArlo },
]
