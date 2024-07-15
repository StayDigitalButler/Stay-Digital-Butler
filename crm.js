document.addEventListener('DOMContentLoaded', async function() {

    var buttonCreateCrm = document.getElementById('createBtn');

    // Funktion zum Anzeigen des Overlays mit Ladeanimation
    function showLoadingScreen() {
        const overlay           = document.getElementById('overlay');
        overlay.style.display   = 'block';
    }

    // Funktion zum Ausblenden des Overlays mit Ladeanimation
    function hideLoadingScreen() {
        const overlay           = document.getElementById('overlay');
        overlay.style.display   = 'none';
    }

    // Pipeline erstelle
    async function createPipeline() {

        showLoadingScreen();

        var token   = document.getElementById('apiKey').value;
        var url     = document.getElementById('pipedriveURL').value;
        var headers = {"Content-Type": "application/json"};
  
        var url_newPipeline     = `${url}/api/v2/pipelines?api_token=${token}`;
        var data                = { "name": "Stay Digital", "is_deal_probability_enabled": true };
        
        try {
            const response_newPipeline = await fetch(url_newPipeline, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            var responseData = await response_newPipeline.json();

            hideLoadingScreen();

            createStages(token, url, responseData, headers);
            createPersonFields(token, url, headers);

            let kundentyp_Id = await createDealField(token, url, headers);

            await createFilters(token, url, headers, kundentyp_Id);
            await getActivityTypes(token, url, headers);

            createActivityType(token, url, headers);

        } catch(error) {
            alert(error);
        }

    }

    // Dealphasen anlegen
    async function createStages(token, url, responseData, headers) {

        var url_newStage = `${url}/api/v2/stages?api_token=${token}`;
        var stages = [
            { "name": "\u{1F4E9} Neuer Lead", "pipeline_id": responseData.data.id, "deal_probability": 20 },
            { "name": "\u{1F4E9} Kunde nicht erreicht 1", "pipeline_id": responseData.data.id, "deal_probability": 20 },
            { "name": "\u{1F4E9} Kunde nicht erreicht 2", "pipeline_id": responseData.data.id, "deal_probability": 10 },
            { "name": "\u{1F4E9} Falsche Telefonnummer", "pipeline_id": responseData.data.id, "deal_probability": 10 },
            { "name": "Vor Ort Termin vereinbart", "pipeline_id": responseData.data.id, "deal_probability": 50 },
            { "name": "\u{1F4E9} Angebot erstellt", "pipeline_id": responseData.data.id, "deal_probability": 60 },
            { "name": "Angebot verschickt", "pipeline_id": responseData.data.id, "deal_probability": 60 },
            { "name": "\u{1F4E9} Follow Up 1", "pipeline_id": responseData.data.id, "deal_probability": 60 },
            { "name": "\u{1F4E9} Follow Up 2", "pipeline_id": responseData.data.id, "deal_probability": 50 },
            { "name": "\u{1F4E9} Gewonnen", "pipeline_id": responseData.data.id, "deal_probability": 100 },
            { "name": "Verloren", "pipeline_id": responseData.data.id, "deal_probability": 0 }
        ];

        try {
            for (var singleStage of stages) {
                var response_newStage = await fetch(url_newStage, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(singleStage)
                });
            }
            alert("CRM erfolgreich eingerichtet");
            window.location.href = 'crm.html';
        } catch(error) {
            alert(error);
        }
        

    }

    // Kontakteigenschaften anlegen
    async function createPersonFields(token, url, headers) {

        var url_newPersonfield = `${url}/api/v1/personFields?api_token=${token}`;

        var all_personFields = [
            {"name": "WhatsApp Link", "field_type": "varchar"},
            {"name": "Adresse", "field_type": "address"},
            {"name": "Postleitzahl", "field_type": "double"},
            {"name": "Ort", "field_type": "varchar"},
            {"name": "Fax", "field_type": "varchar"},
            {"name": "Zusatz (Kontakt)", "field_type": "varchar"},
            {"name": "Kundennummer", "field_type": "varchar"},
            {"name": "Rechnungsadresse (falls abweichend)", "field_type": "address"},
            {"name": "Bearbeitunsstatus des Feedbacks", "field_type": "enum", "options": [{"label": "Noch offen"}, {"label": "Beantwortet"}, {"label": "Gemeldet"}]},
            {"name": "Kundenbewertung Datum", "field_type": "date"},
            {"name": "Kundenbewertung Status", "field_type": "enum", "options": [{"label": "Offen"}, {"label": "Positiv bewertet"}, {"label": "Negativ bewertet"}]},
        ]

        for (var singlePersonField of all_personFields) {

            try {
                let response_personField = await fetch(url_newPersonfield, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(singlePersonField)
                });
    
                response_personField = await response_personField.json();

            } catch(error) {
                alert(error);
            }
            
        }

    }

    // Dealeigenschaften anlegen
    async function createDealField(token, url, headers) {

        var url_newDealfield = `${url}/api/v1/dealFields?api_token=${token}`;

        var all_dealFields = [
            {"name": "Kundenart", "field_type": "enum", "options": [{ "label": "A-Kunde" }, { "label": "B-Kunde" }, { "label": "C-Kunde" }]},
            {"name": "Vor Ort Termin Uhrzeit", "field_type": "time"},
            {"name": "Vor Ort Termin Datum", "field_type": "date"},
            {"name": "Verantwortlicher Mitarbeiter für den Vor-Ort-Termin", "field_type": ""},
            {"name": "Abweichende Objektadresse", "field_type": "address"},
            {"name": "Status des Projekts", "field_type": "enum", "options": [{"label": "Geplant"}, {"label": "In Ausführung"}, {"label": "Abgeschlossen"}]},
            {"name": "Voraussichtliches Enddatum des Projekts", "field_type": "date"},
            {"name": "Startdatum des Projekts", "field_type": "date"},
            {"name": "Zahlungsfälligkeitsdatum", "field_type": "date"},
            {"name": "Zahlungseingangsdatum", "field_type": "date"},
            {"name": "Rechnungsdatum", "field_type": "date"},
            {"name": "Rechnungssnummer", "field_type": "varchar"},
            {"name": "Zahlungsstatus", "field_type": "enum", "options": [{"label": "Offen"}, {"label": "Bezahlt"}, {"label": "Überfällig"}]}
        ];

        let kundentyp_Id = "";

        for (var singleDealfield of all_dealFields) {

            try {
                let response_dealField = await fetch(url_newDealfield, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(singleDealfield)
                });
    
                response_dealField = await response_dealField.json();
    
                if (response_dealField.data.name === "Kundenart") {
                    kundentyp_Id = response_dealField.data.id;
                }

            } catch(error) {
                alert(error);
            }
            
        }

        return kundentyp_Id;

    }

    // Filter anlegen
    async function createFilters(token, url, headers, kundentyp_Id) {


        var url_newFilter = `${url}/api/v1/filters?api_token=${token}`;

        var allFilters = [
            {
                "name": "A-Kunden",
                "type": "deals",
                "conditions": { "object": "deal", "field_id": kundentyp_Id, "operator": "=", "value": "A-Kunde" }
            },
            {
                "name": "B-Kunden",
                "type": "deals",
                "conditions": { "object": "deal", "field_id": kundentyp_Id, "operator": "=", "value": "B-Kunde" }
            },
            {
                "name": "C-Kunden",
                "type": "deals",
                "conditions": { "object": "deal", "field_id": kundentyp_Id, "operator": "=", "value": "C-Kunde" }
            }
        ]

        for (var singleFilter of allFilters) {

            let response_newFilter = await fetch(url_newFilter, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(singleFilter)
            });
    
            response_newFilter = await response_newFilter.json();


        }

    }

    // Aktivitätstypen erstellen
    async function createActivityType(token, url, headers) {
        
        var url_newActivityType = `${url}/api/v1/activityTypes?api_token=${token}`;

        var activityType = {
            "name": "Vor Ort Termin",
            "icon_key": "car",
            "color": "000000"
        };

        try {
            let response_activityType = await fetch(url_newActivityType, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(activityType)
            });

            response_activityType = await response_activityType.json();

        } catch(error) {
            alert(error);
        }
    }

    // Aktivitätstypen abfragen
    async function getActivityTypes(token, url, headers) {

        var url_getActivityTypes = `${url}/api/v1/activityTypes?api_token=${token}`;

        try {
            let response_getActivityTypes = await fetch(url_getActivityTypes, {
                method: 'GET',
                headers: headers
            });

            response_getActivityTypes = await response_getActivityTypes.json();

            for (var singleActivityType of response_getActivityTypes["data"]) {

                if (singleActivityType["name"] == "Meeting" || singleActivityType["name"] == "Frist" || singleActivityType["name"] == "Mittagessen") {
                    deleateActivityType(token, url, headers, singleActivityType["id"])
                }

            }

        } catch(error) {
            alert(error);
        }

    }

    // Aktivitätstypen löschen
    async function deleateActivityType(token, url, headers, id) {
        
        var url_deleteActivityType = `${url}/api/v1/activityTypes/${id}?api_token=${token}`;

        try {
            let response_deleteActivityType = await fetch(url_deleteActivityType, {
                method: 'DELETE',
                headers: headers
            });

            response_deleteActivityType = await response_deleteActivityType.json();

        } catch(error) {
            alert(error);
        }

    }

    buttonCreateCrm.addEventListener('click', async function(event) {

        event.preventDefault();

        createPipeline();

    });

});
