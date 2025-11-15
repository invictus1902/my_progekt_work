import React, { useState } from "react";
import './it_spashel.scss';
import { CustomContext } from "../Context";

const ItSpashel = () => {
    const {} = CustomContext;

    const [mebel, setMebel] = useState(0);
    const [formVisota, setFormVisota] = useState('');
    const [formShirina, setFormShirina] = useState('');
    const [formGlubina, setFormGlubina] = useState('');
    const [fromColl, setFromColl] = useState('');
    const [formTumbaStola, setFormTumbaStola] = useState('');

    const [result, setResult] = useState({});

    const tipMebeli = (tip) => setMebel(tip);

    const handleSubmit = (e) => {
        e.preventDefault();

        const visota = Number(formVisota);
        const shirina = Number(formShirina);
        const glubina = Number(formGlubina);
        const coll = Number(fromColl);
        const tumbaStola = Number(formTumbaStola);

        const newResult = {};

        if (mebel === 0) {
            newResult.stol = `${shirina} : ${glubina} ${coll}шт`;
            newResult.bok = `${visota - 16} : ${glubina - 100} ${coll * 3}шт`;
            newResult.polca_dno = `${tumbaStola - 32} : ${glubina - 116} ${coll * 2}шт`;
            newResult.cargando = `${tumbaStola - 32} : 70 ${coll}шт`;
            newResult.cargaStol = `${shirina - 116 - tumbaStola} : 500 ${coll}шт`;
            newResult.yshikDlina = `450 : 100 ${coll * 2}шт`;
            newResult.yshikShirina = `${tumbaStola - 64 - 24} : 100 ${coll * 2}шт`;
            newResult.plashka = `${tumbaStola - 32} : 100 ${coll * 2}шт`;
            newResult.fasad = `146 : ${tumbaStola - 2} ${coll}шт`;
            newResult.fasadai = `${visota - 240} : ${tumbaStola - 2} ${coll}шт`;
        } else if (mebel === 2) {
            if (shirina > 600 && shirina < 850) {
                newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
                newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
                newResult.cargando = `${shirina - 32} : 70 ${coll}шт`;
                newResult.polca_dno = `${shirina - 32} : ${glubina} ${coll * 5}шт`;
                newResult.fasadai = `${shirina / 2 - 4} : 730 ${coll * 2}шт`;
            }
            else if (shirina < 600){
                newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
                newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
                newResult.cargando = `${shirina - 32} : 70 ${coll}шт`;
                newResult.polca_dno = `${shirina - 32} : ${glubina} ${coll * 5}шт`;
                newResult.fasadai = `${shirina - 2} : 730 ${coll * 2}шт`;
            }
            else if (shirina > 850 && shirina < 950) {
                newResult.kryshka = `${shirina} : ${glubina + 16} ${coll}шт`;
                newResult.bok = `${visota - 16} : ${glubina} ${coll * 2}шт`;
                newResult.cargando = `${shirina - 32} : 70 ${coll}шт`;
                newResult.peregorodka = `${visota - 102} : ${glubina} ${coll}шт`;
                newResult.polca_L = `476 : ${glubina} ${coll}шт`;
                newResult.polca_R = `${(shirina - 500)-24} : ${glubina} ${coll * 4}шт`;
                newResult.dno = `${shirina - 32} : ${glubina} ${coll}шт`;
                newResult.fasadai_R = `${shirina - 504} : 730 ${coll}шт`
            }
        }

        setResult(newResult);
    };

    return (
        <div className="it_spashel">
            <div className="it_spashel__mebeli">
                <button onClick={() => tipMebeli(0)} className={`${mebel === 0 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    1 Однотумбовый стол
                </button>
                <button onClick={() => tipMebeli(1)} className={`${mebel === 1 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    2 Двухтумбовый стол
                </button>
                <button onClick={() => tipMebeli(2)} className={`${mebel === 2 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    3 Шкаф для документов
                </button>
                <button onClick={() => tipMebeli(3)} className={`${mebel === 3 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    4 Шкаф для одежды
                </button>
                <button onClick={() => tipMebeli(4)} className={`${mebel === 4 ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>
                    5 Шкаф пенал
                </button>
            </div>

            <div className="it_spashel__input">
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="Высота" value={formVisota} onChange={e => setFormVisota(e.target.value)} />
                    <input type="number" placeholder="Ширина" value={formShirina} onChange={e => setFormShirina(e.target.value)} />
                    <input type="number" placeholder="Глубина" value={formGlubina} onChange={e => setFormGlubina(e.target.value)} />
                    <input className={`${mebel === 0 ? 'it_spashel__mebeli__itog' : 'none'}`} type="number" placeholder="ширина тумбы" value={formTumbaStola} onChange={e => setFormTumbaStola(e.target.value)} />
                    <input type="number" placeholder="Колличество" value={fromColl} onChange={e => setFromColl(e.target.value)} />
                    <button type="submit">Посчитать</button>
                </form>

                <p>Высота: {formVisota}</p>
                <p>Ширина: {formShirina}</p>
                <p>Глубина: {formGlubina}</p>
                <p>__________________________________________</p>
            </div>

            <div className={`${mebel === 2 ? 'it_spashel__mebeli__itog' : 'none'}`}>
                <p>крышка - {result.kryshka}</p>
                <p>бок - {result.bok}</p>
                <p>полка + дно - {result.polca_dno}</p>
                <p>царга - {result.cargando}</p>
                <p>перегородка - {result.peregorodka}</p>
                <p>двери - {result.fasadai}</p>
            </div>

            <div className={`${mebel === 0 ? 'it_spashel__mebeli__itog' : 'none'}`}>
                <p>стол - {result.stol}</p>
                <p>бок - {result.bok}</p>
                <p>полка + дно - {result.polca_dno}</p>
                <p>царга - {result.cargando}</p>
                <p>царга - {result.cargaStol}</p>
                <p>ящик длинна - {result.yshikDlina}</p>
                <p>ящик ширина - {result.yshikShirina}</p>
                <p>плашка - {result.plashka}</p>
                <p>фасад - {result.fasad}</p>
                <p>двери - {result.fasadai}</p>
            </div>
        </div>
    );
};

export default ItSpashel;
