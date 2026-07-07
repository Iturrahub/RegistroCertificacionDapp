import hre from "hardhat";

async function main() {
  console.log("==================================================================");
  console.log("Iniciando el despliegue del contrato: AcademicCertificates");
  console.log("==================================================================");

  // Conexión explícita a la red activa para soporte de Hardhat 3 (con fallback para Hardhat 2)
  const connection = hre.network.getOrCreate ? await hre.network.getOrCreate() : null;
  const ethers = connection ? connection.ethers : hre.ethers;

  // Obtenemos los firmantes (cuentas) disponibles
  const [deployer] = await ethers.getSigners();
  console.log(`Desplegando con la cuenta administradora (Owner): ${deployer.address}`);

  // Obtenemos la fábrica del contrato
  const AcademicCertificates = await ethers.getContractFactory("AcademicCertificates");

  // Desplegamos el contrato
  // En Ethers.js v6 (Hardhat moderno) se usa .deploy() y luego se espera el resultado
  const contract = await AcademicCertificates.deploy();

  console.log("Esperando confirmación de transacción de despliegue...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("==================================================================");
  console.log("¡Contrato Desplegado Exitosamente!");
  console.log(`Dirección del contrato: ${contractAddress}`);
  console.log("==================================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error durante el despliegue:");
    console.error(error);
    process.exit(1);
  });
