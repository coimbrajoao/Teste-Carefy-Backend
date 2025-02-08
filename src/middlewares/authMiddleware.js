const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).send({ message: 'Autenticação necessária' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    const user = "admin";
    const pass = "admin";

    if(username === user && password === pass) {
        req.user = { username };
        return next();
    } else {
        return res.status(401).send({ message: 'Usuário ou senha inválidos' });
    }

   
};

module.exports = basicAuth;