require("dotenv").config();
const stripe = require("stripe")(`${process.env.STRIPE_KEY}` || null); /// use hardcoded key if env not work

const mongoose = require("mongoose");

const Order = require("../models/Order");

const { handleProductQuantity } = require("../lib/stock-controller/others");
const { formatAmountForStripe } = require("../lib/stripe/stripe");

const addOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
    });
    const order = await newOrder.save();
    res.send({
      sucess:true,
      message: "Sucessfully placed order!!!",
      order
    });
    handleProductQuantity(order.cart);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const addOrder = async (req, res) => {
//   try {
//     const newOrder = new Order({
//       ...req.body,
//     });
//     const order = await newOrder.save();

//     // Fetch product details for each product in the cart
//     const populatedCart = await Promise.all(order.cart.map(async item => {
//       const product = await Product.findById(item.product);
//       return {
//         ...item,
//         productName: product ? product.title : "Product not found" // Assuming product name is stored in a field named 'name'
//       };
//     }));

//     // Update order with populated cart
//     order.cart = populatedCart;
//     await order.save();

//     res.send({
//       success: true,
//       message: "Successfully placed order!!!",
//       order
//     });
    
//     handleProductQuantity(order.cart);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const createPaymentIntent = async (req, res) => {
  const { total: amount, cardInfo: payment_intent, email } = req.body;
  // Validate the amount that was passed from the client.
  if (!(amount >= process.env.MIN_AMOUNT && amount <= process.env.MAX_AMOUNT)) {
    return res.status(500).json({ message: "Invalid amount." });
  }
  if (payment_intent.id) {
    try {
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent.id
      );
      // If PaymentIntent has been created, just update the amount.
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent.id,
          {
            amount: formatAmountForStripe(amount, process.env.CURRENCY),
          }
        );
        // console.log("updated_intent", updated_intent);
        return res.send(updated_intent);
      }
    } catch (err) {
      if (err.code !== "resource_missing") {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        return res.status(500).send({ message: errorMessage });
      }
    }
  }
  try {
    // Create PaymentIntent from body params.
    const params = {
      amount: formatAmountForStripe(amount, process.env.CURRENCY),
      currency: process.env.CURRENCY,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const payment_intent = await stripe.paymentIntents.create(params);
    // console.log("payment_intent", payment_intent);

    res.send(payment_intent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).send({ message: errorMessage });
  }
};

// get all orders user  for dashboard
const getOrderCustomer = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;
    const totalDoc = await Order.countDocuments({ user: req.query.userId });
    
    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
          user: mongoose.Types.ObjectId(req.query.userId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

  

    // total padding order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
          user: mongoose.Types.ObjectId(req.query.userId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          user: mongoose.Types.ObjectId(req.query.userId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // today order amount
    // query for orders
    const orders = await Order.find({ user: req.query.userId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

      var totallength=Math.ceil(totalDoc/limits);
      if(totallength==1 && page==totallength ){
        prevPage=null;
        hasPrevPage=false;
        nextPage=null;
        hasNextPage=false; 
    }
    else if(pages==1 && totallength>pages) {
                prevPage=null;
                hasPrevPage=false;
                nextPage=Number(pages)+1; 
                hasNextPage=true;
    }
    else if(pages>1 && pages==totallength){
            prevPage=Number(pages)-1;
            hasPrevPage=true;
            nextPage=null;
            hasNextPage=false;
    }
    else{   prevPage=Number(pages)-1;
            nextPage=Number(pages)+1;
            hasPrevPage=true;
            hasNextPage=true;
    }
  
    const  Pagination ={
      "TotalDocuments":totalDoc,
      "limit":limits,
      "TotalPages":totallength,
      "Current Page":pages,
      "PrevPage":prevPage,
      "NextPage":nextPage,
      "HasPrevPage":hasPrevPage,
      "HasNextPage":hasNextPage,
      "PagingCounter":pages,      
    };





    res.send({
      Message:"Sucessfully fetch details",
      PendingOrders: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      ProcessingOrders:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      DeliveredOrders:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      orders,
      limits,
      pages,
      totalDoc,
      Pagination
    });

  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//By order id find order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.find({_id: mongoose.Types.ObjectId(req.params.orderid)});
    console.log(order);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log(req.query);
    const orders = await Order.find({ user: mongoose.Types.ObjectId(userId) });
    res.send(orders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  getOrderByUserId
};
