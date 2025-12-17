import React, {useEffect, useState, useMemo} from 'react';
import './catalog.scss';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inputs, setInputs] = useState({
        shirina: '',
        glubina: '',
        visota: '',
        tumbaStola: '',
        coll: '1',
        call_dveri: '2',
        stoleshka: false,
        utolsh: false,
        dveri: false,
    });
    const [result, setResult] = useState({});

    useEffect(() => {
        fetch('http://localhost:8080/product')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                if (data.length > 0) setSelectedProduct(data[0]);
            })
            .catch(err => console.error('Ошибка загрузки:', err));
    }, []);

    const handleInputChange = (key, value) => {
        if (['stoleshka', 'utolsh', 'dveri'].includes(key)) {
            setInputs(prev => ({...prev, [key]: !prev[key]}));
        } else {
            setInputs(prev => ({...prev, [key]: value}));
        }
        setResult({});
    };

    const calculate = () => {
        if (!selectedProduct) return;

        const nums = {
            shirina: Number(inputs.shirina) || 0,
            glubina: Number(inputs.glubina) || 0,
            visota: Number(inputs.visota) || 0,
            tumbaStola: Number(inputs.tumbaStola) || 0,
            coll: Number(inputs.coll) || 1,
            call_dveri: Number(inputs.call_dveri) || 2,
            stoleshka: inputs.stoleshka,
            utolsh: inputs.utolsh,
            dveri: inputs.dveri,
        };

        if (nums.shirina === 0 || nums.glubina === 0 || nums.visota === 0) {
            alert('Заполните ширину, глубину и высоту');
            return;
        }

        const resultObj = {};

        const applyOp = (value, op) => {
            if (!op) return value;
            if (op.op === 'fixed') return op.value;
            if (op.op === 'plus') return value + op.value;
            if (op.op === 'minus') return value - op.value;
            if (op.op === 'divide') return value / op.value;
            return value;
        };

        const computeSize = (sizeArr) => {
            if (!Array.isArray(sizeArr) || sizeArr.length === 0) return [0, 0];

            let dim1 = nums.shirina || 0;
            let dim2 = nums.glubina || 0;

            sizeArr.forEach((op, index) => {
                let base = op.from ? (nums[op.from] || 0) : 0;

                // Основные измерения (первые два элемента массива)
                if (index === 0) {
                    // Первое измерение (обычно ширина)
                    if (op.op === 'fixed') {
                        dim1 = op.value ?? base;
                    } else {
                        dim1 = base;
                        if (op.op === 'plus') dim1 += op.value;
                        if (op.op === 'minus') dim1 -= op.value;
                        if (op.op === 'divide') dim1 /= op.value;
                    }
                } else if (index === 1) {
                    // Второе измерение (обычно глубина или фиксированное)
                    if (op.op === 'fixed') {
                        dim2 = op.value ?? base;
                    } else if (op.op === 'minus_from') {
                        // Специально для твоего случая — если minus_from на втором месте
                        dim1 -= nums[op.from] || 0;
                    } else {
                        dim2 = base;
                        if (op.op === 'plus') dim2 += op.value;
                        if (op.op === 'minus') dim2 -= op.value;
                    }
                } else {
                    // Все остальные операции — применяем к dim1
                    if (op.op === 'minus_from') {
                        dim1 -= nums[op.from] || 0;
                    } else if (op.op === 'minus_mul') {
                        dim1 -= (nums[op.from] || 0) * (op.mul || 1);
                    } else if (op.op === 'minus') {
                        dim1 -= op.value;
                    } else if (op.op === 'plus') {
                        dim1 += op.value;
                    }
                }

                // Модификаторы divide и minus — только для первого измерения
                if (op.divide && (index === 0 || index === 1)) {
                    dim1 /= op.divide;
                }
                if (op.minus && (index === 0 || index === 1)) {
                    dim1 -= op.minus;
                }
            });

            return [Math.round(dim1), Math.round(dim2)];
        };

        const getCount = (count) => {
            if (!count) return nums.coll;
            if (count.from) return (nums[count.from] || 1) * (count.mul || 1);
            return nums.coll * (count.mul || 1);
        };

        let detailsToUse = selectedProduct.details?.standart || [];

        if (nums.stoleshka && selectedProduct.details?.stoleshka) detailsToUse = selectedProduct.details.stoleshka;
        if (nums.utolsh && selectedProduct.details?.utolsh) detailsToUse = selectedProduct.details.utolsh;

        const processDetails = (items) => {
            items.forEach(item => {
                if (item.if) {
                    const w = nums.shirina;
                    let match = false;
                    if (item.if.op === 'range') match = w >= item.if.min && w <= item.if.max;
                    if (item.if.op === 'lt') match = w < item.if.value;
                    if (match) processDetails(item.details);
                    return;
                }

                const [s1, s2] = computeSize(item.size || []);
                const count = getCount(item.count);

                const sizeStr = s2 && s2 !== s1 && s2 !== 0 ? `${s1} : ${s2}` : s1;
                resultObj[item.key] = `${item.label} - ${sizeStr} ${count}шт`;
            });
        };

        if (Array.isArray(detailsToUse)) processDetails(detailsToUse);

        if (Array.isArray(selectedProduct.details_statik)) processDetails(selectedProduct.details_statik);

        setResult(resultObj);
    };

    const resultsArray = useMemo(() => Object.entries(result), [result]);

    return (
        <div className="catalog">
            <h2>Расчёт мебели</h2>

            <div className="products-grid">
                {products.map(product => (
                    <div
                        key={product.id}
                        className={`product-card ${selectedProduct?.id === product.id ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedProduct(product);
                            setResult({});
                            setInputs(prev => ({
                                ...prev,
                                shirina: '',
                                glubina: '',
                                visota: '',
                                tumbaStola: '',
                                call_dveri: '2',
                                stoleshka: false,
                                utolsh: false,
                                dveri: false,
                            }));
                        }}
                    >
                        <img src={product.img} alt={product.title}/>
                        <p>{product.id}. {product.title}</p>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <>
                    <h3>{selectedProduct.title}</h3>

                    <form className="inputs-form" onSubmit={(e) => {
                        e.preventDefault();
                        calculate();
                    }}>
                        <div className="input-row">
                            <input type="number" placeholder="Ширина" value={inputs.shirina}
                                   onChange={e => handleInputChange('shirina', e.target.value)} required/>
                            <input type="number" placeholder="Глубина" value={inputs.glubina}
                                   onChange={e => handleInputChange('glubina', e.target.value)} required/>
                            <input type="number" placeholder="Высота" value={inputs.visota}
                                   onChange={e => handleInputChange('visota', e.target.value)} required/>
                        </div>

                        {([1, 2, 15].includes(selectedProduct.id) || selectedProduct.conditions?.includes('tumbaStola')) && (
                            <input type="number" placeholder="Ширина тумбы" value={inputs.tumbaStola}
                                   onChange={e => handleInputChange('tumbaStola', e.target.value)}
                                   required={selectedProduct.id !== 6}/>
                        )}

                        {(selectedProduct.id === 11 || selectedProduct.conditions?.includes('call_dveri')) && (
                            <input type="number" placeholder="Количество дверей" value={inputs.call_dveri}
                                   onChange={e => handleInputChange('call_dveri', e.target.value)}/>
                        )}

                        <input type="number" placeholder="Количество изделий" value={inputs.coll}
                               onChange={e => handleInputChange('coll', e.target.value)} min="1"/>

                        <div className="checkboxes">
                            {selectedProduct.conditions?.includes('stoleshka') && (
                                <label><input type="checkbox" checked={inputs.stoleshka}
                                              onChange={() => handleInputChange('stoleshka')}/> Столешница</label>
                            )}
                            {selectedProduct.conditions?.includes('utolsh') && (
                                <label><input type="checkbox" checked={inputs.utolsh}
                                              onChange={() => handleInputChange('utolsh')}/> Утолщенка</label>
                            )}
                            {selectedProduct.conditions?.includes('dveri') && (
                                <label><input type="checkbox" checked={inputs.dveri}
                                              onChange={() => handleInputChange('dveri')}/> Дверь во всю высоту</label>
                            )}
                        </div>

                        <button type="submit" className="calculate-btn">Посчитать</button>
                    </form>

                    {resultsArray.length > 0 && (
                        <div className="results">
                            <h3>Результат расчёта:</h3>
                            <table className="results-table">
                                <thead>
                                <tr>
                                    <th>Деталь</th>
                                    <th>Размер и количество</th>
                                </tr>
                                </thead>
                                <tbody>
                                {resultsArray.map(([_, value]) => (
                                    <tr key={value}>
                                        <td>{value.split(' - ')[0]}</td>
                                        <td>{value.split(' - ')[1]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Catalog;