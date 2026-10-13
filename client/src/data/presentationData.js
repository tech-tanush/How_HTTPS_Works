export const VIVA_QUESTIONS = [
  {
    id: 1,
    question: "What is the difference between HTTP and HTTPS?",
    shortAnswer:
      "HTTP transmits data in unencrypted plaintext over TCP port 80. HTTPS transmits HTTP encrypted over TLS (Transport Layer Security) usually over port 443, providing confidentiality, integrity, and server authentication.",
    fullAnswer:
      "HTTP (Hypertext Transfer Protocol) operates at the application layer and transmits headers, cookies, URLs, and payloads in cleartext. Anyone with access to network equipment on the path (routers, Wi-Fi hotspots, ISPs) can read (eavesdrop) or modify (tamper with) the traffic. HTTPS (HTTP Secure) runs the same HTTP protocol on top of TLS (Transport Layer Security). TLS encrypts the traffic using symmetric session keys, authenticates the server using an X.509 digital certificate, and uses cryptographic checksums (AEAD/MAC) to detect any packet alteration.",
    category: "Fundamentals",
  },
  {
    id: 2,
    question: "What is TLS and how does it relate to SSL?",
    shortAnswer:
      "TLS (Transport Layer Security) is the modern cryptographic standard that replaced SSL (Secure Sockets Layer). SSL is obsolete and deprecated.",
    fullAnswer:
      "SSL was originally developed by Netscape in the 1990s (SSL 2.0 and 3.0). Due to severe cryptographic vulnerabilities (such as POODLE), SSL was deprecated. The IETF standardized it as TLS (starting with TLS 1.0 in 1999). Today, modern web security relies on TLS 1.2 and TLS 1.3 (RFC 8446). While people colloquially say 'SSL certificate', modern protocols strictly use TLS.",
    category: "Protocols",
  },
  {
    id: 3,
    question: "What happens in a TCP three-way handshake?",
    shortAnswer:
      "The client and server synchronize sequence numbers and establish full-duplex communication using SYN, SYN-ACK, and ACK packets.",
    fullAnswer:
      "Before any TLS or HTTP traffic can travel, TCP establishes a reliable connection:\n1. Client -> Server: SYN (Synchronize flag set with random initial sequence number X).\n2. Server -> Client: SYN-ACK (Server acknowledges X+1 and provides its own sequence number Y).\n3. Client -> Server: ACK (Client acknowledges Y+1). Once the ACK is received, the connection state becomes ESTABLISHED. Both sides now know the other can transmit and receive reliably.",
    category: "Transport Layer",
  },
  {
    id: 4,
    question: "What is a digital certificate?",
    shortAnswer:
      "An electronic credential that cryptographically binds an organization's public key to their identity (domain name), signed by a Certificate Authority.",
    fullAnswer:
      "An X.509 digital certificate contains the server's public key, the Subject (domain name / SAN), validity dates, the issuing Certificate Authority (Issuer), and a digital signature created using the CA's private key. Browsers verify the signature using the CA's public key already stored in their trust store, ensuring the certificate has not been forged or tampered with.",
    category: "Public Key Infrastructure",
  },
  {
    id: 5,
    question: "What is a Certificate Authority (CA) and a Chain of Trust?",
    shortAnswer:
      "A CA is a globally trusted entity that validates domain ownership and signs digital certificates. A chain of trust links the leaf certificate back to a trusted Root CA.",
    fullAnswer:
      "A Certificate Authority (e.g., Let's Encrypt, DigiCert, Sectigo) acts as a trusted third party. Operating systems and browsers come pre-installed with a curated list of trusted 'Root CAs'. Because Root CAs keep their private keys in offline vaults, they issue Intermediate CAs. The Intermediate CA then signs the website's leaf certificate. When a browser visits a site, it traces the signatures: Website -> Intermediate -> Root CA. If all links in the chain are valid, the browser trusts the website.",
    category: "Public Key Infrastructure",
  },
  {
    id: 6,
    question: "What is the difference between public-key (asymmetric) and symmetric encryption?",
    shortAnswer:
      "Asymmetric encryption uses a public/private key pair and is computationally slow. Symmetric encryption uses a single shared secret key and is extremely fast.",
    fullAnswer:
      "Asymmetric (public-key) cryptography (e.g. RSA, ECC) uses two mathematically linked keys: a public key known to anyone and a private key kept strictly secret. Anyone can encrypt or verify signatures with the public key, but only the owner can decrypt or sign with the private key. It is computationally expensive. Symmetric cryptography (e.g. AES-256-GCM, ChaCha20) uses the same secret key for both encryption and decryption and is hardware-accelerated. TLS cleverly combines both: asymmetric cryptography authenticates the parties and agrees on a key, then symmetric cryptography encrypts the bulk web traffic.",
    category: "Cryptography",
  },
  {
    id: 7,
    question: "How are TLS session keys established?",
    shortAnswer:
      "Modern TLS 1.3 uses Ephemeral Diffie-Hellman (ECDHE) key exchange during the handshake to independently calculate identical symmetric session keys.",
    fullAnswer:
      "Rather than the client encrypting a pre-master secret with the server's public key (which was vulnerable and lacked forward secrecy in older TLS), TLS 1.3 mandates ephemeral Diffie-Hellman (ECDHE). The client and server each generate a temporary private number and exchange public elliptic curve points. Both independently combine their private number with the peer's public point to derive the exact same shared secret. HKDF (HMAC-based Key Derivation Function) then expands this into symmetric encryption keys and initialization vectors. Eavesdroppers seeing only the public points cannot compute the shared secret.",
    category: "Cryptography",
  },
  {
    id: 8,
    question: "What is a Man-in-the-Middle (MITM) attack and how does HTTPS prevent it?",
    shortAnswer:
      "An attacker intercepts and alters communications between client and server. HTTPS prevents this via digital certificate authentication and AEAD message integrity.",
    fullAnswer:
      "In a MITM attack, an adversary positions themselves on the network (e.g. rogue Wi-Fi router) and pretends to be the server to the client and the client to the server. Under HTTP, this is trivial because cleartext is unauthenticated. Under HTTPS, the attacker cannot forge a valid digital certificate for the target domain (e.g. bank.com) because they do not have the private key of a trusted Certificate Authority. If they substitute a self-signed or invalid certificate, the browser warns the user. Additionally, AEAD integrity tags prevent altering encrypted packets in transit.",
    category: "Security & Attacks",
  },
  {
    id: 9,
    question: "Why does a self-signed certificate produce a browser warning?",
    shortAnswer:
      "Because the certificate's issuer is itself and does not trace back to any trusted Root CA in the browser's trust repository.",
    fullAnswer:
      "A self-signed certificate has Issuer == Subject. Anyone can generate one in 2 seconds using OpenSSL for any domain name. Because the browser has no cryptographic proof that the certificate was created by the legitimate domain owner rather than an attacker conducting a MITM attack, it flags 'NET::ERR_CERT_AUTHORITY_INVALID'. In local development, developers either click 'Advanced -> Proceed' or install a local development root CA using tools like mkcert.",
    category: "Practical PKI",
  },
  {
    id: 10,
    question: "What can Wireshark reveal about HTTPS traffic vs HTTP traffic?",
    shortAnswer:
      "For HTTP, Wireshark reveals full URLs, headers, cookies, and payloads. For HTTPS, Wireshark only sees IP addresses, TCP ports, TLS records, and domain names (SNI), with all content encrypted.",
    fullAnswer:
      "For HTTP, a Wireshark packet capture displays plain ASCII text: exact request paths, passwords, cookies, authorization tokens, and HTML/JSON responses. For HTTPS, Wireshark can see the TCP 3-way handshake (SYN, SYN-ACK, ACK), the client and server IP addresses and port numbers, and the TLS record headers. In the ClientHello, the requested hostname is visible in the SNI extension (unless ECH is supported). But after the handshake, all HTTP request headers, query paths, cookies, and response payloads are packaged as opaque 'Application Data' records, appearing as pseudo-random binary ciphertext.",
    category: "Network Inspection",
  },
];

