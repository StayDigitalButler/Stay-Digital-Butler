/*const REPO_OWNER = 'StayDigitalButler'; // z.B. 'octocat'
const REPO_NAME = 'Stay-Digital-Butler'; // z.B. 'Hello-World'
const BRANCH = 'main'; // Der Branch, den du überprüfen möchtest

const CHECK_INTERVAL = 60 * 60 * 1000; // Eine Stunde in Millisekunden

function checkForUpdate() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${BRANCH}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const latestCommitSha = data.sha;
            
            chrome.storage.local.get(['lastCommitSha'], (result) => {
                if (result.lastCommitSha !== latestCommitSha) {
                    // Neues Update gefunden
                    chrome.storage.local.set({ lastCommitSha: latestCommitSha });
                    notifyUser();
                }
            });
        })
        .catch(error => {
            console.error('Fehler beim Überprüfen auf Updates:', error);
        });
}

function notifyUser() {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'logo.png',
        title: 'Update verfügbar',
        message: 'Ein neues Update für die Extension ist verfügbar. Bitte aktualisiere die Extension über GutHub.',
        priority: 2
    });
}

// Überprüfe sofort beim Start
checkForUpdate();

// Richte Intervall ein, um regelmäßig nach Updates zu suchen
setInterval(checkForUpdate, CHECK_INTERVAL);

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installiert oder aktualisiert.');
});*/
