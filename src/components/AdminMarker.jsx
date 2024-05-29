import React from 'react'
import { Icon } from '../constant/Icon'
import { CaretDownOutlined } from '@ant-design/icons'

export default function AdminMarker({ lat,
    lng,
   
    
    ...props}) {
  return (
       <div
            src={Icon.user2}
           
           style={{
                            backgroundColor: "#A273FF ",
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
             ADMIN
            <div
                style={{
                    // backgroundColor: "#A273FF",
                    color:"#A273FF",
                    // width: "0",
                    // height: "0",
                    // borderLeft: "5px solid transparent",
                    // borderRight: "5px solid transparent",
                    // borderTop: "10px solid #A273FF",
                    position: "absolute",
                    bottom: "-10px",
                }}
            >
                <CaretDownOutlined style={{
                    color:"#A273FF",
                    fontSize:"16px"
                }}  />
            </div>
        </div>
  )
}
