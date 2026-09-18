const express = require('express');
const app = express();

// تخزين الأكواد النشطة { code: "123456" }
let pendingCodes = new Set();
let verifiedCodes = new Set();

app.use(express.static(__dirname));

// روبلوكس يرسل الكود هنا للتسجيل
app.get('/api/register-code', (req, res) => {
    const code = req.query.code;
    if (code) {
        pendingCodes.add(code);
        return res.json({ success: true });
    }
    res.json({ success: false });
});

// اللاعب يدخل الكود في الموقع
app.get('/api/verify-code', (req, res) => {
    const code = req.query.code;
    const action = req.query.action;

    if (action === 'submit') {
        // الفحص: هل الكود تم إنشاؤه بالفعل من روبلوكس؟
        if (pendingCodes.has(code)) {
            verifiedCodes.add(code);
            pendingCodes.delete(code);
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: "كود خاطئ!" });
        }
    }

    // روبلوكس يفحص هل تم التفعيل
    if (verifiedCodes.has(code)) {
        verifiedCodes.delete(code); // حذف بعد التفعيل
        return res.json({ verified: true });
    } else {
        return res.json({ verified: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
