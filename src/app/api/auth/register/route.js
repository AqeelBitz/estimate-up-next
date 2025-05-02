import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs'; // bcrypt is used in the model's pre-save hook
import { NextResponse } from 'next/server'; // <-- Import NextResponse

// bcrypt is used in the model's pre-save hook, so importing it here is optional
// unless you use it elsewhere in this specific file outside the model.
// import bcrypt from 'bcryptjs';


// This is the correct App Router syntax for a POST handler
// Remove the 'export default async function handler(req, res)' block completely
export async function POST(request) { // <-- Use named export 'POST' and 'request' argument
    console.log("--- Register API Route Hit (App Router) ---"); // Debug log

    // In App Router, access the request body using request.json()
    // Use a try-catch here in case the request body isn't valid JSON
    let body;
    try {
        body = await request.json();
    } catch (error) {
        console.error("Failed to parse request body:", error);
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { fname, lname, email, password } = body;


    // The method check is typically not needed here because the function name is POST
    // if (request.method !== 'POST') { ... } // Remove this check

    if (!fname || !lname || !email || !password) {
        console.log("Missing fields in request body:", body); // Debug log
        // Use NextResponse.json() to send JSON responses with status
        return NextResponse.json({ error: "Please fill the form properly" }, { status: 422 });
    }

    try {
        await dbConnect(); // Ensure DB connection
        console.log("--- Calling dbConnect from Register (App Router) ---"); // Debug log

        const userExist = await User.findOne({ email: email });
        if (userExist) {
            console.log("User already exists:", email); // Debug log
            return NextResponse.json({ error: "User already exists" }, { status: 422 });
        }

        // Password hashing happens in the pre-save hook (lib/models/User.js)
        const user = new User({ fname, lname, email, password });
        await user.save();

        console.log("User registered successfully:", user.email); // Debug log
        // Use NextResponse.json() for success responses
        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });

    } catch (err) {
        console.error("Registration Error:", err);
        // Use NextResponse.json() for error responses
        return NextResponse.json({ error: "Failed to register user", details: err.message }, { status: 500 });
    }
}

// Remove any 'export default' from this file.
// If you don't need other HTTP methods for this route, only export POST.