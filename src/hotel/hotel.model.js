import { Schema, model } from "mongoose";

const HotelSchema = Schema({
    name: {
        type: String,
        required: [true, "Hotel name is required"],
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [500, "Description can't exceed 500 characters"]
    },
    category: {
        type: String,
        enum: ["ECONOMICO", "FAMILIAR", "NEGOCIOS", "RESORT", "LUJO"],
        default: "FAMILIAR"
    },
    amenities: [
        {
            type: String,
            enum: [
                "WIFI", 
                "PISCINA", 
                "RESTAURANTE", 
                "GYM", 
                "SPA", 
                "ESTACIONAMIENTO",
                "SERVICIO_HABITACION"
            ]
        }
    ],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Hotel admin is required"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Hotel", HotelSchema);
