class Cnn {
    constructor(model) {
        this.model = model;
    }

    preprocess(image) {
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat();

        let offset = tf.scalar(127.5);
        return tensor.sub(offset)
            .div(offset)
            .expandDims();
    }
    
    async predict(image) {
        let tensor = this.preprocess(image);
        let predictions = await this.model.predict(tensor).data();
        let top3 = Array.from(predictions)
            .map(function (p, i) {
                return {
                    probability: p,
                    className: DOGBREED_CLASSES[i]
                };
            }).sort(function (a, b) {
                return b.probability - a.probability;
            }).slice(0, 3);
        
        $("#prediction-list").empty();
        top3.forEach(function (p) {
            $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
        });
    }
}