import {
    InfoCircleOutlined,
    RightOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Input, Tooltip,Space, Button, Tag } from "antd";
const Header = ({path,title,children}) => {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                flexWrap: "wrap",
                background: "transparent",
            }}
        >
            <div className="left">
                <p
                    style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#9CA3AF",
                    }}
                >
                    Dashbord <RightOutlined /> {path}
                </p>

                <h1
                    style={{
                        color: "#2B3674",
                    }}
                >
                    {title}
                </h1>
            </div>
            <div className="rigthContainer">
                {children}
               
            </div>
        </header>
    );
}
export default Header;