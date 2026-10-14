import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function auth(req,res,next){
  try { const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,''); if(!token) return res.status(401).json({message:'Please log in to continue.'});
    const decoded=jwt.verify(token,process.env.JWT_SECRET); const user=await User.findById(decoded.id).select('-passwordHash');
    if(!user) return res.status(401).json({message:'Account not found.'}); req.user=user; next();
  } catch { return res.status(401).json({message:'Invalid or expired session. Please log in again.'}); }
}
