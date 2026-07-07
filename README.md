# Registro Inmutable de Títulos Académicos

## Evaluación Final Transversal (EFT)

**Asignatura:** Fundamentos de Blockchain (BCY0010)  
**Institución:** Duoc UC

---

## Descripción

Este proyecto implementa un Smart Contract en Solidity para el registro inmutable de títulos profesionales o certificaciones académicas sobre tecnología Blockchain.

La solución permite que una institución educativa (propietaria del contrato) emita certificados académicos asociados a la dirección pública (wallet) de un estudiante, almacenando un hash criptográfico del documento para garantizar su autenticidad e integridad.

El proyecto fue desarrollado utilizando la plantilla oficial de la Evaluación Final Transversal y desplegado mediante Remix IDE.

---

## Objetivos

- Registrar certificados académicos en Blockchain.
- Garantizar la autenticidad mediante funciones hash.
- Asociar certificados a wallets públicas.
- Permitir la invalidación lógica de certificados.
- Facilitar la verificación pública de credenciales académicas.

---

## Tecnologías utilizadas

- Solidity 0.8.20
- Remix IDE
- Hardhat
- OpenZeppelin Contracts
- Ethereum
- JavaScript
- Node.js

---

## Funcionalidades

- Emisión de certificados por parte del Owner.
- Asociación del certificado a la wallet del estudiante.
- Almacenamiento del hash criptográfico del certificado.
- Consulta pública de certificados.
- Invalidación lógica de certificados.
- Protección mediante Ownable y ReentrancyGuard.

---

## Estructura del proyecto

```text
src/
│── AcademicCertificates.sol

test/
│── AcademicCertificates.test.js


deploy.js
hardhat.config.js
package.json
package-lock.json
README.md
```

---

## Instalación

Instalar las dependencias del proyecto:

```bash
npm install
```

Compilar el contrato:

```bash
npm run compile
```

Ejecutar las pruebas:

```bash
npm test
```

---

## Despliegue

El contrato puede desplegarse mediante:

- Remix IDE (según la guía incluida en `infra/`)
- Hardhat utilizando:

```bash
npm run deploy
```

---

## Consideraciones de Seguridad

El contrato incorpora mecanismos para:

- Validar wallets distintas de `address(0)`.
- Evitar certificados duplicados.
- Impedir hashes vacíos.
- Controlar el acceso mediante `Ownable`.
- Evitar reentradas mediante `ReentrancyGuard`.

---

## Marco Normativo

Este proyecto considera los principales aspectos regulatorios estudiados en la asignatura:

- Ley N.º 19.628 sobre Protección de la Vida Privada.
- Ley N.º 21.542 sobre Infraestructura Crítica.
- Principios de integridad, autenticidad e inmutabilidad de la información en Blockchain.

---

## Integrantes

- Diego Iturra

---

## Licencia

Proyecto desarrollado exclusivamente con fines académicos para la Evaluación Final Transversal de la asignatura Fundamentos de Blockchain.