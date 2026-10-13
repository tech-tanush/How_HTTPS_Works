# How HTTPS Works — Interactive Working Demonstration Project

An interactive, beginner-friendly educational web application and dual-server testbed designed for college technical presentations, networking labs, and viva examinations.

---

## 1. Project Overview

This project demonstrates the internal mechanics of secure web communications by running **real local HTTP and HTTPS connections** rather than static mockups. It contrasts unencrypted cleartext transport with TLS (Transport Layer Security) encryption across all layers of the network stack.

### Key Topics Demonstrated
1. **HTTP vs. HTTPS**: Cleartext TCP streams vs. authenticated TLS tunnels.
2. **DNS Resolution**: Domain to IP resolution, caching mechanics, and DoH (DNS-over-HTTPS).
3. **TCP Three-Way Handshake**: Connection synchronization (`SYN` → `SYN-ACK` → `ACK`) and full-duplex verification.
4. **TLS 1.3 Handshake**: Single round-trip time (1-RTT) cryptographic negotiation (`ClientHello` → `ServerHello` → `Finished`).
5. **Digital Certificates & PKI**: X.509 format, Subject Alternative Names (SAN), and Root CA trust chains.
6. **Key Exchange & Cryptography**: Ephemeral Diffie-Hellman (`ECDHE`), Forward Secrecy, and symmetric session key derivation (`AES-256-GCM`).
7. **Real Socket Verification**: Backend verification of `req.socket.encrypted`, cipher suites, and protocol versions.
8. **Man-in-the-Middle (MITM) Defense**: Why certificate validation defeats MITM attacks and why ignoring certificate warnings breaks security.
9. **Wireshark Packet Analysis**: Capturing loopback traffic, identifying cleartext vs. encrypted application records.

---

## 2. Architecture & Technology Stack

```
HTTPS_demo/
├── client/                      # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/          # Educational visualizers & dashboards
│   │   │   ├── Navbar.jsx
│   │   │   ├── DashboardOverview.jsx
│   │   │   ├── HttpVsHttpsComparison.jsx
│   │   │   ├── CommunicationFlow.jsx
│   │   │   ├── TcpHandshakeVisualizer.jsx
│   │   │   ├── TlsHandshakeVisualizer.jsx
│   │   │   ├── CertificateExplorer.jsx
│   │   │   ├── EncryptionPlayground.jsx
│   │   │   ├── SecurityAndMitm.jsx
│   │   │   ├── WiresharkGuide.jsx
│   │   │   ├── PresentationGuide.jsx
│   │   │   └── Footer.jsx
│   │   ├── data/                # Handshake steps, viva Q&A, presentation script
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                      # Dual Backend Server (Node.js & Express)
│   ├── cert/                    # TLS Certificate and Private Key (excluded from Git)
│   │   ├── server.key
│   │   └── server.cert
│   ├── scripts/
│   │   ├── generate-cert.js     # Cross-platform certificate generator with SAN
│   │   ├── generate-cert.ps1    # PowerShell certificate generation helper
│   │   └── test-endpoints.js    # Automated test suite for HTTP & HTTPS
│   ├── server.js                # Express app listening on ports 3000 and 3443
│   └── package.json
├── package.json                 # Project root scripts
├── .gitignore                   # Excludes node_modules, keys, certificates, build output
└── README.md                    # Complete project guide and presentation material
```

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide React icons.
- **Backend**: Node.js built-in `http` and `https` modules, Express 4, CORS.
- **Cryptography**: Node.js `crypto` module, OpenSSL 3.x (with optional `mkcert`).
- **Inspection**: Wireshark network protocol analyzer.

---

## 3. Prerequisites

Before running the application, ensure the following are installed on your Windows system:
1. **Node.js**: v18.0.0 or higher (`node -v`).
2. **npm**: v9.0.0 or higher (`npm -v`).
3. **OpenSSL**: Installed and available in your PATH (`openssl version`).
   - *Note: OpenSSL is included with Git for Windows at `C:\Program Files\Git\usr\bin\openssl.exe`.*
4. **Wireshark** *(Optional for packet capture lab)*: With Npcap installed and loopback traffic capture enabled.

---

## 4. Installation & Setup Instructions

Open **Windows PowerShell** in the project directory (`HTTPS_demo`):

