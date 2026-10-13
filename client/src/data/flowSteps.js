export const FLOW_STEPS = [
  {
    id: 1,
    title: "User Enters a URL",
    category: "Client Action",
    actor: "client",
    explanation:
      "The user types 'https://localhost:3443' into the browser address bar or clicks a link. The browser parses the protocol scheme ('https://'), the target hostname ('localhost'), the port (3443), and the request path ('/').",
    clientSends:
      "Internal browser event: Parse URL scheme 'https:', authority 'localhost:3443', and target path.",
    serverSends: "None yet. Server is passively listening for incoming connections on port 3443.",
    networkObserverSees:
      "Nothing on the network wire. This action occurs entirely within the client machine's local memory.",
    analogy:
      "You decide to write a letter, look up your friend's address in your contact book, and write their name on an envelope.",
    keyNote:
      "The 'https://' prefix tells the browser that standard HTTP must be encapsulated within a TLS (Transport Layer Security) session on top of the transport layer.",
  },
  {
    id: 2,
    title: "DNS Resolution (Domain Name Lookup)",
    category: "Name Resolution",
    actor: "client",
    explanation:
      "Before connecting, the operating system must translate the human-readable hostname (e.g., 'localhost' or 'example.com') into a routable IP address (e.g., 127.0.0.1 or ::1).",
    clientSends:
      "DNS Query: Standard UDP port 53 query asking: 'What is the A (IPv4) or AAAA (IPv6) record for this hostname?'",
    serverSends:
      "DNS Response: Returns IP address: 127.0.0.1 (IPv4 Loopback) and ::1 (IPv6 Loopback).",
    networkObserverSees:
      "Plaintext DNS request and response (or DNS-over-HTTPS/DoH if enabled). The domain name is visible in cleartext over standard DNS.",
    analogy:
      "Calling directory assistance or checking your phone's address book to turn a person's name into their exact numerical street address.",
    keyNote:
      "Optimization Note: Browsers and operating systems aggressively cache DNS records. In reality, not every HTTP request triggers a new DNS query. In our local demo, 'localhost' is resolved immediately via the local hosts file or resolver.",
  },
  {
    id: 3,
    title: "TCP Three-Way Handshake",
    category: "Transport Layer",
    actor: "both",
    explanation:
      "Before any secure data can be sent, the client and server must establish a reliable transport connection over TCP (Layer 4) through a 3-step sequence: SYN, SYN-ACK, ACK.",
    clientSends:
      "1. TCP SYN (Synchronize Sequence Number = X)\n3. TCP ACK (Acknowledgment Number = Y + 1)",
    serverSends:
      "2. TCP SYN-ACK (Synchronize Sequence Number = Y, Acknowledgment = X + 1)",
    networkObserverSees:
      "Three TCP packets visible with TCP flags [SYN], [SYN, ACK], and [ACK]. Port numbers (e.g. 52341 -> 3443) and sequence numbers are in cleartext.",
    analogy:
      "Two people establishing a telephone call: 'Hello, can you hear me?' -> 'Yes, I hear you, can you hear me?' -> 'Yes, I hear you loud and clear. Let us talk.'",
    keyNote:
      "Transport Distinction: This TCP handshake is for HTTP/1.1 and HTTP/2. Modern HTTP/3 replaces TCP with QUIC over UDP, combining transport and security handshakes into a single round trip! Notice: No encryption has occurred yet.",
  },
  {
    id: 4,
    title: "TLS Handshake Begins: ClientHello",
    category: "Security Handshake",
    actor: "client",
    explanation:
      "With the TCP tunnel established, the browser initiates the TLS handshake by sending a 'ClientHello' message announcing supported TLS versions, cipher suites, and an ephemeral key share.",
    clientSends:
      "TLS Record [ClientHello]:\n- Protocol Version: TLS 1.3 / 1.2\n- Supported Cipher Suites (e.g., TLS_AES_256_GCM_SHA384)\n- Client Random bytes\n- Server Name Indication (SNI): 'localhost'\n- Key Share: Client's Ephemeral Public Key (ECDHE)",
    serverSends: "Server receives the ClientHello and selects compatible parameters.",
    networkObserverSees:
      "TLS ClientHello record. An observer can see the requested SNI hostname (unless Encrypted Client Hello/ECH is active) and supported cryptographic ciphers.",
    analogy:
      "Walking into a bank counter and stating: 'I speak English or Spanish, I want to use AES-256 security, here is my temporary public token, and I want to speak to the localhost department.'",
    keyNote:
      "In TLS 1.3, the client preemptively sends its Diffie-Hellman public key share in the very first message to dramatically accelerate connection setup.",
  },
  {
    id: 5,
    title: "ServerHello & Certificate Presentation",
    category: "Security Handshake",
    actor: "server",
    explanation:
      "The server responds with 'ServerHello' selecting the cipher suite, providing its own ephemeral key share, and sending its X.509 Digital Certificate containing its identity and public key.",
    clientSends: "Client waits and receives server handshake packets.",
    serverSends:
      "TLS Record [ServerHello]:\n- Selected Cipher: TLS_AES_256_GCM_SHA384\n- Server Random bytes\n- Server Ephemeral Key Share (ECDHE)\n- Server X.509 Certificate (Subject, Issuer, SAN, Public Key)\n- CertificateVerify: Digital signature proving ownership of private key",
    networkObserverSees:
      "TLS ServerHello record. In TLS 1.3, the Certificate and CertificateVerify messages are already encrypted using keys derived from the initial key exchange!",
    analogy:
      "The bank clerk shows their official government-issued employee badge with a security hologram and provides their side of a temporary secret key exchange.",
    keyNote:
      "Crucial TLS 1.3 Feature: Unlike older TLS 1.2 where the certificate was transmitted in plaintext, TLS 1.3 encrypts the certificate and all handshake messages that follow ServerHello.",
  },
  {
    id: 6,
    title: "Browser Validates the Certificate & Hostname",
    category: "Identity & Trust",
    actor: "client",
    explanation:
      "The browser inspects the server's certificate against strict cryptographic criteria: checking the Subject Alternative Name (SAN), the validity dates, and the chain of trust up to a recognized Root CA.",
    clientSends:
      "Internal browser validation logic:\n1. Does hostname ('localhost') match Certificate SAN?\n2. Is current date within 'Not Before' and 'Not After'?\n3. Is certificate signed by a trusted Root CA in the OS store?\n4. Is digital signature mathematically valid?",
    serverSends: "Server waits for client verification.",
    networkObserverSees:
      "Nothing on the wire. This is a local cryptographic and policy verification step on the client.",
    analogy:
      "Inspecting a passport with an ultraviolet light, checking that the name matches the ticket, the expiration date hasn't passed, and the seal was stamped by an authorized agency.",
    keyNote:
      "Why Localhost Warns: Our local demo uses a self-signed certificate. Because the certificate signed itself and is not in the browser's pre-installed Root CA store, the browser displays a warning alert.",
  },
  {
    id: 7,
    title: "Key Agreement (ECDHE) & Session Key Derivation",
    category: "Cryptography",
    actor: "both",
    explanation:
      "Both client and server combine their ephemeral key shares using the Elliptic Curve Diffie-Hellman (ECDHE) algorithm to compute an identical shared secret. From this secret, they derive symmetric session keys.",
    clientSends:
      "Client Finished: Cryptographic MAC confirming handshake parameters were untampered.",
    serverSends:
      "Server Finished: Cryptographic MAC confirming handshake parameters were untampered.",
    networkObserverSees:
      "Encrypted handshake records. The observer has seen both public key shares but cannot calculate the shared secret without knowing the private ephemeral exponents (Discrete Logarithm Problem).",
    analogy:
      "The famous Diffie-Hellman color mixing analogy: Both parties exchange public blended paint colors. Each mixes their private secret paint. Both end up with the exact same secret mixed color, but an observer cannot unmix it.",
    keyNote:
      "Common Misconception Debunked: The server certificate's RSA public key is NOT used to encrypt web requests! It is only used to authenticate the server. Ephemeral ECDHE keys produce fast symmetric session keys for bulk data encryption.",
  },
  {
    id: 8,
    title: "Browser Sends Encrypted HTTP Request",
    category: "Encrypted Application Data",
    actor: "client",
    explanation:
      "The TLS tunnel is now active! The browser constructs a standard HTTP request (e.g. 'POST /api/demo') and encrypts the entire HTTP header, path, query parameters, and payload using the symmetric session key.",
    clientSends:
      "TLS Record [Application Data]:\n- Content Type: 23 (Application Data)\n- Protocol: TLS 1.3\n- Ciphertext: [0x7f 0x2a 0x91 0xbb 0x4f...]\n- Authentication Tag (AEAD MAC)",
    serverSends: "Server receives the encrypted binary TLS record.",
    networkObserverSees:
      "In Wireshark: 'Application Data' packet. All HTTP headers (User-Agent, Cookie, Authorization), URLs, and body text appear as completely scrambled, high-entropy pseudorandom bytes.",
    analogy:
      "Placing your private letter inside an armored, pick-proof steel safe that can only be unlocked by the exact matching key held by the recipient.",
    keyNote:
      "Everything in the HTTP layer is protected: headers, URLs, cookies, form data, and JSON bodies are all encrypted.",
  },
  {
    id: 9,
    title: "Server Decrypts & Processes the Request",
    category: "Server Processing",
    actor: "server",
    explanation:
      "The server's TLS socket receives the encrypted record, validates the AEAD authentication tag to verify integrity, decrypts the payload into plaintext HTTP, and hands it to Express route handlers.",
    clientSends: "Client waits for server processing.",
    serverSends:
      "Internal server processing:\n1. Decrypt TLS record with server session key.\n2. Verify socket.encrypted is true.\n3. Execute Express route logic (e.g. /api/demo).\n4. Formulate JSON response object.",
    networkObserverSees:
      "Nothing visible on the wire while the server CPU processes the request.",
    analogy:
      "The recipient unlocks the steel safe with their key, reads the letter, verifies the wax seal wasn't broken, and writes a reply.",
    keyNote:
      "Socket Verification: Our Express backend verifies 'req.socket.encrypted === true' directly on the underlying TLS socket rather than trusting insecure client headers.",
  },
  {
    id: 10,
    title: "Server Returns Encrypted HTTP Response",
    category: "Encrypted Application Data",
    actor: "server",
    explanation:
      "The server takes the HTTP response headers (Status: 200 OK, Content-Type: application/json) and the JSON body, encrypts them with the symmetric session key, and transmits the TLS record.",
    clientSends: "Client receives the incoming encrypted bytes.",
    serverSends:
      "TLS Record [Application Data]:\n- Encrypted HTTP 200 OK response\n- Encrypted headers and JSON body\n- AEAD Integrity Verification Tag",
    networkObserverSees:
      "Wireshark displays an unreadable TLS 'Application Data' record. Eavesdroppers cannot tell if the response is JSON, HTML, an image, or what status code was returned.",
    analogy:
      "The recipient puts their reply in another locked steel safe, turns the lock, and hands it back to the courier.",
    keyNote:
      "AEAD (Authenticated Encryption with Associated Data) guarantees both privacy and tampering detection. If a single bit is modified in transit, decryption immediately fails with an integrity error.",
  },
  {
    id: 11,
    title: "Browser Decrypts & Renders the Response",
    category: "Client Rendering",
    actor: "client",
    explanation:
      "The browser receives the TLS record, validates the authentication tag, decrypts the payload using its session key, parses the JSON response, and renders the data in the interactive dashboard UI.",
    clientSends: "Connection kept alive or gracefully closed with TLS 'close_notify' alert.",
    serverSends: "Connection remains open for subsequent HTTP/2 multiplexed streams or keep-alive.",
    networkObserverSees:
      "Optional TLS Alert [close_notify] or TCP keep-alive packets.",
    analogy:
      "You unlock the safe, read your friend's letter in the privacy of your home, and update your notes.",
    keyNote:
      "Full cycle complete! The communication achieved Confidentiality (eavesdroppers read nothing), Integrity (tampering was prevented), and Authentication (server identity was verified).",
  },
];
