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
  apiURL= 'http://44.212.115.191:4000/hola/';
  conciertos:any = []

  constructor(private router: Router, private http: HttpClient) {}
  
  base64ToArrayBuffer(base64:any) {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  ngOnInit(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.http.get<[]>(this.apiURL+"getEvents", httpOptions).subscribe(
      (res: any) => {
        //console.log(res)
        //bucle para recorrerlos
        for(var i = 0 ; i< res.length;i++){
          var state = res[i]["EventState"]["S"]
          if(state!= "Cancelled")
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

  navigateToAdmin(){
      // Redirige a la página de venta de entradas y pasa el ID del concierto como parámetro
      this.router.navigate(['/admin'], { queryParams: {} });
  }

  login(idCompra:any){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const jdata = {"data":idCompra}
    
    this.http.post<String>(this.apiURL+"getMyTicket", jdata, httpOptions).subscribe(
      (res: any) => {
        console.log(res)

        const pdfBlob = res.pdf;
        const pdfBuffer = this.base64ToArrayBuffer(pdfBlob);
        const filename = res.title;
        const id_compra = res.idCompra;


        const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        this.router.navigate(['/agradecimiento'], { queryParams: { pdfURL: url, id_compra: id_compra} });
      },
      (error) => {
        console.error(error);        
      }
    );

  }
}

