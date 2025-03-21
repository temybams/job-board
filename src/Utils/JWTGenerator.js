import jwt from 'jsonwebtoken';

function JWTGenerator(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    return token;
}

export default JWTGenerator;
