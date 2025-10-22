import React from 'react';
import './sing_in.scss'

const SingIn = () => {
    return (
        <div className="sing_in">
            <div className="sing_in__main">
                <div className="sing_in__main__top">
                    <a href="/">
                        <div className="sing_in__main__top__x">
                            <div className="sing_in__main__top__x__left"></div>
                            <div className="sing_in__main__top__x__right"></div>
                        </div>
                    </a>
                </div>
                <div className="sing_in__main__center">
                    <h1>TimeTrack</h1>
                    <p>Войдите, чтобы продолжить работу</p>
                </div>
                <div className="sing_in__main__bottom">
                    <form action="">
                        <p>Электронная почта</p>
                        <input type="text" placeholder="ваша.почта@example.com"/>
                        <p>Пароль</p>
                        <input type="text" placeholder="Введите ваш пароль"/>
                        <button>Войти</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SingIn;