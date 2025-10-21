import React from 'react';
import './it_spashel.scss'
import {CustomContext} from "../Context";


const ItSpashel = () => {
    const {
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
    } = CustomContext
    return (
        <div className="it_spashel">
            <div className="it_spashel__mebeli">
                <button onClick={() => tipMebeli('0')}
                        className={`${mebel === '0' ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>1
                    Однотумбовый стол
                </button>
                <button onClick={() => tipMebeli('1')}
                        className={`${mebel === '1' ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>2
                    Двухтумбовый стол
                </button>
                <button onClick={() => tipMebeli('2')}
                        className={`${mebel === '2' ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>3
                    Шкаф
                    для документов
                </button>
                <button onClick={() => tipMebeli('3')}
                        className={`${mebel === '3' ? "it_spashel__mebeli__active" : "it_spashel__mebeli__no_active"}`}>4
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
                    <button type="submit">Посчитать</button>
                </form>

                <p>Высота: {visota}</p>
                <p>Ширина: {shirina}</p>
                <p>Глубина: {glubina}</p>
            </div>
        </div>
    );
};

export default ItSpashel;