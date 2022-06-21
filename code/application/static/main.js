class Main {
    start() {
        let model;
        (async function () {
            model = await tf.loadLayersModel('http://localhost:81/tfjs-model/MobileNet_lr1e-3_e15/model.json');
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