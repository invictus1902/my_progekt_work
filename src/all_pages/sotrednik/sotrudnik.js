import React,{useState} from 'react';
import './sotrudnik.scss'

const Sotrudnik = () => {
    const [state, setState] = useState(1)
    const nav = (e)=>{
        setState(e)
    };

    return (
        <div className="sotrudnik">
            <div className="sotrudnik__nav_menu">
                <p onClick={()=>nav(1)}>Home</p>
                <p onClick={()=>nav(2)}>News</p>
            </div>
            <div className="sotrednik__content">
                <div className={`${state === 1 ? 'sotrudnik__content__home': 'none'}`}>
                    <h1>Home</h1>
                </div>
                <div className={`${ state === 2 ? 'sotrudnik__content__news':'none'}`}>
                    <h1>News</h1>
                </div>
            </div>
        </div>
    );
};

export default Sotrudnik;