import React, { useState } from "react";
import './it_spashel.scss';
import axios from "axios";
import { CustomContext } from "../Context";

const CALCULATORS = {
    1: ({ visota, shirina, glubina, coll, tumbaStola }) => {
        const newResult = {};
        newResult.stol = `${shirina} : ${glubina} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina - 100} ${coll * 3}шт`;
        newResult.polca_dno = `${tumbaStola - 32} : ${glubina - 116} ${coll * 2}шт`;
        newResult.carga = `${tumbaStola - 32} : 70 ${coll}шт`;
        newResult.zadnay_stenka = `${tumbaStola - 32} : ${visota - 16} ${coll}шт`;
        newResult.cargaStol = `${shirina - 116 - tumbaStola} : 500 ${coll}шт`;
        newResult.yshikDlina = `450 : 100 ${coll * 2}шт`;
        newResult.yshikShirina = `${tumbaStola - 64 - 24} : 100 ${coll * 2}шт`;
        newResult.plashka = `${tumbaStola - 32} : 100 ${coll * 2}шт`;
        newResult.fasad = `148 : ${tumbaStola - 2} ${coll}шт`;
        newResult.dveri = `${visota - 240} : ${tumbaStola - 2} ${coll}шт`;
        return newResult;
    },

    2: ({ visota, shirina, glubina, coll, tumbaStola }) => {
        const newResult = {};
        newResult.stol = `${shirina} : ${glubina} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina - 100} ${coll * 4}шт`;
        newResult.carga = `${tumbaStola - 32} : 70 ${coll * 2}шт`;
        newResult.plashka = `${tumbaStola - 32} : 100 ${coll * 4}шт`;
        newResult.polca_dno = `${tumbaStola - 32} : ${glubina - 116} ${coll * 4}шт`;
        newResult.zadnay_stenka = `${tumbaStola - 32} : ${visota - 16} ${coll * 2}шт`;
        newResult.yshikDlina = `450 : 100 ${coll * 4}шт`;
        newResult.yshikShirina = `${tumbaStola - 64 - 24} : 100 ${coll * 4}шт`;
        newResult.cargaStol = `${shirina - 100 - (tumbaStola * 2)} : 500 ${coll}шт`;
        newResult.fasad = `148 : ${tumbaStola - 2} ${coll * 2}шт`;
        newResult.dveri = `${visota - 240} : ${tumbaStola - 2} ${coll * 2}шт`;
        return newResult;
    },

    3: ({ visota, shirina, glubina, coll }) => {
        const newResult = {};
        if (shirina > 600 && shirina < 850) {
            newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
            newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
            newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
            newResult.polca_dno = `${shirina - 32} : ${glubina} ${coll * 5}шт`;
            newResult.dveri = `${shirina / 2 - 4} : 730 ${coll * 2}шт`;
        } else if (shirina > 850 && shirina < 1001) {
            newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
            newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
            newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
            newResult.peregorodka = `${visota - 102} : ${glubina} ${coll}шт`;
            newResult.polca_L = `476 : ${glubina} ${coll}шт`;
            newResult.polca_R = `${(shirina - 500) - 24} : ${glubina} ${coll * 4}шт`;
            newResult.dno = `${shirina - 32} : ${glubina} ${coll}шт`;
            newResult.fasad_R = `${shirina - 504} : 730 ${coll}шт`;
            newResult.fasad_L = `${visota - (20 + 70)} : 496 ${coll}шт`;
        }
        return newResult;
    },

    4: ({ visota, shirina, glubina, coll }) => {
        const newResult = {};
        newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `${shirina - 32} : ${glubina} ${coll * 2}шт`;
        newResult.fasad = `${(shirina / 2) - 4} : ${visota - 90} ${coll * 2}шт`;
        return newResult;
    },

    5: ({ visota, shirina, glubina, coll, dveri }) => {
        const newResult = {};
        if (shirina < 601) {
            newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
            newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
            newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
            newResult.polca_dno = `${shirina - 32} : ${glubina} ${coll * 5}шт`;
            if (dveri === true) {
                newResult.fasad = `${shirina - 2} : ${visota - 88} ${coll}шт`;
            } else {
                newResult.fasad = `${shirina - 2} : 730 ${coll}шт`;
            }
        } else {
            throw new Error('слишком большой размер для пенала');
        }
        return newResult;
    },

    6: ({ visota, shirina, glubina, coll }) => {
        const newResult = {};
        newResult.stol = `${shirina} : ${glubina} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina - 100} ${coll * 2}шт`;
        newResult.cargaStol = `${shirina - 132} : 500 ${coll}шт`;
        return newResult;
    },

    7: ({ visota, shirina, glubina, coll }) => {
        const newResult = {};
        newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
        newResult.plashka = `${shirina - 32} : 100 ${coll * 2}шт`;
        newResult.polca_dno = `${shirina - 32} : ${glubina - 16} ${coll * 2}шт`;
        newResult.zadnay_stenka = `${shirina - 32} : ${visota - 16} ${coll}шт`;
        newResult.yshikDlina = `450 : 100 ${coll * 2}шт`;
        newResult.yshikShirina = `${shirina - 64 - 24} : 100 ${coll * 2}шт`;
        newResult.fasad = `148 : ${shirina - 2} ${coll}шт`;
        newResult.dveri = `${visota - 240} : ${shirina - 2} ${coll}шт`;
        return newResult;
    },

    8: ({ visota, shirina, glubina, coll }) => {
        const newResult = {};
        newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `${shirina - 32} : ${glubina} ${coll * 5}шт`;
        newResult.dveri = `${visota - 90} : ${(shirina / 2) - 4} ${coll *2}шт`
        return newResult;
    },

    9: ({ visota, shirina, glubina, coll }) => {
        const newResult = {};
        newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `${shirina - 32} : 70 ${coll}шт`;
        newResult.peregorodka = `${visota - 102} : ${glubina} ${coll}шт`;
        newResult.polka = `${(shirina / 2) - 24} : ${glubina} ${coll * 4}шт`;
        newResult.dno = `${shirina - 32} : ${glubina} ${coll}шт`
        newResult.dveri = `${visota - 90} : ${(shirina / 2) - 4} ${coll *2}шт`
        return newResult;
    }
};

