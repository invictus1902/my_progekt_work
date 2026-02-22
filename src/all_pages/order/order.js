import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useParams } from 'react-router-dom';
import { evaluate } from 'mathjs';
import './order.scss';

const Order = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetailsForItem, setShowDetailsForItem] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/order/${id}`)
            .then(res => res.json())
            .then(data => {
                const loadedOrder = data.order?.[0] || data; // если массив или объект
                // Рассчитываем calculatedDetails, если их нет
                loadedOrder.product_order = loadedOrder.product_order.map(item => {
                    if (!item.calculatedDetails || item.calculatedDetails.length === 0) {
                        const nums = item.userInputs || {};
                        const calcDetails = (item.details || []).map(detail => {
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
                        return { ...item, calculatedDetails: calcDetails };
                    }
                    return item;
                });

                setOrder(recalculateTotals(loadedOrder));
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки заказа:', err);
                setLoading(false);
            });
    }, [id]);

    const recalculateTotals = (ord) => {
        const items = ord.product_order || [];
        const subtotal = items.reduce((sum, item) => {
            return sum + (Number(item.price || 0) * (Number(item.userInputs?.coll || 1) || 1));
        }, 0);

        const discountAmount = subtotal * ((ord.discountPercent || 0) / 100);
        const taxable = subtotal - discountAmount;
        const taxAmount = taxable * ((ord.taxPercent || 0) / 100);
        const total = taxable + taxAmount;

        return { ...ord, subtotal, discountAmount, taxAmount, total };
    };

    const handleChange = (field, value) => {
        setOrder(prev => recalculateTotals({ ...prev, [field]: value }));
    };

    const handleCustomerChange = (field, value) => {
        setOrder(prev => recalculateTotals({
            ...prev,
            [field === 'name' ? 'name_client' : 'name_compony']: value
        }));
    };

    const handleStatusChange = (e) => {
        setOrder(prev => ({ ...prev, status: e.target.value }));
    };

    const saveChanges = () => {
        fetch(`http://localhost:8080/order/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        })
            .then(res => res.json())
            .then(() => alert('Изменения сохранены!'))
            .catch(err => console.error('Ошибка сохранения:', err));
    };

    const exportSpecification = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text('СПЕЦИФИКАЦИЯ №1', 105, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`К договору № ${order.id} от ${new Date(order.createdAt || Date.now()).toLocaleDateString('ru-RU')}`, 105, 25, { align: 'center' });

        const tableData = order.product_order.map((item, idx) => [
            idx + 1,
            item.title,
            'шт',
            item.userInputs?.coll || 1,
            item.price,
            Number(item.price) * (item.userInputs?.coll || 1)
        ]);

        doc.autoTable({
            head: [['№', 'Наименование продукта', 'Ед.измер.', 'Кол-во', 'Цена за ед.', 'Сумма']],
            body: tableData,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9, cellPadding: 3 }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`ИТОГО К ОПЛАТЕ: ${order.total || 0} сом`, 10, finalY);

        doc.save(`specification_${order.id}.pdf`);
    };

    const exportContract = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`ДОГОВОР № ${order.id}`, 105, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`${new Date().toLocaleDateString('ru-RU')} г. Токмок`, 140, 25);

        let y = 35;
        doc.text('ОсОО «Токмокское УПП КОС и КОГ», именуемая в дальнейшем «Поставщик» в лице директора Турбатова Саламата Адылбековича, действующего на основании Устава, с одной стороны', 10, y, { maxWidth: 180 });
        y += 10;
        doc.text(`${order.name_compony}, в лице ${order.name_client} именуемый в дальнейшем «Покупатель» действующего на основании Положения, заключили настоящий договор согласно закона Кыргызской Республики №27 от 14 апреля 2022 года «О государственных закупках» статья 17, часть 3, пункт 12. Методом из одного источника.`, 10, y, { maxWidth: 180 });
        // Добавь остальной текст договора из DOCX по аналогии

        y += 30;
        doc.text('Общая сумма договора: ' + (order.total || 0) + ' сом', 10, y);

        doc.save(`contract_${order.id}.pdf`);
    };

    if (loading) return <div>Загрузка заказа...</div>;
    if (!order) return <div>Заказ не найден</div>;

    return (
        <section className="placing_an_order">
            <div className="placing_an_order__content">
                <h1>Заказ № {order.id}</h1>

                <article className="placing_an_order__info-card">
                    <h2>Информация о заказе</h2>
                    <div className="placing_an_order__fields">
                        <label className="placing_an_order__field">
                            <span>ФИО Клиента</span>
                            <input value={order.name_client} onChange={e => handleCustomerChange('name', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Название компании</span>
                            <input value={order.name_compony} onChange={e => handleCustomerChange('company', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Адрес доставки</span>
                            <input value={order.address} onChange={e => handleChange('address', e.target.value)} />
                        </label>
                        <label className="placing_an_order__field">
                            <span>Цвет материала</span>
                            <input value={order.order_color} onChange={e => handleChange('order_color', e.target.value)} />
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

                <div className="placing_an_order__title-row">
                    <h3>Состав заказа ({order.product_order.length})</h3>
                    <p>Всего позиций: <strong>{order.product_order.length} шт.</strong></p>
                </div>

                <div className="placing_an_order__list">
                    {order.product_order.map(item => (
                        <article key={item.id} className="placing_an_order__item-card">
                            <img src={item.img} alt={item.title} />
                            <div className="placing_an_order__item-details">
                                <h4>{item.title}</h4>
                                <p><span>Описание:</span> {item.description}</p>
                                <p><span>Цена:</span> {item.price} сом × {item.userInputs?.coll || 1} = {Number(item.price) * (item.userInputs?.coll || 1)} сом</p>
                                <button onClick={() => setShowDetailsForItem(item.id === showDetailsForItem ? null : item.id)}>
                                    {item.id === showDetailsForItem ? 'Скрыть деталировку' : 'Показать деталировку'}
                                </button>
                                {item.id === showDetailsForItem && (
                                    <table className="details-table">
                                        <thead>
                                        <tr>
                                            <th>Деталь</th>
                                            <th>Размер</th>
                                            <th>Кол-во</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {item.calculatedDetails?.map(d => (
                                            <tr key={d.key}>
                                                <td>{d.label}</td>
                                                <td>{d.size}</td>
                                                <td>{d.count}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="placing_an_order__footer-actions">
                    <button className="placing_an_order__draft" onClick={saveChanges}>
                        Сохранить изменения
                    </button>
                    <button className="placing_an_order__submit" onClick={exportSpecification}>
                        Спецификация PDF
                    </button>
                    <button className="placing_an_order__submit" onClick={exportContract}>
                        Договор PDF
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Order;