import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TData, useGlobalContext } from "@/context/GlobalContextProvider";
import { ColumnDef } from "@tanstack/react-table";
import { Car, DollarSign, LucideIcon, MapPinCheck, Users2 } from "lucide-react";
import { DataTable } from "../table/Datatable";
import { DataTableColumnHeader } from "../table/DatatableColumnHeader";
import { Button } from "../ui/button";
import MapComponent from "../map/MapComponent";

type TCard = {
  title: string;
  total: number | undefined;
  description: string;
  icon: LucideIcon;
};

export default function Overview() {
  const { data } = useGlobalContext();
  const cards: TCard[] = [
    {
      title: "Total fare amount",
      total: data?.reduce((prev, curr) => prev + parseInt(curr.fare_amount), 0),
      description: "Total fare amount 2014",
      icon: DollarSign,
    },
    {
      title: "Total trip",
      total: data?.length,
      description: "Total trip 2014",
      icon: MapPinCheck,
    },
    {
      title: "Trip distance",
      total: data?.reduce(
        (prev, curr) => prev + parseInt(curr.trip_distance),
        0
      ),
      description: "Total trip distance 2014",
      icon: Car,
    },
    {
      title: "Passengers",
      total: data?.reduce(
        (prev, curr) => prev + parseInt(curr.passenger_count),
        0
      ),
      description: "Total passengers 2014",
      icon: Users2,
    },
  ];

  return (
    <div className="space-y-4 mt-4">
      <div className="grid lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <CardComponent
            key={index}
            description={card.description}
            icon={card.icon}
            title={card.title}
            total={card.total}
          />
        ))}
      </div>
      <Card>
        <CardHeader className="space-y-0">
          <h3 className="text-xl font-semibold">Data table</h3>
          <p className="text-sm text-muted-foreground">
            List of all trips data
          </p>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={dataColumns}
            search="trip_distance"
            data={data!}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CardComponent({ title, total, description, icon: Icon }: TCard) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-bold flex items-center gap-1 mb-1">
          <Icon className="text-primary" />
          {total}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

const dataColumns: ColumnDef<TData>[] = [
  {
    id: "number",
    header: "Number",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: "trip_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trip time" />
    ),
    cell: ({ row }) => {
      const milisecond = parseInt(row.original.trip_time);
      const formattedHours = String(
        Math.floor(milisecond / (1000 * 60 * 60))
      ).padStart(2, "0");
      const formattedMinutes = String(
        Math.floor((milisecond / (1000 * 60)) % 60)
      ).padStart(2, "0");
      const formattedSeconds = String(
        Math.floor((milisecond / 1000) % 60)
      ).padStart(2, "0");

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds} (${milisecond}ms)`;
    },
  },
  {
    accessorKey: "fare_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fare amount" />
    ),
    cell: ({ row }) => `$${row.original.fare_amount}`,
  },
  {
    accessorKey: "trip_distance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trip distance" />
    ),
    cell: ({ row }) => `${row.original.trip_distance} mile(s)`,
  },
  {
    accessorKey: "payment_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment type" />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const data = row.original;
      return <SheetComponent data={data} />;
    },
  },
];

function SheetComponent({ data }: { data: TData }) {
  const tripData = {
    pickup_longitude: data.pickup_longitude,
    pickup_latitude: data.pickup_latitude,
    dropoff_longitude: data.dropoff_longitude,
    dropoff_latitude: data.dropoff_latitude,
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-background">Detail</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[50%] max-w-[80%] overflow-auto">
        <SheetHeader className="text-left">
          <div>
            <SheetTitle>Detail trip data</SheetTitle>
            <SheetDescription>Detail selected trip data</SheetDescription>
          </div>
          <div className="aspect-video rounded-lg mt-4">
            <MapComponent tripData={tripData} />
          </div>
        </SheetHeader>
        <div className="mt-4">
          <SheetTitle>Vendor ID {data.vendor_id}</SheetTitle>
          <SheetDescription>
            Detail trip data with Vendor ID {data.vendor_id}
          </SheetDescription>
        </div>
        <Table className="border mt-4">
          <TableCaption>A list detail of selected trip data.</TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="border-r">Name</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(data).map((key, i) => {
              const castKey = key as keyof TData;
              return (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground border-r">
                    {key.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-right">{data[castKey]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SheetContent>
    </Sheet>
  );
}
