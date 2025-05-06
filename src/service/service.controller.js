import { response } from "express";
import Service from "./service.model.js";

export const createService = async (req, res = response) => {
    try {
        const { name, description, price } = req.body;

        const existingService = await Service.findOne({ name });
        if (existingService) {
            return res.status(400).json({
                success: false,
                msg: "Service already exists ⚠️"
            });
        }

        const newService = new Service({
            name,
            description,
            price
        });

        await newService.save();

        res.status(201).json({
            success: true,
            msg: "Service created successfully ✅",
            service: newService
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating service ❌",
            error
        });
    }
};

export const getServices = async (req, res = response) => {
    try {
        const services = await Service.find({ estado: true });

        res.status(200).json({
            success: true,
            services
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching services ❌",
            error
        });
    }
};

export const getServiceById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);
        if (!service || !service.estado) {
            return res.status(404).json({
                success: false,
                msg: "Service not found ❌"
            });
        }

        res.status(200).json({
            success: true,
            service
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching service ❌",
            error
        });
    }
};

export const updateService = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                msg: "Service not found ❌"
            });
        }

        service.name = name || service.name;
        service.description = description || service.description;
        service.price = price ?? service.price;

        await service.save();

        res.status(200).json({
            success: true,
            msg: "Service updated successfully ✅",
            service
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating service ❌",
            error
        });
    }
};

export const deleteService = async (req, res = response) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                msg: "Service not found ❌"
            });
        }

        service.estado = false;
        await service.save();

        res.status(200).json({
            success: true,
            msg: "Service deleted successfully (soft delete) ✅"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting service ❌",
            error
        });
    }
};
