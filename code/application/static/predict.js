const DOGBREED_CLASSES = {
    0: 'Afghan',
    1: 'African Wild Dog',
    2: 'Airedale',
    3: 'American Hairless',
    4: 'American Spaniel',
    5: 'Basenji',
    6: 'Basset',
    7: 'Beagle',
    8: 'Bearded Collie',
    9: 'Bermaise',
    10: 'Bichon Frise',
    11: 'Blenheim',
    12: 'Bloodhound',
    13: 'Bluetick',
    14: 'Border Collie',
    15: 'Borzoi',
    16: 'Boston Terrier',
    17: 'Boxer',
    18: 'Bull Mastiff',
    19: 'Bull Terrier',
    20: 'Bulldog',
    21: 'Cairn',
    22: 'Chihuahua',
    23: 'Chinese Crested',
    24: 'Chow',
    25: 'Clumber',
    26: 'Cockapoo',
    27: 'Cocker',
    28: 'Collie',
    29: 'Corgi',
    30: 'Coyote',
    31: 'Dalmation',
    32: 'Dhole',
    33: 'Dingo',
    34: 'Doberman',
    35: 'Elk Hound',
    36: 'French Bulldog',
    37: 'German Sheperd',
    38: 'Golden Retriever',
    39: 'Great Dane',
    40: 'Great Perenees',
    41: 'Greyhound',
    42: 'Groenendael',
    43: 'Irish Spaniel',
    44: 'Irish Wolfhound',
    45: 'Japanese Spaniel',
    46: 'Komondor',
    47: 'Labradoodle',
    48: 'Labrador',
    49: 'Lhasa',
    50: 'Malinois',
    51: 'Maltese',
    52: 'Mex Hairless',
    53: 'Newfoundland',
    54: 'Pekinese',
    55: 'Pit Bull',
    56: 'Pomeranian',
    57: 'Poodle',
    58: 'Pug',
    59: 'Rhodesian',
    60: 'Rottweiler',
    61: 'Saint Bernard',
    62: 'Schnauzer',
    63: 'Scotch Terrier',
    64: 'Shar_Pei',
    65: 'Shiba Inu',
    66: 'Shih-Tzu',
    67: 'Siberian Husky',
    68: 'Vizsla',
    69: 'Yorkie'
};

$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

let model;
(async function () {
    model = await tf.loadLayersModel('http://localhost:81/tfjs-model/MobileNet5/model.json');
    $(".progress-bar").hide();
})();

// preprocess the image to be mobilenet friendly
function preprocessImage(image, modelName) {
    // resize the input image to mobilenet's target size of (224, 224)
    let tensor = tf.browser.fromPixels(image)
      .resizeNearestNeighbor([224, 224])
      .toFloat();
  
    // if model is not available, send the tensor with expanded dimensions
    if (modelName === undefined) {
      return tensor.expandDims();
    } 
  
    // if model is mobilenet, feature scale tensor image to range [-1, 1]
    else if (modelName === "mobilenet") {
      let offset = tf.scalar(127.5);
      return tensor.sub(offset)
        .div(offset)
        .expandDims();
    } 
  
    // else throw an error
    else {
      alert("Unknown model name..")
    }
}

$("#predict-button").click(async function () {
    let image = $("#selected-image").get(0);
    let tensor = preprocessImage(image, 'mobilenet');
    // let tensor = tf.browser.fromPixels(image)
    //     .resizeNearestNeighbor([224,224])
    //     .toFloat()
    //     .expandDims();

    let predictions = await model.predict(tensor).data();
    let top5 = Array.from(predictions)
        .map(function (p, i) {
            return {
                probability: p,
                className: DOGBREED_CLASSES[i]
            };
        }).sort(function (a, b) {
            return b.probability - a.probability;
        }).slice(0, 5);
    
        $("#prediction-list").empty();
        top5.forEach(function (p) {
            $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
        });
});