window.addEventListener("load", function() {
    loadEmptyCanvas();
    addPixelListeners();

    if (typeof window.ethereum !== 'undefined') {
        getMetamask();
    } else {
        setAccontStatus("Not Connected", "red");
    }

    populateCanvas();
});

async function getMetamask() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccontStatus(account.substring(0,6) + "..." + account.slice(-4), "green");
        setNetwork();
    } catch(error) {
        setAccontStatus("Not Connected", "red");
    }
}

async function setNetwork() {
    const networks = {
        "0x1": "ETH Mainnet",
        "0x89": "Polygon",
        "0x3": "Ropsten",
        "0x2a": "Kovan",
        "0x4": "Rinkeby",
        "0x5": "Goerli"
    }

    const chain_id = await ethereum.request({method: "eth_chainId"});
    if (Object.keys(networks).includes(chain_id)) {
        document.getElementById("network-status").innerHTML = networks[chain_id];
    } else {
        document.getElementById("network-status").innerHTML = chain_id;
    }
}

function setAccontStatus(status, color) {
    document.getElementById("account-status").innerHTML = status;
        document.getElementById("account-status-icon").style.backgroundColor = color;
        document.getElementById("account-status-icon").style.boxShadow = "0px 0px 10px 1px " + color;
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

async function populateCanvas() {
    const web3 = new Web3("https://rinkeby.infura.io/v3/586a399ff09641fcab0bccc875b1ce1b");

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