"use client";

import { ResponsiveBar } from "@nivo/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = ({
    data,
    legendBottom,
    legendLeft,
    indexBy,
    labelTextColor,
    keys,
    colors,
}: {
    data: any;
    legendBottom: string;
    legendLeft: string;
    indexBy: string;
    labelTextColor: string;
    keys: string[];
    colors: string[];
}) => {
    return (
        <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={indexBy}
            margin={{ top: 10, right: 100, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={colors}
            borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: legendBottom,
                legendPosition: "middle",
                legendOffset: 32,
                truncateTickAt: 0,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: legendLeft,
                legendPosition: "middle",
                legendOffset: -40,
                truncateTickAt: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={labelTextColor}
            legends={[
                {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            role="application"
            ariaLabel="Bar Chart"
            // barAriaLabel={(e) =>
            //     e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            // }
        />
    );
};

const BarChart = ({
    title,
    legendBottom,
    legendLeft,
    indexBy,
    labelTextColor,
    data,
    keys,
    colors,
}: {
    title: string;
    legendBottom: string;
    legendLeft: string;
    indexBy: string;
    labelTextColor: string;
    data: {
        module: string;
        pending: string;
        inprogess: string;
        done: string;
    }[];
    keys: string[];
    colors: string[];
}) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] xl:h-[350px]">
                <Chart
                    data={data}
                    legendBottom={legendBottom}
                    legendLeft={legendLeft}
                    indexBy={indexBy}
                    labelTextColor={labelTextColor}
                    keys={keys}
                    colors={colors}
                />
            </CardContent>
        </Card>
    );
};

export default BarChart;
