import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evaluate } from 'mathjs';
import './order_editor.scss';

const OrderEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [status, setStatus] = useState('Оформлен');

    // Для модального окна добавления позиции
    const [modalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedNewProduct, setSelectedNewProduct] = useState(null);
    const [newInputs, setNewInputs] = useState({});
    const [customDesc, setCustomDesc] = useState('');

    useEffect(() => {
        // Загрузка заказа
        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://localhost:8080/order/${id}`);
                if (!res.ok) throw new Error('Заказ не найден');
                const data = await res.json();
                let loaded = data.order?.[0] || data;

                loaded.product_order = (loaded.product_order || []).map(item => ({
                    ...item,
                    userInputs: { ...item.userInputs },
                    calculatedDetails: item.calculatedDetails?.length ? item.calculatedDetails : calculateDetails(item)
                }));

                setOrder(loaded);
                setStatus(loaded.status || 'Оформлен');
                if (loaded.product_order?.length) setSelectedProductId(loaded.product_order[0].id);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Загрузка каталога продуктов для добавления
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:8080/product');
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error('Ошибка каталога:', err);
            }
        };

        fetchOrder();
        fetchProducts();
    }, [id]);

    const selectedProduct = order?.product_order?.find(p => p.id === selectedProductId);

    // Функция расчёта деталировки
    const calculateDetails = (product) => {
        if (!product) return [];
        const nums = { ...product.userInputs };
        (product.variables || []).forEach(v => nums[v.name] = Number(nums[v.name]) || v.default);
        (product.conditions || []).forEach(c => {
            if (c.type === 'flag') nums[c.name] = !!nums[c.name];
        });

        return (product.details || []).map(detail => {
            if (detail.if_condition && !nums[detail.if_condition]) return null;
            try {
                const w = evaluate(detail.formula_width || '0', nums);
                const h = detail.formula_height ? evaluate(detail.formula_height, nums) : null;
                const cnt = evaluate(detail.count_formula || '1', nums);
                const size = h ? `${Math.round(w)} × ${Math.round(h)} мм` : `${Math.round(w)} мм`;
                return { key: detail.key, label: detail.label, size, count: Math.round(cnt) };
            } catch {
                return { key: detail.key, label: detail.label, size: 'Ошибка', count: 0 };
            }
        }).filter(Boolean);
    };

    // Изменение переменной позиции
    const handleItemInput = (varName, value) => {
        if (!selectedProduct) return;
        const numVal = isNaN(value) ? value : Number(value);

        setOrder(prev => {
            const updated = prev.product_order.map(p =>
                p.id === selectedProductId
                    ? {
                        ...p,
                        userInputs: { ...p.userInputs, [varName]: numVal },
                        calculatedDetails: calculateDetails({
                            ...p,
                            userInputs: { ...p.userInputs, [varName]: numVal }
                        })
                    }
                    : p
            );
            return { ...prev, product_order: updated };
        });
    };

    // Изменение полей заказа (клиент, цвет и т.д.)
    const handleOrderInput = (field, value) => {
        setOrder(prev => ({ ...prev, [field]: value }));
    };

    // Сохранение заказа
    const saveOrder = async () => {
        if (!order) return;
        try {
            const res = await fetch(`http://localhost:8080/order/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...order,
                    status,
                    subtotal: order.product_order.reduce((s, p) => s + Number(p.price || 0) * (Number(p.userInputs?.coll || 1) || 1), 0),
                    total: order.product_order.reduce((s, p) => s + Number(p.price || 0) * (Number(p.userInputs?.coll || 1) || 1), 0)
                })
            });
            if (!res.ok) throw new Error('Ошибка сохранения');
            alert('Заказ сохранён');
            navigate(`/order/${id}`);
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    // Добавление новой позиции (модалка)
    const addPosition = () => {
        if (!selectedNewProduct) return;
        const details = calculateDetails(selectedNewProduct);

        const newItem = {
            id: Date.now(), // временный ID
            title: selectedNewProduct.title,
            img: selectedNewProduct.img,
            description: customDesc,
            variables: selectedNewProduct.variables,
            conditions: selectedNewProduct.conditions,
            details: selectedNewProduct.details,
            userInputs: { ...newInputs },
            calculatedDetails: details,
            price: selectedNewProduct.price || '0'
        };

        setOrder(prev => ({
            ...prev,
            product_order: [...(prev.product_order || []), newItem]
        }));

        setModalOpen(false);
        setSelectedNewProduct(null);
        setNewInputs({});
        setCustomDesc('');
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!order) return <div>Заказ не найден</div>;

    return (
        <section className="order_editor">
            {/* Статус-бар */}
            <div className="order_editor__status-bar">
                {['Оформлен', 'Пилится', 'Собирается', 'Ожидание доставки', 'Установка', 'Завершено'].map((step, i) => (
                    <div
                        key={step}
                        className={`order_editor__status-step ${step === status ? 'order_editor__status-step--active' : ''}`}
                        onClick={() => setStatus(step)}
                    >
                        <span>{i + 1}</span>
                        <p>{step}</p>
                    </div>
                ))}
            </div>

            <div className="order_editor__layout">
                {/* Левая колонка — позиции */}
                <aside className="order_editor__left">
                    <div className="order_editor__left-head">
                        <h3>Позиции заказа</h3>
                        <span>{order.product_order?.length || 0} поз.</span>
                    </div>

                    <div className="order_editor__positions">
                        {order.product_order?.map(item => (
                            <article
                                key={item.id}
                                className={`order_editor__position-card ${selectedProductId === item.id ? 'order_editor__position-card--active' : ''}`}
                                onClick={() => setSelectedProductId(item.id)}
                            >
                                <img
                                    src={item.img?.startsWith('http') ? item.img : `/utilse/${item.img?.split('/').pop() || 'no-image.jpg'}`}
                                    alt={item.title}
                                />
                                <div>
                                    <h4>{item.title}</h4>
                                    <p>
                                        {item.userInputs?.shirina || '?'} × {item.userInputs?.visota || '?'} × {item.userInputs?.glubina || '?'} мм
                                    </p>
                                    <small>{order.order_color || '—'}</small>
                                </div>
                                <strong>{Number(item.price || 0).toLocaleString()} сом</strong>
                            </article>
                        ))}
                    </div>

                    <button className="order_editor__add-position" onClick={() => setModalOpen(true)}>
                        + Добавить позицию
                    </button>
                </aside>

                {/* Центральная часть — редактирование позиции */}
                <main className="order_editor__center">
                    {selectedProduct ? (
                        <>
                            <div className="order_editor__center-head">
                                <div>
                                    <h2>{selectedProduct.title}</h2>
                                    <p>ID позиции: {selectedProduct.id}</p>
                                </div>
                                <button onClick={saveOrder}>Сохранить изменения</button>
                            </div>

                            <div className="order_editor__specs">
                                <article>
                                    <h4>Параметры изделия</h4>
                                    <div className="order_editor__sizes-grid">
                                        {selectedProduct.variables?.map(v => (
                                            <div key={v.name} className="size-input">
                                                <label>{v.label}</label>
                                                <input
                                                    type="number"
                                                    value={selectedProduct.userInputs?.[v.name] ?? v.default ?? ''}
                                                    onChange={e => handleItemInput(v.name, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </article>

                                <article>
                                    <h4>Материалы и описание</h4>
                                    <input
                                        type="text"
                                        value={order.order_color || ''}
                                        onChange={e => handleOrderInput('order_color', e.target.value)}
                                        placeholder="Цвет"
                                    />
                                    <textarea
                                        value={order.description_for_order || ''}
                                        onChange={e => handleOrderInput('description_for_order', e.target.value)}
                                        placeholder="Описание заказа"
                                    />
                                </article>
                            </div>

                            <div className="order_editor__details-section">
                                <h4>Деталировка</h4>
                                {selectedProduct.calculatedDetails?.length > 0 ? (
                                    <table className="details-table">
                                        <thead>
                                        <tr>
                                            <th>Деталь</th>
                                            <th>Размер</th>
                                            <th>Кол-во</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedProduct.calculatedDetails.map(d => (
                                            <tr key={d.key}>
                                                <td>{d.label}</td>
                                                <td>{d.size}</td>
                                                <td>{d.count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>Нет данных для деталировки</p>
                                )}
                            </div>

                            <div className="order_editor__preview">
                                <div className="order_editor__preview-head">
                                    <h5>Предпросмотр</h5>
                                    <div>
                                        <button className="active">Фото</button>
                                        <button>2D Схема</button>
                                    </div>
                                </div>
                                <div className="order_editor__preview-image">
                                    <img src={selectedProduct.img} alt={selectedProduct.title} />
                                    <p>{selectedProduct.title}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="no-selection">Выберите позицию слева</p>
                    )}
                </main>

                {/* Правая колонка — клиент и финансы */}
                <aside className="order_editor__right">
                    <section className="order_editor__summary">
                        <h3>Сводка</h3>
                        <div className="order_editor__summary-rows">
                            <p><span>Сумма товаров:</span><strong>{order.product_order?.reduce((s, p) => s + Number(p.price || 0) * (Number(p.userInputs?.coll || 1) || 1), 0).toLocaleString()} сом</strong></p>
                            <p><span>НДС:</span><input type="number" defaultValue={order.taxAmount || 0} className="finance-input" /></p>
                            <p><span>Скидка:</span><input type="number" defaultValue={order.discountAmount || 0} className="finance-input" /></p>
                        </div>
                        <div className="order_editor__total">
                            <p>ИТОГО</p>
                            <strong>{order.total?.toLocaleString() || '0'} сом</strong>
                        </div>
                        <button onClick={saveOrder}>Сохранить / Подтвердить</button>
                    </section>

                    <section className="order_editor__client">
                        <h4>Клиент</h4>
                        <input
                            value={order.name_client || ''}
                            onChange={e => handleOrderInput('name_client', e.target.value)}
                            placeholder="ФИО клиента"
                        />
                        <input
                            value={order.phone || ''}
                            onChange={e => handleOrderInput('phone', e.target.value)}
                            placeholder="Телефон"
                        />
                        <textarea
                            value={order.address || ''}
                            onChange={e => handleOrderInput('address', e.target.value)}
                            placeholder="Адрес"
                        />
                        <textarea
                            value={order.order_note || ''}
                            onChange={e => handleOrderInput('order_note', e.target.value)}
                            placeholder="Примечание"
                        />
                    </section>

                    <button className="order_editor__doc-btn">Печать договора</button>
                    <button className="order_editor__doc-btn">Спецификация материалов</button>
                </aside>
            </div>

            {/* Модальное окно добавления позиции */}
            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Добавить позицию</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                        </div>

                        <div className="modal-products">
                            {products.map(p => (
                                <div
                                    key={p.id}
                                    className={`modal-product ${selectedNewProduct?.id === p.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedNewProduct(p);
                                        const init = {};
                                        (p.variables || []).forEach(v => init[v.name] = v.default);
                                        setNewInputs(init);
                                    }}
                                >
                                    <img src={p.img} alt={p.title} />
                                    <p>{p.title}</p>
                                </div>
                            ))}
                        </div>

                        {selectedNewProduct && (
                            <div className="modal-form">
                                <h4>{selectedNewProduct.title}</h4>

                                <div className="modal-fields">
                                    {selectedNewProduct.variables?.map(v => (
                                        <label key={v.name}>
                                            <span>{v.label}</span>
                                            <input
                                                type="number"
                                                value={newInputs[v.name] ?? v.default}
                                                onChange={e => setNewInputs(prev => ({ ...prev, [v.name]: e.target.value }))}
                                            />
                                        </label>
                                    ))}

                                    {selectedNewProduct.conditions?.map(c => c.type === 'flag' && (
                                        <label key={c.name} className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={newInputs[c.name] ?? false}
                                                onChange={() => setNewInputs(prev => ({ ...prev, [c.name]: !prev[c.name] }))}
                                            />
                                            {c.label}
                                        </label>
                                    ))}
                                </div>

                                <textarea
                                    placeholder="Описание позиции (опционально)"
                                    value={customDesc}
                                    onChange={e => setCustomDesc(e.target.value)}
                                />

                                <button className="modal-add-btn" onClick={addPosition}>
                                    Добавить в заказ
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default OrderEditor;