import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { useNavigate } from 'react-router-dom';
import './placing_an_order.scss';

const PlacingAnOrder = () => {
    const navigate = useNavigate();

    // Начальное состояние — полностью пустое, без моков
    const [order, setOrder] = useState({
        name_client: '',
        name_compony: '',
        address: '',
        phone: '',
        email: '',
        order_color: '',
        order_note: '',
        description_for_order: '',
        items: [] // сюда добавляем мебель
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inputs, setInputs] = useState({});
    const [customDescription, setCustomDescription] = useState('');
    const [result, setResult] = useState({});

    // Загрузка каталога
    useEffect(() => {
        fetch('http://localhost:8080/product')
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : [data]))
            .catch(err => console.error('Ошибка каталога:', err));
    }, []);

    // Инициализация полей для выбранной мебели
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

    // Расчёт деталей (возвращает сразу)
    const calculate = () => {
        if (!selectedProduct) return [];
        const nums = { ...inputs };
        (selectedProduct.variables || []).forEach(v => nums[v.name] = Number(inputs[v.name]) || v.default);
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
                return { key: detail.key, label: detail.label, size: `${size} мм`, count: Math.round(cnt) };
            } catch (e) {
                return { key: detail.key, label: detail.label, size: 'Ошибка', count: 0 };
            }
        }).filter(Boolean);

        setResult({ details: calcDetails });
        return calcDetails;
    };

    // Добавление позиции
    const addToOrder = () => {
        if (!selectedProduct) return;
        const calcDetails = calculate();

        const newItem = {
            productId: selectedProduct.id,
            title: selectedProduct.title,
            img: selectedProduct.img,
            description: customDescription,
            variables: selectedProduct.variables,
            conditions: selectedProduct.conditions,
            details: selectedProduct.details,
            userInputs: { ...inputs },
            calculatedDetails: calcDetails,
            price: selectedProduct.price || '0',
            quantity: Number(inputs.coll) || 1,
            totalPrice: Number(selectedProduct.price || 0) * (Number(inputs.coll) || 1)
        };

        setOrder(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));

        setModalOpen(false);
        setSelectedProduct(null);
        setInputs({});
        setCustomDescription('');
    };

    // Удаление позиции
    const removeItem = (itemId) => {
        setOrder(prev => ({
            ...prev,
            items: prev.items.filter(i => i.productId !== itemId) // используем productId как уникальный ключ
        }));
    };

    // Обработчики полей заказа
    const handleChange = (field, value) => {
        setOrder(prev => ({ ...prev, [field]: value }));
    };

    // Отправка на сервер
    const saveOrder = (asDraft = false) => {
        if (order.items.length === 0) {
            alert('Добавьте хотя бы одну позицию');
            return;
        }

        const payload = {
            name_client: order.name_client,
            name_compony: order.name_compony,
            address: order.address,
            order_note: order.order_note,
            description_for_order: order.description_for_order,
            order_color: order.order_color,
            product_order: order.items.map(item => ({
                id: item.productId,
                img: item.img,
                title: item.title,
                description: item.description,
                variables: item.variables,
                conditions: item.conditions,
                details: item.details,
                price: item.price,
                userInputs: item.userInputs,
                calculatedDetails: item.calculatedDetails
            }))
        };

        fetch('http://localhost:8080/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);
                return res.json();
            })
            .then(data => {
                const createdId = data.id || data[0]?.id; // сервер может вернуть массив или объект
                alert(asDraft ? 'Черновик сохранён' : 'Заказ оформлен!');
                if (!asDraft && createdId) {
                    navigate(`/order/${createdId}`);
                }
            })
            .catch(err => alert('Ошибка сохранения: ' + err.message));
    };

    return (
        <section className="placing_an_order">
            <div className="placing_an_order__content">
                <article className="placing_an_order__info-card">
                    <h2 className="placing_an_order__section-title">Основная информация о заказе</h2>
                    <p className="placing_an_order__section-subtitle">Введите данные контрагента для формирования договора</p>

                    <div className="placing_an_order__fields">
                        <label className="placing_an_order__field">
                            <span>ФИО Клиента / Представителя</span>
                            <input type="text" value={order.name_client} onChange={e => handleChange('name_client', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Название компании</span>
                            <input type="text" value={order.name_compony} onChange={e => handleChange('name_compony', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Адрес доставки</span>
                            <input type="text" value={order.address} onChange={e => handleChange('address', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Телефон клиента</span>
                            <input type="tel" value={order.phone} onChange={e => handleChange('phone', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Email клиента</span>
                            <input type="email" value={order.email} onChange={e => handleChange('email', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Цвет материала</span>
                            <input type="text" value={order.order_color} onChange={e => handleChange('order_color', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Примечание к заказу</span>
                            <textarea value={order.order_note} onChange={e => handleChange('order_note', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Описание к заказу</span>
                            <textarea value={order.description_for_order} onChange={e => handleChange('description_for_order', e.target.value)} />
                        </label>
                    </div>
                </article>

                <div className="placing_an_order__add-wrap">
                    <button className="placing_an_order__add-button" onClick={() => setModalOpen(true)}>
                        <span>＋</span> Добавить мебель в заказ
                    </button>
                </div>

                {modalOpen && (
                    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Добавить мебель</h3>
                                <button className="modal-close-btn" onClick={() => setModalOpen(false)}>×</button>
                            </div>

                            <div className="modal-products-grid">
                                {products.map(p => (
                                    <div key={p.id} className={`modal-product-card ${selectedProduct?.id === p.id ? 'active' : ''}`} onClick={() => setSelectedProduct(p)}>
                                        <img src={p.img} alt={p.title} />
                                        <p>{p.title}</p>
                                    </div>
                                ))}
                            </div>

                            {selectedProduct && (
                                <div className="modal-form">
                                    <h4>{selectedProduct.title}</h4>

                                    <div className="modal-inputs">
                                        {(selectedProduct.variables || []).map(v => (
                                            <label key={v.name} className="modal-field">
                                                <span>{v.label}</span>
                                                <input
                                                    type="number"
                                                    value={inputs[v.name] ?? v.default}
                                                    onChange={e => {
                                                        setInputs(prev => ({ ...prev, [v.name]: e.target.value }));
                                                        setResult({});
                                                    }}
                                                />
                                            </label>
                                        ))}
                                        {(selectedProduct.conditions || []).map(c => c.type === 'flag' && (
                                            <label key={c.name} className="modal-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={inputs[c.name] ?? false}
                                                    onChange={() => setInputs(prev => ({ ...prev, [c.name]: !prev[c.name] }))}
                                                />
                                                {c.label}
                                            </label>
                                        ))}
                                    </div>

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

                <div className="placing_an_order__title-row">
                    <h3>Состав заказа ({order.items.length})</h3>
                    <p>Всего позиций: <strong>{order.items.length} шт.</strong></p>
                </div>

                <div className="placing_an_order__list">
                    {order.items.map(item => (
                        <article key={item.id} className="placing_an_order__item-card">
                            <img src={item.img} alt={item.title} />
                            <div className="placing_an_order__item-details">
                                <h4>{item.title}</h4>
                                <p><span>Описание:</span> {item.description}</p>
                                <p><span>Размеры:</span> {item.calculatedDetails.map(d => d.size).join(', ')}</p>
                                <p><span>Цена:</span> {item.totalPrice} сом</p>
                                <div className="placing_an_order__item-actions">
                                    <button type="button">Изм.</button>
                                    <button type="button" className="placing_an_order__delete" onClick={() => removeItem(item.productId)}>
                                        Удал.
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="placing_an_order__footer-actions">
                    <button className="placing_an_order__draft" onClick={() => saveOrder(true)}>
                        Сохранить как черновик
                    </button>
                    <button className="placing_an_order__submit" onClick={() => saveOrder(false)}>
                        Оформить заказ
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PlacingAnOrder;