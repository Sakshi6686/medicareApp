// const jwt=require("jsonwebtoken");
// exports={};

// exports.getToken=(email,user)=>{

//     const token=jwt.sign({identifier:user.id},"ksfknkknvoaovno");

//     return token;
// }
// module.exports=exports;

import jwt from "jsonwebtoken";

const getToken = (email, user) => {
    const token = jwt.sign({ identifier: user.id }, "ksfknkknvoaovno");
    return token;
};

export { getToken };