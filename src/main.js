let express = require("express");
require('dotenv').config();

let app = express();
const port = process.env.PORT || 4002;

app.use(express.json())

let messageRoutes = require("./routes/messagesRoutes")
let authRoutes = require("./routes/authRoutes")

app.use('/', messageRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Web server is listening on port ${port}!`);
   });