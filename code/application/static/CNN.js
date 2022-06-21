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
        let predict_result = Array.from(predictions)
            .map(function (p, i) {
                return {
                    probability: p,
                    className: DOGBREED_CLASSES[i]
                };
            }).sort(function (a, b) {
                return b.probability - a.probability;
            }).slice(0,1);
        
        $("#prediction").empty()
        $("#prediction").append(
            `<h4>Hasil Klasifikasi:</h4>
            <p>${(predict_result[0].probability.toFixed(6))*100}% ${predict_result[0].className}</p>`
            );
    }
}