const express = require('express');
const path = require('path');
const app = express();

let verifiedCodes = new Set();

app.use(express.static(__dirname));

app.get('/api/verify-code', (req, res) => {
    const code = req.query.code;
    const action = req.query.action;

    if (action === 'submit') {
        verifiedCodes.add(code);
        return res.json({ success: true });
    }

    if (verifiedCodes.has(code)) {
        return res.json({ verified: true });
    } else {
        return res.json({ verified: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));