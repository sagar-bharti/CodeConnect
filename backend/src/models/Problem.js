import mongoose from 'mongoose';
const problemSchema = new mongoose.Schema({
  title:{type:String,required:true}, slug:{type:String,required:true,unique:true},
  difficulty:{type:String,enum:['Easy','Medium','Hard'],default:'Easy'},
  topic:{type:String,default:'Arrays'}, description:{type:String,required:true},
  examples:[{input:String,output:String,explanation:String}],
  constraints:[String], starterCode:{type:Map,of:String,default:{}},
  testCases:[{input:String,expectedOutput:String}],
  createdAt:{type:Date,default:Date.now}
},{timestamps:true});
export default mongoose.model('Problem',problemSchema);
