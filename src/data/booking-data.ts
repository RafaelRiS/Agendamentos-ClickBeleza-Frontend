import barber1 from "@/assets/barber-1.jpg";
import barber2 from "@/assets/barber-2.jpg";
import barber3 from "@/assets/barber-3.jpg";
import barber4 from "@/assets/barber-4.jpg";

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Barber {
  id: string;
  name: string;
  image: string;
  available: boolean;
  specialty: string;
}

export const SERVICES: Service[] = [
  { id: "skin-fade", name: "Skin Fade", price: 55, duration: 45 },
  { id: "classic-cut", name: "Classic Cut", price: 40, duration: 30 },
  { id: "buzz-cut", name: "Buzz Cut", price: 25, duration: 15 },
  { id: "beard-trim", name: "Beard Trim", price: 30, duration: 20 },
  { id: "hot-towel-shave", name: "Hot Towel Shave", price: 45, duration: 35 },
  { id: "lineup", name: "Line-Up", price: 20, duration: 15 },
];

export const BARBERS: Barber[] = [
  { id: "marcus", name: "Marcus", image: barber1, available: true, specialty: "Fades" },
  { id: "carlos", name: "Carlos", image: barber2, available: true, specialty: "Textures" },
  { id: "erik", name: "Erik", image: barber3, available: false, specialty: "Beards" },
  { id: "jay", name: "Jay", image: barber4, available: true, specialty: "Classic" },
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export const UNAVAILABLE_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "17:00"];