### Step 1: Install Dependencies
```powershell
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

### Step 2: Generate TLS Certificates
A valid self-signed certificate with Subject Alternative Names (SAN) for `localhost` and `127.0.0.1` is generated automatically when the server boots. You can also generate or regenerate it manually:

```powershell
# Cross-platform Node generator
npm --prefix server run cert

# Or using the PowerShell script
.\server\scripts\generate-cert.ps1
```

#### Certificate Details:
- **Private Key (`server.key`)**: 2048-bit RSA private key used by the server to create digital signatures (`CertificateVerify`) proving its identity during the TLS handshake. Kept strictly secret on the server.
- **Certificate (`server.cert`)**: Contains the server's public key, Subject (`CN=localhost`), Issuer, Validity dates (365 days), and Subject Alternative Names (`DNS:localhost, IP:127.0.0.1, IP:::1`).

---

## 5. Starting the Application

You will run the backend and frontend in two separate terminal windows.

### Terminal 1: Start Backend Server
```powershell
cd server
npm start
```
*Output:*
```
[Certificates] Existing certificates found:
  Key:  ...\server\cert\server.key
  Cert: ...\server\cert\server.cert
[HTTP Server]  Listening on http://localhost:3000
               Transport: Unencrypted Plaintext
[HTTPS Server] Listening on https://localhost:3443
               Transport: TLS Encrypted (TLS 1.2 / TLS 1.3)
```

### Terminal 2: Start Frontend Application
```powershell
cd client
npm run dev
```
*Output:*
```
  VITE v6.x.x ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

Open your browser and navigate to **`http://localhost:5173/`**.

---

## 6. How to Test HTTP & HTTPS Features

### 1. Automated Test Suite
With the server running, execute the automated test suite in a PowerShell terminal:
```powershell
cd server
npm test
```
This tests both ports:
- Confirms `http://localhost:3000/api/health` reports `isTls: false`.
- Confirms `https://localhost:3443/api/health` reports `isTls: true` and active TLS cipher suites.
- Verifies `POST /api/demo` input validation and echo analysis.
- Verifies `GET /api/certificate` parses X.509 fields (SAN, algorithm, validity).

### 2. Browser Authorization (Accepting the Local Self-Signed Certificate)
Because the certificate is self-signed, browsers display a security warning: `NET::ERR_CERT_AUTHORITY_INVALID`.
1. Open a new browser tab to: **`https://localhost:3443/api/health`**
2. Click **"Advanced"** (or "Details").
3. Click **"Proceed to localhost (unsafe)"**.
4. The browser will now accept HTTPS requests to port 3443 from the interactive dashboard playground.

