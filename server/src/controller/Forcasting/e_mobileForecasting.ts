import * as tf from "@tensorflow/tfjs-node";
import {Request, Response} from "express"
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import { Emission } from "../Dashboard/overview_data";








export const e_mobileForecasting = async(req : Request, res:Response) => {

    const {municipality_code, form_type} = req.params;
    const year = new Date().getFullYear();

    try {
      // user_type === "s-admin" ? 
      //                   await FuelFormSchema.find({dateTime_created : {
      //                           $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      //                           $lte: new Date(`${year}-12-30T23:59:59.000Z`)
      //                       },
      //                       "survey_data.form_type" : form_type
                    
      //                   }).exec() : 
      const query = await FuelFormSchema.find({
                      "surveyor_info.municipality_code" : municipality_code,
                      dateTime_created : {
                      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                      $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                      },
                      "survey_data.form_type" : form_type
                    }).exec()



        //await FuelFormSchema.find({
        //                                 "surveyor_info.municipality_code" : municipality_code,
        //                                 dateTime_created : {
        //                                     $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        //                                     $lte: new Date(`${year}-12-30T23:59:59.000Z`)
        //                                 },
        //                             }).exec():
                                      
                                   
        




        
    
        if(!query) return res.sendStatus(404);
        // console.log(query.length);

        // if(query.length < 20) return res.status(200).send("Insuficient Data can't forecast!!");
          
        const {x, y} = prepareData(query)
        console.log("x : ", x);
        console.log("y : ", y);

        if(x.length <= 10) return res.status(204).send("Insuficient Data can't forecast!!");
       const forecast_result =  await forecast(x, y);
       const ghge = computeTotalForecastGHG(forecast_result, form_type as "residential" | "commercial");

        console.log(ghge)
       return res.status(200).send(ghge);
       



    } catch (error) {
        console.log("Forecasting Error : ", error);
        return res.status(500).send(error);
    }
}



const prepareData = (formCollection : any[]) =>{
  const year = new Date().getFullYear();
  let liters:number[] = [];
  let x_date :Date[] = [];



  const dates = formCollection.map(dt => {
  const date = dt.dateTime_created;
    const month = date.getMonth();
    const day = date.getDate();

    return {
      month,
      day,
      year

    }

  })
  const uniqueDate = new Set(dates.map((date)=>JSON.stringify(date)));
  const normalizeUniqueDate = Array.from(uniqueDate).map((date)=>JSON.parse(date));
  // console.log("normalizeDate  : ",  normalizeUniqueDate);

  normalizeUniqueDate.map((date)=>{
    // console.log("dateMap : ", date)
    const {month, day, year} = date
    x_date.push(new Date(year, month, day))
    let liter = 0;

    formCollection.map(dt => {
      const db_date = dt.dateTime_created;
      const db_month = db_date.getMonth();
      const db_day = db_date.getDate();
      const db_year = db_date.getFullYear();
      

      if(month == db_month && day == db_day && db_year == year){
          liter += dt.survey_data.liters_consumption;
      }

    })

    liters.push(liter);

  })



  return {
    x : x_date,
    y : liters
  }
}





const computeTotalForecastGHG = (liters_consumption:number[][], type:"residential"|"commercial")=>{
  let ghge :Emission[] = [];
  let total_litersConsumption :number[]= [];

  liters_consumption.forEach((lts) => {
    let total_liters = 0;
    lts.forEach((lt) =>{
      total_liters += lt;
    })
    total_litersConsumption.push(total_liters);
  })

  total_litersConsumption.forEach((total_lt) => {
    const emmission_result = compute_emission(type, total_lt);
    ghge.push(emmission_result);

  })


  return ghge

}






