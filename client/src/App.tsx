import instance from './http';
const App = () => {
    const handleTest: React.MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
        const res = await instance.get('/');
        console.log(res.data);
    };
    const handleLogin: React.MouseEventHandler<HTMLButtonElement> = async (): Promise<void> => {
        const user = {
            email: 'trandungksnb00@gmail.com',
            password: 'trandung',
        };
        const res = await instance.post('/api/auth/login', user);
        const info = res.data;
        console.log(info);
    };
    const handleGetProfile: React.MouseEventHandler<
        HTMLButtonElement
    > = async (): Promise<void> => {
        try {
            const res = await instance.get('/api/auth/profile');
            console.log(res.data);
        } catch (error: any) {
            console.log(error.message);
        }
    };
    return (
        <div>
            <h1>App</h1>
            <button onClick={handleTest}>Test</button>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleGetProfile}>Get Profile</button>
        </div>
    );
};

export default App;
