import { Spin } from "antd"

const Loader = () => {
    return (
        <div
            className="loader"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                position: "absolute",
                top: "0",
                background: "rgba(0,0,0,0.6)",
                flexDirection: "column",
            }}
        >
           
            <Spin
                spinning={true}
                tip="Chargement..kh."
                size="large"
                fullscreen={true}
            />
             
        </div>
    );
}
export default Loader