import jsonwebtoken from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.json({ message: "Please, Enter a token" });
    }
    const token = req.headers['authorization'].split(' ')[1];

    jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        req.userId = decoded.userId;
        next();
    });

}
