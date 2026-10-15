const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'database.json');

// توجيه الصفحة الرئيسية مباشرة إلى ملف index.html لحل مشكلة Cannot GET /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// جلب البيانات من ملف قاعدة البيانات
app.get('/api/data', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
        res.sendFile(DB_FILE);
    } else {
        const initialData = { 
            files: [
                {
                    id: 1,
                    title: 'عصابة البوابة السوداء',
                    targets: [
                        { id: 101, name: 'يزن', alias: 'كاي', photo: 'https://via.placeholder.com/100', desc: 'مشتبه به رئيسي', x: 80, y: 80 }
                    ],
                    connections: []
                }
            ], 
            reports: [] 
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
        res.json(initialData);
    }
});

// حفظ البيانات في ملف database.json فوراً عند أي تعديل
app.post('/api/data', (req, res) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CIB Server running on port ${PORT}`));
