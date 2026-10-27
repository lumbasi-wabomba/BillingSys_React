const dotenv = require('dotenv');   
dotenv.config();

const keys = {
    backend: process.env.BACKEND_API_KEY,
    thriftly: process.env.THRIFTLY_API_KEY,
    test: process.env.TEST_API_KEY
};

function apiKeyMiddleware(apiTypes) {
    return function(req, res, next) {
        const apiKey = req.headers['x-api-key'];
        if (apiKey === undefined || apiKey === null || apiKey === '') {
            return res.status(401).json({ message: 'Forbidden: API Key is required' });
        }

        let isKeyValid = false;
        for (let i = 0; i < apiTypes.length; i++) {
            const currentType = apiTypes[i];
            const correctKeyValue = keys[currentType];
            if (apiKey === correctKeyValue) {
                isKeyValid = true;
                break;
            }
        }
        if (isKeyValid === false) {
            return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
        }
        req.apiKey = apiKey;
        next();
    };
}

module.exports = apiKeyMiddleware;
