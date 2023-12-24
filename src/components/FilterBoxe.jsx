// import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    placeHolder,
    setDateRange,
    dateRange,
}) => {
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);

    const rangPicker = (value) => {
        console.log(value);
        
        const [start, end] = value;
        setStartDate(start);
        setEndDate(end);

        if (end == null) {
            return;
        }
        setDateRange({
            ...dateRange,
            fromDate: convertToISO(startDate),
            toDate: endDate !== null ? convertToISO(endDate) : null,
        });
        selectRange();
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
                placeholder={placeHolder}
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
            <div onClick={onClick ? onClick : null} className="rangeContainer">
                {children ? (
                    children
                ) : (
                    <DatePicker
                        onChange={rangPicker}
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
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
