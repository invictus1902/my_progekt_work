import React from 'react';
import {useState, useEffect} from "react";
import './it_spashel.scss'
import {CustomContext} from "../Context";


const ItSpashel = () => {
    const {} = CustomContext
    const [mebel, setMebel] = useState(0);
    const tipMebeli = (tip) => {
        setMebel(tip);
    };
    const [visota, setVisota] = useState(0);
    const [shirina, setShirina] = useState(0);
    const [glubina, setGlubina] = useState(0);
    const [coll,setColl] = useState(0);

    const [formVisota, setFormVisota] = useState('');
    const [formShirina, setFormShirina] = useState('');
    const [formGlubina, setFormGlubina] = useState('');
    const [fromColl,setFromColl] = useState('');


    const [kryshka, setKryshkas] = useState('');
    const [bok, setBokas] = useState('');
    const [cargando, setCargando] = useState('');
    const [polca_dno, setPolca_dno] = useState('');
    const [fasadai, setFasadai] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        setVisota(Number(formVisota));
        setShirina(Number(formShirina));
        setGlubina(Number(formGlubina));
        setColl(Number(fromColl));


        if (mebel === 2) {
            setKryshkas(formShirina + ' : ' + (Number(formGlubina) + 16) + ' ' + fromColl * 1 + 'шт');
            setBokas((Number(formVisota) - 16) + ' : ' + formGlubina + ' ' + fromColl * 2 + 'шт');
            setCargando((Number(formShirina) - 32) + ' : 70 ' + ' ' + fromColl * 1 + 'шт');
            setPolca_dno((Number(formShirina) - 32) + ' : ' + formGlubina + ' ' + fromColl * 5 + 'шт');
            setFasadai(((Number(formShirina) / 2) - 4) + ' : 730 ' + ' ' + fromColl * 2 + 'шт');
        }

        else{
            setKryshkas('');
            setBokas('');
            setCargando('');
            setPolca_dno('');
            setFasadai('')
        }

        console.log("Итоговые данные:", {
            visota: Number(formVisota),
            shirina: Number(formShirina),
            glubina: Number(formGlubina)
        });
    };

    return (
        <div className="it_spashel">
            <div className="it_spashel__mebeli">
                <button onClick={() => tipMebeli(0)}
                        className={`${mebel === 0 ?
                            "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>1
                    Однотумбовый стол
                </button>
                <button onClick={() => tipMebeli(1)}
                        className={`${mebel === 1 ?
                            "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>2
                    Двухтумбовый стол
                </button>
                <button onClick={() => tipMebeli(2)}
                        className={`${mebel === 2 ?
                            "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>3
                    Шкаф
                    для документов
                </button>
                <button onClick={() => tipMebeli(3)}
                        className={`${mebel === 3 ?
                            "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>4
                    Шкаф
                    для одежды
                </button>
            </div>
            <div className="it_spashel__input">
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        placeholder="Высота"
                        value={formVisota}
                        onChange={(e) => setFormVisota(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Ширина"
                        value={formShirina}
                        onChange={(e) => setFormShirina(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Глубина"
                        value={formGlubina}
                        onChange={(e) => setFormGlubina(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Колличество"
                        value={fromColl}
                        onChange={(e) => setFromColl(e.target.value)}
                    />
                    <button type="submit">Посчитать</button>
                </form>

                <p>Высота: {visota}</p>
                <p>Ширина: {shirina}</p>
                <p>Глубина: {glubina}</p>
                <p>__________________________________________</p>
            </div>
            <div className="it_spashel__mebeli__itog">
                <p>крышка - {kryshka}</p>
                <p>бок - {bok}</p>
                <p>полка + дно - {polca_dno}</p>
                <p>царга - {cargando}</p>
                <p>двери - {fasadai}</p>
            </div>
        </div>
    );
};

export default ItSpashel;