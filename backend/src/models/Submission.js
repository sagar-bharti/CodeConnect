import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},problem:{type:mongoose.Schema.Types.ObjectId,ref:'Problem'},language:{type:String,required:true},sourceCode:{type:String,required:true},status:{type:String,default:'Submitted'},stdout:String,stderr:String,time:String,memory:String,createdAt:{type:Date,default:Date.now}},{timestamps:true});
export default mongoose.model('Submission',schema);