const compute_emission = (type:"residential"|"commercial", liters_consumption: number) :Emission => {

  /*
     ==========================================
         -------Conversion-Factor-----
         co2 = 1
         ch4 = 28
         n20 = 265

      ==========================================
 */

  //residential          commercial
  //co2  2.66            2.07     
  //ch4  0.0004          0.00032
  //n2o  0.0000218       0.00019


const emission_factors = type === "residential" ? 
                          {
                            co2 : 2.66,
                            ch4 : 0.0004,
                            n2o : 0.0000218
                          } : 
                          {
                            co2 : 2.07,
                            ch4 : 0.00032,
                            n2o : 0.00019
                          }



 const  co2e = (liters_consumption * emission_factors.co2) / 1000;
 const  ch4e =  (liters_consumption * emission_factors.ch4) / 1000;
 const  n2oe =  (liters_consumption * emission_factors.n2o) / 1000;
  
 const emission : Emission = {
     co2e,
     ch4e,
     n2oe, 
     ghge : (co2e * 1) + (ch4e * 28) + (n2oe * 265)     
 }



 return emission

}







/////////////////////////////////////////FORECATING CODE///////////////////////////////////////////////////////////////////////////

const createModel = async (dataLength : number) => {
    const model = tf.sequential();

    model.add(tf.layers.dense({
      units: dataLength,
      inputShape: [dataLength, 1] 
      
    }));


    model.add(
      tf.layers.lstm({
        units: dataLength,
        kernelInitializer: "heUniform",
        activation: "relu",
        returnSequences : true,
      })
    );
    
    model.add(
      tf.layers.lstm({
        units: dataLength,
        kernelInitializer: "heUniform",
        activation: "relu",
        returnSequences : true,
        
     
      })
    );
    
    model.add(
      tf.layers.lstm({
        units: dataLength,
        kernelInitializer: "heUniform",
        activation: "relu",
     
      })
    );


  //   model.add(tf.layers.lstm({
  //     units: dataLength,
  //     kernelInitializer: 'heUniform',
  //     activation: 'relu', // ReLU activation
  //     returnSequences: false,
  // }));

  

  
    model.add(
      tf.layers.dense({
        units: dataLength,
        // kernelInitializer: "heUniform",
        // activation: "relu"
      })
    );
  
    model.compile({ optimizer: "adam", loss: "meanSquaredError" }); 
  
    return model;
  };






const forecast = async (x:Date[], y:number[]) => {

    const dataLength = x.length;
    let x_val = x;
    let y_val = y;
    let predictions:any[] = [];
    let cycle = 200


    

      let x_buff = tf.buffer([1 , dataLength, 1]);
      let y_buff = tf.buffer([1, dataLength]);

      let x_timeStamp = toTimeStamp(x_val, 0);

      
      x_timeStamp.forEach((xT, index) => {
        // console.log("x_val : ", x);
        x_buff.set(xT, 0, index, 0);
        y_buff.set(y_val[index], 0, index);
      });




        
        const xs = x_buff.toTensor();
        const ys = y_buff.toTensor();

        // xs.print();
        console.log("Creating Model !");
        const model = await createModel(dataLength);
        console.log("Model Created !");


        console.log("Model Training !");
        await model.fit(xs, ys, {
          epochs: cycle,
        });

        console.log("Training Completed !");
        




      for(let i = 0; i <= 10; i++){  
       

        const xT_input = toTimeStamp(x_val);
    

        
        let pred = await predict(model, xT_input);
       
        predictions.push(pred);
      }

      tf.dispose(xs);
      tf.dispose(ys);
      
    
    

    return predictions
}




const predict = async (model : tf.Sequential, input : number[]) => {

  //  console.log("Start to Predict future value ! ....");
  //  console.log(input)
   const predict: tf.Tensor = model.predict(tf.tensor3d(input, [1, input.length, 1])) as tf.Tensor;
   const predictedValue = predict.dataSync();
   tf.dispose(predict);

   return predictedValue

}

















//Data Normalize



const normalizeTimeStamp = (timeStamps : number []) =>{

  const maxTimestamp = Math.max(...timeStamps);
  const normalizedTimestamps = timeStamps.map(ts => ts / maxTimestamp);

  return normalizedTimestamps
}



const toTimeStamp = (dates : Date[], addMonth:number = 1) => {

  let timeStamps : number[] = []
  dates.forEach((date)=>{
    const dateToTimeStamps = date.setMonth(date.getMonth() + addMonth);
    timeStamps.push(dateToTimeStamps);
    
  });

const normalizeTS = normalizeTimeStamp(timeStamps);



  return normalizeTS;

}















