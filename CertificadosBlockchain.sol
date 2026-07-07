// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificadosBlockchain {

    address public administrador;

    struct Certificado {
        uint id;
        string nombreEstudiante;
        string nombreCurso;
        string institucion;
        string hashDocumento;
        address emisor;
        uint fechaEmision;
        bool valido;
    }

    uint public contadorCertificados;

    mapping(uint => Certificado) public certificados;
    mapping(string => bool) public hashRegistrado;
    mapping(address => bool) public emisoresAutorizados;

    event CertificadoEmitido(
        uint id,
        string nombreEstudiante,
        string nombreCurso,
        string hashDocumento,
        address emisor
    );

    event CertificadoRevocado(uint id);
    event EmisorAutorizado(address emisor);
    event EmisorEliminado(address emisor);

    constructor() {
        administrador = msg.sender;
        emisoresAutorizados[msg.sender] = true;
    }

    modifier soloAdministrador() {
        require(msg.sender == administrador, "Solo el administrador puede realizar esta accion");
        _;
    }

    modifier soloEmisorAutorizado() {
        require(emisoresAutorizados[msg.sender], "No eres un emisor autorizado");
        _;
    }

    function autorizarEmisor(address _emisor) public soloAdministrador {
        emisoresAutorizados[_emisor] = true;
        emit EmisorAutorizado(_emisor);
    }

    function eliminarEmisor(address _emisor) public soloAdministrador {
        emisoresAutorizados[_emisor] = false;
        emit EmisorEliminado(_emisor);
    }

    function emitirCertificado(
        string memory _nombreEstudiante,
        string memory _nombreCurso,
        string memory _institucion,
        string memory _hashDocumento
    ) public soloEmisorAutorizado {

        require(bytes(_nombreEstudiante).length > 0, "Debe ingresar el nombre del estudiante");
        require(bytes(_nombreCurso).length > 0, "Debe ingresar el nombre del curso");
        require(bytes(_institucion).length > 0, "Debe ingresar la institucion");
        require(bytes(_hashDocumento).length > 0, "Debe ingresar el hash del documento");
        require(!hashRegistrado[_hashDocumento], "Este certificado ya fue registrado");

        contadorCertificados++;

        certificados[contadorCertificados] = Certificado(
            contadorCertificados,
            _nombreEstudiante,
            _nombreCurso,
            _institucion,
            _hashDocumento,
            msg.sender,
            block.timestamp,
            true
        );

        hashRegistrado[_hashDocumento] = true;

        emit CertificadoEmitido(
            contadorCertificados,
            _nombreEstudiante,
            _nombreCurso,
            _hashDocumento,
            msg.sender
        );
    }

    function verificarCertificado(uint _id) public view returns (
        string memory nombreEstudiante,
        string memory nombreCurso,
        string memory institucion,
        string memory hashDocumento,
        address emisor,
        uint fechaEmision,
        bool valido
    ) {
        require(_id > 0 && _id <= contadorCertificados, "Certificado no existe");

        Certificado memory cert = certificados[_id];

        return (
            cert.nombreEstudiante,
            cert.nombreCurso,
            cert.institucion,
            cert.hashDocumento,
            cert.emisor,
            cert.fechaEmision,
            cert.valido
        );
    }

    function verificarPorHash(string memory _hashDocumento) public view returns (bool) {
        return hashRegistrado[_hashDocumento];
    }

    function revocarCertificado(uint _id) public soloAdministrador {
        require(_id > 0 && _id <= contadorCertificados, "Certificado no existe");
        require(certificados[_id].valido, "El certificado ya esta revocado");

        certificados[_id].valido = false;

        emit CertificadoRevocado(_id);
    }
}