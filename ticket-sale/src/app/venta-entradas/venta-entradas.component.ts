import { Component } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-venta-entradas',
  templateUrl: './venta-entradas.component.html',
  styleUrls: ['./venta-entradas.component.css']
})
export class VentaEntradasComponent {
  apiURL= 'http://44.212.115.191:4000/hola/';
  selectedPaymentMethod = ""; // Propiedad para almacenar el método de pago seleccionado
  selectedEvent =""

  constructor(private router: Router, private http: HttpClient,private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.queryParams.subscribe((params:any)=> {
      // params es un objeto que contiene todos los parámetros de consulta
      this.selectedEvent = params['concertId']; // Reemplaza 'parametro' con el nombre de tu parámetro de consulta
      console.log('Valor del parámetro:', this.selectedEvent);
    });
  }
  
    
  changeMethod(payment:any){    
    this.selectedPaymentMethod = payment
    console.log(this.selectedPaymentMethod);
  }

   // Función para convertir datos codificados en base64 en ArrayBuffer
   base64ToArrayBuffer(base64:any) {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  async redirectToThankYouPage(name:any, numberTickets:any,payment:any, email:any) {
    // Obtener el valor del método de pago seleccionado
    this.selectedPaymentMethod = payment; // Asegúrate de tener una propiedad 'payment' en tu componente para almacenar el método de pago seleccionado.

    // Asigna el método de pago seleccionado a la propiedad
    this.selectedPaymentMethod = this.selectedPaymentMethod;

    //mandamos los datos al backend para que los mande a la cola 
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    var data = this.selectedEvent+";"+name + ";" + numberTickets + ";"+email
    var jdata = {"data":data}
    
    await this.http.post<String>(this.apiURL, jdata, httpOptions).subscribe(
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
        this.router.navigate(['/error']);
      }
    );
  }

}

