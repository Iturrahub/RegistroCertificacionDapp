import hre from "hardhat";
import { expect } from "chai";

describe("Contrato: AcademicCertificates (Pruebas Unitarias)", function () {
  let ethers;
  let AcademicCertificates;
  let contract;
  let owner;
  let student;
  let validator;

  // Se ejecuta antes de cada test
  beforeEach(async function () {
    // Conexión explícita a la red activa para soporte de Hardhat 3 (con fallback para Hardhat 2)
    const connection = hre.network.getOrCreate ? await hre.network.getOrCreate() : null;
    ethers = connection ? connection.ethers : hre.ethers;

    // Obtenemos cuentas de prueba virtuales de Hardhat Network
    [owner, student, validator] = await ethers.getSigners();

    // Desplegamos el contrato
    AcademicCertificates = await ethers.getContractFactory("AcademicCertificates");
    contract = await AcademicCertificates.deploy();
    await contract.waitForDeployment();
  });

  describe("Despliegue e Inicialización", function () {
    it("Debe asignar el propietario (Owner) correcto", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Emisión de Certificados", function () {
    it("Debe permitir al Owner emitir un certificado", async function () {
      const id = 101;
      const name = "Juan Perez";
      // Generamos un hash de prueba (32 bytes)
      const hash = ethers.keccak256(ethers.toUtf8Bytes("diploma-juan-perez-2026"));

      // El owner emite el certificado
      await expect(contract.connect(owner).emitirCertificado(student.address, id, name, hash))
        .to.emit(contract, "CertificadoEmitido")
        .withArgs(student.address, id, hash);

      // Verificamos los datos guardados en el estado
      const cert = await contract.certificados(student.address);
      expect(cert.idCertificado).to.equal(id);
      expect(cert.nombreGraduado).to.equal(name);
      expect(cert.hashContenido).to.equal(hash);
      expect(cert.activo).to.be.true;
    });

    it("No debe permitir a una cuenta cualquiera (no Owner) emitir certificados", async function () {
      const id = 102;
      const name = "Maria Lopez";
      const hash = ethers.keccak256(ethers.toUtf8Bytes("diploma-maria-lopez-2026"));

      // Intentamos emitir con la cuenta del estudiante (debe fallar)
      await expect(
        contract.connect(student).emitirCertificado(student.address, id, name, hash)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Revocación e Inactivación", function () {
    let id = 103;
    let name = "Carlos Ruiz";
    let hash;

    beforeEach(async function () {
      hash = ethers.keccak256(ethers.toUtf8Bytes("diploma-carlos-ruiz-2026"));
      // Emitimos un certificado antes de probar la revocación
      await contract.connect(owner).emitirCertificado(student.address, id, name, hash);
    });

    it("Debe permitir al Owner invalidar un certificado", async function () {
      // El owner invalida
      await expect(contract.connect(owner).invalidarCertificado(student.address))
        .to.emit(contract, "CertificadoInvalidado")
        .withArgs(student.address, id);

      // El certificado debe seguir existiendo en el mapping pero con 'activo = false'
      const cert = await contract.certificados(student.address);
      expect(cert.activo).to.be.false;
    });
  });
});
