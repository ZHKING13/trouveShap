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
import { transformData } from "./Line";

const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="custom-tooltip"
                style={{
                    backgroundColor: "#A273FF",
                    border: "1px solid #A273FF",
                    borderRadius: "10px",

                    color: "#fff",
                    padding: "5px",
                }}
            >
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                {/* Additional content as needed */}
            </div>
        );
    }
    return null;
};
const AreaCharts = ({ data, options }) => {
    const transformedData = transformData(data);
    return (
        <ResponsiveContainer width="100%" height="90%">
            <AreaChart
                width={500}
                height={400}
                data={transformedData ? transformedData : DATA}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 15,
                }}
            >
                <XAxis axisLine={false} tickLine={false} dataKey="month" />

                <Tooltip content={customTooltip} cursor={false} />

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
};
export default AreaCharts;
