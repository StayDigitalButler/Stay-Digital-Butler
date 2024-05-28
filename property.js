// Funktion zum Ein- oder Ausblenden der Dropdown Optionen
function toggleHiddenDiv() {
    const dropdown          = document.getElementById('propertyType');
    const propertyText      = document.getElementById('text');
    const propertyDropdown  = document.getElementById('dropdown');
    const propertyNumber    = document.getElementById('number');
  
    if (dropdown.value === 'Text' || dropdown.value === 'Nummer') {
        propertyText.style.display = 'block';
    } else {
        propertyText.style.display = 'none';
    }

    if (dropdown.value === 'Dropdown') {
        propertyDropdown.style.display = 'block';
    } else {
        propertyDropdown.style.display = 'none';
    }
  }
  
// Ereignislistener für Änderungen im Dropdown-Menü
const dropdown = document.getElementById('propertyType');
dropdown.addEventListener('change', toggleHiddenDiv);

var count           = 1;
var buttonAddOption = document.getElementById('addOption');

// Funktion zum Hinzufügen eines neuen Input-Elements
function addInput(event) {

    event.preventDefault();
    
    count += 1;

    const newInput = document.createElement('input');

    newInput.type   = 'text';
    newInput.id     = `propertyOption${count}`;
    newInput.name   = `propertyOption${count}`;
    newInput.class  = "options";
    
    // Das neue Input-Element hinzufügen
    const inputContainer = document.getElementById('newOptions');
    inputContainer.appendChild(newInput);
}

buttonAddOption.addEventListener('click', addInput);

var buttonCreateProperty    = document.getElementById('createBtnProperty');
var headers                 = {"Content-Type": "application/json"};

// Dealeigenschaften anlegen
const kundentyp = {"name": "Kundenart", "field_type": "enum", "options": [{"label": "A-Kunde"}, {"label": "B-Kunde"}, {"label": "C-Kunde"}]};
// const whatsapp  = {"name": "WhatsApp Link", "field_type": "varchar"};

const all_dealFields = [];
let kundentyp_Id = "";

async function createDealFields(url_newField, field) {
  
    try {
        const response_newField = await fetch(url_newField, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(field)
        });
        const responseData = await response_newField.json();

        hideLoadingScreen();
        alert("Eigenschaftsfeld wurde erstellt")
        window.location.href = 'property.html';

    } catch(error) {
        alert("Eigenschaftsfeld konnte nicht erstellt werden:", error)
    }

    if (responseData.data.name === "Kundenart") {
        kundentyp_Id = responseData.data.id;
    }
    
}

// Funktion zum Anzeigen des Overlays mit Ladeanimation
function showLoadingScreen() {
    const overlay           = document.getElementById('overlay2');
    overlay.style.display   = 'block';
}

// Funktion zum Ausblenden des Overlays mit Ladeanimation
function hideLoadingScreen() {
    const overlay           = document.getElementById('overlay2');
    overlay.style.display   = 'none';
}

buttonCreateProperty.addEventListener('click', async function(event) {
    event.preventDefault();
    
    showLoadingScreen();

    var token                   = document.getElementById('apiKey2').value;
    var url                     = document.getElementById('pipedriveURL2').value;

    var fieldType = document.getElementById('category').value;

    if(fieldType === "Kontakt") {
        fieldType = "personFields";
    }
    if(fieldType === "Deal") {
        fieldType = "dealFields";
    }

    if(document.getElementById('propertyType').value === "Text") {
        var fieldName   = document.getElementById("propertyText").value;
        var field       = {"name": `${fieldName}`, "field_type": "varchar"};
    }
    if(document.getElementById('propertyType').value === "Nummer") {
        var fieldName   = document.getElementById("propertyText").value;
        var field       = {"name": `${fieldName}`, "field_type": "double"};
    }
    if(document.getElementById('propertyType').value === "Dropdown") {
        var fieldName = document.getElementById("propertyDropdown").value;

        const inputElements     = document.querySelectorAll('#newOptions input');
        var inputOption1        = {"label": `${document.getElementById('propertyOption1').value}`}
        var inputValues         = [];
        
        inputValues.push(inputOption1);

        inputElements.forEach(function(inputElement) {
            var label = {"label": inputElement.value}
            inputValues.push(label);
        });
        

        var field = {"name": `${fieldName}`, "field_type": "enum", "options": inputValues};
        
    }

    var url_newField = `${url}/api/v1/${fieldType}?api_token=${token}`;

    createDealFields(url_newField, field);

});

