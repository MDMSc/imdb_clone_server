import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];
    
          if (!token) {
            return res.status(401).send({ message: "User not logged in" })
          }
    
          jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
              return res.status(500).send({ message: error.message });
            }
    
            req.user = decoded;
            next();
          });
        } catch (error) {
          res.status(401).send({ message: error.message });
        }
      } else {
        res.status(401).send({ message: "User not logged in" });
      }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
