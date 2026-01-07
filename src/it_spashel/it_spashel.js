import React, {useState} from "react";
import './it_spashel.scss';
import {CustomContext} from "../Context";
import Odno_stol from './img_mebel/odnotumboviy_stol.png'
import Dvuh from './img_mebel/двухтумбовый_стол.jpg'
import Shkaf_dok from './img_mebel/шкаф_для_документов.jpg'
import Shkaf_odejda from './img_mebel/шкаф_для_одежды_2двери.jpg'
import Penal_Odej from './img_mebel/шкаф_пенал_для_одежды.jpg'
import Penal_Dok from './img_mebel/шкаф_пенал_для_доку.jpg'
import Stol_pristavka from './img_mebel/стол_приставка.jpg'
import TumbaYshik from './img_mebel/тумба с полкой и ящикаи.png'
import ShkafPolkaZak from './img_mebel/шкаф полка.jpg'
import ShkafOdPere from './img_mebel/Шкаф для одежды с перегородкой по центру.jpg'
import Tumbochka from './img_mebel/тумбачка маленькая.jpg'
import TumbaPolkaDno from './img_mebel/Тумба с полкаой и дном.jpg'
import ShkafStellaj from './img_mebel/шкаф стеллаж.jpg'
import ShafSoSteklon1 from './img_mebel/шкаф_со_стеклом.jpeg'
import ShafSoSteklon2 from './img_mebel/шкаф_для_документов_со_стеклом.jpg'
import Stol_3_yshika from './img_mebel/1 тумбовый стол 3ящика.webp'


