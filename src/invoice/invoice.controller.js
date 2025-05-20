import { response } from "express";
import Invoice from "./invoice.model.js";

export const createInvoice = async (req, res = response) => {
    try {
        const {
            reservation,
            hotel,
            user,
            amount,
            servicesCharges,
            total,
        } = req.body;

        const invoice = new Invoice({
            reservation,
            hotel,
            user,
            amount,
            servicesCharges: servicesCharges || 0,
            total,
        });

        await invoice.save();

        res.status(201).json({
            success: true,
            msg: "Invoice created successfully ✅",
            invoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error creating invoice ❌",
            error
        });
    }
};

export const getInvoices = async (req, res = response) => {
    try {
        const invoices = await Invoice.find({ estado: true })
            .populate("reservation")
            .populate("hotel", "name address")
            .populate("user", "name email");

        res.status(200).json({
            success: true,
            invoices
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching invoices ❌",
            error
        });
    }
};

export const getInvoiceById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id)
            .populate("reservation")
            .populate("hotel", "name address")
            .populate("user", "name email");

        if (!invoice || !invoice.estado) {
            return res.status(404).json({
                success: false,
                msg: "Invoice not found ❌"
            });
        }

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error fetching invoice ❌",
            error
        });
    }
};

export const updateInvoiceStatus = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                msg: "Invoice not found ❌"
            });
        }

        invoice.status = status;
        await invoice.save();

        res.status(200).json({
            success: true,
            msg: "Invoice status updated ✅",
            invoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error updating invoice ❌",
            error
        });
    }
};

export const deleteInvoice = async (req, res = response) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                msg: "Invoice not found ❌"
            });
        }

        invoice.estado = false;
        await invoice.save();

        res.status(200).json({
            success: true,
            msg: "Invoice deleted successfully (soft delete) ✅"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error deleting invoice ❌",
            error
        });
    }
};
