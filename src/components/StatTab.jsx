import React from 'react'

function StatTab({ name, isActive, onClick }) {
    return (
        <a
            href="#"
            className={`tab ${isActive ? "active" : ""}`}
            onClick={(e) => {
                e.preventDefault();
                onClick(name);
            }}
        >
            {name}
        </a>
    );
}

export default StatTab