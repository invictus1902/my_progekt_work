import React, {useState} from 'react';
import './sotrudnik.scss'
import HomeSVG from './img/home.svg'
import NewsSVG from './img/news.svg'

const Sotrudnik = () => {
    const [state, setState] = useState(1)
    const nav = (e) => {
        setState(e)
    };

    return (
        <div className="sotrudnik">
            <div className="sotrudnik__nav_menu">
                <p onClick={() => nav(1)}
                   className={`${state === 1 ? 'sotrudnik__nav_menu__active' : 'sotrudnik__nav_menu__no_active'}`}>
                    <img src={HomeSVG} alt=""/> Home</p>
                <p onClick={() => nav(2)}
                   className={`${state === 2 ? 'sotrudnik__nav_menu__active' : 'sotrudnik__nav_menu__no_active'}`}>
                    <img src={NewsSVG} alt=""/>News</p>
            </div>
            <div className="sotrednik__content">
                <div className={`${state === 1 ? 'sotrudnik__content__home' : 'none'}`}>
                    <h1>Панель сотрудника</h1>
                    <div className="sotrudnik__content__home__work_info">
                        <div className="sotrudnik__content__work_info__left"></div>
                        <div className="sotrudnik__content__work_info__right"></div>
                    </div>
                </div>
                <div className={`${state === 2 ? 'sotrudnik__content__news' : 'none'}`}>
                    <h1>News</h1>
                </div>
            </div>
        </div>);
};

export default Sotrudnik;