const CALCULATORS = {
    1: ({visota, shirina, glubina, coll, tumbaStola, stoleshka, utolsh}) => {
        const newResult = {};
        if (stoleshka) {
            newResult.bok = `бок - ${visota - 50} : ${glubina - 100} ${coll * 3}шт`;
            newResult.zadnay_stenka = `задняя стенка - ${tumbaStola - 32} : ${visota - 50} ${coll}шт`;
            newResult.fasad = `фасад - 148 : ${tumbaStola - 2} ${coll}шт`;
            newResult.dveri = `двери - ${visota - 274} : ${tumbaStola - 2} ${coll}шт`;
        } else if (utolsh) {
            newResult.stol = `стол - ${shirina + 10} : ${glubina + 10} ${coll}шт`;
            newResult.untol1 = `утолщенка - ${shirina + 10} : 100 ${coll * 2}шт`
            newResult.untol2 = `утолщенка - ${glubina - 190} : 100 ${coll * 2}шт`
            newResult.bok = `бок - ${visota - 32} : ${glubina - 100} ${coll * 3}шт`;
            newResult.zadnay_stenka = `задняя стенка - ${tumbaStola - 32} : ${visota - 32} ${coll}шт`;
            newResult.fasad = `фасад - 148 : ${tumbaStola - 2} ${coll}шт`;
            newResult.dveri = `двери - ${visota - 256} : ${tumbaStola - 2} ${coll}шт`;
        } else {
            newResult.stol = `стол - ${shirina} : ${glubina} ${coll}шт`;
            newResult.bok = `бок - ${visota - 16} : ${glubina - 100} ${coll * 3}шт`;
            newResult.zadnay_stenka = `задняя стенка - ${tumbaStola - 32} : ${visota - 16} ${coll}шт`;
            newResult.fasad = `фасад - 148 : ${tumbaStola - 2} ${coll}шт`;
            newResult.dveri = `двери - ${visota - 240} : ${tumbaStola - 2} ${coll}шт`;
        }
        newResult.polca_dno = `полка+дно - ${tumbaStola - 32} : ${glubina - 116} ${coll * 2}шт`;
        newResult.carga = `царга - ${tumbaStola - 32} : 70 ${coll}шт`;
        newResult.cargaStol = `царга - ${shirina - 116 - tumbaStola} : 500 ${coll}шт`;
        newResult.yshikDlina = `ящик - 450 : 100 ${coll * 2}шт`;
        newResult.yshikShirina = `ящик - ${tumbaStola - 64 - 24} : 100 ${coll * 2}шт`;
        newResult.plashka = `планка - ${tumbaStola - 32} : 100 ${coll * 2}шт`;

        return newResult;
    },

    2: ({visota, shirina, glubina, coll, tumbaStola}) => {
        const newResult = {};
        newResult.stol = `стол - ${shirina} : ${glubina} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina - 100} ${coll * 4}шт`;
        newResult.carga = `царга - ${tumbaStola - 32} : 70 ${coll * 2}шт`;
        newResult.plashka = `планка - ${tumbaStola - 32} : 100 ${coll * 4}шт`;
        newResult.polca_dno = `покла+дно - ${tumbaStola - 32} : ${glubina - 116} ${coll * 4}шт`;
        newResult.zadnay_stenka = `задняя стенка - ${tumbaStola - 32} : ${visota - 16} ${coll * 2}шт`;
        newResult.yshikDlina = `ящик - 450 : 100 ${coll * 4}шт`;
        newResult.yshikShirina = `ящик - ${tumbaStola - 64 - 24} : 100 ${coll * 4}шт`;
        newResult.cargaStol = `царга - ${shirina - 100 - (tumbaStola * 2)} : 500 ${coll}шт`;
        newResult.fasad = `фасад - 148 : ${tumbaStola - 2} ${coll * 2}шт`;
        newResult.dveri = `двери - ${visota - 240} : ${tumbaStola - 2} ${coll * 2}шт`;
        return newResult;
    },

    3: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        if (shirina > 600 && shirina < 850) {
            newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
            newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
            newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
            newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 5}шт`;
            newResult.dveri = `двери - ${shirina / 2 - 4} : 730 ${coll * 2}шт`;
        } else if (shirina > 850 && shirina < 1001) {
            newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
            newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
            newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
            newResult.peregorodka = `перегородка - ${visota - 102} : ${glubina} ${coll}шт`;
            newResult.polca_L = `полка левая - 476 : ${glubina} ${coll}шт`;
            newResult.polca_R = `полка правая - ${(shirina - 500) - 24} : ${glubina} ${coll * 4}шт`;
            newResult.dno = `бок - ${shirina - 32} : ${glubina} ${coll}шт`;
            newResult.fasad_R = `фасад левый - ${shirina - 504} : 730 ${coll}шт`;
            newResult.fasad_L = `фасад правый - ${visota - (20 + 70)} : 496 ${coll}шт`;
        }

        return newResult;
    },

    4: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 2}шт`;
        newResult.fasad = `фасад - ${(shirina / 2) - 4} : ${visota - 90} ${coll * 2}шт`;
        return newResult;
    },

    5: ({visota, shirina, glubina, coll, dveri}) => {
        const newResult = {};
        if (shirina < 601) {
            newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
            newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
            newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
            if (dveri === true) {
                newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 2}шт`;
                newResult.fasad = `фасад - ${shirina - 2} : ${visota - 90} ${coll}шт`;
            } else {
                newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 5}шт`;
                newResult.fasad = `фасад - ${shirina - 2} : 730 ${coll}шт`;
            }
        } else {
            throw new Error('слишком большой размер для пенала');
        }
        return newResult;
    },

    6: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.stol = `стол - ${shirina} : ${glubina} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina - 100} ${coll * 2}шт`;
        newResult.cargaStol = `царга - ${shirina - 132} : 500 ${coll}шт`;
        return newResult;
    },

    7: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.plashka = `планка - ${shirina - 32} : 100 ${coll * 2}шт`;
        newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina - 16} ${coll * 2}шт`;
        newResult.zadnay_stenka = `задняя стенка - ${shirina - 32} : ${visota - 16} ${coll}шт`;
        newResult.yshikDlina = `ящик - 450 : 100 ${coll * 2}шт`;
        newResult.yshikShirina = `ящик - ${shirina - 64 - 24} : 100 ${coll * 2}шт`;
        newResult.fasad = `фасад - 148 : ${shirina - 2} ${coll}шт`;
        newResult.dveri = `двери - ${visota - 240} : ${shirina - 2} ${coll}шт`;
        return newResult;
    },

    8: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 5}шт`;
        newResult.dveri = `двери - ${visota - 90} : ${(shirina / 2) - 4} ${coll * 2}шт`
        return newResult;
    },

    9: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.peregorodka = `перегородка - ${visota - 102} : ${glubina} ${coll}шт`;
        newResult.polka = `полка - ${(shirina / 2) - 24} : ${glubina} ${coll * 2}шт`;
        newResult.dno = `дно - ${shirina - 32} : ${glubina} ${coll}шт`
        newResult.dveri = `двери - ${visota - 90} : ${(shirina / 2) - 4} ${coll * 2}шт`
        return newResult;
    },

    10: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.polka_dno = `полка+дно - ${shirina - 32} : ${glubina - 16} ${coll * 2}шт`;
        newResult.zadnay_stenka = `задняя стенка - ${shirina - 32} : ${visota - 16} ${coll}шт`;
        newResult.yshikDlina = `ящик - 450 : 100 ${coll * 6}шт`;
        newResult.yshikShirina = `ящик - ${shirina - 64 - 24} : 100 ${coll * 6}шт`;
        newResult.fasad = `фасад - ${(visota - 286) / 3 - 4} : ${shirina - 2} ${coll * 3}шт`;
        return newResult;
    },

    11: ({visota, shirina, glubina, coll, call_dveri, stoleshka}) => {
        const newResult = {};
        if (stoleshka === true) {
            newResult.bok = `бок - ${visota - 50} : ${glubina - 50} ${coll * 2}шт`;
            newResult.peregorodka = `перегородка - ${visota - 136} : ${glubina - 50} ${coll}шт`
            newResult.fasad = `фасад - ${visota - 124} : ${(shirina / call_dveri) - 4} ${coll * call_dveri}шт`;
        } else {
            newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`
            newResult.bok = `бок - ${visota - 16} : ${glubina - 50} ${coll * 2}шт`;
            newResult.peregorodka = `перегородка - ${visota - 102} : ${glubina - 50} ${coll}шт`
            newResult.fasad = `фасад - ${visota - 90} : ${(shirina / call_dveri) - 4} ${coll * call_dveri}шт`;
        }
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.dno = `дно - ${shirina - 32} : ${glubina - 50} ${coll}шт`;
        if (call_dveri % 2 !== 0) {
            newResult.plashka_L = `планка левая - ${(shirina / call_dveri) * 2 - 24} : 100 ${coll * 2}шт`;
            newResult.plashka_R = `планка правая - ${(shirina / call_dveri) - 24} : 100 ${coll * 2}шт`;
            newResult.polka_L = `полка левая - ${(shirina / call_dveri) * 2 - 24} : ${glubina - 50} ${coll}шт`;
            newResult.polka_R = `полка правая - ${(shirina / call_dveri) - 24} : ${glubina - 50} ${coll}шт`;
        } else if (call_dveri % 2 === 0) {
            newResult.plashka = `планка - ${(shirina / call_dveri) * 2 - 24} : 100 ${coll * 4}шт`;
            newResult.polka = `полка - ${(shirina / call_dveri) * 2 - 24} : ${glubina - 50} ${coll * 2}шт`;
        }

        return newResult;
    },

    12: ({visota, shirina, glubina, coll, call_dveri}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 6}шт`;
        // newResult.peregorodka = `перегородка - ${visota - 102} : ${glubina} ${coll}шт`;
        // newResult.dno = `дно - ${shirina - 32} : ${glubina} ${coll}шт`;
        // if (call_dveri % 2 !== 0) {
        //     newResult.polka_L = `полка левая - ${(shirina / call_dveri) * 2 - 24} : ${glubina} ${coll * 4}шт`;
        //     newResult.polka_R = `полка правая - ${(shirina / call_dveri) - 24} : ${glubina} ${coll * 4}шт`;
        // } else if (call_dveri % 2 === 0) {
        //     newResult.polka = `полка - ${(shirina / call_dveri) * 2 - 24} : ${glubina} ${coll * 4}шт`;
        // }
        return newResult;
    },

    13: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 5}шт`;
        newResult.planki_dveri = `планки для дверей со стеклом - 2700 : 68 ${coll * 3}шт`;
        return newResult;
    },

    14: ({visota, shirina, glubina, coll}) => {
        const newResult = {};
        newResult.kryshka = `крышка - ${shirina} : ${glubina + 16} ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina} ${coll * 2}шт`;
        newResult.carga = `царга - ${shirina - 32} : 70 ${coll}шт`;
        newResult.polca_dno = `полка+дно - ${shirina - 32} : ${glubina} ${coll * 5}шт`;
        newResult.dveri = `двери - 730 : ${shirina / 2 - 4} ${coll * 2}шт`;
        newResult.planki_dveri = `планки для дверей со стеклом - 2700 : 60 ${coll * 3}шт`;
        newResult.dveri_stekla = `размеры фасада со стеклом - ${visota - 820} : ${shirina / 2 - 4} ${coll * 2}шт`;
        return newResult;
    },

    15: ({visota, shirina, glubina, coll, tumbaStola, stoleshka, utolsh}) => {
        const newResult = {};
        newResult.stol = `стол - ${shirina} : ${glubina} ${coll}шт`;
        newResult.cargaStol = `царга - ${shirina - 116 - tumbaStola} : 500 ${coll}шт`;
        newResult.bok = `бок - ${visota - 16} : ${glubina - 100} ${coll * 3}шт`;
        newResult.zadnay_stenka = `задняя стенка - ${tumbaStola - 32} : ${visota - 16} ${coll}шт`;
        newResult.polca_dno = `дно - ${tumbaStola - 32} : ${glubina - 116} ${coll}шт`;
        newResult.carga = `царга - ${tumbaStola - 32} : 70 ${coll}шт`;
        newResult.plashka = `планка - ${tumbaStola - 32} : 100 ${coll * 2}шт`;
        newResult.yshikDlina = `ящик - 450 : 150 ${coll * 6}шт`;
        newResult.yshikShirina = `ящик - ${tumbaStola - 64 - 24} : 150 ${coll * 6}шт`;
        newResult.fasad = `фасад - ${((visota - 86) / 3) - 4} : ${tumbaStola - 2} ${coll * 3}шт`;

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
        call_dveri: '',
        tumbaStola: '',
        dveri: false,
        stoleshka: false,
        utolsh: false
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
        setForm(prev => ({...prev, dveri: !prev.dveri}));
    };

    const tip_stola = () => {
        setForm(prev => ({...prev, stoleshka: !prev.stoleshka}));
    }

    const utolshonka = () => {
        setForm(prev => ({...prev, utolsh: !prev.utolsh}));
    }
    const handleChange = (key, value) => {
        setForm(prev => ({...prev, [key]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const visota = Number(form.visota);
        const shirina = Number(form.shirina);
        const glubina = Number(form.glubina);
        const coll = Number(form.coll);
        const tumbaStola = Number(form.tumbaStola);
        const call_dveri = Number(form.call_dveri);
        const dveri = !!form.dveri;
        const stoleshka = !!form.stoleshka;
        const utolsh = !!form.utolsh;

        try {
            const calc = CALCULATORS[mebel];
            if (!calc) {
                alert('Для выбранного типа мебели нет калькулятора.');
                return;
            }
            const newResult = calc({visota, shirina, glubina, coll, tumbaStola, dveri, stoleshka, call_dveri, utolsh});
            setResult(newResult);
        } catch (err) {
            alert(err.message || 'Ошибка в расчётах');
            setResult({});
        }

        console.log("Итоговые данные:", {visota, shirina, glubina, coll, tumbaStola});
    };

    return (
        <div className="it_spashel">
            <div className="it_spashel__mebeli">
                <div className="it_spashel__mebeli__button_img">
                    <img src={Odno_stol} alt=""/>
                    <button onClick={() => tipMebeli(1)}
                            className={`${mebel === 1 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        1 Однотумбовый стол
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={Dvuh} alt=""/>
                    <button onClick={() => tipMebeli(2)}
                            className={`${mebel === 2 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        2 Двухтумбовый стол
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={Shkaf_dok} alt=""/>
                    <button onClick={() => tipMebeli(3)}
                            className={`${mebel === 3 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        3 Шкаф для документов
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={Shkaf_odejda} alt=""/>
                    <button onClick={() => tipMebeli(4)}
                            className={`${mebel === 4 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        4 Шкаф для одежды
                    </button>
                </div>
                <div className="it_spashel__mebeli__dok">
                    <div className="it_spashel__mebeli__button_img">
                        <img src={Penal_Dok} alt=""/>
                        <button onClick={() => tipMebeli(5)}
                                className={`${mebel === 5 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                            5 Шкаф пенал
                        </button>
                    </div>
                    {mebel === 5 ? (
                        <div className="it_spashel__mebeli__button_img">
                            <img src={Penal_Odej} alt=""/>
                            <button
                                className={`${form.dveri === true ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}
                                onClick={() => dvrri_po_Z()}>
                                дверь во всей длине
                            </button>
                        </div>
                    ) : <p></p>}
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={Stol_pristavka} alt=""/>
                    <button onClick={() => tipMebeli(6)}
                            className={`${mebel === 6 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        6 Стол приставка
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={Tumbochka} alt=""/>
                    <button onClick={() => tipMebeli(7)}
                            className={`${mebel === 7 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        7 Тумба маленькая
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={ShkafPolkaZak} alt=""/>
                    <button onClick={() => tipMebeli(8)}
                            className={`${mebel === 8 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        8 Шкаф полка закрытый
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={ShkafOdPere} alt=""/>
                    <button onClick={() => tipMebeli(9)}
                            className={`${mebel === 9 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        9 Шкаф для одежды с перегородкой по центру
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={TumbaYshik} alt=""/>
                    <button onClick={() => tipMebeli(10)}
                            className={`${mebel === 10 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        10 Тумбочка с полкой на 200 и ящиками 3шт
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={TumbaPolkaDno} alt=""/>
                    <button onClick={() => tipMebeli(11)}
                            className={`${mebel === 11 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        11 Тумба с полкаой и дном
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={ShkafStellaj} alt=""/>
                    <button onClick={() => tipMebeli(12)}
                            className={`${mebel === 12 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        12 Шкаф стелаж
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={ShafSoSteklon1} alt=""/>
                    <button onClick={() => tipMebeli(13)}
                            className={`${mebel === 13 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        13 Шкаф книжный со стеклом
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={ShafSoSteklon2} alt=""/>
                    <button onClick={() => tipMebeli(14)}
                            className={`${mebel === 14 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        14 Шкаф для документов со стеклом
                    </button>
                </div>
                <div className="it_spashel__mebeli__button_img">
                    <img src={Stol_3_yshika} alt=""/>
                    <button onClick={() => tipMebeli(15)}
                            className={`${mebel === 15 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                        15 Однотумбовый стол c 3-ящиками
                    </button>
                </div>
            </div>

            <div className="it_spashel__input">
                <div className="it_spashel__input__button">
                    <button
                        className={`${form.stoleshka === true ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}
                        onClick={() => tip_stola()}>
                        Столешница
                    </button>
                    <button
                        className={`${form.utolsh === true ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}
                        onClick={() => utolshonka()}>
                        Утолщенка
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="Высота" value={form.visota}
                           onChange={e => handleChange('visota', e.target.value)}/>
                    <input type="number" placeholder="Ширина" value={form.shirina}
                           onChange={e => handleChange('shirina', e.target.value)}/>
                    <input type="number" placeholder="Глубина" value={form.glubina}
                           onChange={e => handleChange('glubina', e.target.value)}/>
                    <input className={`${mebel === 1 || mebel === 2 || mebel === 15 ? 'it_spashel__mebeli__itog' : 'none'}`}
                           type="number" placeholder="ширина тумбы" value={form.tumbaStola}
                           onChange={e => handleChange('tumbaStola', e.target.value)}/>
                    <input className={`${mebel === 11 ? 'it_spashel__mebeli__itog' : 'none'}`}
                           type="number"
                           placeholder="колл дверей" value={form.call_dveri}
                           onChange={e => handleChange('call_dveri', e.target.value)}/>

                    {/*<input className={`${mebel === 11 || mebel === 12 ? 'it_spashel__mebeli__itog' : 'none'}`}*/}
                    {/*       type="number" */}
                    {/*       placeholder="колл дверей" value={form.call_dveri} */}
                    {/*       onChange={e => handleChange('call_dveri', e.target.value)}/>*/}
                    <input type="number" placeholder="Колличество" value={form.coll}
                           onChange={e => handleChange('coll', e.target.value)}/>
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
                            {value}
                        </p>
                    ))
                )}
            </div>

        </div>
    );
};

export default ItSpashel;
