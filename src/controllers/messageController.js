let hello = (req, res) => {
    console.log("hello() from messages cotroller");
    res.send("Hello, this is a public hello")
}

//we want this route to be available only to logged users
let privateHello = (req, res) => {

    let fullName = req.userInfo.fullName;
    let userId = req.userInfo.userId;


    console.log("private hello from message controller");
    res.send("Hello " + fullName + "! You are logged in with user id " + userId)
}

module.exports = {
    hello,
    privateHello
}