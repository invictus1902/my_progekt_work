import React, { useContext, useEffect, useState } from 'react';
import './sotrudnik.scss';
import HomeSVG from './img/home.svg';
import NewsSVG from './img/news.svg';
import { CustomContext } from '../../Context.js';

const Sotrudnik = () => {
    const { currentUser, workSessions, endShift } = useContext(CustomContext);
    const [activeTab, setActiveTab] = useState(1);
    const [liveWorkedTime, setLiveWorkedTime] = useState({}); // {sessionId: "X ч Y мин"}

    const today = new Date().toISOString().split('T')[0];

    // Все сессии сотрудника за сегодня
    const todaySessions = workSessions.filter(
        s => s.userId === currentUser?.id && s.date === today
    );

    // Активные сессии (для которых можно завершить)
    const activeSessions = todaySessions.filter(s => !s.endTime);

    // Суммарное отработанное время за сегодня (завершённые + живые)
    const totalMinutesToday = todaySessions.reduce((sum, s) => {
        if (s.durationMinutes !== null) return sum + s.durationMinutes;
        return sum;
    }, 0);

    // Плюс живой счётчик для активных
    const liveMinutes = Object.values(liveWorkedTime).reduce((sum, timeStr) => {
        const match = timeStr.match(/(\d+) ч (\d+) мин/);
        if (match) {
            return sum + parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return sum;
    }, 0);

    const totalHours = Math.floor((totalMinutesToday + liveMinutes) / 60);
    const totalMins = (totalMinutesToday + liveMinutes) % 60;

    // Живой таймер для каждой активной сессии
    useEffect(() => {
        if (activeSessions.length > 0) {
            const timer = setInterval(() => {
                const newTimes = {};
                activeSessions.forEach(session => {
                    newTimes[session.id] = calculateLiveTime(session.startTime);
                });
                setLiveWorkedTime(newTimes);
            }, 60000);

            // Первоначальный расчёт
            const initialTimes = {};
            activeSessions.forEach(session => {
                initialTimes[session.id] = calculateLiveTime(session.startTime);
            });
            setLiveWorkedTime(initialTimes);

            return () => clearInterval(timer);
        } else {
            setLiveWorkedTime({});
        }
    }, [currentUser, workSessions, today]);

    const calculateLiveTime = (startTime) => {
        const [hours, minutes, seconds] = startTime.split(':').map(Number);
        const startToday = new Date();
        startToday.setHours(hours, minutes, seconds, 0);

        const now = new Date();
        let diffMs = now - startToday;
        if (diffMs < 0) diffMs = 0;

        const totalMinutes = Math.floor(diffMs / 60000);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h} ч ${m} мин`;
    };

    const formatTime = (timeStr) => timeStr ? timeStr.slice(0, 5) : '-';

    const handleEndShift = async (sessionId) => {
        await endShift(sessionId);
        alert('Смена успешно завершена!');
    };

    if (!currentUser) return <div>Загрузка...</div>;

    return (
        <div className="sotrudnik">
            <div className="sotrudnik__nav_menu">
                <p onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'sotrudnik__nav_menu__active' : 'sotrudnik__nav_menu__no_active'}>
                    <img src={HomeSVG} alt="" /> Home
                </p>
                <p onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'sotrudnik__nav_menu__active' : 'sotrudnik__nav_menu__no_active'}>
                    <img src={NewsSVG} alt="" /> News
                </p>
            </div>

            <div className="sotrudnik__content">
                {activeTab === 1 && (
                    <div className="sotrudnik__content__home">
                        <h1>Панель сотрудника</h1>

                        {/* Основная карточка — суммарно за день */}
                        <div className="sotrudnik__content__home__work_info">
                            <div className="sotrudnik__content__home__work_info__left">
                                <div className="sotrudnik__content__home__work_info__left__info">
                                    <div className="sotrudnik__content__home__work_info__left__info__top"><p>Дата</p></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__line"></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__bottom">
                                        <p>{today.split('-').reverse().join('.')}</p>
                                    </div>
                                </div>

                                <div className="sotrudnik__content__home__work_info__left__info">
                                    <div className="sotrudnik__content__home__work_info__left__info__top"><p>Смен сегодня</p></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__line"></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__bottom">
                                        <p>{todaySessions.length}</p>
                                    </div>
                                </div>

                                <div className="sotrudnik__content__home__work_info__left__info">
                                    <div className="sotrudnik__content__home__work_info__left__info__top"><p>Активных</p></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__line"></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__bottom">
                                        <p>{activeSessions.length}</p>
                                    </div>
                                </div>

                                <div className="sotrudnik__content__home__work_info__left__info">
                                    <div className="sotrudnik__content__home__work_info__left__info__top"><p>Отработано сегодня</p></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__line"></div>
                                    <div className="sotrudnik__content__home__work_info__left__info__bottom">
                                        <p>{totalHours} ч {totalMins} мин</p>
                                    </div>
                                </div>
                            </div>

                            <div className="sotrudnik__content__home__work_info__right">
                                {activeSessions.length > 0 && (
                                    <div className="active_shifts_list">
                                        <p>Активные смены:</p>
                                        {activeSessions.map(session => (
                                            <button
                                                key={session.id}
                                                className="sotrudnik__end_shift_btn small"
                                                onClick={() => handleEndShift(session.id)}
                                            >
                                                Завершить ({formatTime(session.startTime)} – сейчас)
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {todaySessions.length === 0 && (
                                    <p className="sotrudnik__no_shift_msg">Сегодня смен ещё не было</p>
                                )}
                            </div>
                        </div>

                        {/* Список всех смен за сегодня */}
                        {todaySessions.length > 0 && (
                            <div className="sotrudnik__today_sessions">
                                <h2>Смены за сегодня</h2>
                                <div className="sotrudnik__history_list">
                                    {todaySessions.map(session => (
                                        <div key={session.id} className="sotrudnik__history_item">
                                            <span className="time">
                                                {formatTime(session.startTime)} – {formatTime(session.endTime) || '—'}
                                            </span>
                                            <span className="duration">
                                                {session.endTime
                                                    ? `${Math.floor(session.durationMinutes / 60)} ч ${session.durationMinutes % 60} мин`
                                                    : liveWorkedTime[session.id] || 'Расчёт...'
                                                }
                                            </span>
                                            <span className={`status ${session.status}`}>
                                                {session.endTime ? 'Завершена' : '● Активна'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* История за неделю */}
                        <div className="sotrudnik__content__home__history">
                            <h2>История смен за неделю</h2>
                            <div className="sotrudnik__history_list">
                                {workSessions
                                    .filter(s => s.userId === currentUser.id)
                                    .sort((a, b) => b.date.localeCompare(a.date))
                                    .slice(0, 10)
                                    .map(session => (
                                        <div key={session.id} className="sotrudnik__history_item">
                                            <span className="date">{session.date.split('-').reverse().join('.')}</span>
                                            <span className="time">
                                                {formatTime(session.startTime)} – {formatTime(session.endTime) || '—'}
                                            </span>
                                            <span className="duration">
                                                {session.durationMinutes !== null
                                                    ? `${Math.floor(session.durationMinutes / 60)} ч ${session.durationMinutes % 60} мин`
                                                    : 'Активна'}
                                            </span>
                                            <span className={`status ${session.status}`}>
                                                {session.status === 'active' ? '● Активна' :
                                                    session.status === 'completed' ? 'Завершена' : 'Редактирована'}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="sotrudnik__content__news">
                        <h1>Новости</h1>
                        <p>Здесь будут новости компании...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sotrudnik;