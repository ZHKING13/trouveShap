import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { DATA } from "../../data";

const BarCharts = ({ data, options }) => {
    return (
        <ResponsiveContainer width="100%" height="90%">
            <BarChart
                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                min-width={600}
                height={300}
                data={DATA}
            >
                <XAxis axisLine={false} tickLine={false} dataKey="month" />

                <Tooltip />

                <Bar dataKey="gain" fill="#A273FF" />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default BarCharts;
