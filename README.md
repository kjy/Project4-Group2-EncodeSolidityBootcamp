
### Environment Setup

Node: v16

Angular: v14.2.10

Clone the repo and install dependencies:

``` bash
git clone https://github.com/arawal/Project4-Group2-EncodeSolidityBootcamp
cd backend
yarn config set nodeLinker node-modules
yarn install
cd ../frontend
yarn config set nodeLinker node-modules
yarn install
```

## Frontend Requirements

**Signing In**

1. User is able to connect to a wallet through various methods
    1. User is able to create a wallet
    2. User is able to import their wallet mnemonic
    3. Optional — User is able to sign in through metamask

**Dashboard View - *wallet connected***

1. User is able to view their info relevant to the TokenizedBallot and ERC20Votes contracts
    1. Users native token account balance
    2. Users MyToken account balance
    3. Users voting power
2. User is able to request new tokens via the API
    1. Displays a button users can click to request 100 MyTokens to their address
        1. Optional — user is limited to one API request
3. User is able to delegate votes to themselves
    1. Displays a button users can click to delegate votes to themselves
4. Optional — User is able to view general info of the TokenizedBallot and ERC20Votes contracts
    1. Displays a list of vote transactions sorted by most recent
        1. Voters address
        2. Proposal name
        3. Tx timestamp
        4. Tx hash

## Backend Requirements
*to be edited with named functions*

GET

- the token address of the ERC20Votes smart contract
- the token address of the TokenizedBallots smart contract
- the voting power for a given address
- the token balance of a given address
- the results of the TokenizedBallot smart contract

POST

- request to mint 100 MyTokens to the given users address — fired upon triggering the Request Tokens button
- request to delegate voting power to a specified address
- request for a user to vote on a given proposal