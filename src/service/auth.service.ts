import User from '../model/user.model';
import bcrypt from 'bcrypt';
class AuthService {
    static async register(user: { email: string; password: string }) {
        try {
            const findUser = await User.findOne({ email: user.email });
            if (findUser) {
                return {
                    statusCode: 400,
                    data: 'Email already exists',
                };
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(user.password, salt);
                const newUser = new User({
                    email: user.email,
                    password: hashPassword,
                });
                const savedUser = await newUser.save();
                return {
                    statusCode: 201,
                    data: savedUser,
                };
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
    static async login(user: { email: string; password: string }) {
        try {
            const findUser = await User.findOne({ email: user.email });
            if (!findUser) {
                return {
                    statusCode: 404,
                    data: 'User not found',
                };
            } else {
                const isValidPassword = await bcrypt.compare(user.password, findUser.password);
                if (!isValidPassword) {
                    return {
                        statusCode: 400,
                        data: 'Wrong password',
                    };
                } else {
                    const { password, ...info } = findUser._doc;
                    return {
                        statusCode: 200,
                        data: info,
                    };
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}

export default AuthService;
