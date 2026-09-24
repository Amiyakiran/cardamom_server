const mongoose = require('mongoose')

connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('Mongodb connected successfully');
    
}).catch((err)=>{
    console.log(`connection failed due to ${err}`);
    
})