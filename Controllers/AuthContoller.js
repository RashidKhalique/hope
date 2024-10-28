import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const { name, role } = user;
        const jwtSecret = process.env.JWT_SECRET || '@#(^#^@#';
        const token = jwt.sign({ email, role }, jwtSecret, { expiresIn: '1h' });

        // Set HTTP-only cookie and respond with user data
        return res
            .status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 3600000, // 1 hour in milliseconds
            })
            .json({
                success: true,
                message: "Successfully logged in",
                user: { email, name, role },
                token
            });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const Signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { email, name, role },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default { Login, Signup };
