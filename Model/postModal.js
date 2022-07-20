const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = require('./userModel')
const postSchema = new Schema({
  img: {
    type: Array,
    default: [],
    required: true,
  },
  caption: {
    type: "string",
    required: true,
  },
  createdBy: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: [
    {
      comment: {
        type: "string",
      },
      reply:[
        {
              reply: {
                type: "string",
                required: true,

              },
              
              replyBy : {
                required: true,
                type: mongoose.Types.ObjectId,
                ref: "user", 
              },
              time : {
                type: Date,
                default: Date.now
              },
              like:{
               type: Array,
               default: [],
              }
        
            }
      ],
      commentBy: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: "user",   
      },
      likes: [
        {
            type: Array,
            default: [],
        }
      ],
    },
  ],
});
module.exports = mongoose.model('Post', postSchema);
