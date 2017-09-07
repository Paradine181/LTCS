window.ListeningToComplexSystems = {
    models: [],

    addModel: function(model) {
        ListeningToComplexSystems.models.push(model);
    },

    getModelByName: function(name) {
        for (var i = 0; i < ListeningToComplexSystems.models.length; i++)
            if (ListeningToComplexSystems.models[i].name === name)
                return ListeningToComplexSystems.models[i];
        return null;
    }
}

function Model(name) {
    this.name = name;
    this.chapters = [];
    this.addChapter = function(chapter) {
        this.chapters.push(chapter);
    };
    this.getChapterByName = function(chapterName) {
        for (var i = 0; i < this.chapters.length; i++)
            if (this.chapters[i].name === chapterName)
                return this.chapters[i];
        return null;
    };
}

function Chapter(model, name) {
    this.name = name;
    this.paragraphs = [];
    this.images = [];
    this.addParagraph = function(text) {
        this.paragraphs.push(text);
    };
    this.addImage = function(url, description) {
        this.images.push(new Image(url, description));
    };
    model.addChapter(this);
}

function Image(url, description) {
    this.url = url;
    this.description = description;
}

window.addEventListener('load', function() {
    loadDeferredStyles();
    initializeModels();

    var galleryModal = document.querySelector('.gallery-modal');
    var galleryModalClose = galleryModal.querySelector('.close');

    galleryModalClose.addEventListener('click', function() {
        galleryModal.style.display = 'none';
        galleryModal.style.visibility = 'hidden';
    });
});

function loadDeferredStyles() {
    var addStylesNode = document.querySelector("#deferred-styles");
    var replacement = document.createElement("div");

    replacement.innerHTML = addStylesNode.textContent;
    document.body.appendChild(replacement)
    addStylesNode.parentElement.removeChild(addStylesNode);
}

function setModelView(model) {
    var main = document.querySelector('main');
    var header = main.querySelector('.model-header')
    var headerTitle = document.createElement('h2');

    clearModelView();

    headerTitle.innerHTML = model.name;
    headerTitle.setAttribute('class', 'model-title');

    header.appendChild(headerTitle);

    for (var i = 0; i < model.chapters.length; i++) {
        const btn = document.createElement('button');
        
        btn.innerHTML = model.chapters[i].name;

        btn.addEventListener('click', function() {
            setChapterView(model.getChapterByName(btn.innerHTML));
        });

        header.appendChild(btn);
    }

    if (model.chapters.length > 0) {
        setChapterView(model.chapters[0]);
        header.querySelector('button').click();
    }
}

function clearModelView() {
    var main = document.querySelector('main');
    var header = main.querySelector('header');
    var headerTitle = header.querySelector('h2');

    while (header.hasChildNodes()) {
        header.removeChild(header.lastChild);
    }

    clearChapterView();
}

function setChapterView(chapter) {
    var modelHeader = document.querySelector('.model-content h3');
    var modelText = document.querySelector('.model-content-text');
    var gallery = document.querySelector('.gallery');

    clearChapterView();
    
    modelHeader.innerHTML = chapter.name;

    for (var i = 0; i < chapter.paragraphs.length; i++) {
        addParagraphToChapter(chapter.paragraphs[i]);
    }

    for (var i = 0; i < chapter.images.length; i++) {
        addImageToGallery(chapter.images[i]);
    }

    if (chapter.images.length > 0) {
        gallery.style.display = 'flex';
        gallery.style.visibility = 'visible';
    } else {
        gallery.style.display = 'none';
        gallery.style.visibility = 'hidden';
    }
}

function clearChapterView() {
    var modelText = document.querySelector('.model-content-text');
    var gallery = document.querySelector('.gallery');

    while (modelText.hasChildNodes()) {
        modelText.removeChild(modelText.lastChild);
    }

    while (gallery.hasChildNodes()) {
        gallery.removeChild(gallery.lastChild);
    }
}

function addParagraphToChapter(paragraph) {
    var chapterContent = document.querySelector('.model-content-text');
    var p = document.createElement('p');
    var newLine = document.createElement('br');

    p.innerHTML = paragraph;

    chapterContent.appendChild(p);
    chapterContent.appendChild(newLine);
}

