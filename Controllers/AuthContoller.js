import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        const { name, role } = user;
        const token = jwt.sign({ email, role }, process.env.JWT_SECRET || '@#(^#^@#', { expiresIn: '1h' });

        return res
            .status(200)
            .cookie('token', token, { httpOnly: true })
            .json({
                success: true,
                message: "Successfully logged in",
                signuserdata: { email, name, role, password},
                token
            });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error'});
    }
};

const Signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error'});
    }
};

export default { Login, Signup }; // This is a default export of an object
