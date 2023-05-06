class AuthService {
    static async login(user: { email: string; password: string }) {
        try {
            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}

export default AuthService;
