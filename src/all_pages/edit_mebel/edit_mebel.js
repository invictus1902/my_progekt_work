import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/product';

function FurnitureEditor() {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_URL)
            .then(r => r.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : [data]);
                setLoading(false);
            })
            .catch(err => console.error('Ошибка загрузки:', err));
    }, []);

    const selectProduct = (p) => {
        setSelected(JSON.parse(JSON.stringify(p)));
    };

    const save = async () => {
        if (!selected?.id) return;
        try {
            await fetch(`${API_URL}/${selected.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected),
            });
            alert('Изменения сохранены!');
            setSelected(null);
        } catch (err) {
            alert('Ошибка сохранения: ' + err.message);
        }
    };

    const update = (path, value) => {
        setSelected(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            let ref = copy;
            for (let i = 0; i < path.length - 1; i++) {
                ref = ref[path[i]];
            }
            ref[path[path.length - 1]] = value;
            return copy;
        });
    };

    // Добавление новой переменной
    const addVariable = () => {
        update(['variables'], [
            ...(selected.variables || []),
            { name: 'new_var', label: 'Новая переменная', default: 0 }
        ]);
    };

    // Удаление переменной
    const removeVariable = (idx) => {
        update(['variables'], selected.variables.filter((_, i) => i !== idx));
    };

    // Добавление нового условия
    const addCondition = () => {
        update(['conditions'], [
            ...(selected.conditions || []),
            { name: 'new_condition', label: 'Новое условие', type: 'flag', default: false }
        ]);
    };

    // Удаление условия
    const removeCondition = (idx) => {
        update(['conditions'], selected.conditions.filter((_, i) => i !== idx));
    };

    // Добавление новой детали
    const addDetail = () => {
        update(['details'], [
            ...(selected.details || []),
            {
                key: 'new_detail',
                label: 'Новая деталь',
                formula_width: 'shirina',
                formula_height: 'glubina',
                count_formula: 'coll * 1',
                if_condition: ''
            }
        ]);
    };

    // Удаление детали
    const removeDetail = (idx) => {
        update(['details'], selected.details.filter((_, i) => i !== idx));
    };

    if (loading) return <div style={{ padding: 40, fontSize: 20 }}>Загрузка мебели...</div>;

    return (
        <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ marginBottom: 32 }}>Редактор мебели</h1>

            {/* Список мебели */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
                {products.map(p => (
                    <button
                        key={p.id}
                        onClick={() => selectProduct(p)}
                        style={{
                            padding: '12px 24px',
                            background: selected?.id === p.id ? '#0066ff' : '#f0f0f0',
                            color: selected?.id === p.id ? 'white' : '#333',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: selected?.id === p.id ? 'bold' : 'normal'
                        }}
                    >
                        {p.title} (ID: {p.id})
                    </button>
                ))}
            </div>

            {selected && (
                <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    {/* Название */}
                    <input
                        value={selected.title}
                        onChange={e => update(['title'], e.target.value)}
                        placeholder="Название мебели"
                        style={{ fontSize: 28, width: '100%', border: 'none', marginBottom: 32, outline: 'none' }}
                    />

                    {/* Переменные */}
                    <h3 style={{ marginBottom: 16 }}>Переменные (размеры и параметры)</h3>
                    {selected.variables?.map((v, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
                            <input
                                value={v.name}
                                onChange={e => update(['variables', idx, 'name'], e.target.value)}
                                placeholder="Имя (shirina)"
                                style={{ width: 180 }}
                            />
                            <input
                                value={v.label}
                                onChange={e => update(['variables', idx, 'label'], e.target.value)}
                                placeholder="Подпись (Ширина)"
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                value={v.default}
                                onChange={e => update(['variables', idx, 'default'], +e.target.value)}
                                placeholder="По умолчанию"
                                style={{ width: 120 }}
                            />
                            <button
                                onClick={() => removeVariable(idx)}
                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6 }}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addVariable}
                        style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, marginBottom: 24 }}
                    >
                        + Добавить переменную
                    </button>

                    {/* Условия */}
                    <h3 style={{ marginBottom: 16 }}>Условия (флаги и проверки)</h3>
                    {selected.conditions?.map((c, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
                            <input
                                value={c.name}
                                onChange={e => update(['conditions', idx, 'name'], e.target.value)}
                                placeholder="Имя (stoleshka)"
                                style={{ width: 180 }}
                            />
                            <input
                                value={c.label}
                                onChange={e => update(['conditions', idx, 'label'], e.target.value)}
                                placeholder="Подпись (Столешница)"
                                style={{ flex: 1 }}
                            />
                            <select
                                value={c.type}
                                onChange={e => update(['conditions', idx, 'type'], e.target.value)}
                                style={{ width: 160 }}
                            >
                                <option value="flag">Флаг (чекбокс)</option>
                                <option value="range">Диапазон (условие)</option>
                            </select>
                            <button
                                onClick={() => removeCondition(idx)}
                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6 }}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addCondition}
                        style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, marginBottom: 32 }}
                    >
                        + Добавить условие
                    </button>

                    {/* Детали */}
                    <h3 style={{ marginBottom: 16 }}>Детали (формулы)</h3>
                    {selected.details?.map((d, idx) => (
                        <div key={idx} style={{ marginBottom: 24, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
                                <input
                                    value={d.key}
                                    onChange={e => update(['details', idx, 'key'], e.target.value)}
                                    placeholder="Ключ (bok)"
                                    style={{ width: 140 }}
                                />
                                <input
                                    value={d.label}
                                    onChange={e => update(['details', idx, 'label'], e.target.value)}
                                    placeholder="Название (бок)"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    onClick={() => removeDetail(idx)}
                                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6 }}
                                >
                                    Удалить деталь
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                <input
                                    value={d.formula_width}
                                    onChange={e => update(['details', idx, 'formula_width'], e.target.value)}
                                    placeholder="Ширина: shirina - 32"
                                    style={{ flex: 1 }}
                                />
                                <input
                                    value={d.formula_height}
                                    onChange={e => update(['details', idx, 'formula_height'], e.target.value)}
                                    placeholder="Высота: visota - 16"
                                    style={{ flex: 1 }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                <input
                                    value={d.count_formula}
                                    onChange={e => update(['details', idx, 'count_formula'], e.target.value)}
                                    placeholder="Количество: coll * 2"
                                    style={{ flex: 1 }}
                                />
                                <select
                                    value={d.if_condition || ''}
                                    onChange={e => update(['details', idx, 'if_condition'], e.target.value)}
                                    style={{ width: 200 }}
                                >
                                    <option value="">Без условия</option>
                                    {selected.conditions?.map(c => (
                                        <option key={c.name} value={c.name}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addDetail}
                        style={{ background: '#0066cc', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 6, marginTop: 16 }}
                    >
                        + Добавить деталь
                    </button>

                    {/* Кнопки сохранения */}
                    <div style={{ marginTop: 48, textAlign: 'center' }}>
                        <button
                            onClick={save}
                            style={{
                                padding: '16px 48px',
                                fontSize: 20,
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer'
                            }}
                        >
                            СОХРАНИТЬ ИЗМЕНЕНИЯ
                        </button>
                        <button
                            onClick={() => setSelected(null)}
                            style={{
                                marginLeft: 24,
                                padding: '16px 40px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8
                            }}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FurnitureEditor;