import React, {Component, useContext} from 'react';
import "./home.scss";
import {CustomContext} from "../Context";

class Home extends Component {
    static contextType = CustomContext;

    render() {
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
        } = this.context;
        return (
            <main className="home">
                <div className="home__mebeli">
                    <button onClick={() => tipMebeli('1')}
                            className={`${mebel === '1' ? "home__mebeli__active" : "home__mebeli__no_active"}`}>1
                        Однотумбовый стол
                    </button>
                    <button onClick={() => tipMebeli('2')}
                            className={`${mebel === '2' ? "home__mebeli__active" : "home__mebeli__no_active"}`}>2
                        Двухтумбовый стол
                    </button>
                    <button onClick={() => tipMebeli('3')}
                            className={`${mebel === '3' ? "home__mebeli__active" : "home__mebeli__no_active"}`}>3 Шкаф
                        для документов
                    </button>
                    <button onClick={() => tipMebeli('4')}
                            className={`${mebel === '4' ? "home__mebeli__active" : "home__mebeli__no_active"}`}>4 Шкаф
                        для одежды
                    </button>
                </div>
                <div className="home__input">
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
            </main>
        );
    }
}

export default Home;