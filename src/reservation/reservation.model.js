import { Schema, model } from "mongoose";

const ReservationSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: [true, "Hotel is required"]
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Room is required"]
    },
    checkIn: {
        type: Date,
        required: [true, "Check-in date is required"]
    },
    checkOut: {
        type: Date,
        required: [true, "Check-out date is required"]
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        min: [0, "Total price must be greater than 0"]
    },
    status: {
        type: String,
        enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
        default: "CONFIRMED"
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Reservation", ReservationSchema);
