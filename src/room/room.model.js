import { Schema, model } from "mongoose";

const RoomSchema = Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: [true, "Hotel reference is required"]
    },
    number: {
        type: String,
        required: [true, "Room number is required"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Room type is required"],
        enum: ["SENCILLA", "DOBLE", "SUITE", "FAMILIAR"]
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [1, "Capacity must be at least 1"]
    },
    pricePerNight: {
        type: Number,
        required: [true, "Price per night is required"],
        min: [0, "Price must be greater than 0"]
    },
    description: {
        type: String,
        maxLength: [500, "Description can't exceed 500 characters"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Room", RoomSchema);
