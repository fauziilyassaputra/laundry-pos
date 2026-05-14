import { clsx, type ClassValue } from "clsx";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files![0];
  const displayUrl = URL.createObjectURL(file);
  return { file, displayUrl };
}

export function formatWaktuWib(tanggalISO: string | Date | null){
  if (!tanggalISO) return "-";

  const date = new Date(tanggalISO);

  if (Number.isNaN(date.getTime())) {
    return "-"; // Tampilkan strip saja daripada membuat layar merah
  }
  
  return new Intl.DateTimeFormat("id-ID",{
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  }).format(date);
}