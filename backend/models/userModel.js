import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
        default: {}
    },
}, {minimize: false}); // By default, Mongoose removes empty objects from documents before saving. that why we use minimize false

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;