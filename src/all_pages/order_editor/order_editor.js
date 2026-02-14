import React from 'react';
import './order_editor.scss';

const orderPositions = [
    {
        id: 1,
        title: 'Шкаф-купе "Милан"',
        size: '1800 x 2400 x 600 мм',
        material: 'ЛДСП Дуб Сонома',
        price: '45,600 сом',
        image: '/utilse/odnotumboviy_stol.png',
        active: true
    },
    {
        id: 2,
        title: 'Комод 4 ящика',
        size: '900 x 1100 x 450 мм',
        material: 'МДФ Белый глянец',
        price: '18,400 сом',
        image: '/utilse/тумба с полкой и ящикаи.png'
    },
    {
        id: 3,
        title: 'Тумба прикроватная',
        size: '500 x 550 x 400 мм',
        material: 'МДФ Белый глянец',
        price: '7,200 сом',
        image: '/utilse/тумбачка маленькая.jpg'
    }
];

const OrderEditor = () => {
    return (
        <section className="order_editor">
            <div className="order_editor__status-bar">
                {['Оформлен', 'Пилится', 'Собирается', 'Ожидание доставки', 'Установка', 'Завершено'].map((step, index) => (
                    <div key={step} className={`order_editor__status-step ${index === 1 ? 'order_editor__status-step--active' : ''}`}>
                        <span>{index + 1}</span>
                        <p>{step}</p>
                    </div>
                ))}
            </div>

            <div className="order_editor__layout">
                <aside className="order_editor__left">
                    <div className="order_editor__left-head">
                        <h3>Позиции заказа</h3>
                        <span>3 поз.</span>
                    </div>

                    <div className="order_editor__positions">
                        {orderPositions.map((item) => (
                            <article key={item.id} className={`order_editor__position-card ${item.active ? 'order_editor__position-card--active' : ''}`}>
                                <img src={item.image} alt={item.title} />
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>{item.size}</p>
                                    <small>{item.material}</small>
                                </div>
                                <strong>{item.price}</strong>
                            </article>
                        ))}
                    </div>

                    <button type="button" className="order_editor__add-position">+ Добавить позицию</button>
                </aside>

                <main className="order_editor__center">
                    <div className="order_editor__center-head">
                        <div>
                            <h2>Шкаф-купе "Милан"</h2>
                            <p>ID позиции: ORD-2024-001</p>
                        </div>
                        <button type="button">Сохранить изменения</button>
                    </div>

                    <div className="order_editor__specs">
                        <article>
                            <h4>Габаритные размеры (мм)</h4>
                            <div className="order_editor__sizes">
                                <span>1800</span>
                                <span>2400</span>
                                <span>600</span>
                            </div>
                            <p>Указаны внешние габариты изделия.</p>
                        </article>

                        <article>
                            <h4>Материалы и отделка</h4>
                            <label>Основной материал</label>
                            <div>ЛДСП Дуб Сонома</div>
                            <label>Фурнитура</label>
                            <div>Система плавного закрытия</div>
                        </article>
                    </div>

                    <div className="order_editor__preview">
                        <div className="order_editor__preview-head">
                            <h5>Предварительный просмотр</h5>
                            <div>
                                <button type="button" className="active">2D Схема</button>
                                <button type="button">3D Модель</button>
                            </div>
                        </div>
                        <div className="order_editor__preview-image">
                            <img src="/utilse/шкаф_для_документов.jpg" alt="Рендер шкафа" />
                            <p>Рендер: Шкаф-купе "Милан"</p>
                        </div>
                    </div>
                </main>

                <aside className="order_editor__right">
                    <section className="order_editor__summary">
                        <h3>Сводка по заказу</h3>
                        <div className="order_editor__summary-rows">
                            <p><span>Сумма товаров:</span><strong>71 200 сом</strong></p>
                            <p><span>Налоги (НДС 20%):</span><strong>14 240 сом</strong></p>
                            <p><span>Персональная скидка:</span><strong className="discount">- 5 000 сом</strong></p>
                        </div>
                        <div className="order_editor__total">
                            <p>ИТОГО К ОПЛАТЕ</p>
                            <strong>80 440 сом</strong>
                            <small>включая стоимость сборки и доставки</small>
                        </div>
                        <button type="button">Подтвердить заказ</button>
                    </section>

                    <section className="order_editor__client">
                        <h4>Информация о клиенте</h4>
                        <p><strong>Лиров Ариф</strong></p>
                        <p>+996 (999) 12-45-67</p>
                        <p>г. Токмок , ул. Ленина, д. 10</p>
                    </section>

                    <button type="button" className="order_editor__doc-btn">Печать договора</button>
                    <button type="button" className="order_editor__doc-btn">Спецификация материалов</button>
                </aside>
            </div>
        </section>
    );
};

export default OrderEditor;
