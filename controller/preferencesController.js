const { PREFERENCE_CATEGORIES, SUPPORTED_LANGUAGES } = require("../config/constants");
const userSchema = require("../model/userModel");

const getUserPreferences = async function (req, res) {

    let { email } = req.user;

    const user = await userSchema.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json({ preferences: user.preferences });

};

const updateUserPreferences = async function (req, res) {
    try {
        let { preferences } = req.body;

        // Validate preferences
        if (!preferences || !Array.isArray(preferences) || !preferences.every((pref) => PREFERENCE_CATEGORIES.includes(pref))) {
            return res.status(400).json({ message: "Invalid or unsupported preferences" });
        }

        const userInfo = await userSchema.findOne({email: req.user.email}).select("preferences");

        preferences.push(...userInfo.preferences);
        preferences = [...new Set(preferences)];
        // Update user preferences
        const user = await userSchema.findOneAndUpdate(
            { email: req.user.email },
            { $set: { preferences } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Preferences updated successfully!", preferences: user.preferences });
    } catch (e) {
        console.error("Error while updating preferences:", e);
        res.status(500).json({ message: "Internal server error while updating preferences" });
    }
};

module.exports = {
    getUserPreferences,
    updateUserPreferences
};