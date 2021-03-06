const goUrl = 'http://localhost:8000/go/sha256/';
const nodeUrl = 'http://localhost:8000/node/sha256/';


function isRawStringValid(rawString) {
    if (rawString.length < 8)
        return false;
    return true;
}

async function getEncodedString(url, encodedString) {
    const response = await fetch(`${url}?encoded=${encodedString}`);
    return response;
}

async function submitRawString(url, body) {
    const jsonBody = JSON.stringify(body)
    console.log(`Going to send post request, url=${url} body=${jsonBody}`);
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: jsonBody,
    });
    const content = await rawResponse.json();
    return content;
}

function getCurrentBackendUrl() {
    if (document.querySelector('input[type="radio"]:checked').id == 'goRadio') {
        return goUrl;
    } else {
        return nodeUrl;
    }
}

const rawStringSubmitButton = document.querySelector('#rawStringSubmitButton');

rawStringSubmitButton.addEventListener('click', async (event) => {
    const rawString = document.querySelector('#rawStringInput').value;
    console.log(rawString);
    const rawStringResponseContainer = document.querySelector('#rawStringSubmitResponseContainer');
    rawStringResponseContainer.innerHTML = '';
    var responseContainer = null;
    if (isRawStringValid(rawString)) {
        console.log('success');
        const responseData = await submitRawString(getCurrentBackendUrl(), { raw_string: rawString });
        responseContainer = getSuccessComponent(`Your sha string: ${responseData.encoded}`);
    } else {
        console.log('failure');
        responseContainer = getAlertComponent('Input should at least be 8 characters.');
    }
    rawStringResponseContainer.innerHTML = responseContainer.innerHTML;
});

const getStringSubmitButton = document.querySelector('#encodedStringSubmitButton');

getStringSubmitButton.addEventListener('click', async (event) => {
    const encodedString = document.querySelector('#encodedStringInput').value;
    console.log(encodedString);
    const encodedStringResponseContainer = document.querySelector('#encodedStringSubmitResponseContainer');
    encodedStringResponseContainer.innerHTML = '';
    var responseContainer = null;
    const response = await getEncodedString(getCurrentBackendUrl(), encodedString);
    const responseData = await response.json();
    console.log(responseData);
    var status = response.status;
    if (status==200) {
        responseContainer = getSuccessComponent(`Your raw string: ${responseData.raw_string}`);
    } else {
        responseContainer = getAlertComponent(`${responseData.errors[0]}`);
    }
    encodedStringResponseContainer.innerHTML = responseContainer.innerHTML;
});

const resetButton = document.querySelector('#resetButton');
resetButton.addEventListener('click', ()=> {
    document.querySelectorAll('.response-container').forEach(element => {
        element.innerHTML = '';
    });
    document.querySelectorAll('input[type="text"]').forEach(element => {
        element.value = '';
    });
});

const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(element => {
    element.addEventListener('click', ()=> {
        const labelText = document.querySelector(`label[for="${element.id}"]`).innerText;
        document.querySelector('#cardHeader').innerText = `Submit Requests To ${labelText}`;
    });
});

function createHtmlElement(htmlString) {
    const parent = document.createElement('div');
    parent.innerHTML = htmlString.trim();
    return parent.firstChild;
}

function getAlertComponent(message) {
    const htmlString = `
    <div class="response-container py-2">
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </symbol>
        </svg>
        <div class="alert alert-danger d-flex align-items-center overflow-auto" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                <use xlink:href="#exclamation-triangle-fill" />
            </svg>
            <div>
                ${message}
            </div>
        </div>
    </div>`;
    return createHtmlElement(htmlString);
}

function getSuccessComponent(message) {
    const htmlString = `
    <div class="response-container py-2">
        <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </symbol>
            </svg>
        <div class="alert alert-success d-flex align-items-center overflow-auto" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
            <div>
                ${message}
            </div>
        </div>
    </div>`;
    return createHtmlElement(htmlString);
}