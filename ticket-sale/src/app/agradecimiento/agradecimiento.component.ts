import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agradecimiento',
  templateUrl: './agradecimiento.component.html',
  styleUrls: ['./agradecimiento.component.css']
})
export class AgradecimientoComponent implements OnInit {
  pdfURL: string ="";
  id_compra: string =""

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.pdfURL = params['pdfURL'];
      this.id_compra = params["id_compra"]

    });
  }
}