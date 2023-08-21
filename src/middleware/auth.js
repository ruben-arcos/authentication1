let jwt = require("jsonwebtoken");

// AUTHORIZATION: WHAT ROUTES CAN YOU ACCESS AS A LOGGED IN USER THAT A REGULAR USER CAN'T

let checkJWT = (req, res, next) => {
    let headerValue = req.get("Authorization");
    let signedToken;

    if(headerValue) {
        let parts = headerValue.split(" ");
        signedToken = parts[1];
    }

    if(!signedToken) {
        console.log("Missing signed token")
        res.sendStatus(403)
        return //stop
    }

    // if I get here, the signed token is good, so I want to verify the secret

    try {

    let unsigned = jwt.verify(signedToken, process.env.JWT_SECRET)

    // define a var in the request object and sfuff the info from the unsigned token
    // we made it in the authController into the request object
    // so I can use it in the next step in the chain

    req.userInfo = unsigned;

    } catch(err) {
        console.log("Failed to verify token", err)
        res.sendStatus(403);
        return;
    }

    // if get to here, it's a valid token, so we g to the next task in the chain

    next();

}

module.exports = {
    checkJWT
}