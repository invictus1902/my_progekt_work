import React, { useContext, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './sotrudnik.scss';
import { CustomContext } from '../../Context.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Sotrudnik = () => {
    const { currentUser, workSessions } = useContext(CustomContext);

    // === ВСЕ ХУКИ В НАЧАЛЕ, ДО ЛЮБОГО RETURN ===
    const recentSessions = useMemo(() => {
        if (!currentUser) return [];
        return [...workSessions]
            .filter(s => s.userId === currentUser.id)
            .sort((a, b) => b.date.localeCompare(a.date) || (b.startTime || '').localeCompare(a.startTime || ''))
            .slice(0, 7);
    }, [workSessions, currentUser]);

    const weekData = useMemo(() => {
        if (!currentUser) return { labels: [], datasets: [] };

        const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']; // JS: 0 = Вс, 1 = Пн
        const today = new Date();
        const todayWeekday = today.getDay(); // 0 = Вс, 1 = Пн, ..., 6 = Сб

        const labels = [];
        const data = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Правильный день недели
            const weekdayIndex = date.getDay();
            labels.push(daysOfWeek[weekdayIndex]);

            const daySessions = workSessions.filter(
                s => s.userId === currentUser.id && s.date === dateStr
            );

            const minutes = daySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
            data.push(Math.round((minutes / 60) * 10) / 10);
        }

        return {
            labels,
            datasets: [{
                label: 'Отработано часов',
                data,
                backgroundColor: '#0F74C7FF',
                borderRadius: 4,
                barThickness: 30,
            }]
        };
    }, [workSessions, currentUser]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y} ч`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 12,
                ticks: {
                    stepSize: 2,
                    callback: (value) => `${value} ч`
                },
                grid: { color: '#eee' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    // === Теперь можно безопасно проверять currentUser ===
    if (!currentUser) {
        return <div className="loading">Загрузка...</div>;
    }

    const formatTime = (time) => time ? time.slice(0, 5) : '-';
    const formatHours = (minutes) => {
        if (minutes === null || minutes === undefined) return '-';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}` : `${h}.${m.toString().padStart(2, '0')}`;
    };

    return (
        <div className="sotrudnik_page">
            <div className="sotrudnik_header">
                <h1>Панель сотрудника</h1>
            </div>

            <div className="sotrudnik_main">
                {/* Левый блок — журнал */}
                <div className="journal_block">
                    <h2>Ежедневные рабочие журналы</h2>
                    <table className="journal_table">
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Время прихода</th>
                            <th>Время ухода</th>
                            <th>Отработано часов</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentSessions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="no_data">Нет данных за последние дни</td>
                            </tr>
                        ) : (
                            recentSessions.map(session => (
                                <tr key={session.id}>
                                    <td>{session.date.split('-').reverse().join('.')}</td>
                                    <td>{formatTime(session.startTime)}</td>
                                    <td>{formatTime(session.endTime)}</td>
                                    <td>{formatHours(session.durationMinutes)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Правый блок — график */}
                <div className="chart_block">
                    <h2>Еженедельные часы</h2>
                    <div className="chart_container">
                        <Bar data={weekData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Новости */}
            <div className="news_block">
                <h2>Новости компании</h2>
                <div className="news_placeholder">
                    <p>Здесь будут отображаться новости и объявления компании...</p>
                </div>
            </div>
        </div>
    );
};

export default Sotrudnik;