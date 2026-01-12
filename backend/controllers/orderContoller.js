import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing order with COD method

const placeOrder = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData:{}});
        
        res.status(200).json({
            success: true,
            message:"Order Placed"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Placing order with stripe method

const placeOrderStripe = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

// Placing order with Razorpay method

const placeOrderRazorpay = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

// User Orders Data for frontend

const userOrders = async (req, res) => {
    try { 
        const {userId} = req.body;
        console.log("HEllo");
        const orders = await orderModel.find ({userId});
        console.log(orders);

        return res.status(200).json({
            success:true,
            orders
        });

    } catch (error) {
        return res.status(400).json({
            success: true,
            message:error.message
        });
    }
}


// All orders data for admin panel

const allOrders = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

// update Order status from admin panel

const updateStatus = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, userOrders, allOrders, updateStatus}