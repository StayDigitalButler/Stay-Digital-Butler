

document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');
    var message = document.getElementById('message');
    var headers = {"Content-Type": "application/json"};
    var email = "";

    if(localStorage.getItem('username') && localStorage.getItem('password')) {

      window.location.href = 'popup.html';

    } else {

      loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
  
        email = username;
        var url = `https://x87k-ttv5-neqc.n7c.xano.io/api:outMboxI/user/${email}`;
  
        let response = await fetch(url, {
          method: 'GET',
          headers: headers
        });
        response = await response.json();
    
        // Hier kannst du die Logik für die Überprüfung von Benutzername und Passwort einfügen
        // Zum Beispiel:
        if (username === response["email"] && password === response["password"]) {
  
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);
  
          message.textContent = 'Erfolgreich eingeloggt!';
          // Füge hier den Code hinzu, um den Benutzer einzuloggen oder weiterzuleiten
          window.location.href = 'popup.html';
        } else {
          message.textContent = 'Falscher Benutzername oder Passwort!';
        }
      });

    }
  
  });
  