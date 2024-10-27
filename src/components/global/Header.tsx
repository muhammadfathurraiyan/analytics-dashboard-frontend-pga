import { CarTaxiFront } from "lucide-react";
import ThemeController from "./ThemeController";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-16 py-4 border-b max-lg:px-4">
      <h1 className="font-semibold text-2xl flex items-center gap-2">
        <CarTaxiFront className="text-primary size-8" /> Taxi trip.
      </h1>
      <ThemeController />
    </header>
  );
}
