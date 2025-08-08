interface PagosPendientesInterface {
    id:number;
    nombre: String;
    monto:number;
    descripcion: String;
    tipo: String;
    meses: number;
    fechaVencimiento: Date;
    idUsuario: number;
    estado: String;
    totalPagoPorMes: number;
    mesesPagados:number
}