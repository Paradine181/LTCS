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

function Chapter(model, name, direction) {
    this.name = name;
    this.direction = direction;
    this.paragraphs = [];
    this.images = [];
    this.addParagraph = function(text, type) {
        this.paragraphs.push({type: type, content: text});
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
    toggleModalAnimation();

    var galleryModal = document.querySelector('.gallery-modal');
    var galleryModalClose = galleryModal.querySelector('.close');

    galleryModalClose.addEventListener('click', function() {
        if (galleryModal.classList.contains('is-paused')){
            galleryModal.classList.remove('is-paused');
        }
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
    var header = main.querySelector('header')
    var headerTitle = document.createElement('h2');

    clearModelView();

    headerTitle.innerHTML = model.name;
    headerTitle.setAttribute('class', 'ltcs-item-grow');

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
    modelText.dir = chapter.direction;

    for (var i = 0; i < chapter.paragraphs.length; i++) {
        addParagraphToChapter(chapter.paragraphs[i].content, chapter.paragraphs[i].type);
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

function addParagraphToChapter(paragraphUrl, type) {
    var chapterContent = document.querySelector('.model-content-text');
    var p = document.createElement('p');
    var newLine = document.createElement('br');

    getFile(paragraphUrl, function(paragraph) {
        if (type === 'code') {
            const paragraphHTML = (require('highlight-nl')(paragraph)).replace(/\r\n/g, "\n").replace(/\n/g, '<br />').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/  /g, '&nbsp;&nbsp;&nbsp;&nbsp;');
            p.innerHTML = paragraphHTML;
        } else {
            const paragraphHTML = paragraph;
            p.innerHTML = paragraphHTML;
        }
    });

    chapterContent.appendChild(p);
    chapterContent.appendChild(newLine);
}

function toggleModalAnimation() {
    var galleryModal = document.querySelector('.gallery-modal');
    
    galleryModal.addEventListener('animationend', function() {
        if (!galleryModal.classList.contains('is-paused')){
            galleryModal.classList.add('is-paused');
        }

        if (galleryModal.classList.contains('fade-out')) {
            if (!galleryModal.classList.contains('fade-in'))
                galleryModal.classList.add('fade-in');
            galleryModal.classList.remove('fade-out');
            galleryModal.style.display = 'none';
            galleryModal.style.visibility = 'hidden';
        } else if (galleryModal.classList.contains('fade-in')) {
            if (!galleryModal.classList.contains('fade-out'))
                galleryModal.classList.add('fade-out');
            galleryModal.classList.remove('fade-in');
        } else {
            galleryModal.classList.add('fade-in');
        }
    });
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

        if (galleryModal.classList.contains('is-paused')){
            galleryModal.classList.remove('is-paused');
        }
    });

    galleryDescription.setAttribute('class', 'gallery-caption');
    galleryDescription.innerHTML = image.description;

    galleryObject.setAttribute('class', 'gallery-object');
    galleryObject.appendChild(galleryImage);
    galleryObject.appendChild(galleryDescription);

    gallery.appendChild(galleryObject);
}

function getFile(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.addEventListener('load', function (e) {
        if (xhr.status == 200) {
            if (callback) {
                callback(e.target.responseText);
            }
        } else {
            console.error('received the following status from server: ' + xhr.status);
            console.log('received the following status from server: ' + xhr.status);
        }
    });
    xhr.send();
}

function initializeModels() {
    /* Introduction */
    var introModel = new Model('הקדמה');
    var introModelAccessibility = new Chapter(introModel, 'מבוא', 'rtl');
    var introModelSonification = new Chapter(introModel, 'סוניפיקציה', 'rtl');

    introModelAccessibility.addParagraph('./resources/models/Introduction/About01.html', 'text');

    introModelSonification.addParagraph('./resources/models/Introduction/About02.html', 'text');
    
    document.querySelector('#Introduction').addEventListener('click', () => { setModelView(introModel); })
    
    /* 1. Niels */
    var neilsModel = new Model('מודל החשמל - נילס');
    var neilsModelAbout = new Chapter(neilsModel, 'אודות המודל', 'rtl');
    var neilsModelCode = new Chapter(neilsModel, 'קוד המודל', 'ltr');

    neilsModelAbout.addImage('./resources/models/Neils/Neils_0.png', 'בקרי סוניפיקציה');
    neilsModelAbout.addImage('./resources/models/Neils/NeilsParallel_1.png', 'מצב התחלתי');
    neilsModelAbout.addImage('./resources/models/Neils/NeilsParallel_2.png', 'מעגל מקבילי');
    neilsModelAbout.addImage('./resources/models/Neils/NeilsSerial_2.png', 'מעגל טורי');
    neilsModelAbout.addImage('./resources/models/Neils/NeilsSingle_2.png', 'מוליך יחיד');

    neilsModelAbout.addParagraph('./resources/models/Neils/About.html', 'text');

    neilsModelCode.addParagraph('./resources/models/Neils/SourceCode.txt', 'code');

    document.querySelector('#Neils').addEventListener('click', () => { setModelView(neilsModel); })
    
    /* 2. GasLab */
    var gasLabModel = new Model('מודל הגז');
    var gasLabModelAbout = new Chapter(gasLabModel, 'אודות המודל', 'rtl');
    var gasLabModelCode = new Chapter(gasLabModel, 'קוד המודל', 'ltr');

    gasLabModelAbout.addImage('./resources/models/GasLab/GasLab_0.png', 'בקרי סוניפיקציה');
    gasLabModelAbout.addImage('./resources/models/GasLab/GasLab_1.png', 'מצב התחלתי');
    gasLabModelAbout.addImage('./resources/models/GasLab/GasLab_2.png', 'מודל הגז');

    gasLabModelAbout.addParagraph('./resources/models/GasLab/About.html', 'text');
    
    gasLabModelCode.addParagraph('./resources/models/GasLab/SourceCode.txt', 'code');

    document.querySelector('#GasLab').addEventListener('click', () => { setModelView(gasLabModel); })
    
    /* 3. GasLab - Moving Piston */
    var gasLabMovingPistonModel = new Model('מודל הגז עם בוכנה נעה');
    var gasLabMovingPistonModelAbout = new Chapter(gasLabMovingPistonModel, 'אודות המודל', 'rtl');
    var gasLabMovingPistonModelCode = new Chapter(gasLabMovingPistonModel, 'קוד המודל', 'ltr');

    gasLabMovingPistonModelAbout.addImage('./resources/models/GasLabMovingPiston/GasLabMovingPiston_0.png', 'בקרי סוניפיקציה');
    gasLabMovingPistonModelAbout.addImage('./resources/models/GasLabMovingPiston/GasLabMovingPiston_1.png', 'מצב התחלתי');
    gasLabMovingPistonModelAbout.addImage('./resources/models/GasLabMovingPiston/GasLabMovingPiston_2.png', 'מודל הגז עם בוכנה נעה');

    gasLabMovingPistonModelAbout.addParagraph('./resources/models/GasLabMovingPiston/About.html', 'text');

    gasLabMovingPistonModelCode.addParagraph('./resources/models/GasLabMovingPiston/SourceCode.txt', 'code');

    document.querySelector('#GasLabMovingPiston').addEventListener('click', () => { setModelView(gasLabMovingPistonModel); })
    
    /* 4. Ising */
    var isingModel = new Model('מודל Ising');
    var isingModelAbout = new Chapter(isingModel, 'אודות המודל', 'rtl');
    var isingModelCode = new Chapter(isingModel, 'קוד המודל', 'ltr');

    isingModelAbout.addImage('./resources/models/Ising/Ising_0.png', 'בוררי סוניפיקציה');
    isingModelAbout.addImage('./resources/models/Ising/Ising_1.png', 'מצב התחלתי');
    isingModelAbout.addImage('./resources/models/Ising/Ising_2.png', 'מודל Ising');

    isingModelAbout.addParagraph('./resources/models/Ising/About.html', 'text');

    isingModelCode.addParagraph('./resources/models/Ising/SourceCode.txt', 'code');


    document.querySelector('#Ising').addEventListener('click', () => { setModelView(isingModel); })
    
    /* 5. Crystalization */
    var crystalizationModel = new Model('מודל קריסטליזציה');
    var crystalizationModelAbout = new Chapter(crystalizationModel, 'אודות המודל', 'rtl');
    var crystalizationModelCode = new Chapter(crystalizationModel, 'קוד המודל', 'ltr');

    crystalizationModelAbout.addImage('./resources/models/CrystalizationBasic/CrystalizationBasic_0.png', 'בקרי סוניפיקציה');
    crystalizationModelAbout.addImage('./resources/models/CrystalizationBasic/CrystalizationBasic_1.png', 'מצב התחלתי');
    crystalizationModelAbout.addImage('./resources/models/CrystalizationBasic/CrystalizationBasic_2.png', 'מודל קריסטליזציה');

    crystalizationModelAbout.addParagraph('./resources/models/CrystalizationBasic/About.html', 'text');

    crystalizationModelCode.addParagraph('./resources/models/CrystalizationBasic/SourceCode.txt', 'code');

    document.querySelector('#Crystalization').addEventListener('click', () => { setModelView(crystalizationModel); })
    
    /* 6. Simple Kinetics 1 */
    var kinetics1Model = new Model('מודל Simple Kinetics 1');
    var kinetics1ModelAbout = new Chapter(kinetics1Model, 'אודות המודל', 'rtl');
    var kinetics1ModelCode = new Chapter(kinetics1Model, 'קוד המודל', 'ltr');

    kinetics1ModelAbout.addImage('./resources/models/SimpleKinetics1/SimpleKinetics1_0.png', 'בקרי סוניפיקציה');
    kinetics1ModelAbout.addImage('./resources/models/SimpleKinetics1/SimpleKinetics1_1.png', 'מצב התחלתי');
    kinetics1ModelAbout.addImage('./resources/models/SimpleKinetics1/SimpleKinetics1_2.png', 'מודל Simple Kinetics 1');

    kinetics1ModelAbout.addParagraph('./resources/models/SimpleKinetics1/About.html', 'text');

    kinetics1ModelCode.addParagraph('./resources/models/SimpleKinetics1/SourceCode.txt', 'code');

    document.querySelector('#SimpleKinetics1').addEventListener('click', () => { setModelView(kinetics1Model); })
    
    /* 7. Simple Kinetics 2 */
    var kinetics2Model = new Model('מודל Simple Kinetics 2');
    var kinetics2ModelAbout = new Chapter(kinetics2Model, 'אודות המודל', 'rtl');
    var kinetics2ModelCode = new Chapter(kinetics2Model, 'קוד המודל', 'ltr');

    kinetics2ModelAbout.addImage('./resources/models/SimpleKinetics2/SimpleKinetics2_0.png', 'בקרי סוניפיקציה');
    kinetics2ModelAbout.addImage('./resources/models/SimpleKinetics2/SimpleKinetics2_1.png', 'מצב התחלתי');
    kinetics2ModelAbout.addImage('./resources/models/SimpleKinetics2/SimpleKinetics2_2.png', 'מודל Simple Kinetics 2');

    kinetics2ModelAbout.addParagraph('./resources/models/SimpleKinetics2/About.html', 'text');

    kinetics2ModelCode.addParagraph('./resources/models/SimpleKinetics2/SourceCode.txt', 'code');

    document.querySelector('#SimpleKinetics2').addEventListener('click', () => { setModelView(kinetics2Model); })
    
    /* 8. Simple Kinetics 3 */
    var kinetics3Model = new Model('מודל Simple Kinetics 3');
    var kinetics3ModelAbout = new Chapter(kinetics3Model, 'אודות המודל', 'rtl');
    var kinetics3ModelCode = new Chapter(kinetics3Model, 'קוד המודל', 'ltr');

    kinetics3ModelAbout.addImage('./resources/models/SimpleKinetics3/SimpleKinetics3_0.png', 'בקרי סוניפיקציה');
    kinetics3ModelAbout.addImage('./resources/models/SimpleKinetics3/SimpleKinetics3_1.png', 'מצב התחלתי');
    kinetics3ModelAbout.addImage('./resources/models/SimpleKinetics3/SimpleKinetics3_2.png', 'מודל Simple Kinetics 3');

    kinetics3ModelAbout.addParagraph('./resources/models/SimpleKinetics3/About.html', 'text');

    kinetics3ModelCode.addParagraph('./resources/models/SimpleKinetics3/SourceCode.txt', 'code');

    document.querySelector('#SimpleKinetics3').addEventListener('click', () => { setModelView(kinetics3Model); })
    
    /* 9. Fire */
    var fireModel = new Model('מודל האש');
    var fireModelAbout = new Chapter(fireModel, 'אודות המודל', 'rtl');
    var fireModelCode = new Chapter(fireModel, 'קוד המודל', 'ltr');

    fireModelAbout.addImage('./resources/models/Fire/Fire_0.png', 'בקרי סוניפיקציה');
    fireModelAbout.addImage('./resources/models/Fire/Fire_1.png', 'מצב התחלתי');
    fireModelAbout.addImage('./resources/models/Fire/Fire_2.png', 'מודל האש');

    fireModelAbout.addParagraph('./resources/models/Fire/About.html', 'type');

    fireModelCode.addParagraph('./resources/models/Fire/SourceCode.txt', 'code');

    document.querySelector('#Fire').addEventListener('click', () => { setModelView(fireModel); })
    
    /* 10. Wolf Sheep Predation */
    var wolfSheepModel = new Model('מודל Wolf Sheep Predation');
    var wolfSheepModelAbout = new Chapter(wolfSheepModel, 'אודות המודל', 'rtl');
    var wolfSheepModelCode = new Chapter(wolfSheepModel, 'קוד המודל', 'ltr');

    wolfSheepModelAbout.addImage('./resources/models/WolfSheepPredation/WolfSheepPredation_0.png', 'בקרי סוניפיקציה');
    wolfSheepModelAbout.addImage('./resources/models/WolfSheepPredation/WolfSheepPredation_1.png', 'מצב התחלתי');
    wolfSheepModelAbout.addImage('./resources/models/WolfSheepPredation/WolfSheepPredation_2.png', 'מודל Wolf Sheep Predation');

    wolfSheepModelAbout.addParagraph('./resources/models/WolfSheepPredation/About.html', 'text');

    wolfSheepModelCode.addParagraph('./resources/models/WolfSheepPredation/SourceCode.txt', 'code');

    document.querySelector('#WolfSheepPredation').addEventListener('click', () => { setModelView(wolfSheepModel); })
    
    ListeningToComplexSystems.addModel(introModel);

    setModelView(introModel);
}
