// import { DatePicker } from "antd";
import ColumnGroup from "antd/es/table/ColumnGroup";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateRangePicker } from "rsuite";
import { Icon } from "../constant/Icon";
// const { RangePicker } = DatePicker;
function convertToISO(dateString) {
    const dateObject = new Date(dateString);
    const ISOString = dateObject.toISOString();
    return ISOString;
}
const FilterBoxe = ({
    handleSearch,
    selectRange,
    filtertext,
    children,
    onClick,
}) => {
    const [startDate, setStartDate] = useState();
    const [enddate, setEndDate] = useState();
    const [open, setOpen] = useState(false);
    const rangPicker = (value) => {
        console.log(value);
        setStartDate(value[0]);
        setEndDate(value[1]);
        if (value[1] == null) {
            return;
        }
        selectRange({
            fromDate: convertToISO(value[0]),
            toDate: convertToISO(value[1]),
        });
    };
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "50px",
                borderRadius: "31px",
                boxShadow: "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
                background: "#fff",
                gap: "10px",
            }}
            className="filter-box"
        >
            <input
                type="text"
                placeholder="Chercher une réservation"
                value={filtertext}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                style={{
                    border: "none",
                    outline: "none",
                    marginLeft: "6px",
                    background: "#F4F7FE",
                    borderRadius: "31px",
                    padding: "4px 16px",
                    minHeight: "30px",
                }}
            />
            <div onClick={onClick ? onClick:null} className="rangeContainer">
                {children ? (
                    children
                ) : (
                    <DatePicker
                        onChange={rangPicker}
                        selectsRange={true}
                        startDate={startDate}
                        endDate={enddate}
                        withPortal
                        placeholderText="trier par date"
                        dateFormat="yyy-MM-dd"
                    />
                )}
            </div>
        </div>
    );
};
export default FilterBoxe;
