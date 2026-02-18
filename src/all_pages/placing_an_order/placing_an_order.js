import React, { useState, useEffect, useMemo } from 'react';
import { evaluate } from 'mathjs'; // ← УСТАНОВИ: npm i mathjs
import { useNavigate } from 'react-router-dom'; // для редиректа
import './placing_an_order.scss';

const PlacingAnOrder = () => {
    const navigate = useNavigate();

    // Полный заказ (состояние)
    const [order, setOrder] = useState({
        id: `ORD-${Date.now().toString().slice(-6)}`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        customer: {
            name: 'Ариф Лиров',
            company: 'ООО "Мебельный Стиль"',
            address: 'Город-Бишкек улица-Слоботская дом-293',
            phone: '+996 999 12-45-67',
            email: 'arif@mebel.kg'
        },
        orderColor: 'Дуб-Санома',
        notes: 'После готовности заказа сделать доставку когда позвонит клиент',
        description: 'Фурнитуру цвета графит . Цвет столов и фасадов белый . Каркас дуб санома',
        items: [
            // начальные из твоего примера
        ],
        subtotal: 0,
        discountPercent: 0,
        discountAmount: 0,
        taxPercent: 0,
        taxAmount: 0,
        total: 0
    });

    // Модалка
    const [modalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inputs, setInputs] = useState({});
    const [customDescription, setCustomDescription] = useState(''); // ← НОВОЕ
    const [result, setResult] = useState({});

    // Загрузка каталога
    useEffect(() => {
        fetch('http://localhost:8080/product')
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : [data]))
            .catch(console.error);
    }, []);

    // Инициализация inputs при выборе продукта
    useEffect(() => {
        if (!selectedProduct) return;
        const init = {};
        (selectedProduct.variables || []).forEach(v => init[v.name] = v.default);
        (selectedProduct.conditions || []).forEach(c => {
            if (c.type === 'flag') init[c.name] = !!c.default;
        });
        setInputs(init);
        setCustomDescription('');
        setResult({});
    }, [selectedProduct]);

    // Расчёт деталей (копия из Catalog)
    const calculate = () => {
        if (!selectedProduct) return;
        const nums = { ...inputs };
        (selectedProduct.variables || []).forEach(v => {
            nums[v.name] = Number(inputs[v.name]) || v.default;
        });
        (selectedProduct.conditions || []).forEach(c => {
            if (c.type === 'flag') nums[c.name] = !!inputs[c.name];
        });

        const calcDetails = (selectedProduct.details || []).map(detail => {
            if (detail.if_condition && !nums[detail.if_condition]) return null;
            try {
                const w = evaluate(detail.formula_width || '0', nums);
                const h = detail.formula_height ? evaluate(detail.formula_height, nums) : null;
                const cnt = evaluate(detail.count_formula || '1', nums);
                const size = h ? `${Math.round(w)} × ${Math.round(h)}` : Math.round(w);
                return {
                    key: detail.key,
                    label: detail.label,
                    size: `${size} мм`,
                    count: Math.round(cnt)
                };
            } catch (e) {
                return { key: detail.key, label: detail.label, size: 'Ошибка', count: 0 };
            }
        }).filter(Boolean);

        setResult({ details: calcDetails });
    };

    // Добавление в заказ
    const addToOrder = () => {
        if (!selectedProduct) return;
        calculate(); // ← пересчёт

        const newItem = {
            id: `ITEM-${Date.now().toString().slice(-4)}`,
            productId: selectedProduct.id,
            title: selectedProduct.title,
            img: selectedProduct.img,
            customDescription,
            userInputs: { ...inputs },
            calculatedDetails: result.details || [],
            quantity: Number(inputs.coll) || 1,
            unitPrice: Number(selectedProduct.price) || 0,
            totalPrice: (Number(selectedProduct.price) || 0) * (Number(inputs.coll) || 1)
        };

        setOrder(prev => {
            const newItems = [...prev.items, newItem];
            const subtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
            return {
                ...prev,
                items: newItems,
                subtotal,
                total: subtotal // пока без скидок/НДС
            };
        });

        // Сброс модалки
        setModalOpen(false);
        setSelectedProduct(null);
        setInputs({});
        setCustomDescription('');
    };

    // Удаление позиции
    const removeItem = (itemId) => {
        setOrder(prev => {
            const newItems = prev.items.filter(i => i.id !== itemId);
            const subtotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
            return { ...prev, items: newItems, subtotal, total: subtotal };
        });
    };

    // Обработчики инпутов (клиент)
    const handleCustomerChange = (field, value) => {
        setOrder(prev => ({
            ...prev,
            customer: { ...prev.customer, [field]: value }
        }));
    };

    const handleOrderChange = (field, value) => {
        setOrder(prev => ({ ...prev, [field]: value }));
    };

    // Сохранение заказа (пока лог, потом fetch)
    const saveOrder = (asDraft = false) => {
        const finalOrder = { ...order, status: asDraft ? 'draft' : 'confirmed' };
        console.log('🚀 ЗАКАЗ ГОТОВ К ОТПРАВКЕ:', finalOrder); // ← Замени на fetch POST /orders
        // fetch('http://localhost:8080/orders', { method: 'POST', body: JSON.stringify(finalOrder) });
        if (!asDraft) navigate(`/orders/${order.id}`); // ← редирект в редактор
    };

    return (
        <section className="placing_an_order">
            <div className="placing_an_order__content">
                {/* Основная инфа (с новыми полями) */}
                <article className="placing_an_order__info-card">
                    <h2 className="placing_an_order__section-title">Основная информация о заказе</h2>
                    <p className="placing_an_order__section-subtitle">Введите данные контрагента для формирования договора</p>

                    <div className="placing_an_order__fields">
                        <label className="placing_an_order__field">
                            <span>ФИО Клиента / Представителя</span>
                            <input
                                type="text"
                                value={order.customer.name}
                                onChange={e => handleCustomerChange('name', e.target.value)}
                            />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Название компании</span>
                            <input
                                type="text"
                                value={order.customer.company}
                                onChange={e => handleCustomerChange('company', e.target.value)}
                            />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Адрес доставки</span>
                            <input
                                type="text"
                                value={order.customer.address}
                                onChange={e => handleCustomerChange('address', e.target.value)}
                            />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Телефон клиента</span>
                            <input
                                type="tel"
                                value={order.customer.phone}
                                onChange={e => handleCustomerChange('phone', e.target.value)}
                            />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Email клиента</span>
                            <input
                                type="email"
                                value={order.customer.email}
                                onChange={e => handleCustomerChange('email', e.target.value)}
                            />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Цвет материала</span>
                            <input
                                type="text"
                                value={order.orderColor}
                                onChange={e => handleOrderChange('orderColor', e.target.value)}
                            />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Примечание к заказу</span>
                            <textarea value={order.notes} onChange={e => handleOrderChange('notes', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Описание к заказу</span>
                            <textarea value={order.description} onChange={e => handleOrderChange('description', e.target.value)} />
                        </label>
                    </div>
                </article>

                {/* Кнопка добавить */}
                <div className="placing_an_order__add-wrap">
                    <button
                        className="placing_an_order__add-button"
                        onClick={() => setModalOpen(true)}
                    >
                        <span>＋</span> Добавить мебель в заказ
                    </button>
                </div>

                {/* МОДАЛКА (полная) */}
                {modalOpen && (
                    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Добавить мебель</h3>
                                <button className="modal-close-btn" onClick={() => setModalOpen(false)}>×</button>
                            </div>

                            <div className="modal-products-grid">
                                {products.map(p => (
                                    <div
                                        key={p.id}
                                        className={`modal-product-card ${selectedProduct?.id === p.id ? 'active' : ''}`}
                                        onClick={() => setSelectedProduct(p)}
                                    >
                                        <img src={p.img} alt={p.title} />
                                        <p>{p.title}</p>
                                    </div>
                                ))}
                            </div>

                            {selectedProduct && (
                                <div className="modal-form">
                                    <h4>{selectedProduct.title}</h4>

                                    {/* Инпуты размеров */}
                                    <div className="modal-inputs">
                                        {(selectedProduct.variables || []).map(v => (
                                            <label key={v.name} className="modal-field">
                                                <span>{v.label}</span>
                                                <input
                                                    type="number"
                                                    value={inputs[v.name] ?? ''}
                                                    onChange={e => {
                                                        setInputs(prev => ({ ...prev, [v.name]: e.target.value }));
                                                        setResult({}); // сброс результата
                                                    }}
                                                />
                                            </label>
                                        ))}
                                        {(selectedProduct.conditions || []).map(c => c.type === 'flag' && (
                                            <label key={c.name} className="modal-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={!!inputs[c.name]}
                                                    onChange={() => setInputs(prev => ({ ...prev, [c.name]: !prev[c.name] }))}
                                                />
                                                {c.label}
                                            </label>
                                        ))}
                                    </div>

                                    {/* НОВОЕ: Описание позиции */}
                                    <label className="modal-field" style={{ gridColumn: '1 / -1' }}>
                                        <span>Описание позиции (опционально)</span>
                                        <textarea
                                            value={customDescription}
                                            onChange={e => setCustomDescription(e.target.value)}
                                            placeholder="Например: фасады белого цвета, добавить полку..."
                                        />
                                    </label>

                                    <button className="modal-save-btn" onClick={addToOrder}>
                                        Добавить в заказ
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Состав заказа */}
                <div className="placing_an_order__title-row">
                    <h3>Состав заказа ({order.items.length})</h3>
                    <p>Всего позиций: <strong>{order.items.length} шт.</strong></p>
                </div>

                <div className="placing_an_order__list">
                    {order.items.map(item => (
                        <article key={item.id} className="placing_an_order__item-card">
                            <img src={item.img} alt={item.img} />
                            <div className="placing_an_order__item-details">
                                <h4>{item.title}</h4>
                                <p><span>Размеры:</span> {item.calculatedDetails.map(d => d.size).join(', ')}</p>
                                <p><span>Цена:</span> {item.totalPrice} сом</p> {/* ← ЦЕНА ИЗ ДИЗАЙНА */}
                                <div className="placing_an_order__item-actions">
                                    <button type="button">Изм.</button> {/* ← Позже сделаем модалку редакта */}
                                    <button
                                        type="button"
                                        className="placing_an_order__delete"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        Удал.
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Футер */}
                <div className="placing_an_order__footer-actions">
                    <button
                        className="placing_an_order__draft"
                        onClick={() => saveOrder(true)}
                    >
                        Сохранить как черновик
                    </button>
                    <button
                        className="placing_an_order__submit"
                        onClick={() => saveOrder(false)}
                    >
                        Оформить заказ
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PlacingAnOrder;