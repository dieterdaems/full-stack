import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET
const jwtExpiresHours = process.env.JWT_EXPIRES_HOURS

const generateJwtToken = ({id, role}): string => {
    const payload = { id, role};
    const options = { expiresIn: `${jwtExpiresHours}h`, issuer: 'projectsmgm_app' };
    try {
        return jwt.sign(payload, jwtSecret, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
}

export { generateJwtToken };