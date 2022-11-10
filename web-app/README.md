Architecture

Components:
- web-app
  Areas:
  - Enabler form
  - Job referral form
  - Candidate CV form

- smart-contract
  Methods:
  - jobCreate( fromAddress) { enablerAddress guard }
      returns jobTransactionHash (will be our job id)
      notes: amount is locked inside SC and prompted at the transaction approval time.
  - jobRefer(jobTransactionHash, fromAddress, candidateAddress)
  - jobFinalize(jobTransactionHash, candidateAddress, refererAddress) { enablerAddress guard }
        notes: 

Goerli Smart Contracts:
- Recruitment: 0xDFfA6230381bc0280d3a585Cc33e0e3B9D87b55C
- EnsSubdomainFactory: 0x2dD32Ca2726cc86ba40625c2D6B7452CE5808dCa

