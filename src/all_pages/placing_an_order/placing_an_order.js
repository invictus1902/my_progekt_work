import React, {useState} from 'react';
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

    const [text_diskription, setText_diskription] = useState("Фурнитуру цвета графит . Цвет столов и фасадов белый . Каркас дуб санома");
    const [text, setText] = useState("После готовности заказа сделать доставку когда позвонит клиент");


    const handleChange1 = (e) => {
        const target = e.target;
        // Сначала сбрасываем высоту, чтобы она могла уменьшиться при удалении текста
        target.style.height = 'inherit';
        // Устанавливаем высоту равную высоте контента
        target.style.height = `${target.scrollHeight}px`;
        setText(target.value);
    };
    const handleChange2 = (e) => {
        const target = e.target;
        // Сначала сбрасываем высоту, чтобы она могла уменьшиться при удалении текста
        target.style.height = 'inherit';
        // Устанавливаем высоту равную высоте контента
        target.style.height = `${target.scrollHeight}px`;
        setText_diskription(target.value);
    };


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

                        <label className="placing_an_order__field">
                            <span>Адрес доставки</span>
                            <input type="text" defaultValue={'Город-Бишкек улица-Слоботская дом-293'} />
                        </label>

                        <label className="placing_an_order__field">
                            <span>Цвет материала</span>
                            <input type="text" defaultValue={'Дуб-Санома'} />
                        </label>

                        <label className="placing_an_order__field">
                            <span>Примечание к заказу</span>

                            <textarea
                                value={text}
                                onChange={handleChange1}
                                placeholder='Примечание к заказу'
                                style={{
                                    width: '100%',
                                    overflow: 'hidden',
                                    resize: 'none',
                                    minHeight: '40px'
                                }}
                            />

                            {/*<input type="text" defaultValue={'После готовности заказа сделать доставку когда позвонит клиент'} />*/}
                        </label>

                        <label className="placing_an_order__field">
                            <span>Описание к заказу</span>

                            <textarea
                                value={text_diskription}
                                // value={"Фурнитуру цвета графит . Цвет столов и фасадов белый . Каркас дуб санома"}
                                onChange={handleChange2}
                                placeholder='Описание к заказу'
                                style={{
                                    width: '100%',
                                    overflow: 'hidden',
                                    resize: 'none',
                                    minHeight: '40px'
                                }}
                            />
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