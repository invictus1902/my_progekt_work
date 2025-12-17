import React, { useContext } from 'react';
import './header.scss';
import logo from '../img_layout/logo.svg'; // поправь путь, если нужно
import defaultAvatar from '../img_layout/avatar_img.jpg'; // заглушка
import exitImg from '../img_layout/exit_img.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CustomContext } from '../../Context'; // путь к твоему Context


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useContext(CustomContext); // будем брать из контекста
    console.log('Header рендерится. currentUser:', currentUser);

    // Если вдруг currentUser ещё не загрузился — не рендерим хедер
    if (!currentUser) return null;

    const handleLogout = () => {
        logout(); // функция из контекста, очистим состояние
        navigate('/'); // на страницу логина
    };

    // Определяем активный путь (упростим логику)
    const isActive = (path) => location.pathname === path;

    return (
        <header className="header container">
            <div className="header__left">
                <Link to="/home">
                    <img src={logo} alt="TimeTrack Logo" className="header__logo" />
                </Link>

                <nav className="header__nav">
                    {currentUser.role === 'user' && (
                        <Link to="/sotrudnik">
                            <p className={isActive('/sotrudnik') ? 'active' : ''}>
                                Панель сотрудника
                            </p>
                        </Link>
                    )}

                    {currentUser.role === 'admin' && (
                        <>
                            <Link to="/admin">
                                <p className={isActive('/admin') ? 'active' : ''}>
                                    Панель администратора
                                </p>
                            </Link>
                            <Link to="/sotrudnik">
                                <p className={isActive('/sotrudnik') ? 'active' : ''}>
                                    Моя панель
                                </p>
                            </Link>
                        </>
                    )}
                    <Link to="/catalog">
                        <p className={isActive('/catalog') ? 'active' : ''}>
                            Каталог мебели
                        </p>
                    </Link>
                    <Link to="/it_spashel">
                        <p className={isActive('/it_spashel') ? 'active' : ''}>
                            Каталог мебели старый
                        </p>
                    </Link>

                    {/* Примеры других ссылок — раскомментируй при необходимости */}
                    {/* <Link to="/catalog">
                        <p className={isActive('/catalog') ? 'active' : ''}>Каталог мебели</p>
                    </Link> */}
                </nav>
            </div>

            <div className="header__right">
                <button onClick={handleLogout} className="header__logout-btn">
                    <img src={exitImg} alt="" />
                    Выйти
                </button>

                <div className="header__user">
                    <img
                        src={currentUser.avatar || defaultAvatar}
                        alt="Avatar"
                        className="header__avatar"
                    />
                    <span className="header__username">{currentUser.fullName}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;