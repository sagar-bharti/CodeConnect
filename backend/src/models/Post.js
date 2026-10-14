import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},body:{type:String,required:true,maxlength:3000},createdAt:{type:Date,default:Date.now}});
const postSchema = new mongoose.Schema({
  author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  title:{type:String,required:true,trim:true,maxlength:160}, body:{type:String,required:true,maxlength:8000},
  code:{type:String,default:'',maxlength:20000}, topic:{type:String,default:'General'}, difficulty:{type:String,enum:['Easy','Medium','Hard','General'],default:'General'},
  comments:[commentSchema], likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}], bookmarks:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
  createdAt:{type:Date,default:Date.now}
},{timestamps:true});
export default mongoose.model('Post',postSchema);
