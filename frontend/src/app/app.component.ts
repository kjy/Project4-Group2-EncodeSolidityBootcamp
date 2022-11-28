import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json'
import ballotJson from '../assets/Ballot.json'

export class requestTokensDTO {
    constructor(public address: string, public amount: string) { }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    // wallet object
    wallet: ethers.Wallet | undefined;

    // provider object connecting to goerli
    provider: ethers.providers.Provider;

    // token contract object
    tokenContract: ethers.Contract | undefined;

    // ballot contract object
    ballotContract: ethers.Contract | undefined;


    ethBalance: number | string | undefined;
    tokenBalance: number | string | undefined;
    votePower: number | string | undefined;

    ballotVotePower: number | string | undefined;
    ballotWinningProposal: number | string | undefined;
    ballotWinnerName: string | undefined;

    backendUrl: string | undefined;
    tokenContractAddress: string | undefined;
    ballotContractAddress: string | undefined;

    tokenRequestPending: boolean;
    errorMsg: string | undefined;

    historicalData: any | undefined;
    k_historicalData: string[] | undefined;

    constructor(private http: HttpClient) {
        // set the provider object
        this.provider = ethers.getDefaultProvider('goerli');

        this.backendUrl = "http://localhost:3000"
        this.http.get<any>(`${this.backendUrl}/get-token-contract-address`).subscribe((ans) => {
            this.tokenContractAddress = ans.result;
        })

        // this.http.get<any>(`${this.backendUrl}/get-ballot-contract-address`).subscribe((ans) => {
        //   this.ballotContractAddress = ans.result;
        // })

        this.tokenRequestPending = false;
    }

    setTokenContract() {
        if (this.tokenContractAddress) {
            this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJson.abi, this.wallet);
        }
    }

    connectBallotContract(address: string) {
        this.ballotContractAddress = address;
        this.ballotContract = new ethers.Contract(this.ballotContractAddress, ballotJson.abi, this.wallet);

        this.getHistoricalData();
        this.updateValues();
    }

    createWallet() {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        if (this.tokenContractAddress) {
            this.setTokenContract();
            this.updateValues();
        }
    }

    updateValues() {
        [this.ethBalance, this.tokenBalance, this.votePower] = [
            'loading...',
            'loading...',
            'loading...'
        ];

        [this.ballotVotePower, this.ballotWinningProposal, this.ballotWinnerName] = [
            'loading...',
            'loading...',
            'loading...'
        ];

        this.wallet?.getBalance().then((balance) => {
            this.ethBalance = parseFloat(ethers.utils.formatEther(balance));
            if (this.tokenContract) {
                this.tokenContract['balanceOf'](this.wallet?.address).then(
                    (balanceBN: ethers.BigNumberish) => {
                        this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
                    }
                );
                this.tokenContract['getVotes'](this.wallet?.address).then(
                    (votePowerBN: ethers.BigNumberish) => {
                        this.votePower = parseFloat(ethers.utils.formatEther(votePowerBN));
                    }
                );
            }
            if (this.ballotContract) {
                this.ballotContract['votePower'](this.wallet?.address).then(
                    (ballotVotePowerBN: ethers.BigNumberish) => {
                        this.ballotVotePower = parseFloat(ethers.utils.formatEther(ballotVotePowerBN));
                    }
                );
                this.ballotContract['winningProposal']().then(
                    (ballotWinningProposal: number) => {
                        this.ballotWinningProposal = ballotWinningProposal;
                    }
                );
                this.ballotContract['winnerName']().then(
                    (ballotWinnerName: string) => {
                        // convert ballotWinnerName to string
                        this.ballotWinnerName = ethers.utils.parseBytes32String(ballotWinnerName);
                    }
                );
            }
        });
    }

    importWallet(secret: string, importMethod: string) {
        if (importMethod == 'mnemonic') {
            this.wallet = ethers.Wallet.fromMnemonic(secret ?? "").connect(this.provider);
        } else {
            this.wallet = new ethers.Wallet(secret ?? "").connect(this.provider);
        }
        if (this.wallet.address.length == 42) {
            this.setTokenContract();
            this.updateValues();
        } else {
            this.errorMsg = 'Could not import wallet, invalid mnumonic or private key';
            console.log(this.errorMsg);
            alert(this.errorMsg);
        }
    }


    requestTokensTen() {
        // TODO: request 10 tokens to be minted in the backend
        this.tokenRequestPending = true;

        const body = new requestTokensDTO(this.wallet?.address ?? "", "10");
        this.http.post<any>(`${this.backendUrl}/request-tokens`, body).subscribe(async (ans) => {
            const txHash = ans.result;
            console.log({ ans });
            let status: number | undefined;
            while (!status) {
                status = await this.getTransactionStatus(txHash);
            }
            this.updateValues();
        })
    }

    delegateTokens(to: string) {
        console.log(`you are delegating tokens to ${to}`);
        if (this.tokenContract) {
            console.log('there is a contract and you are inside the if about to delegate');
            this.tokenContract['delegate'](to).then(this.updateValues());
            console.log('you are done with delegating');
        }
    }

    transferTokens(to: string, amount: number | string) {
        console.log(`you are delegating ${amount} tokens to ${to}`);
        if (this.tokenContract) {
            console.log('there is a contract and you are inside the if about to delegate');
            this.tokenContract['transfer'](to).then(this.updateValues());
            console.log('you are done with delegating');
        }
    }

    vote(proposal: number | string, amount: number | string) {
        console.log(`you are using ballot contract ${this.ballotContractAddress} and ${amount} vote power to vote towards proposal ${proposal}`);
        if (this.ballotContract) {
            console.log(`there is a ballot contract of address ${this.ballotContract.address} and you are inside the if about to vote`);
            this.ballotContract['vote'](proposal, amount).then(this.updateValues());
            console.log('you are done with voting');
        }
    }

    connectWallet() {
    }

    disconnectWallet() {
        this.wallet = undefined;
    }

    getHistoricalData() {
        //todo get data from backend
        this.historicalData = [
            {
                "a": 1,
                "b": 2
            },
            {
                "a": 3,
                "b": 4
            }
        ]
        this.k_historicalData = Object.keys(this.historicalData[0]);
    }

    async getTransaction(hash: string) {
        const tx = await this.provider.getTransaction(hash)
        return await tx.wait();
    }

    async getTransactionStatus(hash: string) {
        const resp = await this.getTransaction(hash);
        return resp.status;
    }
}