export const PRESENTATION_SCRIPT = [
  {
    time: "0:00 - 0:45",
    slide: "1. Introduction & The HTTP Problem",
    speakerNotes:
      "Good morning professors and fellow students. Today, we demonstrate 'How HTTPS Works' through real network connections and live socket inspection. When the web was invented, HTTP transmitted everything in cleartext. If you submit a form or browse on an open network, every router along the path can inspect your cookies, passwords, and private messages. To solve this, the internet adopted HTTPS—which is HTTP wrapped inside a TLS cryptographic tunnel.",
    keyPoints: [
      "Define HTTP (cleartext, unauthenticated) vs HTTPS (confidential, tamper-evident, authenticated).",
      "Mention real demonstration servers running on localhost: port 3000 (HTTP) and port 3443 (HTTPS).",
    ],
  },
  {
    time: "0:45 - 1:45",
    slide: "2. The Journey: DNS, TCP, and TLS Handshake",
    speakerNotes:
      "Let's trace what happens when you type https://localhost:3443 into your browser. First, DNS translates the hostname into an IP address. Second, a Layer 4 TCP three-way handshake establishes a reliable connection through SYN, SYN-ACK, and ACK packets. Crucially, TCP provides reliability, not encryption. Third, the TLS handshake begins. The browser sends ClientHello with supported cryptographic ciphers and an ephemeral key share. The server answers with ServerHello, its own key share, and its X.509 digital certificate.",
    keyPoints: [
      "Distinguish Layer 4 TCP connection from Layer 7 TLS cryptographic session.",
      "Show how TLS 1.3 optimizes the handshake into 1 round-trip time (1-RTT).",
    ],
  },
  {
    time: "1:45 - 2:45",
    slide: "3. Digital Certificates & Ephemeral Key Agreement",
    speakerNotes:
      "Now, how do we know the server is who it claims to be? The browser validates the server's X.509 certificate. It checks the Subject Alternative Name, expiration dates, and the cryptographic signature up to a trusted Root CA. In our demo, our server uses a self-signed certificate, which is why browsers show an alert—because the root CA isn't in the global trust store! Next, both sides execute ECDHE—Elliptic Curve Diffie-Hellman Ephemeral. Notice an essential point: the server's certificate public key does NOT encrypt web requests. It only authenticates the server. Symmetric session keys (AES-GCM) are derived to encrypt all HTTP data.",
    keyPoints: [
      "Address common misconception: RSA certificate key does not encrypt requests directly.",
      "Explain the Diffie-Hellman shared secret and forward secrecy.",
    ],
  },
  {
    time: "2:45 - 3:45",
    slide: "4. Live Encryption Playground & Wireshark Proof",
    speakerNotes:
      "Now, let's look at our live playground. When we send a test message over HTTP on port 3000, our Node.js socket reports 'encrypted: false'. In Wireshark, you can follow the TCP stream and see the raw ASCII text plain as day. But when we send the exact same payload over HTTPS on port 3443, the socket confirms TLS 1.3 with AES-256-GCM. In Wireshark, the payload is completely indecipherable binary Application Data. Even if an attacker captures the packets, they cannot decrypt the payload without the ephemeral session keys.",
    keyPoints: [
      "Demonstrate live requests to ports 3000 and 3443.",
      "Show socket metadata proving actual transport-layer encryption.",
    ],
  },
  {
    time: "3:45 - 4:30",
    slide: "5. Security Limitations & Conclusion",
    speakerNotes:
      "Finally, let's understand what HTTPS does and does not do. HTTPS protects data in transit against eavesdropping and MITM tampering. However, HTTPS does not guarantee that a website is trustworthy—phishing websites can obtain free HTTPS certificates too. Nor does it protect endpoints if a device is infected with malware. In conclusion, HTTPS is the fundamental bedrock of internet privacy, combining public-key authentication, ephemeral key exchange, and high-speed symmetric encryption. Thank you, and we welcome your questions!",
    keyPoints: [
      "Summarize the 3 security pillars: Confidentiality, Integrity, Authentication.",
      "Highlight limitations: endpoint security and phishing.",
    ],
  },
];

