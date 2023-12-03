import React from "react";
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DATA } from "../../data";

const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{
                backgroundColor: "#A273FF",
                border: "1px solid #A273FF",
                borderRadius: "10px",
                
                color: "#fff",
                padding: "5px",
            }}>
                
                <p className="label">{`xof : ${payload[0].value}`}</p>
                {/* Additional content as needed */}
            </div>
        );
    }
    return null;
};

const LineCharts = ({ data, options }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                min-width={600}
                height={300}
                data={DATA}
            >
                <Line
                    strokeWidth={3}
                    type="monotone"
                    dataKey="gain"
                    stroke="#A273FF"
                    dot={false}
                />

                <XAxis axisLine={false} tickLine={false} dataKey="month" />
                <Tooltip content={customTooltip} cursor={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineCharts;
