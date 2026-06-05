import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
    title:{
        type:String,
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
},{timestamps:true})
const Expense = new mongoose.model("Expense" , expenseSchema)
export default Expense