export const WIRESHARK_GUIDE_STEPS = [
  {
    step: 1,
    title: "Launch Wireshark & Select Interface",
    description:
      "Open Wireshark. Because our demonstration runs on localhost, select the Loopback adapter (on Windows: '\\Device\\NPF_Loopback' or 'Adapter for loopback traffic capture'; on macOS/Linux: 'lo' or 'lo0').",
    tip: "If you don't see the loopback adapter on Windows, ensure Npcap was installed with the 'Support loopback traffic' option checked.",
  },
  {
    step: 2,
    title: "Apply Initial Capture Filter",
    description:
      "To keep your capture clean, type the following display filter into the green Wireshark filter bar:\n`tcp.port == 3000 || tcp.port == 3443`",
    tip: "Press Enter. Wireshark will now only display packets bound to or originating from our demo backend ports.",
  },
  {
    step: 3,
    title: "Capture Unencrypted HTTP Traffic (Port 3000)",
    description:
      "In the playground or in a browser tab, trigger a request to `http://localhost:3000/api/demo`. In Wireshark, look for the HTTP GET or POST request. Right-click the packet -> 'Follow' -> 'TCP Stream'.",
    expectedResult:
      "You will see the raw, unencrypted HTTP request headers and JSON response in plain ASCII text (Red = client sent, Blue = server answered).",
  },
  {
    step: 4,
    title: "Capture Encrypted HTTPS Traffic (Port 3443)",
    description:
      "Now send a request to `https://localhost:3443/api/demo`. In Wireshark, apply the filter `tcp.port == 3443`.",
    expectedResult:
      "You will see:\n1. TCP SYN, SYN-ACK, ACK handshake packets.\n2. TLS ClientHello (announcing ciphers and key share).\n3. TLS ServerHello.\n4. Opaque 'Application Data' packets.",
  },
  {
    step: 5,
    title: "Filter Recognized TLS Handshake Records",
    description:
      "Change the display filter to `tls`. Expand the 'Transport Layer Security' protocol tree inside the ClientHello packet to inspect the Supported Groups, Cipher Suites, and Server Name Indication (SNI).",
    expectedResult:
      "Notice that after ServerHello, you cannot follow the TCP stream into readable text! The stream consists solely of encrypted ciphertext bytes.",
  },
];
