import  jwt from "jsonwebtoken";

const authMiddleware=(req,res,next)=>{

    try{
        const token=req.headers["authorization"].split(" ")[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                console.log("err in auth mid ",err);
                return res.status(401).send({
                    message:"Auth failed",
                    success:false,
                });
            }
            else{
                  req.body.userId=decoded.id;
                // req.userId=decoded.id;
                next();
            }
        });

    } catch(err){
        console.log("err in auth mid catch",err);
        return res.status(401).send({
            message:"Auth failed",
            success:false,
        })
    }

}
export default authMiddleware;
