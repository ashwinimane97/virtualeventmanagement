const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = require("../model/userModel");
const { validateUserRegistration, validateUserLogin } = require("../validators/authValidators");
const { sendVerificationEmail } = require("../utils/emailService");


const userRegister = async function (req, res) {
    try {
        const { error } = validateUserRegistration(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, preferences } = req.body;

        let user = await userSchema.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        let saltRounds = parseInt(process.env.SALT_ROUNDS, 10); // Convert to number
        let hashedPwd = await bcrypt.hash(password, saltRounds);

        user = new userSchema({ name, email, password: hashedPwd, preferences });

        await user.save();

        // Generate verification mail token (expires in 1h)
        let token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        sendVerificationEmail(user.email, token);

        // Return success response
        return res.status(200).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        console.error("Error during user registration:", err);
        return res.status(500).json({ message: "Server error. Try again later." });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).json({ message: "Invalid verification link" });

        // Decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userSchema.findOne({ email: decoded.email });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

        // Mark user as verified
        user.isVerified = true;
        await user.save();

        res.json({ message: "Email verified! You can now log in." });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

const userLogin = async function (req, res) {
    try {
        const { error } = validateUserLogin(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email or password is missing" });
        }

        let userInfo = await userSchema.findOne({ email }); // Fetch user info from DB

        if (!userInfo) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = bcrypt.compareSync(password, userInfo.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Return token as part of a JSON object
        return res.status(200).json({ message: "User logged in successfully", token });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Server experiencing issues. Try again later." });
    }
};


module.exports = {
    userRegister,
    verifyEmail,
    userLogin
}