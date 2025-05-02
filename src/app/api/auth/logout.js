import dbConnect from '../../../lib/db';
import authenticate from '../../../lib/middleware/authenticate';
import { clearCookie } from '../../../lib/utils/cookies'; // Import cookie helper

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') { // Often logout is POST, but your example uses GET
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        await dbConnect();
        const { user, token } = await authenticate(req); // Get user and the specific token used

        // Remove the specific token from the user's tokens array
        user.tokens = user.tokens.filter((t) => t.token !== token);
        await user.save();

        // Clear the cookie using the helper
        clearCookie(res, 'jwtoken', { path: '/' });

        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        // Handle cases where user isn't authenticated or DB error occurs
         console.error("Logout Error:", error.message);
         // Even if unauthenticated, clearing the cookie might be desired
         clearCookie(res, 'jwtoken', { path: '/' });
         // Respond appropriately, maybe 200 even if already logged out or 401 if strict auth needed before logout action
        res.status(200).json({ message: "Logout processed (user may already be logged out)" });
    }
}