*(Alternative for zero warnings: Use [`mkcert`](https://github.com/FiloSottile/mkcert): `mkcert -install && mkcert -key-file server/cert/server.key -cert-file server/cert/server.cert localhost 127.0.0.1 ::1`)*

### 3. Testing via cURL
To test directly from the command line:
```powershell
# Test HTTP (Unencrypted)
curl http://localhost:3000/api/demo

# Test HTTPS (Using -k to bypass local self-signed certificate validation)
curl -k https://localhost:3443/api/demo
```
*Note: The `-k` (`--insecure`) flag is used strictly for local diagnostic testing of self-signed certificates and must never be used in production applications.*

---

## 7. Wireshark Packet Inspection Guide

### Lab Instructions:
1. Open **Wireshark**.
2. Select the **Loopback** capture interface:
   - On Windows: `\Device\NPF_Loopback` or `Adapter for loopback traffic capture`.
   - On macOS/Linux: `lo` or `lo0`.
3. In the display filter bar at the top, enter:
   ```wireshark
   tcp.port == 3000 || tcp.port == 3443
   ```
4. Click the blue shark fin icon to start packet capture.
5. In the web dashboard playground, send a message via **HTTP (Port 3000)**:
   - In Wireshark, find the HTTP packet.
   - Right-click → **Follow** → **TCP Stream**.
   - **Observation**: The entire request and response are visible in readable ASCII text (Red = client sent, Blue = server answered).
6. Send the same message via **HTTPS (Port 3443)**:
   - Set the Wireshark filter to:
     ```wireshark
     tcp.port == 3443
     ```
   - **Observations**:
     - Observe the TCP 3-way handshake: `[SYN]`, `[SYN, ACK]`, `[ACK]`.
     - Filter by `tls` to inspect the `ClientHello` and `ServerHello`.
     - Follow the TCP Stream on port 3443.
     - **Observation**: All HTTP paths, headers, and payloads appear as opaque, high-entropy binary bytes (`Application Data`). No readable text is visible.

---

## 8. Security Benefits and Real-World Limitations

### The Three Pillars of HTTPS:
1. **Confidentiality**: Symmetric encryption (`AES-256-GCM`, `ChaCha20-Poly1305`) scrambles all application headers, URLs, cookies, and data on the wire.
2. **Integrity**: Authenticated Encryption with Associated Data (AEAD) includes cryptographic message authentication codes (MAC). Any in-flight bit alteration immediately triggers a decryption failure.
3. **Authentication**: Digital certificates cryptographically prove server identity using a chain of trust back to a trusted Root CA.

### Real-World Limitations:
- **HTTPS does not equal trustworthy content**: Malicious actors and phishing websites can obtain free, valid certificates from automated CAs (e.g., Let's Encrypt).
- **HTTPS protects data in transit, not on endpoints**: If client malware or keyloggers exist, or if the server database is breached, HTTPS cannot prevent data compromise.
- **Certificate warnings must not be ignored**: Bypassing certificate alerts on public networks allows Man-in-the-Middle attackers to terminate and decrypt your traffic.

---

## 9. 3–5 Minute College Presentation Script

| Timestamp | Slide / Section | Speaker Talk Track |
|---|---|---|
| **0:00 - 0:45** | **1. Introduction & The Problem with HTTP** | *"Good morning professors and fellow students. Today, we demonstrate 'How HTTPS Works' through real network connections and live socket inspection. In the early web, HTTP transmitted data in plaintext. On an open network, every router along the path can inspect your cookies, passwords, and private messages. To solve this, HTTPS wraps HTTP inside a TLS cryptographic tunnel."* |
| **0:45 - 1:45** | **2. Request Journey: DNS, TCP, and Handshake** | *"When you type https://localhost:3443 into a browser, three distinct layers interact: First, DNS translates the hostname into an IP address. Second, a Layer 4 TCP three-way handshake establishes transport reliability through SYN, SYN-ACK, and ACK packets. Crucially, TCP provides reliability, not encryption. Third, the TLS handshake begins: the browser sends ClientHello with supported ciphers and an ephemeral key share. The server answers with ServerHello and its X.509 certificate."* |
| **1:45 - 2:45** | **3. Certificates & Ephemeral Key Agreement** | *"How does the browser authenticate the server? It validates the server's certificate against Subject Alternative Names, expiration dates, and a chain of trust. In our demo, our server uses a self-signed certificate, which is why browsers show an alert. Next, both sides execute ECDHE—Elliptic Curve Diffie-Hellman Ephemeral. A key technical point: the server's certificate public key does NOT encrypt web requests directly. It only authenticates the server. High-speed symmetric session keys (AES-GCM) are derived to encrypt all HTTP data."* |
| **2:45 - 3:45** | **4. Live Demonstration & Wireshark Proof** | *"Now let's examine our live playground. When we transmit a message over HTTP on port 3000, our backend socket reports 'encrypted: false'. In Wireshark, the TCP stream displays raw ASCII text. But when we send the exact same payload over HTTPS on port 3443, the socket confirms TLS 1.3 with AES-256-GCM. In Wireshark, the payload is completely indecipherable binary Application Data. An attacker captures only meaningless ciphertext."* |
| **3:45 - 4:30** | **5. Security Limitations & Conclusion** | *"Finally, we must understand the boundaries of HTTPS. HTTPS guarantees confidentiality, integrity, and authentication in transit. However, HTTPS does not guarantee that a website is trustworthy—phishing sites use HTTPS too! Nor does it protect endpoints if a device is infected with malware. In conclusion, HTTPS is the fundamental bedrock of internet privacy. Thank you, and we welcome your questions!"* |

---

## 10. Top 10 College Viva Questions & Answers

### Q1: What is the difference between HTTP and HTTPS?
> **Answer**: HTTP operates at the application layer over TCP port 80 and transmits data in unencrypted plaintext. HTTPS transmits HTTP encrypted inside a TLS (Transport Layer Security) session over port 443, guaranteeing confidentiality, packet integrity, and server authentication.

### Q2: What is TLS and how does it relate to SSL?
> **Answer**: TLS is the modern cryptographic standard that replaced SSL (Secure Sockets Layer). SSL 2.0 and 3.0 were developed by Netscape in the 1990s and are now deprecated due to security vulnerabilities (such as POODLE). TLS 1.2 and TLS 1.3 are the current RFC standards.

### Q3: What happens in a TCP three-way handshake?
> **Answer**: TCP establishes a reliable connection in three steps:
> 1. **Client → Server (SYN)**: Synchronize sequence number $X$.
> 2. **Server → Client (SYN-ACK)**: Acknowledge $X+1$ and synchronize server sequence number $Y$.
> 3. **Client → Server (ACK)**: Acknowledge $Y+1$. Once received, both sockets transition to the `ESTABLISHED` state.

### Q4: What is a digital certificate?
> **Answer**: An X.509 digital certificate is an electronic credential that cryptographically binds an organization's public key to their identity (domain name). It includes the Subject (domain), Issuer (CA), validity dates, public key, and a digital signature created using the CA's private key.

### Q5: What is a Certificate Authority (CA) and a Chain of Trust?
> **Answer**: A CA is a globally trusted organization (e.g., Let's Encrypt, DigiCert) that verifies domain ownership and issues certificates. Operating systems maintain a pre-installed repository of trusted Root CAs. A chain of trust connects the website's leaf certificate to an Intermediate CA, which traces back to a trusted Root CA.

### Q6: What is the difference between asymmetric and symmetric encryption in TLS?
> **Answer**: Asymmetric (public-key) cryptography uses a public/private key pair and is computationally intensive. Symmetric cryptography uses a single shared secret key and is hardware-accelerated. TLS uses asymmetric cryptography during the handshake to authenticate the server and agree on keys, then switches to symmetric encryption (AES-GCM / ChaCha20) for all web traffic.

### Q7: How are TLS session keys established? Does the server public key encrypt web data?
> **Answer**: No, the server's public key does not encrypt web data directly. Modern TLS 1.3 uses Ephemeral Diffie-Hellman (`ECDHE`). Both parties generate temporary private numbers, exchange public elliptic curve points, and independently calculate an identical shared secret. HKDF expands this secret into symmetric session keys.

### Q8: What is a Man-in-the-Middle (MITM) attack and how does HTTPS prevent it?
> **Answer**: In a MITM attack, an adversary intercepts and alters communications between client and server. HTTPS prevents this because the attacker cannot forge a valid certificate for the target domain without the private key of a trusted CA. If the attacker injects an invalid certificate, the browser halts the connection. AEAD authentication tags also prevent in-flight packet modification.

### Q9: Why does a local self-signed certificate trigger a browser warning?
> **Answer**: Because the certificate's Issuer equals its Subject and does not chain back to any trusted Root CA in the operating system's trust store. The browser flags `NET::ERR_CERT_AUTHORITY_INVALID` to warn users that the identity of the certificate creator cannot be verified.

### Q10: What can Wireshark reveal about HTTPS traffic?
> **Answer**: For HTTP, Wireshark exposes all headers, cookies, URLs, and payloads in plain text. For HTTPS, Wireshark can observe IP addresses, TCP ports, handshake flags (SYN/ACK), and the target domain name via the Server Name Indication (SNI) header. However, all application data, paths, headers, and payloads appear as opaque encrypted binary records.

---

## 11. Troubleshooting Common Issues

1. **`NET::ERR_CERT_AUTHORITY_INVALID` in Browser**:
   - *Cause*: Normal behavior for local self-signed certificates.
   - *Fix*: Open `https://localhost:3443/api/health` directly in your browser, click "Advanced", and select "Proceed to localhost".
2. **CORS Errors**:
   - *Cause*: Frontend running on an origin not allowed by backend CORS configuration.
   - *Fix*: The backend is configured to allow `http://localhost:5173` and `http://127.0.0.1:5173`. Ensure your Vite dev server runs on port 5173.
3. **Port Already in Use (`EADDRINUSE`)**:
   - *Cause*: Another process is occupying port 3000, 3443, or 5173.
   - *Fix*: Run `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force` in PowerShell.
4. **Wireshark Not Showing Localhost Packets**:
   - *Cause*: Npcap loopback driver is not installed or enabled.
   - *Fix*: Reinstall Npcap with the option *"Support loopback traffic (`\Device\NPF_Loopback`)"* checked.
