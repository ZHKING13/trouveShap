import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { DATA } from "../../data";
const AreaCharts = ({ data, options }) => {
    return (
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart
                width={500}
                height={400}
                data={DATA}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 15,
                }}

            >
                <XAxis axisLine={false} tickLine={false} dataKey="month" />

                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="gain"
                    stroke="#A273FF"
                    fill="#E4D0FF"
                    strokeWidth={3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
export default AreaCharts;