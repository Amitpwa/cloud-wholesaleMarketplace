const Cart = require("../models/Cart");
const Product = require("../models/Product");


const addToCart = async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(200).send({
      message: "Product Added to Cart!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getFromCart = async (req, res) => {
//   try {
//       const cartItem = await Cart.find({ userId: req.body.userId })
//           .populate({
//               path: "products.productId", // Populate the products' productId field
//               model: product, // Corrected model name to capital 'P'
//               select: "title", // Select the title field from the Product schema
//           });

//       res.send({
//           success: true,
//           message: "Successfully fetch!!",
//           cartItem
//       });
//   } catch (err) {
//       console.log(err);
//       res.status(500).send({
//           message: err.message,
//       });
//   }
// };

const getFromCart = async (req, res) => {
  try {
    // Find cart items for the given userId
    const cartItems = await Cart.find({ userId: req.body.userId }).populate({
      path: "products.productId",
      model: Product, // Corrected model name to capital 'Product'
      select: "title stock minimumOrderOfQuantity", // Select necessary fields from the Product schema
    });

    // Validate cart items and construct response
    const response = { success: true, message: "Successfully fetched cart items", cartItems: [] };
    for (const item of cartItems) {
      for (const productItem of item.products) {
        const product = productItem.productId;
        const cartQuantity = parseInt(productItem.quantity);
        const cartItemData = { productId: product._id, title: product.title, cartQuantity };

        if (cartQuantity < product.minimumOrderOfQuantity) {
          cartItemData.message = 'Quantity is less than Minimum Order Of Quantity';
        } else if (cartQuantity > product.stock) {
          cartItemData.message = 'Quantity exceeds Available Stock';
        } else {
          cartItemData.message = 'Valid Quantity';
        }

        response.cartItems.push(cartItemData);
      }
    }

    // Send the response
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};


module.exports = {
    addToCart,
    getFromCart
};
