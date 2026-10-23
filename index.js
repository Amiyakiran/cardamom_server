const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const routes = require("./routes")
require('./connection')
const cookieParser = require("cookie-parser");



const server = express();
server.use(cors({
    origin: "https://cardamom-frontend-yumh.vercel.app",
    credentials: true
  }));
server.use(express.json());
server.use(cookieParser());
server.use(routes);
server.use('/uploads', express.static('./uploads'))

const PORT = 4000 || process.env.PORT 

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})