// D:\My Projects\Academic\FYP\estimate-up-next\src\app\api\auth\login\route.js

// Make sure your imports are correct relative to this file's location
import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'; 
import { serialize } from 'cookie'; 

// The setCookie helper from before is designed for the 'res' object in Pages Router.
// In App Router, you set headers directly on the NextResponse.

export async function POST(request) { // <-- Use named export 'POST' and 'request' argument
    console.log("--- Login API Route Hit (App Router) ---"); // Debug log

     // In App Router, access the request body using request.json()
    // Use a try-catch here in case the request body isn't valid JSON
    let body;
    try {
        body = await request.json();
    } catch (error) {
        console.error("Failed to parse request body:", error);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { email, password } = body;

    // The method check is typically not needed here because the function name is POST
    // if (request.method !== 'POST') { ... } // Remove this check

    if (!email || !password) {
        console.log("Missing email or password in request body"); // Debug log
         // Use NextResponse.json() to send JSON responses with status
        return NextResponse.json({ error: "Please provide email and password" }, { status: 400 });
    }

    try {
        await dbConnect(); // Ensure DB connection
        console.log("--- Calling dbConnect from Login (App Router) ---"); // Debug log


        const userLogin = await User.findOne({ email: email });

        if (!userLogin) {
             console.log("Login failed: User not found for email", email); // Debug log
             return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, userLogin.password);

        if (!isMatch) {
             console.log("Login failed: Password mismatch for email", email); // Debug log
             return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
        }

        // Token generation happens via the model method
        const token = await userLogin.generateAuthToken();
        console.log("Token generated for user:", userLogin.email); // Debug log


        // --- Set HttpOnly cookie directly on the NextResponse ---
         const cookieOptions = {
             // expires: new Date(Date.now() + 25892000000), // ~300 days
             maxAge: 300 * 24 * 60 * 60, // Max age in seconds (more common)
             httpOnly: true,
             path: '/',
             sameSite: 'lax', // Good default for security
             secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
         };

         const serializedCookie = serialize('jwtoken', token, cookieOptions);

         // Use NextResponse.json() for success responses and set the header
         const response = NextResponse.json(
             { message: "User signin successful!", token: token , email:email }, // Response body
             { status: 200 } // Response status
         );

         // Set the Set-Cookie header
         response.headers.set('Set-Cookie', serializedCookie);

         return response; // Return the response with the cookie header


    } catch (err) {
        console.error("Signin Error:", err);
         // Use NextResponse.json() for error responses
        return NextResponse.json({ error: "Failed to sign in", details: err.message }, { status: 500 });
    }
}

// Remove any 'export default' from this file.
// If you don't need other HTTP methods for this route, only export POST.