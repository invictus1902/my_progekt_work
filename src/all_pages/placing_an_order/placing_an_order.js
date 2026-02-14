import React from 'react';
import './placing_an_order.scss';

const orderItems = [
    {
        id: 1,
        title: 'Шкаф-купе',
        size: '2100 × 2400 × 600 мм',
        image: '/utilse/odnotumboviy_stol.png'
    },
    {
        id: 2,
        title: 'Обеденный стол',
        size: '1800 × 750 × 900 мм',
        image: '/utilse/двухтумбовый_стол.jpg'
    }
];

const PlacingAnOrder = () => {
    return (
        <section className="placing_an_order">
            <div className="placing_an_order__content">
                <article className="placing_an_order__info-card">
                    <h2 className="placing_an_order__section-title">Основная информация о заказе</h2>
                    <p className="placing_an_order__section-subtitle">
                        Введите данные контрагента для формирования договора
                    </p>

                    <div className="placing_an_order__fields">
                        <label className="placing_an_order__field">
                            <span>ФИО Клиента / Представителя</span>
                            <input type="text" defaultValue="Лиров Ариф" />
                        </label>

                        <label className="placing_an_order__field">
                            <span>Название компании</span>
                            <input type="text" defaultValue={'ООО "Мебельный Стиль"'} />
                        </label>
                    </div>
                </article>

                <div className="placing_an_order__add-wrap">
                    <button type="button" className="placing_an_order__add-button">
                        <span>＋</span>
                        Добавить мебель в заказ
                    </button>
                </div>

                <div className="placing_an_order__title-row">
                    <h3>Состав заказа (2)</h3>
                    <p>Всего позиций: <strong>2 шт.</strong></p>
                </div>

                <div className="placing_an_order__list">
                    {orderItems.map((item) => (
                        <article key={item.id} className="placing_an_order__item-card">
                            <img src={item.image} alt={item.title} />

                            <div className="placing_an_order__item-details">
                                <h4>{item.title}</h4>
                                <p>
                                    <span>Размеры:</span>
                                    {item.size}
                                </p>

                                <div className="placing_an_order__item-actions">
                                    <button type="button">Изм.</button>
                                    <button type="button" className="placing_an_order__delete">Удал.</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="placing_an_order__footer-actions">
                    <button type="button" className="placing_an_order__draft">Сохранить как черновик</button>
                    <button type="button" className="placing_an_order__submit">Оформить заказ</button>
                </div>
            </div>
        </section>
    );
};

export default PlacingAnOrder;