class Main {
    start() {
        let model;
        (async function () {
            model = await tf.loadLayersModel('http://localhost:81/tfjs-model/MobileNet5/model.json');
            $(".progress-bar").hide();
        })();
        
        $("#image-selector").change(function () {
            let imageSelector = new ImageSelector("#image-selector");
            imageSelector.insertImage();
        });
        
        $("#predict-button").click(function () {
            let CNN = new Cnn(model);
            let image = $("#selected-image").get(0);
            CNN.predict(image);
        });
    }
}

new Main().start();

// $("#image-selector").change(function () {
//     let reader = new FileReader();
//     reader.onload = function () {
//         let dataURL = reader.result;
//         $("#selected-image").attr("src", dataURL);
//         $("#prediction-list").empty();
//     }
//     let file = $("#image-selector").prop('files')[0];
//     reader.readAsDataURL(file);
// });

// preprocess the image to be mobilenet friendly
// function preprocessImage(image, modelName) {
// function preprocessImage(image) {
//     // resize the input image to mobilenet's target size of (224, 224)
//     let tensor = tf.browser.fromPixels(image)
//       .resizeNearestNeighbor([224, 224])
//       .toFloat();
  
//     // if model is not available, send the tensor with expanded dimensions
//     // if (modelName === undefined) {
//     //   return tensor.expandDims();
//     // } 
  
//     // if model is mobilenet, feature scale tensor image to range [-1, 1]
//     // else if (modelName === "mobilenet") {
//       let offset = tf.scalar(127.5);
//       return tensor.sub(offset)
//         .div(offset)
//         .expandDims();
//     // } 
  
//     // else throw an error
//     // else {
//     //   alert("Unknown model name..")
//     // }
// }

// $("#predict-button").click(async function () {
//     let image = $("#selected-image").get(0);
//     // let tensor = preprocessImage(image, 'mobilenet');
//     let tensor = preprocessImage(image);

//     let predictions = await model.predict(tensor).data();
//     let top3 = Array.from(predictions)
//         .map(function (p, i) {
//             return {
//                 probability: p,
//                 className: DOGBREED_CLASSES[i]
//             };
//         }).sort(function (a, b) {
//             return b.probability - a.probability;
//         }).slice(0, 3);
    
//     $("#prediction-list").empty();
//     top3.forEach(function (p) {
//         $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
//     });
// });