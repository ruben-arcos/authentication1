let express = require("express");
let router = express.Router();
let controller = require("../controllers/messageController");
let auths = require("../middleware/auth")

// only two routers

// anyone can get to this route
router.get('/hello', controller.hello)

// private hello - someone with a valid token can access this route
// needs some work first

// this is where next() comes in

router.get('/privatehello', auths.checkJWT, controller.privateHello)

module.exports = router;