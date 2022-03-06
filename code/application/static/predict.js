$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#classification-list").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

let model;
(async function () {
    model = await tf.loadModel('http://localhost:81/tfjs-model/MobileNet/model.json');
    $(".progress-bar").hide();
})();

$("#predict-button").click(async function () {
    let image = $("#selected-image").get(0);
    let tensor = tf.fromPixels(image)
        .resizeNearestNeighbor([224,224])
        .toFloat()
        .expandDims();

    //more pre-processing to be added here later

    let classifications = await model.predict(tensor).data();
    let top5 = Array.from(classifications)
        .map(function (p, i) {
            return {
                probability: p,
                className: DOGBREED_CLASSES[i]
            };
        }).sort(function (a, b) {
            return b.probability - a.probability;
        }).slice(0, 5);
    
        $("#classification-list").empty();
        top5.forEach(function (p) {
            $("#classification-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`)
        });
});