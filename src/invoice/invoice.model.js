import { Schema, model } from "mongoose";

const InvoiceSchema = Schema({
    reservation: {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
        required: [true, "Reservation reference is required"]
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: [true, "Hotel reference is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"]
    },
    amount: {
        type: Number,
        required: [true, "Invoice amount is required"],
        min: [0, "Amount must be positive"]
    },
    servicesCharges: {
        type: Number,
        default: 0,
        min: [0, "Services charges must be positive"]
    },
    total: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total must be positive"]
    },
    status: {
        type: String,
        enum: ["PENDING", "PAID", "CANCELLED"],
        default: "PENDING"
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Invoice", InvoiceSchema);
