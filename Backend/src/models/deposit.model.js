import mongoose from "mongoose";
const depositSchema = new mongoose.Schema(
    {
         memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Member",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
    },{timestamps:true}
)
const Deposit = new mongoose.model("Deposit" , depositSchema)
export default Deposit