/*const metamask_connect = document.getElementById("metamask_connect");

metamask_connect.addEventListener("click", function() {
    getMetamask();
});

async function getMetamask() {
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    const account = accounts[0];
    const chain_id = await ethereum.request({method: "eth_chainId"});
}*/

window.addEventListener("load", function() {
    loadEmptyCanvas();
    addPixelListeners();
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask installed");
        getMetamask();
    }
    populateCanvas();
});

async function getMetamask() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    document.getElementById("account-status").innerHTML = account;
}

function setStatus(status) {
    document.getElementById("display-status").innerHTML = "Status: " + status;
}

function loadEmptyCanvas() {
    const SIZE = 24;
    const SCALE = 20;

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let div = document.createElement("div");
            div.setAttribute("id", "pixel-" + i.toString() + "-" + j.toString());
            div.setAttribute("class", "pixel");
            div.style.position = "absolute";
            div.style.width = SCALE.toString() + "px";
            div.style.height = SCALE.toString() + "px";
            div.style.top = (SCALE * i).toString() + "px";
            div.style.left = (SCALE * j).toString() + "px";
            document.getElementById("canvas-wrapper").appendChild(div);
        }
    }
}

function populateCanvas() {
    setStatus("Retrieved Canvas");
}

function addPixelListeners() {
    let pixels = document.getElementsByClassName("pixel");

    for (let i = 0; i < pixels.length; i++) {
        let pixel = pixels[i];
        let coordinates = pixel.getAttribute("id").split("-");

        pixel.addEventListener("mouseover", function() {
            document.getElementById("display-cursor").innerHTML = coordinates[1] + " x " + coordinates[2];
        });
    }
}