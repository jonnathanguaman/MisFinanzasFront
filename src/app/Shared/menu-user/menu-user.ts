import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login/login';

@Component({
  selector: 'app-menu-user',
  standalone: false,
  templateUrl: './menu-user.html',
  styleUrls: ['./menu-user.css']
})
export class MenuUser implements OnInit {
  

  ngOnInit() {
    console.log("MenuUser component initialized");
  }

  constructor(private loginService:LoginService) {}


  logout() {
    this.loginService.logOut();
  }
}