const ItSpashel = () => {
    const {} = CustomContext;

    // unified form state (strings from inputs)
    const [form, setForm] = useState({
        visota: '',
        shirina: '',
        glubina: '',
        coll: '',
        tumbaStola: '',
        dveri: false
    });

    // current selected furniture type (keeps old numeric mebel)
    const [mebel, setMebel] = useState(0);

    // result object (dynamic keys)
    const [result, setResult] = useState({});

    const tipMebeli = (tip) => {
        setMebel(tip);
        setResult({});
    };

    const dvrri_po_Z = () => {
        setForm(prev => ({ ...prev, dveri: !prev.dveri }));
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const visota = Number(form.visota);
        const shirina = Number(form.shirina);
        const glubina = Number(form.glubina);
        const coll = Number(form.coll);
        const tumbaStola = Number(form.tumbaStola);
        const dveri = !!form.dveri;

        try {
            const calc = CALCULATORS[mebel];
            if (!calc) {
                alert('Для выбранного типа мебели нет калькулятора.');
                return;
            }
            const newResult = calc({ visota, shirina, glubina, coll, tumbaStola, dveri });
            setResult(newResult);
        } catch (err) {
            alert(err.message || 'Ошибка в расчётах');
            setResult({});
        }

        console.log("Итоговые данные:", { visota, shirina, glubina, coll, tumbaStola });
    };

    return (
        <div className="it_spashel">
            <div className="it_spashel__mebeli">
                <button onClick={() => tipMebeli(1)} className={`${mebel === 1 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    1 Однотумбовый стол
                </button>
                <button onClick={() => tipMebeli(2)} className={`${mebel === 2 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    2 Двухтумбовый стол
                </button>
                <button onClick={() => tipMebeli(3)} className={`${mebel === 3 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    3 Шкаф для документов
                </button>
                <button onClick={() => tipMebeli(4)} className={`${mebel === 4 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    4 Шкаф для одежды
                </button>
                <div className="it_spashel__mebeli__dok">
                    <button onClick={() => tipMebeli(5)} className={`${mebel === 5 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        5 Шкаф пенал
                    </button>
                    {mebel === 5 ? (
                        <button
                            className={`${form.dveri === true ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}
                            onClick={() => dvrri_po_Z()}>
                            дверь во всей длине
                        </button>
                    ) : <p></p>}
                </div>
                <button onClick={() => tipMebeli(6)} className={`${mebel === 6 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    6 Стол приставка
                </button>
                <button onClick={() => tipMebeli(7)} className={`${mebel === 7 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    7 Тумба маленькая
                </button>
                <button onClick={() => tipMebeli(8)} className={`${mebel === 8 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    8 Шкаф полка закрытый
                </button>
                <button onClick={() => tipMebeli(9)} className={`${mebel === 9 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    9 Шкаф для одежды с перегородкой по центру
                </button>
            </div>

            <div className="it_spashel__input">
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="Высота" value={form.visota} onChange={e => handleChange('visota', e.target.value)} />
                    <input type="number" placeholder="Ширина" value={form.shirina} onChange={e => handleChange('shirina', e.target.value)} />
                    <input type="number" placeholder="Глубина" value={form.glubina} onChange={e => handleChange('glubina', e.target.value)} />
                    <input className={`${mebel === 0 || mebel === 1 ? 'it_spashel__mebeli__itog' : 'none'}`} type="number" placeholder="ширина тумбы" value={form.tumbaStola} onChange={e => handleChange('tumbaStola', e.target.value)} />
                    <input type="number" placeholder="Колличество" value={form.coll} onChange={e => handleChange('coll', e.target.value)} />
                    <button type="submit">Посчитать</button>
                </form>

                <p>Высота: {form.visota}</p>
                <p>Ширина: {form.shirina}</p>
                <p>Глубина: {form.glubina}</p>
                <p>__________________________________________</p>
            </div>

            <div className="it_spashel__mebeli__itog">
                {Object.keys(result).length === 0 ? (
                    <p></p>
                ) : (
                    Object.entries(result).map(([name, value]) => (
                        <p key={name}>
                            {name} — {value}
                        </p>
                    ))
                )}
            </div>

        </div>
    );
};

export default ItSpashel;
