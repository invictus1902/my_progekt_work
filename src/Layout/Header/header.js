import React, {Component, useEffect, useState} from 'react';
import './header.scss';
import logo from '../img_layout/logo.svg'
import Avatar from '../img_layout/avatar_img.jpg'
import exit_img from '../img_layout/exit_img.svg'
import {useLocation} from 'react-router-dom'

const Header = () => {
    const [path, setPath] = useState();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/') {
            setPath('/');
        } else if (location.pathname === '/admin') {
            setPath('/admin');
        } else if (location.pathname === '/sotrudnik') {
            setPath('/sotrudnik');
        }
    }, []);
    console.log(path)

    return (
        <header className="header container">
            <div className="header__left">
                <a href="/">
                    <img src={logo} alt=""/>
                </a>
                <div className="header__left__nav">
                    <a href="/sotrudnik">
                        <p className={`${path === '/sotrudnik' ? 'header__left__nav__active_p' : 'header__left__nav__p'}`}>Панель сотрудника</p>
                    </a>
                    <a href="/admin">
                        <p className={`${path === '/admin' ? 'header__left__nav__active_p' : 'header__left__nav__p'}`}>Панель администратора</p>
                    </a>
                </div>
            </div>
            <div className="header__right">
                <a href="/sing_in">
                    <button><img src={exit_img} alt=""/> Exit</button>
                </a>
                <img src={Avatar} alt=""/>
            </div>
        </header>
    );
};

export default Header;