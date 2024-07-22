const mongoose = require('mongoose');

//Create notificationSchema

var notification = new mongoose.Schema({
    touser:[{type:mongoose.Schema.Types.ObjectId,}],
    viewers: { type: [{ type: mongoose.Schema.Types.ObjectId }], default: [] }, // Initialize viewers array    viewsOrNot:{type:Boolean,default:false},
    notification:{ 
        notification_subject: {type: String},
        notification_body: {type: String}
    },
},{
    timestamps: true
});


module.exports = mongoose.model("notification", notification);