const { RateLimiterMemory } = require("rate-limiter-flexible");

const registerLimiter = new RateLimiterMemory({
    points: 3,
    duration: 500 // per hour
})

const loginLimiter = new RateLimiterMemory({
    points: 5, // 5 request
    duration: 900, // 15 min
    blockDuration: 60 // 15 min
})

const preferenceLimiter = new RateLimiterMemory({
    points: 5, // 5 request
    duration: 60, // 1 min
})

const registerRateLimitMiddleware = async (req, res, next) => {
    try {
        await registerLimiter.consume(req.ip);
        next();
    } catch (err) {
        res.status(429).json({ message: "Too many registration attempts. Try again later." });
    }
};

const loginRateLimitMiddleware = async (req, res, next) => {
    try {
        await loginLimiter.consume(req.ip);
        next();
    } catch (err) {
        res.status(429).json({ message: "Too many Login attempts. Try again later." });
    }
};

// for user updates it is neccessary to apply limiter on reuest by userID
// in userID not there then it will fallback to ip
// we will use this while updating pref
// not needed while reading.
const preferenceRateLimitMiddleware = async (req, res, next) => {
    try {

        let userId = req.user.email || req.ip;
        await preferenceLimiter.consume(userId);
        next();
    } catch (err) {
        res.status(429).json({ message: "Too many attempts. Try again later." });
    }
};

  
module.exports = {
    registerRateLimitMiddleware,
    loginRateLimitMiddleware,
    preferenceRateLimitMiddleware
}

