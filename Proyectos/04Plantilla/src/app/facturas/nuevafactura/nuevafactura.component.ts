import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { IFactura } from 'src/app/Interfaces/factura';
import { ICliente } from 'src/app/Interfaces/icliente';
import { ClientesService } from 'src/app/Services/clientes.service';
import { FacturaService } from 'src/app/Services/factura.service';

@Component({
  selector: 'app-nuevafactura',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './nuevafactura.component.html',
  styleUrls: ['./nuevafactura.component.scss'] // Corregido styleUrl a styleUrls
})
export class NuevafacturaComponent implements OnInit {
  // Variables o constantes
  titulo = 'Nueva Factura';
  idFactura: number = 0; // Cambiado a tipo number
  listaClientes: ICliente[] = [];
  listaClientesFiltrada: ICliente[] = [];
  totalapagar: number = 0;
  // FormGroup
  frm_factura: FormGroup;

  constructor(
    private clientesServicios: ClientesService,
    private facturaService: FacturaService,
    private navegacion: Router,
    private ruta: ActivatedRoute // Inyección del servicio ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idFactura = parseInt(this.ruta.snapshot.paramMap.get('id') || '0'); // Manejo de caso cuando 'id' es null

    this.frm_factura = new FormGroup({
      Fecha: new FormControl('', Validators.required),
      Sub_total: new FormControl('', Validators.required),
      Sub_total_iva: new FormControl('', Validators.required),
      Valor_IVA: new FormControl('0.15', Validators.required),
      Clientes_idClientes: new FormControl('', Validators.required)
    });

    this.clientesServicios.todos().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.listaClientesFiltrada = data;
      },
      error: (e) => {
        console.log(e);
      }
    });


    
    if (this.idFactura > 0) {
      this.facturaService.uno(this.idFactura).subscribe((factura) => {
        //12
        let fecha = new Date(factura.Fecha).toISOString().split('T')[0];
        //12
        this.frm_factura.patchValue({
          //Fecha: factura.Fecha,
          Fecha: fecha,
          Sub_total: factura.Sub_total,
          Sub_total_iva: factura.Sub_total_iva,
          //10
          //Valor_IVA: factura.Valor_IVA,
          //11
          Clientes_idClientes: factura.Clientes_idClientes
        });
        this.titulo = 'Actualizar Factura';
      });
    }
  }

  limpiarcaja() {
    alert('Limpiar Caja');
  }

  grabar() {
    let factura: IFactura = {
      Fecha: this.frm_factura.get('Fecha')?.value,
      Sub_total: this.frm_factura.get('Sub_total')?.value,
      Sub_total_iva: this.frm_factura.get('Sub_total_iva')?.value,
      Valor_IVA: this.frm_factura.get('Valor_IVA')?.value,
      Clientes_idClientes: this.frm_factura.get('Clientes_idClientes')?.value
    };

    if (this.idFactura == 0 || isNaN(this.idFactura)) {
      this.facturaService.insertar(factura).subscribe((respuesta) => {
        if (parseInt(respuesta) > 0) {
          alert('Factura grabada');
          this.navegacion.navigate(['/facturas']);
        }
      });
    } else {
      factura.idFactura = this.idFactura; // Corrección aquí
      this.facturaService.actualizar(factura).subscribe((respuesta) => {
        if (parseInt(respuesta) > 0) {
          this.idFactura = 0;
          alert('Actualizado con éxito');
          this.navegacion.navigate(['/facturas']);
        } else {
          alert('Error al actualizar');
        }
      });
    }
  }

  calculos() {
    let sub_total = parseFloat(this.frm_factura.get('Sub_total')?.value || '0');
    let iva = parseFloat(this.frm_factura.get('Valor_IVA')?.value || '0');
    let sub_total_iva = sub_total * iva;
    this.frm_factura.get('Sub_total_iva')?.setValue(sub_total_iva.toFixed(2)); // Manejo de decimales
    this.totalapagar = sub_total + sub_total_iva;
  }

  cambio(event: any) { // Corrección del tipo de evento
    let idCliente = event.target.value;
    this.frm_factura.get('Clientes_idClientes')?.setValue(idCliente);
  }
}
