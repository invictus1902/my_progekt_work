const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { LowSync } = require('lowdb');
const { JSONFileSync } = require('lowdb/node');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Секрет для JWT
const JWT_SECRET = 'your-secret-key';

// Папка для фото
const uploadDir = path.join(__dirname, 'public', 'utilse');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer — оригинальное имя
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// База данных
const adapter = new JSONFileSync('db.json');
const db = new LowSync(adapter, { product: [], users: [], workSessions: [] });
db.read();
db.write();

// Static /utilse/
app.use('/utilse', express.static(uploadDir));

// Middleware аутентификации (закомментирован)
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Routes — без аутентификации
const collections = ['product', 'users', 'workSessions'];

collections.forEach(collection => {
    app.get(`/${collection}`, (req, res) => {
        res.json(db.data[collection] || []);
    });

    app.get(`/${collection}/:id`, (req, res) => {
        const item = (db.data[collection] || []).find(i => i.id === Number(req.params.id));
        res.json(item || {});
    });

    app.post(`/${collection}`, (req, res) => {
        const newItem = { ...req.body, id: (db.data[collection].length || 0) + 1 }; // Авто id
        db.data[collection].push(newItem);
        db.write();
        res.json(newItem);
    });

    app.put(`/${collection}/:id`, (req, res) => {
        const index = db.data[collection].findIndex(i => i.id === Number(req.params.id));
        if (index !== -1) {
            db.data[collection][index] = req.body;
            db.write();
            res.json(req.body);
        } else {
            res.status(404).json({ error: 'Не найдено' });
        }
    });

    app.delete(`/${collection}/:id`, (req, res) => {
        db.data[collection] = db.data[collection].filter(i => i.id !== Number(req.params.id));
        db.write();
        res.json({ success: true });
    });
});

// Register
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: (db.data.users?.length || 0) + 1, email, password: hashedPassword };
    db.data.users ||= [];
    db.data.users.push(newUser);
    db.write();
    res.json(newUser);
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.data.users?.find(u => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Загрузка фото
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });

    const filePath = `/utilse/${req.file.filename}`;
    res.json({ path: filePath });
});

// Удаление фото
app.delete('/upload', (req, res) => {
    const fileName = req.body.fileName;
    if (!fileName) return res.status(400).json({ error: 'Имя файла не указано' });

    const filePath = path.join(uploadDir, fileName.replace('/utilse/', ''));

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Фото не найдено' });
    }
});

// Запуск
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});