import stylist1 from "@/assets/stylist-1.jpg";
import stylist2 from "@/assets/stylist-2.jpg";
import stylist3 from "@/assets/stylist-3.jpg";
import stylist4 from "@/assets/stylist-4.jpg";

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
    { id: "volume-8d", name: "Volume 8D", price: 180, duration: 60 },
    { id: "volume-egipcio", name: "Volume Egípcio", price: 140, duration: 60 },
    { id: "remocao", name: "Remoção", price: 60, duration: 30 },
    { id: "sobrancelha", name: "Design de Sobrancelha", price: 50, duration: 60 },
  { id: "manutencao-volume-8d", name: "Manutenção Volume 8D", price: 110, duration: 60 },
  { id: "manutencao-volume-egipcio", name: "Manutenção Volume Egípcio", price: 90, duration: 60 },
];

export const BARBERS: Barber[] = [
  { id: "natasha_sabrine", name: "Natasha Sabrine", image: stylist1, available: true, specialty: "Cílios e Sombrancelhas" },
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export const UNAVAILABLE_SLOTS = [];
