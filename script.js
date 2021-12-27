var account;
const CONTRACT_ADDRESS = "0x1a62098e46aDb8d5Aae3d78BC8E31ca840270999";
const ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "getPixels",
        "outputs": [
            {
                "internalType": "string[24][24]",
                "name": "",
                "type": "string[24][24]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pixels",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "resetPainting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_i",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_j",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_color",
                "type": "string"
            }
        ],
        "name": "setPixel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "timestamps",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const web3 = new Web3("https://rinkeby.infura.io/v3/586a399ff09641fcab0bccc875b1ce1b");
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

window.addEventListener("load", function() {
    document.getElementById("contract-address").innerHTML = "Contract: " + CONTRACT_ADDRESS;
    loadCanvas();

    if (typeof window.ethereum !== 'undefined') {
        getMetamask();
    } else {
        setAccontStatus("Not Connected", "red");
    }
});

async function getMetamask() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];
        setAccontStatus(account.substring(0,6) + "..." + account.slice(-4), "green");
        setNetwork();
        ethereum.on('chainChanged', (_chainId) => window.location.reload());
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
        document.getElementById("network-status").innerHTML = "Network: " + networks[chain_id];
    } else {
        document.getElementById("network-status").innerHTML = "Network: " + chain_id;
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

async function loadCanvas() {
    setStatus("Loading Painting...");
    let pixels = document.getElementsByClassName("pixel");
    for (let i = 0; i < pixels.length; i++) {
        pixels[i].remove();
    }

    let pixel_colors = await contract.methods.getPixels().call();
    console.log(pixel_colors);

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
            div.style.backgroundColor = "#" + pixel_colors[i][j];
            document.getElementById("canvas-wrapper").appendChild(div);
        }
    }

    setStatus("Retrieved Canvas");
    addPixelListeners();
}

function addPixelListeners() {
    let pixels = document.getElementsByClassName("pixel");

    for (let i = 0; i < pixels.length; i++) {
        let pixel = pixels[i];
        let coordinates = pixel.getAttribute("id").split("-");

        pixel.addEventListener("mouseover", function() {
            document.getElementById("display-cursor").innerHTML = coordinates[1] + " x " + coordinates[2];
        });

        pixel.addEventListener("dblclick", function() {
            if (document.getElementById("network-status") === "Network: Rinkeby") {
                if (window.ethereum) {
                    setPixel(i, j, document.getElementById("color-input").value);
                } else {
                    setStatus("Please connect your MetaMask wallet");
                }
            } else {
                setStatus("Please connect to the Rinkeby test network");
            }
        });
    }
}

async function setPixel(i, j, color)  {
    await contract.methods.setPixel(i, j, color).send({from: account});
}

document.getElementById("metamask-connect").addEventListener("click", function() {
    if (typeof window.ethereum !== 'undefined') {
        getMetamask();
    } else {
        setStatus("MetaMask not detected");
        setAccontStatus("Not Connected", "red");
    }
});

document.getElementById("github-connect").addEventListener("click", function() {
    window.open("https://github.com/dev-matthew/decentralized-paint", "_blank");
});

document.getElementById("get-eth").addEventListener("click", function() {
    window.open("https://faucets.chain.link/rinkeby", "_blank");
});

document.getElementById("color-div").addEventListener("click", function() {
    document.getElementById("color-input").click();
});

document.getElementById("refresh-painting").addEventListener("click", function() {
    window.location.reload();
});