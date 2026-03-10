# DID Vault

A self-sovereign identity portal built on [Hyperledger Identus](https://github.com/hyperledger/identus).  
Create PRISM DIDs, issue W3C Verifiable Credentials (JWT), and verify credential presentations — all through a production-grade Next.js UI backed by the Identus Cloud Agent.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Next.js UI                     │
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────────┐    │
│  │  /dids   │   │    /issue    │   │       /verify        │    │
│  │  DID Mgr │   │  VC Issuer  │   │  Proof Verification  │    │
│  └────┬─────┘   └──────┬───────┘   └──────────┬───────────┘    │
│       │                │                       │                │
│       └────────────────┼───────────────────────┘                │
│                        │                                        │
│              lib/identus.ts  (Axios REST client)                │
│              hooks/useDIDs · useCredentials · usePresentations  │
└────────────────────────┼────────────────────────────────────────┘
                         │ REST  (apikey header)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Identus Cloud Agent  :8085                     │
│                                                                 │
│  /cloud-agent/v1/did-registrar/dids                           │
│  /cloud-agent/v1/issue-credentials/credential-offers           │
│  /cloud-agent/v1/present-proof/presentations                    │
└───────┬──────────────────────────┬──────────────────────────────┘
        │ gRPC :50053               │ Secret KV
        ▼                           ▼
┌───────────────┐          ┌────────────────┐
│  PRISM Node   │          │  Vault :8200   │
│  (Cardano)    │          │  (key storage) │
└───────┬───────┘          └────────────────┘
        │
        ▼
┌───────────────┐
│  PostgreSQL   │
│  :5432        │
└───────────────┘
```

### DID → Issue → Present (in plain English)

**1. DID creation**  
The Cloud Agent generates a secp256k1 key pair, derives a PRISM DID from the public key, and stores the private key in Vault. The DID exists locally as a *long-form* DID immediately. Publishing it submits an anchoring transaction to the Cardano blockchain so anyone can resolve it.

**2. Credential issuance**  
The issuer selects one of its managed DIDs and a subject DID (the holder). It builds a credential payload — `credentialSubject` fields plus metadata — and asks the Cloud Agent to sign it as a JWT using the assertion key. The agent wraps this in a DIDComm `issue-credential` offer. When `automaticIssuance: true` the credential is signed and delivered without a manual approval step.

**3. Presentation & verification**  
The verifier creates a *proof request* that includes a cryptographic challenge (nonce) and a domain. The holder receives the request, wraps their credential in a *Verifiable Presentation* signed with their authentication key, and sends it back. The Cloud Agent verifies the signature, checks the nonce matches, confirms the credential has not expired, and marks the presentation record `PresentationVerified` or `PresentationFailed`.

---

## Quick start

### Prerequisites

| Tool | Version |
|------|---------|
| Docker + Compose | 24+ |
| Node.js | 20+ |
| npm | 10+ |

### 1 — Clone & install

```bash
git clone https://github.com/codewithayuu/did-vault.git
cd did-vault
npm install
```

### 2 — Configure environment

```bash
cp .env.example .env
```

The defaults work out of the box with the Docker stack below.  
Change `AGENT_API_KEY` / `NEXT_PUBLIC_AGENT_API_KEY` if you harden the agent.

### 3 — Start the Identus Cloud Agent

```bash
docker compose up -d
```

This starts four services:

| Container | Port | Purpose |
|-----------|------|---------|
| `db` | 5432 | PostgreSQL — agent + keycloak databases |
| `vault` | 8200 | HashiCorp Vault — DID key storage |
| `prism-node` | 50053 | PRISM Node — Cardano anchoring |
| `cloud-agent` | 8085 / 8090 | Identus REST API + DIDComm endpoint |

Wait ~30 s for the agent to initialise, then verify:

```bash
curl -s http://localhost:8085/cloud-agent/v1/_system/health \
     -H "apikey: changeme" | jq
# → { "version": "1.37.0" }
```

### 4 — Run the CLI smoke test (optional)

```bash
npm run create-did
```

Expected output:

```
=== DID Vault — Phase 1 CLI ===

Checking agent health... OK — {"version":"1.37.0"}
Creating DID... Done
  Long-form DID : did:prism:abc123…:<long-suffix>
  Operation ID  : <uuid>

Managed DIDs (1 total):
  [1] did:prism:abc123…  status=CREATED
```

### 5 — Start the Next.js app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Screen guide

### DID Manager `/dids` 

- **New DID** → opens modal, calls `POST /did-registrar/dids`, shows long-form DID in toast
- **Resolve** → calls `GET /dids/:did`, renders verification methods, service endpoints, and raw JSON in the right panel
- **Publish** → calls `POST /did-registrar/dids/:did/publications`, submits anchoring transaction; status badge transitions `CREATED → PUBLICATION_PENDING → PUBLISHED` 

### Issue Credential `/issue` 

- Select issuer DID from dropdown (any status)
- Select or manually enter subject DID
- Pick a preset claim schema (Identity / Education / Employment / Membership) or build custom claims
- Choose validity period
- **Issue Credential** → calls `POST /issue-credentials/credential-offers`; new record appears immediately and polls every 4 s until `CredentialSent` 
- Expand any record to view the decoded JWT (header · payload · claims) or the raw token

### Verify Credential `/verify` 

- Fill challenge (auto-generated nonce) and domain
- Optionally bind to a DIDComm connection ID
- **Send Proof Request** → calls `POST /present-proof/presentations`; record polls every 3.5 s
- Expand a record to see the full verification result: VERIFIED / FAILED / PENDING with per-check breakdown
- Filter tabs: ALL · PENDING · VERIFIED · FAILED with live counts
- Stats bar shows aggregate totals

---

## Project structure

```
did-vault/
├── app/
│   ├── layout.tsx          shell (Sidebar + TopBar + AgentBanner)
│   ├── page.tsx            landing / nav dashboard
│   ├── error.tsx           Next.js error boundary page
│   ├── not-found.tsx       404 page
│   ├── loading.tsx         route-level skeleton
│   ├── dids/page.tsx       DID management screen
│   ├── issue/page.tsx      credential issuance screen
│   └── verify/page.tsx     presentation + verification screen
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── AgentBanner.tsx
│   │   └── AgentBannerWrapper.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── dids/
│   │   ├── CreateDIDModal.tsx
│   │   ├── DIDCard.tsx
│   │   ├── DIDDocumentPanel.tsx
│   │   └── DIDTable.tsx
│   ├── credentials/
│   │   ├── ClaimBuilder.tsx
│   │   ├── CredentialCard.tsx
│   │   ├── CredentialRawPanel.tsx
│   │   ├── DIDSelector.tsx
│   │   └── IssueCredentialForm.tsx
│   └── verify/
│       ├── PresentationCard.tsx
│       ├── PresentationTimeline.tsx
│       ├── ProofRequestForm.tsx
│       └── VerificationResult.tsx
├── hooks/
│   ├── useAgentHealth.ts
│   ├── useCredentials.ts
│   ├── useDIDs.ts
│   ├── usePresentations.ts
│   └── useToast.ts
├── lib/
│   ├── identus.ts          REST client (retry, timeout, interceptors)
│   ├── jwt.ts              JWT decode + VC claim extraction
│   └── verification.ts     status derivation + result builder
├── types/
│   └── index.ts
├── scripts/
│   └── create-did.ts       Phase 1 CLI smoke test
├── docker-compose.yml
├── .env.example
├── next.config.js
├── tsconfig.json
└── tsconfig.scripts.json
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_AGENT_BASE_URL` | `http://localhost:8085` | Cloud Agent base URL |
| `NEXT_PUBLIC_AGENT_API_KEY` | `changeme` | Agent API key |
| `AGENT_BASE_URL` | `http://localhost:8085` | Server-side agent URL |
| `AGENT_API_KEY` | `changeme` | Server-side API key |

---

## Stopping the stack

```bash
docker compose down          # stop containers, keep volumes
docker compose down -v       # stop and delete all data
```

---

## Key dependencies

| Package | Role |
|---------|------|
| `next` 14 | App framework / routing |
| `react` 18 | UI rendering |
| `axios` | HTTP client with interceptors |

---

## References

- [Hyperledger Identus Cloud Agent docs](https://docs.atalaprism.io)
- [Identus Edge Agent SDK (TypeScript)](https://github.com/hyperledger/identus-edge-agent-sdk-ts)
- [W3C DID Core spec](https://www.w3.org/TR/did-core/)
- [W3C VC Data Model](https://www.w3.org/TR/vc-data-model/)
- [PRISM DID Method spec](https://github.com/input-output-hk/prism-did-method-spec)
