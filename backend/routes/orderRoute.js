import express from 'express';
import {placeOrder, placeOrderStripe, placeOrderRazorpay, userOrders, allOrders, updateStatus} from '../controllers/orderContoller.js';
import adminAuth from '../middlreware/adminAuth.js';
import authUser from '../middlreware/auth.js';

const orderRouter = express.Router();

// Admin features

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment features

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser,placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// user features
orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;