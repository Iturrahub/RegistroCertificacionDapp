let provider;
let signer;
let contrato;

const contratoDireccion = "0x68Db76f248C1cFd349b4f7B932679C02D20C7aF6";

const contratoABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "administrador",
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
        "internalType": "address",
        "name": "_emisor",
        "type": "address"
      }
    ],
    "name": "autorizarEmisor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contadorCertificados",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_emisor",
        "type": "address"
      }
    ],
    "name": "eliminarEmisor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_nombreEstudiante",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_nombreCurso",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_institucion",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_hashDocumento",
        "type": "string"
      }
    ],
    "name": "emitirCertificado",
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
    "name": "emisoresAutorizados",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "hashRegistrado",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "revocarCertificado",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "verificarCertificado",
    "outputs": [
      {
        "internalType": "string",
        "name": "nombreEstudiante",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "nombreCurso",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "institucion",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "hashDocumento",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "emisor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "fechaEmision",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "valido",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hashDocumento",
        "type": "string"
      }
    ],
    "name": "verificarPorHash",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function conectarWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask no está instalado.");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const cuenta = await signer.getAddress();

    contrato = new ethers.Contract(contratoDireccion, contratoABI, signer);

    document.getElementById("wallet").innerHTML =
      `<span class="success">Wallet conectada:</span> ${cuenta}`;
  } catch (error) {
    console.error(error);
    alert("Error al conectar MetaMask.");
  }
}

async function emitirCertificado() {
  try {
    const nombre = document.getElementById("nombre").value;
    const curso = document.getElementById("curso").value;
    const institucion = document.getElementById("institucion").value;
    const hash = document.getElementById("hash").value;

    if (!nombre || !curso || !institucion || !hash) {
      alert("Completa todos los campos.");
      return;
    }

    const tx = await contrato.emitirCertificado(nombre, curso, institucion, hash);
    document.getElementById("resultadoEmision").innerText =
      "Transacción enviada. Esperando confirmación...";

    await tx.wait();

    document.getElementById("resultadoEmision").innerHTML =
      `<span class="success">Certificado registrado correctamente en blockchain.</span>`;
  } catch (error) {
    console.error(error);
    document.getElementById("resultadoEmision").innerHTML =
      `<span class="error">Error al emitir certificado.</span>`;
  }
}

async function verificarCertificado() {
  try {
    const id = document.getElementById("idCertificado").value;

    if (!id) {
      alert("Ingresa un ID.");
      return;
    }

    const cert = await contrato.verificarCertificado(id);

    const fecha = new Date(cert.fechaEmision.toNumber() * 1000).toLocaleString();

    document.getElementById("resultadoCertificado").innerHTML = `
      <strong>Nombre:</strong> ${cert.nombreEstudiante}<br>
      <strong>Curso:</strong> ${cert.nombreCurso}<br>
      <strong>Institución:</strong> ${cert.institucion}<br>
      <strong>Hash:</strong> ${cert.hashDocumento}<br>
      <strong>Emisor:</strong> ${cert.emisor}<br>
      <strong>Fecha:</strong> ${fecha}<br>
      <strong>Estado:</strong> ${
        cert.valido
          ? "<span class='success'>Válido</span>"
          : "<span class='error'>Revocado</span>"
      }
    `;
  } catch (error) {
    console.error(error);
    document.getElementById("resultadoCertificado").innerHTML =
      `<span class="error">Certificado no encontrado.</span>`;
  }
}

async function verificarHash() {
  try {
    const hash = document.getElementById("hashBuscar").value;

    if (!hash) {
      alert("Ingresa un hash.");
      return;
    }

    const existe = await contrato.verificarPorHash(hash);

    document.getElementById("resultadoHash").innerHTML = existe
      ? `<span class="success">El hash existe en blockchain.</span>`
      : `<span class="error">El hash no está registrado.</span>`;
  } catch (error) {
    console.error(error);
    document.getElementById("resultadoHash").innerHTML =
      `<span class="error">Error al verificar hash.</span>`;
  }
}

async function revocarCertificado() {
  try {
    const id = document.getElementById("idRevocar").value;

    if (!id) {
      alert("Ingresa un ID.");
      return;
    }

    const tx = await contrato.revocarCertificado(id);

    document.getElementById("resultadoRevocacion").innerText =
      "Transacción enviada. Esperando confirmación...";

    await tx.wait();

    document.getElementById("resultadoRevocacion").innerHTML =
      `<span class="success">Certificado revocado correctamente.</span>`;
  } catch (error) {
    console.error(error);
    document.getElementById("resultadoRevocacion").innerHTML =
      `<span class="error">Error al revocar. Solo el administrador puede hacerlo.</span>`;
  }
}