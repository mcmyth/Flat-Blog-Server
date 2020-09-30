export const SessionConfig = {
    secret: '12345',
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: true
}

export const jwtConfig = {
    secret: 'secret12345',
    algorithms: ['HS256'],
    credentialsRequired: false,
    expiresIn: 3600 * 24 * 3
}

export const CrossOrigin = (req, res, next) => {
    const allowedOrigins = ['http://127.0.0.1:8081', 'http://localhost:8081']
    const origin = req.headers.origin
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin)
    }
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "content-type")
    next();
}
