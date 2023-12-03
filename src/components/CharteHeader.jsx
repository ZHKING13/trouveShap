const ChartHeader = ({title,subtitle,span,children}) => {
    return (
        <div
            className="legendTab"
            style={{
                display: "flex",
                justifyContent: "space-between",
                
                
            }}
        >
            <div className="chart-header__left" style={{}}>
                <span>{ subtitle}</span>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    
                    gap: "10px",
                
                }} >
                    <p style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: "0",
                    }} >{title}</p>
                    <p style={{
                        fontSize: "12px",
                        margin: "0",
                    }}>{span}</p>

                </div>
            </div>
            <div>
                <div >{ children}</div>
            </div>
        </div>
    );
}
export default ChartHeader;