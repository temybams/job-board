import jwt from "jsonwebtoken";

function JWTGenerator(payload: object): string {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });
    return token;
}

export default JWTGenerator;
