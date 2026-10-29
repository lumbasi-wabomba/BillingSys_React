import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    limit: 100,
    message:{
        status: 429,
        error: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export { limiter };

