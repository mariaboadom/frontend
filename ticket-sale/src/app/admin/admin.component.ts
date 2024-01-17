import { Component , OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  apiURL= 'http://44.212.115.191:4000/hola/admin';
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
  navigateToModify(concertId: string) {
    // Redirige a la página de venta de entradas y pasa el ID del concierto como parámetro
    this.router.navigate(['/venta-entradas'], { queryParams: { concertId: concertId } });
  }

  async updateEvent(name:any) {
 

    //mandamos los datos al backend para que los mande a la cola 
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    var jdata = {"data":name}
    
    await this.http.post<String>(this.apiURL+'admin', jdata, httpOptions).subscribe(
      (res: any) => {
        window.alert(res.a);
      },
      (error) => {
        console.error(error);        
      }
    );
  }
}
