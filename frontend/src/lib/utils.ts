import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstName(name: string) {
  return name.split(" ")[0];
}

export function getLastName(name: string) {
  return name.split(" ")[1];
}

export function getInitials(name: string) {
  return name.split(" ").map((word) => word[0]).join("");
}

export function getFirstLetter(name: string) {
  return name[0];
}