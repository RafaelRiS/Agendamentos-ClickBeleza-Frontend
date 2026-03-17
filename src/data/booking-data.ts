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
  { id: "corte-feminino", name: "Corte Feminino", price: 120, duration: 60 },
  { id: "escova-progressiva", name: "Escova Progressiva", price: 250, duration: 120 },
  { id: "coloracao", name: "Coloração", price: 180, duration: 90 },
  { id: "hidratacao", name: "Hidratação Profunda", price: 90, duration: 45 },
  { id: "manicure", name: "Manicure & Pedicure", price: 80, duration: 60 },
  { id: "sobrancelha", name: "Design de Sobrancelha", price: 45, duration: 20 },
];

export const BARBERS: Barber[] = [
  { id: "camila", name: "Camila", image: stylist1, available: true, specialty: "Cortes" },
  { id: "aline", name: "Aline", image: stylist2, available: true, specialty: "Coloração" },
  { id: "renata", name: "Renata", image: stylist3, available: false, specialty: "Tratamentos" },
  { id: "julia", name: "Júlia", image: stylist4, available: true, specialty: "Penteados" },
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

export const UNAVAILABLE_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "17:00"];