function addImageToGallery(image) {
    var gallery = document.querySelector('.gallery');
    var galleryObject = document.createElement('div');
    var galleryImage = document.createElement('img');
    var galleryDescription = document.createElement('div');
    
    var galleryModal = document.querySelector('.gallery-modal');
    var galleryModalImage = galleryModal.querySelector('.modal-image');
    var galleryModalCaption = galleryModal.querySelector('.model-caption');

    galleryImage.setAttribute('src', image.url);
    galleryImage.setAttribute('alt', image.description);

    galleryImage.addEventListener('click', function() {
        galleryModal.style.display = "block";
        galleryModal.style.visibility = "visible";
        galleryModalImage.src = this.src;
        galleryModalImage.alt = this.alt;
        galleryModalCaption.innerHTML = this.alt;
    });

    galleryDescription.setAttribute('class', 'gallery-caption');
    galleryDescription.innerHTML = image.description;

    galleryObject.setAttribute('class', 'gallery-object');
    galleryObject.appendChild(galleryImage);
    galleryObject.appendChild(galleryDescription);

    gallery.appendChild(galleryObject);
}

function initializeModels() {
    /* Introduction */
    var introModel = new Model('Introduction');
    var introModelAccessibility = new Chapter(introModel, 'Accessibility');
    var introModelSonification = new Chapter(introModel, 'Sonification');
    var introModelNetLogo = new Chapter(introModel, 'NetLogo');
    document.querySelector('#Introduction').addEventListener('click', () => { setModelView(introModel); })
    
    /* 1. Neils */
    var neilsModel = new Model('Neils - Current in a Wire');
    var neilsModelAbout = new Chapter(neilsModel, 'About the Model');
    var neilsModelCode = new Chapter(neilsModel, 'Source Code');

    neilsModelAbout.addImage('./images/models/Neils/NeilsParallel_0.png', 'Neils - Initial State');
    neilsModelAbout.addImage('./images/models/Neils/NeilsParallel_1.png', 'Neils - Parallel Circuit');
    neilsModelAbout.addImage('./images/models/Neils/NeilsSerial_1.png', 'Neils - Serial Circuit');
    neilsModelAbout.addImage('./images/models/Neils/NeilsSingle_1.png', 'Neils - Single Wire');

    /*var reader = new FileReader();
    reader.addEventListener("loadend", function() {
        neilsModelCode.addParagraph(reader.result);
    });
    reader.readAsText(new File('./images/models/Neils/SourceCode.txt'));*/

    document.querySelector('#Neils').addEventListener('click', () => { setModelView(neilsModel); })
    
    /* 2. GasLab */
    var gasLabModel = new Model('Gas Lab');
    var gasLabModelAbout = new Chapter(gasLabModel, 'About the Model');
    var gasLabModelCode = new Chapter(gasLabModel, 'Source Code');

    gasLabModelAbout.addImage('./images/models/GasLab/GasLab_0.png', 'Gas Lab - Initial State');
    gasLabModelAbout.addImage('./images/models/GasLab/GasLab_1.png', 'Gas Lab');

    document.querySelector('#GasLab').addEventListener('click', () => { setModelView(gasLabModel); })
    
    /* 3. GasLab - Moving Piston */
    var gasLabMovingPistonModel = new Model('Gas Lab - Moving Piston');
    var gasLabMovingPistonModelAbout = new Chapter(gasLabMovingPistonModel, 'About the Model');
    var gasLabMovingPistonModelCode = new Chapter(gasLabMovingPistonModel, 'Source Code');

    gasLabMovingPistonModelAbout.addImage('./images/models/GasLabMovingPiston/GasLabMovingPiston_0.png', 'Gas Lab Moving Piston - Initial State');
    gasLabMovingPistonModelAbout.addImage('./images/models/GasLabMovingPiston/GasLabMovingPiston_1.png', 'Gas Lab Moving Piston');

    document.querySelector('#GasLabMovingPiston').addEventListener('click', () => { setModelView(gasLabMovingPistonModel); })
    
    /* 4. Ising */
    var isingModel = new Model('Ising');
    var isingModelAbout = new Chapter(isingModel, 'About the Model');
    var isingModelCode = new Chapter(isingModel, 'Source Code');

    isingModelAbout.addImage('./images/models/Ising/Ising_0.png', 'Ising - Initial State');
    isingModelAbout.addImage('./images/models/Ising/Ising_1.png', 'Ising');

    document.querySelector('#Ising').addEventListener('click', () => { setModelView(isingModel); })
    
    /* 5. Crystalization */
    var crystalizationModel = new Model('Crystalization');
    var crystalizationModelAbout = new Chapter(crystalizationModel, 'About the Model');
    var crystalizationModelCode = new Chapter(crystalizationModel, 'Source Code');

    crystalizationModelAbout.addImage('./images/models/CrystalizationBasic/CrystalizationBasic_0.png', 'Crystalization - Initial State');
    crystalizationModelAbout.addImage('./images/models/CrystalizationBasic/CrystalizationBasic_1.png', 'Crystalization');

    document.querySelector('#Crystalization').addEventListener('click', () => { setModelView(crystalizationModel); })
    
    /* 6. Simple Kinetics 1 */
    var kinetics1Model = new Model('Simple Kinetics 1');
    var kinetics1ModelAbout = new Chapter(kinetics1Model, 'About the Model');
    var kinetics1ModelCode = new Chapter(kinetics1Model, 'Source Code');

    kinetics1ModelAbout.addImage('./images/models/SimpleKinetics1/SimpleKinetics1_0.png', 'Simple Kinetics 1 - Initial State');
    kinetics1ModelAbout.addImage('./images/models/SimpleKinetics1/SimpleKinetics1_1.png', 'Simple Kinetics 1');

    document.querySelector('#SimpleKinetics1').addEventListener('click', () => { setModelView(kinetics1Model); })
    
    /* 7. Simple Kinetics 2 */
    var kinetics2Model = new Model('Simple Kinetics 2');
    var kinetics2ModelAbout = new Chapter(kinetics2Model, 'About the Model');
    var kinetics2ModelCode = new Chapter(kinetics2Model, 'Source Code');

    kinetics2ModelAbout.addImage('./images/models/SimpleKinetics2/SimpleKinetics2_0.png', 'Simple Kinetics 2 - Initial State');
    kinetics2ModelAbout.addImage('./images/models/SimpleKinetics2/SimpleKinetics2_1.png', 'Simple Kinetics 2');

    document.querySelector('#SimpleKinetics2').addEventListener('click', () => { setModelView(kinetics2Model); })
    
    /* 8. Simple Kinetics 3 */
    var kinetics3Model = new Model('Simple Kinetics 3');
    var kinetics3ModelAbout = new Chapter(kinetics3Model, 'About the Model');
    var kinetics3ModelCode = new Chapter(kinetics3Model, 'Source Code');

    kinetics3ModelAbout.addImage('./images/models/SimpleKinetics3/SimpleKinetics3_0.png', 'Simple Kinetics 3 - Initial State');
    kinetics3ModelAbout.addImage('./images/models/SimpleKinetics3/SimpleKinetics3_1.png', 'Simple Kinetics 3');

    document.querySelector('#SimpleKinetics3').addEventListener('click', () => { setModelView(kinetics3Model); })
    
    /* 9. Fire */
    var fireModel = new Model('Fire');
    var fireModelAbout = new Chapter(fireModel, 'About the Model');
    var fireModelCode = new Chapter(fireModel, 'Source Code');

    fireModelAbout.addImage('./images/models/Fire/Fire_0.png', 'Fire - Initial State');
    fireModelAbout.addImage('./images/models/Fire/Fire_1.png', 'Fire');

    document.querySelector('#Fire').addEventListener('click', () => { setModelView(fireModel); })
    
    /* 10. Wolf Sheep Predation */
    var wolfSheepModel = new Model('Wolf Sheep Predation');
    var wolfSheepModelAbout = new Chapter(wolfSheepModel, 'About the Model');
    var wolfSheepModelCode = new Chapter(wolfSheepModel, 'Source Code');

    wolfSheepModelAbout.addImage('./images/models/WolfSheepPredation/WolfSheepPredation_0.png', 'Wolf Sheep Predation - Initial State');
    wolfSheepModelAbout.addImage('./images/models/WolfSheepPredation/WolfSheepPredation_1.png', 'Wolf Sheep Predation');

    document.querySelector('#WolfSheepPredation').addEventListener('click', () => { setModelView(wolfSheepModel); })
    
    ListeningToComplexSystems.addModel(introModel);

    setModelView(introModel);
}
