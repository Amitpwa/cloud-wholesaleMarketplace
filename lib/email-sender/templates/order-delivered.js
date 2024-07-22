const orderDeliveredBody = (option) => {
    return `
      <h1>Your Order has been Delivered</h1>
      <p>Dear Customer,</p>
      <p>Your order with ID ${option.orderId} has been successfully delivered. Please find the details in the attached PDF.</p>
      <p>Thank you for shopping with us!</p>
    `;
  };
  
  module.exports = { orderDeliveredBody };
  