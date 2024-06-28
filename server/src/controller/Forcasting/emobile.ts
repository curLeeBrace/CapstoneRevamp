import * as tf from "@tensorflow/tfjs-node";


const forecast = () => {
    const x = tf.tensor1d([1,2,3]);

    x.print();
}


export default forecast