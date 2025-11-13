import {createContext, useEffect, useState, useRef} from "react";

export const CustomContext = createContext();

export const Context = (props) => {





    const value = {

    };
    return <CustomContext.Provider value={value}>
        {props.children}
    </CustomContext.Provider>
}