// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AcademicCertificates is Ownable, ReentrancyGuard {

    struct Certificado {
        uint256 idCertificado;
        string nombreGraduado;
        bytes32 hashContenido;
        bool activo;
    }

    mapping(address => Certificado) public certificados;

    event CertificadoEmitido(address indexed studentWallet, uint256 idCertificado, bytes32 hashContenido);
    event CertificadoInvalidado(address indexed studentWallet, uint256 idCertificado);

    constructor() Ownable(msg.sender) {}

    function emitirCertificado(
        address studentWallet,
        uint256 idCertificado,
        string memory nombreGraduado,
        bytes32 hashContenido
    ) external onlyOwner nonReentrant {

        require(studentWallet != address(0), "Wallet invalida");
        require(certificados[studentWallet].idCertificado == 0, "La wallet ya posee un certificado");
        require(hashContenido != bytes32(0), "Hash invalido");

        certificados[studentWallet] = Certificado({
            idCertificado: idCertificado,
            nombreGraduado: nombreGraduado,
            hashContenido: hashContenido,
            activo: true
        });

        emit CertificadoEmitido(studentWallet, idCertificado, hashContenido);
    }

    function invalidarCertificado(address studentWallet) external onlyOwner nonReentrant {
        require(certificados[studentWallet].activo == true, "No existe un certificado activo para esta wallet");

        certificados[studentWallet].activo = false;

        emit CertificadoInvalidado(studentWallet, certificados[studentWallet].idCertificado);
    }

    function verificarCertificado(address studentWallet)
        external
        view
        returns (
            uint256 idCertificado,
            string memory nombreGraduado,
            bytes32 hashContenido,
            bool activo
        )
    {
        require(certificados[studentWallet].activo == true, "No existe un certificado activo para esta wallet");

        Certificado memory cert = certificados[studentWallet];

        return (cert.idCertificado, cert.nombreGraduado, cert.hashContenido, cert.activo);
    }
}