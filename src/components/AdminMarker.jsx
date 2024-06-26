import React from 'react'
import { Icon } from '../constant/Icon'
import { CaretDownOutlined } from '@ant-design/icons'
import home from "../assets/loca.svg";

export default function AdminMarker({ lat,
    lng,
   
    
    ...props}) {
  return (
       <div
            src={Icon.user2}
           
           style={{
                            backgroundColor: "#010101 ",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "4px 8px",
                            color: "#fff",
                            position: "relative",
                            cursor: "pointer",
                            
                            transition:
                                "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                        }}
            // style={{ fontSize: 40 }}
            
            width={35}
            height={35}
           
        >
             <img src={home} alt="" />
            <div
                style={{
                    // backgroundColor: "#A273FF",
                    color:"#010101",
                    // width: "0",
                    // height: "0",
                    // borderLeft: "5px solid transparent",
                    // borderRight: "5px solid transparent",
                    // borderTop: "10px solid #A273FF",
                    position: "absolute",
                    bottom: "-15px",
                }}
            >
                <CaretDownOutlined style={{
                    color:"#010101",
                    fontSize:"24px"
                }}  />
            </div>
        </div>
  )
}
