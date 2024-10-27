import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { TextSearch } from "lucide-react";
import { useState } from "react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export default function DatatableSearch<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [column, setColumn] = useState("trip_time");
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search..."
        value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(column)?.setFilterValue(event.target.value)
        }
        className="max-w-sm focus-visible:ring-0 focus-visible:ring-transparent"
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"outline"} size={"icon"}>
            <TextSearch />
            <span className="sr-only">Search setting</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Search by:</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={column} onValueChange={setColumn}>
            <DropdownMenuRadioItem value="trip_time">
              Trip time
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="fare_amount">
              Fare amount
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="trip_distance">
              Trip distance
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="payment_type">
              Payment type
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
