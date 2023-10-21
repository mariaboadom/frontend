import { Component } from '@angular/core';
import { Router  } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {

  constructor(private router: Router,private location: Location) {}

  inicio(){
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    // Llamar a replaceState para reemplazar la entrada actual en el historial
    window.history.pushState(null, '', '/error');
    window.onpopstate = function () {
      window.history.pushState(null, '', '/error');
    };  
  }
}
