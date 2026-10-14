import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username:{type:String,required:true,trim:true,minlength:2,maxlength:30},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  passwordHash:{type:String,required:true},
  solvedProblems:[{type:mongoose.Schema.Types.ObjectId,ref:'Problem'}],
  contributionPoints:{type:Number,default:0},
  createdAt:{type:Date,default:Date.now}
},{timestamps:true});
export default mongoose.model('User',userSchema);
