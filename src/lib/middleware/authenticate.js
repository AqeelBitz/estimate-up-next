// lib/middleware/authenticate.js
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dbConnect from '../db'; // Ensure DB is connected

const authenticate = async (req) => {
    try {
        // Get token from cookies (requires 'cookie' package installed or parse manually)
        const token = req.cookies.jwtoken;

        if (!token) {
            // console.log("No token found in cookies");
            throw new Error('Authentication failed: No token');
        }

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Verified Token:", verifyToken); // Debugging

        await dbConnect(); // Ensure database connection is active

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            // console.log(`User not found for ID: ${verifyToken._id} with token`);
            throw new Error('Authentication failed: User not found or token mismatch');
        }

        // Return necessary data for the API route to use
        return {
            token: token,
            user: rootUser,
            userId: rootUser._id
        };

    } catch (err) {
        console.error('Authentication error:', err.message);
        // Throw the error so the calling API route can handle it (e.g., return 401)
        throw new Error('Unauthorized');
    }
};

export default authenticate;