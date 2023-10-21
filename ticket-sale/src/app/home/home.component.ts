import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Json } from 'aws-sdk/clients/robomaker';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  apiURL= 'http://localhost:4000/hola/';
  conciertos:any = []

  constructor(private router: Router, private http: HttpClient) {}


  ngOnInit(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.http.get<[]>(this.apiURL+"getEvents", httpOptions).subscribe(
      (res: any) => {
        //console.log(res)
        //bucle para recorrerlos
        for(var i = 0 ; i< res.length;i++){
          this.conciertos.push({"Nombre":res[i]["eventos"]["S"], "Lugar":res[i]["Lugar"]["S"], "Fecha":res[i]["Fecha"]["S"], "URLImage":res[i]["URLImage"]["S"]})
        }
      },
      (error) => {
        console.error(error);        
      }
    );

    console.log(this.conciertos)
  }

  navigateToVentaEntradas(concertId: string) {
    // Redirige a la página de venta de entradas y pasa el ID del concierto como parámetro
    this.router.navigate(['/venta-entradas'], { queryParams: { concertId: concertId } });
  }
}

