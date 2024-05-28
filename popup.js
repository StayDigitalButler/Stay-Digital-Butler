document.addEventListener('DOMContentLoaded', function() {

    var buttonCrm = document.getElementById('createCrm');
    buttonCrm.addEventListener('click', function() {
        window.location.href = 'crm.html';
    });

    var buttonProperty = document.getElementById('createProperty');
    buttonProperty.addEventListener('click', function() {
        window.location.href = 'property.html';
    });
  });