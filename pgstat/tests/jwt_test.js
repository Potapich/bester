const jwt = require('jsonwebtoken')
const config = require('../server/config')

const jwttoken = jwt.sign(
    {user: 'jwt_light-pro_sec'},
    config.jwtSecret,
    {expiresIn: '10h'}
)

console.log(jwttoken);

console.log(jwt.verify(jwttoken, config.jwtSecret));