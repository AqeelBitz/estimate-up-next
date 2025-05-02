// lib/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Add unique index for better performance and data integrity
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true }); // Optional: Add timestamps for createdAt/updatedAt

// Hashing password
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Generating token
userSchema.methods.generateAuthToken = async function() {
    try {
        let mytoken = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: mytoken });
        await this.save();
        return mytoken;
    } catch (err) {
        console.error("Error generating auth token:", err); // Log the specific error
        throw new Error('Token generation failed'); // Throw error to be handled
    }
};

// Avoid recompiling the model if it already exists
export default mongoose.models.User || mongoose.model('User', userSchema);