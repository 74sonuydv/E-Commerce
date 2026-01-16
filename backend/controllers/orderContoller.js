import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import Razorpay from 'razorpay'
import 'dotenv/config'

// Global variables 
const currency = 'inr';
const deliveryCharges = 10


// gateway initialize
const stripe = new Stripe (process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay ({
    key_id: process.env.RAZORPAY_KEY_SECRET,
    key_secret: process.env.RAZORPAY_KEY_ID
});



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
        
        const {userId, items, amount, address} = req.body;
        const {origin} = req.headers;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }
        
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        
        const line_items = items.map( (item) => ({
            price_data:{
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        
        console.log("hello");
        line_items.push({
             price_data:{
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        res.status(200).json({
            success:true,
            session_url: session.url
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// Verify Stripe

const verifyStripe = async(req, res) => {
    try {
        const {orderId, success, userId} = req.body;

        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment: 'true'});
            await userModel.findByIdAndUpdate(userId, {cartData: {}});
            res.status(200).json({
                success: true,
            })
        } else {
            await orderModel.findByIdAndUpdate(orderId);
            res.json({
                success: false
            });
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// verify Razorpay

const verifyRazorpay = async(req, res) => {
    try {
        const {razorpay_order_id, userId} = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData:{}});
            res.status(200).json({
                success: true,
                message: "Payment successfull"
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment failed'
            });
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


// Placing order with Razorpay method

const placeOrderRazorpay = async (req, res) => {
    try {
        const {userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }
            
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.order.create(options, (error, order) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message:error
                });
            }
            res.status(200).json({
                success: true,
                order,
            });
        })



    } catch (error) {
        return res.status(400).json({
            success: false,
            message:error.message
        });
    }
}

// User Orders Data for frontend

const userOrders = async (req, res) => {
    try { 
        const {userId} = req.body;
        const orders = await orderModel.find ({userId});
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
        const orders = await orderModel.find({});
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

// update Order status from admin panel

const updateStatus = async (req, res) => {
    try {
        
        const {orderId, status} = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status});
        res.status(200).json({
            success: true,
            message: "Status Updated"
        })

    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, userOrders, allOrders, updateStatus, verifyStripe, verifyRazorpay}