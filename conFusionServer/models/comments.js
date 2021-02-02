const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating :{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    author:{
        type:String,
        required:true
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dish:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish',
    }
},{
    timestamps:true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;