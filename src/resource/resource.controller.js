import { response } from "express";
import Resource from "./resource.model.js";

export const createResource = async (req, res = response) => {
    try {
        const { name, description } = req.body;

        const existing = await Resource.findOne({ name });
        if (existing) {
            return res.status(400).json({
                success: false,
                msg: "Resource already exists ⚠️"
            });
        }

        const resource = new Resource({ name, description });
        await resource.save();

        res.status(201).json({
            success: true,
            msg: "Resource created successfully ✅",
            resource
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating resource ❌",
            error
        });
    }
};

export const getResources = async (req, res = response) => {
    try {
        const resources = await Resource.find({ estado: true });
        res.status(200).json({
            success: true,
            resources
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching resources ❌",
            error
        });
    }
};

export const getResourceById = async (req, res = response) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findById(id);

        if (!resource || !resource.estado) {
            return res.status(404).json({
                success: false,
                msg: "Resource not found ❌"
            });
        }

        res.status(200).json({
            success: true,
            resource
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching resource ❌",
            error
        });
    }
};

export const updateResource = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                msg: "Resource not found ❌"
            });
        }

        resource.name = name || resource.name;
        resource.description = description || resource.description;

        await resource.save();

        res.status(200).json({
            success: true,
            msg: "Resource updated successfully ✅",
            resource
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating resource ❌",
            error
        });
    }
};

export const deleteResource = async (req, res = response) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({
                success: false,
                msg: "Resource not found ❌"
            });
        }

        resource.estado = false;
        await resource.save();

        res.status(200).json({
            success: true,
            msg: "Resource deleted successfully (soft delete) ✅"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting resource ❌",
            error
        });
    }
};
