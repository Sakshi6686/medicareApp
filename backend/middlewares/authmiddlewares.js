import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            console.log();
            if (err) {
                console.log("err in auth",err);
                return res.status(401).send({
                    message: "Auth failed",
                    success: false,
                });
            }
            else {
                console.log("else in auth");
                //console.log(decoded.id);
                req.body.userId = decoded.id;
                next();
            }
        });

    } catch (err) {
        console.log("err in auth catch");
        return res.status(401).send({
            message: "Auth failed",
            success: false,
        })
    }

}

export default authMiddleware;