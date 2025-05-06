import mongoose, { Schema, model } from "mongoose";

const EventSchema = Schema({
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
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true
    },
    description: {
        type: String,
        maxLength: [500, "Description can't exceed 500 characters"]
    },
    date: {
        type: Date,
        required: [true, "Event date is required"]
    },
    resources: [{
        type: Schema.Types.ObjectId,
        ref: "Resource"
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: "Service"
    }],
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"]
    },
    status: {
        type: String,
        enum: ["SCHEDULED", "CANCELLED", "COMPLETED"],
        default: "SCHEDULED"
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.models.Event || model("Event", EventSchema);
