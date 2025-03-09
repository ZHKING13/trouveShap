import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { DATA } from "../../data";
import { transformData } from "./Line";

const COLORS = [
    "#A273FF",
    "#FF7E67",
    "#6C5DD3",
    "#FFCB57",
    "#57C7FF",
    "#77DD77",
];

const BarCharts = ({ data, options }) => {
    const transformedData = transformData(data);

    return (
        <ResponsiveContainer width="100%" height="90%">
            <BarChart
                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                min-width={600}
                height={300}
                data={transformedData ? transformedData : DATA}
            >
                <XAxis axisLine={false} tickLine={false} dataKey="month" />
                <Tooltip />
                <Bar dataKey="gain">
                    {transformedData?.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarCharts;
