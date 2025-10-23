import {createContext, useEffect, useState, useRef} from "react";

export const CustomContext = createContext();

export const Context = (props) => {
    const[mebel,setMebel]=useState('');
    const tipMebeli = (tip) => {
        setMebel(tip);
    };
    const [visota, setVisota] = useState(0);
    const [shirina, setShirina] = useState(0);
    const [glubina, setGlubina] = useState(0);

    const [formVisota, setFormVisota] = useState('');
    const [formShirina, setFormShirina] = useState('');
    const [formGlubina, setFormGlubina] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        setVisota(Number(formVisota));
        setShirina(Number(formShirina));
        setGlubina(Number(formGlubina));


        console.log("Итоговые данные:", {
            visota: Number(formVisota),
            shirina: Number(formShirina),
            glubina: Number(formGlubina)
        });
    };




    const value = {
        tipMebeli,
        mebel,
        handleSubmit,
        visota,
        shirina,
        glubina,
        formGlubina,
        formShirina,
        formVisota,
        setFormGlubina,
        setFormShirina,
        setFormVisota
    };
    return <CustomContext.Provider value={value}>
        {props.children}
    </CustomContext.Provider>
}