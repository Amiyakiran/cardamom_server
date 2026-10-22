

const mongoose = require("mongoose")
const inventories = require("../models/inventoryModel")
const products = require("../models/productModel")

const getNonNegativeNumber = (value) => {
    if (value === undefined || value === null || value === "") return null
    const number = Number(value)
    return Number.isFinite(number) && number >= 0 ? number : null
}

//add inventory details
exports.addToInventoryController = async (req, res) => {
    const { date, products: reportProducts } = req.body || {}
    const [year, month, day] = typeof date === "string" ? date.split("-").map(Number) : []
    const parsedDate = new Date(`${date}T00:00:00.000Z`)
    if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.getUTCFullYear() !== year ||
        parsedDate.getUTCMonth() !== month - 1 ||
        parsedDate.getUTCDate() !== day ||
        !Array.isArray(reportProducts) ||
        reportProducts.length === 0
    ) {
        return res.status(400).json({ message: "A valid report date and at least one product are required" })
    }

    const seenProductIds = new Set()
    const normalizedProducts = []
    for (const reportProduct of reportProducts) {
        const productId = String(reportProduct?.productId || "")
        const openingStock = getNonNegativeNumber(reportProduct?.openingStock)
        const unitsSold = getNonNegativeNumber(reportProduct?.unitsSold)
        const stockAdded = getNonNegativeNumber(reportProduct?.stockAdded)
        if (
            !mongoose.Types.ObjectId.isValid(productId) ||
            seenProductIds.has(productId) ||
            openingStock === null ||
            unitsSold === null ||
            stockAdded === null ||
            unitsSold > openingStock
        ) {
            return res.status(400).json({ message: "The inventory report contains invalid product stock values" })
        }

        seenProductIds.add(productId)
        normalizedProducts.push({
            productId,
            openingStock,
            unitsSold,
            stockAdded,
            closingStock: openingStock - unitsSold + stockAdded
        })
    }

    let session
    try {
        session = await mongoose.startSession()
        let savedInventory
        await session.withTransaction(async () => {
            const matchingProducts = await products.find({
                _id: { $in: normalizedProducts.map((product) => product.productId) }
            }).session(session)
            if (matchingProducts.length !== normalizedProducts.length) {
                const error = new Error("One or more products in this report no longer exist")
                error.status = 404
                throw error
            }

            const productById = new Map(matchingProducts.map((product) => [String(product._id), product]))
            const inventoryProducts = normalizedProducts.map((reportProduct) => {
                const product = productById.get(reportProduct.productId)
                return {
                    ...reportProduct,
                    title: product.title,
                    image: product.image,
                    varient: product.varient
                }
            })

            const stockUpdates = await products.bulkWrite(
                inventoryProducts.map((product) => ({
                    updateOne: {
                        filter: { _id: product.productId },
                        update: { $set: { stock: product.closingStock } }
                    }
                })),
                { session }
            )
            if (stockUpdates.matchedCount !== inventoryProducts.length) {
                throw new Error("Unable to update stock for every product in the report")
            }

            savedInventory = await inventories.findOneAndUpdate(
                { date },
                { $set: { date, products: inventoryProducts } },
                { new: true, upsert: true, runValidators: true, session }
            )
        })

        return res.status(200).json({
            message: "Inventory report saved and product stocks updated",
            inventory: savedInventory
        })
    } catch (error) {
        console.error("Unable to save inventory report", error)
        return res.status(error.status || 500).json({
            message: error.status ? error.message : "Unable to save inventory report and update product stocks"
        })
    } finally {
        if (session) await session.endSession()
    }
}


//get all inventories
exports.getAllInventoriesController = async (_req, res) => {
    try {
        const allInventories = await inventories.find().sort({ date: -1 })
        return res.status(200).json(allInventories)
    } catch (error) {
        console.error("Unable to load inventory reports", error)
        return res.status(500).json({ message: "Unable to load inventory reports" })
    }
}

//delete inventory

exports.deleteInventoryController = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid inventory report ID" })
    }
    try {
        const deletedInventory = await inventories.findByIdAndDelete(req.params.id)
        if (!deletedInventory) {
            return res.status(404).json({ message: "Inventory report not found" })
        }
        return res.status(200).json({ message: "Inventory report deleted" })
    } catch (error) {
        console.error("Unable to delete inventory report", error)
        return res.status(500).json({ message: "Unable to delete inventory report" })
    }
}