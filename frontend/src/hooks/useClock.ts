import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface ClockState {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string | null;
  dateString: string;
  is24h: boolean;
  toggle24h: () => void;
  prevHours: string;
  prevMinutes: string;
  prevSeconds: string;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatTime(date: Date, is24h: boolean) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let ampm: string | null = null;

  if (!is24h) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    ampm,
  };
}

function formatDate(date: Date): string {
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function useClock(): ClockState {
  const [is24h, setIs24h] = useLocalStorage("clock_24h", false);
  const [now, setNow] = useState(() => new Date());
  const prevRef = useRef({ hours: "", minutes: "", seconds: "" });

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const { hours, minutes, seconds, ampm } = formatTime(now, is24h);
  const dateString = formatDate(now);

  const prev = prevRef.current;
  const result = {
    hours,
    minutes,
    seconds,
    ampm,
    dateString,
    is24h,
    toggle24h: () => setIs24h((v) => !v),
    prevHours: prev.hours,
    prevMinutes: prev.minutes,
    prevSeconds: prev.seconds,
  };

  prevRef.current = { hours, minutes, seconds };

  return result;
}
