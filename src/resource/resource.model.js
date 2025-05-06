import { Schema, model } from "mongoose";

const ResourceSchema = Schema({
    name: {
        type: String,
        required: [true, "Resource name is required"],
        trim: true
    },
    description: {
        type: String,
        maxLength: [300, "Description can't exceed 300 characters"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Resource", ResourceSchema);
