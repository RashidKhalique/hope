import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    Isactive: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    }
})


const User = mongoose.model("User", userschema)
export default User;