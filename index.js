const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const dotenv= require('dotenv');
dotenv.config();
const connection = process.env.MONGODB_URI ;
const port = process.env.PORT ;
const app = express();
const swagger = require('./swagger.json');
const errorHandling = require('./Middleware/errorhandler');
const AllRoutes = require('./Routes/app');

app.use(express.json());
app.use(cookieParser());
// app.use('/careConnect', swaggerUi.serve, swaggerUi.setup(swagger))
// app.use(cors({
//     origin: ["https://loanhub-frontend.onrender.com","https://loanhub-frontend-xity.onrender.com"],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
//  }));
mongoose.connect(connection)
.then(() => {
    app.listen(port, () =>{
        console.log("Mongo DB connected....")
        console.log(`Server running on ${port}...`);
    })
})
.catch((err) => console.log(err));

 app.use('/api', AllRoutes);
app.use(errorHandling);







