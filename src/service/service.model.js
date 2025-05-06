import { Schema, model } from "mongoose";

const ServiceSchema = Schema({
    name: {
        type: String,
        required: [true, "Service name is required"],
        trim: true
    },
    description: {
        type: String,
        maxLength: [300, "Description can't exceed 300 characters"]
    },
    price: {
        type: Number,
        required: [true, "Service price is required"],
        min: [0, "Price must be greater than 0"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Service", ServiceSchema);
