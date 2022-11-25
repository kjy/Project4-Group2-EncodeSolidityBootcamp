import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  backendUrl: string | undefined;
  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;

  constructor(private http: HttpClient) {
    this.backendUrl = "http://localhost:3000"
    this.http.get<any>(`${this.backendUrl}/get-token-contract-address`).subscribe((ans) => {
      this.tokenContractAddress = ans.result;
    })
  }

  connectBallotContract(address: string) {
    this.ballotContractAddress = address;
  }
}
