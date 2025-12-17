import React, { useContext } from 'react';
import './admin.scss';
import { CustomContext } from '../../Context';

const Admin = () => {
    const { currentUser, users, workSessions, manualStartShift, manualEndShift, editSession } = useContext(CustomContext);
    const today = new Date().toISOString().split('T')[0];

    if (!currentUser || currentUser.role !== 'admin') {
        return <div className="access_denied">Доступ запрещён</div>;
    }

    const getTodaySessions = (userId) => {
        return workSessions
            .filter(s => s.userId === userId && s.date === today)
            .sort((a, b) => a.startTime.localeCompare(b.startTime)); // по времени прихода
    };

    const formatTime = (time) => time ? time.slice(0, 5) : '-';

    const formatDuration = (session) => {
        if (!session.durationMinutes && session.durationMinutes !== 0) {
            return session.endTime ? '-' : 'Активна';
        }
        const h = Math.floor(session.durationMinutes / 60);
        const m = session.durationMinutes % 60;
        return `${h} ч ${m} мин`;
    };

    const handleEdit = (session) => {
        const newStart = prompt('Время прихода (ЧЧ:ММ)', session.startTime.slice(0, 5));
        if (!newStart || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newStart)) {
            alert('Неверный формат времени');
            return;
        }

        const newEnd = session.endTime ? prompt('Время ухода (ЧЧ:ММ)', session.endTime.slice(0, 5)) : null;
        if (newEnd && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newEnd)) {
            alert('Неверный формат времени');
            return;
        }

        const updates = {
            startTime: newStart + ':00',
            status: 'manually_edited',
            editedBy: currentUser.id
        };

        if (newEnd) {
            updates.endTime = newEnd + ':00';
            const start = new Date(`1970-01-01T${updates.startTime}Z`);
            const end = new Date(`1970-01-01T${updates.endTime}Z`);
            updates.durationMinutes = Math.round((end - start) / 60000);
            updates.status = 'manually_edited';
        } else if (session.endTime) {
            // Если убрали конец — пересчитываем от нового начала до старого конца
            const start = new Date(`1970-01-01T${updates.startTime}Z`);
            const end = new Date(`1970-01-01T${session.endTime}Z`);
            updates.durationMinutes = Math.round((end - start) / 60000);
        }

        editSession(session.id, updates);
        alert('Смена обновлена');
    };

    return (
        <div className="admin">
            <h1>Панель администратора</h1>

            <div className="admin__table">
                <div className="admin__table_header">
                    <span>Сотрудник</span>
                    <span>Дата</span>
                    <span>Приход</span>
                    <span>Уход</span>
                    <span>Отработано</span>
                    <span>Статус</span>
                    <span>Действия</span>
                </div>

                {users.map(user => {
                    const sessions = getTodaySessions(user.id);

                    return (
                        <div key={user.id} className="admin__table_row_group">
                            <div className="admin__user_header">
                                <span className="name_group">{user.fullName}</span>
                            </div>

                            <div className="sessions_list">
                                {sessions.length === 0 ? (
                                    <div className="admin__table_row no_sessions">
                                        <span></span>
                                        <span>{today.split('-').reverse().join('.')}</span>
                                        <span>-</span>
                                        <span>-</span>
                                        <span>-</span>
                                        <span className="status">Нет смены</span>
                                        <span className="actions">
                                            <button onClick={() => manualStartShift(user.id)} className="btn_start">
                                                Начать смену
                                            </button>
                                        </span>
                                    </div>
                                ) : (
                                    sessions.map(session => {
                                        const isActive = !session.endTime;
                                        return (
                                            <div key={session.id} className="admin__table_row">
                                                <span></span>
                                                <span>{today.split('-').reverse().join('.')}</span>
                                                <span>{formatTime(session.startTime)}</span>
                                                <span>{formatTime(session.endTime)}</span>
                                                <span>{formatDuration(session)}</span>
                                                <span className={`status ${session.status || ''}`}>
                                                    {isActive ? '● На работе' :
                                                        session.status === 'manually_edited' ? 'Редактирована' :
                                                            'Завершена'}
                                                </span>
                                                <span className="actions">
                                                    {isActive && (
                                                        <button onClick={() => manualEndShift(session.id)} className="btn_end">
                                                            Завершить
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleEdit(session)} className="btn_edit">
                                                        ✎ Ред.
                                                    </button>
                                                </span>
                                            </div>
                                        );
                                    })
                                )}

                                {/* Кнопка добавить новую смену */}
                                <div className="admin__table_row add_new">
                                    <span></span><span></span><span></span><span></span><span></span><span></span>
                                    <span className="actions">
                                        <button onClick={() => manualStartShift(user.id)} className="btn_start">
                                            + Начать новую смену
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Admin;