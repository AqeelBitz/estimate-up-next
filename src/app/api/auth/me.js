import dbConnect from '../../../lib/db';
import authenticate from '../../../lib/middleware/authenticate'; // Import the helper

export default async function handler(req, res) {
     if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
         await dbConnect(); // Ensure DB connection if authenticate needs it later

        // Call the authenticate helper
        // It will throw an error if authentication fails
        const { user } = await authenticate(req); // Destructure the authenticated user

        // If authenticate didn't throw, user is authenticated
        // Exclude sensitive data before sending back
        const userData = {
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            // DO NOT send back password or full tokens array
        };
        res.status(200).json(userData);

    } catch (error) {
        // If authenticate throws, catch the error here
         console.error("Me Route Error:", error.message);
        res.status(401).json({ message: 'Unauthorized' }); // Send 401 Unauthorized
    }
}