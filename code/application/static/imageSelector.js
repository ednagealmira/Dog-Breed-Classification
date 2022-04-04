class ImageSelector {
    constructor(idselector) {
        this.idselector = idselector;
    }

    insertImage() {
        let reader = new FileReader();
        reader.onload = function () {
            let dataURL = reader.result;
            $("#selected-image").attr("src", dataURL);
            $("#prediction-list").empty();
        }
        let file = $(this.idselector).prop('files')[0];
        reader.readAsDataURL(file);
    }
}