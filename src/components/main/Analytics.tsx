import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis
} from "recharts";

type TChartData = {
  column: string;
  total: number | undefined;
  fill: string;
};

type TChartConfig = {
  total: {
    label: string;
  };
  column: {
    label: string;
    color: string;
  };
};

export default function Analytics() {
  const { data } = useGlobalContext();

  const fareChartData: TChartData[] = [
    {
      column: "fare_amount",
      total: data?.reduce((prev, curr) => prev + parseInt(curr.fare_amount), 0),
      fill: "var(--color-column)",
    },
  ];
  const fareChartConfig: TChartConfig = {
    total: {
      label: "total",
    },
    column: {
      label: "fare_amount",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const tripChartData: TChartData[] = [
    {
      column: "total_trip",
      total: data?.length,
      fill: "var(--color-column)",
    },
  ];
  const tripChartConfig: TChartConfig = {
    total: {
      label: "total",
    },
    column: {
      label: "total_trip",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const distanceChartData: TChartData[] = [
    {
      column: "total_distance",
      total: data?.reduce(
        (prev, curr) => prev + parseInt(curr.trip_distance),
        0
      ),
      fill: "var(--color-column)",
    },
  ];
  const distanceChartConfig: TChartConfig = {
    total: {
      label: "total",
    },
    column: {
      label: "total_distance",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const passengerChartData: TChartData[] = [
    {
      column: "total_passenger",
      total: data?.reduce(
        (prev, curr) => prev + parseInt(curr.passenger_count),
        0
      ),
      fill: "var(--color-column)",
    },
  ];
  const passengerChartConfig: TChartConfig = {
    total: {
      label: "total",
    },
    column: {
      label: "total_passenger",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  return (
    <div className="mt-4 grid lg:grid-cols-4 gap-4">
      <RadialChartComponent
        chartConfig={fareChartConfig}
        chartData={fareChartData}
        title="fare amount"
        label="USD"
      />
      <RadialChartComponent
        chartConfig={tripChartConfig}
        chartData={tripChartData}
        title="Trip"
        label="Times"
      />
      <RadialChartComponent
        chartConfig={distanceChartConfig}
        chartData={distanceChartData}
        title="distance"
        label="Miles"
      />
      <RadialChartComponent
        chartConfig={passengerChartConfig}
        chartData={passengerChartData}
        title="passenger"
        label="Passenger"
      />
      <BarChartComponent />
    </div>
  );
}

function RadialChartComponent({
  chartData,
  chartConfig,
  title,
  label,
}: {
  chartData: TChartData[];
  chartConfig: TChartConfig;
  title: string;
  label: string;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="capitalize">{title}</CardTitle>
        <CardDescription>Total {title}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360}
            innerRadius={80}
            outerRadius={120}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="total" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].total?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Calculating {title} in 2014
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total {title} 2014
        </div>
      </CardFooter>
    </Card>
  );
}

function BarChartComponent() {
  const { data } = useGlobalContext();
  const newData: { [key: string]: number } = {};
  data?.forEach((data) => {
    if (newData[data.payment_type]) {
      newData[data.payment_type] += 1;
    } else {
      newData[data.payment_type] = 1;
    }
  });

  const chartData = Object.keys(newData).map((key) => {
    return {
      column: key,
      total: newData[key],
      fill: `var(--color-${key})`,
    };
  });

  console.log(newData);

  const chartConfig = {
    total: {
      label: "total",
    },
    CRD: {
      label: "CRD",
      color: "hsl(var(--chart-1))",
    },
    CSH: {
      label: "CSH",
      color: "hsl(var(--chart-2))",
    },
    DIS: {
      label: "DIS",
      color: "hsl(var(--chart-3))",
    },
    NOC: {
      label: "NOC",
      color: "hsl(var(--chart-4))",
    },
    UNK: {
      label: "UNK",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Total payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="column"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" strokeWidth={2} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Calculating payment method in 2014
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total payment method 2014
        </div>
      </CardFooter>
    </Card>
  );
}
