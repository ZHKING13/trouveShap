import React from "react";

const ChartHeader = ({ title, value }) => {
    return (
        <div style={styles.header}>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
};

const styles = {
    header: {
        textAlign: "center",
        marginBottom: "20px",
    },
};

export default ChartHeader;
