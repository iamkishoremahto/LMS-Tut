import { app } from './app'
require('dotenv').config();
import connectDb  from './utils/db'
// create server

app.listen(process.env.PORT, async () =>{
    console.log(`server listening on port : ${process.env.PORT}`);
    await connectDb();
});