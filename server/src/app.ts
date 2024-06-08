import express from 'express';
import connectDB from './db_connection';
import cors from 'cors';

import accountRoute from './route/acc_route'
import tokenRoute from "./route/token_route"
import formRoute from "./route/form_route"
import dashboardRoute from "./route/dashboard_route";
import summaryDataRoute from "./route/summaryData_route";

const app = express();

app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(cors());







//routes
app.use('/api/account', accountRoute);
app.use('/api/token', tokenRoute);
app.use('/api/forms', formRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/summary-data', summaryDataRoute);




app.get('/', (req : express.Request, res:express.Response)=>{
    return res.send("Hello Erika!");
})

const start = async () =>{ 
    try {
        const PORT = process.env.PORT || 3001;
        // const online_db_url = process.env.MONGO_URI as string
        const local_db_url = 'mongodb://127.0.0.1/ghgV2_db'
        await connectDB(local_db_url);
        app.listen(PORT, () => console.log(`server is listening in port ${PORT}`))

    } catch (error) {
        // console.error(error);
        console.log(error);
    }
}

start(); // start server


export default app;