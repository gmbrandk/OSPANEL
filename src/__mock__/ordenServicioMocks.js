export async function mockGetOrdenServicioById(id) {
  // Simulamos un delay como si viniera del backend real
  await new Promise((res) => setTimeout(res, 600));

  return {
    success: true,
    data: {
      // _id: id,

      // 🔥 El provider espera IDs planos, NO objetos
      representanteId: '690d6f117be85ef8af7b79ce',
      equipoId: '686beee0f64be7dc40967003',
      tecnico: '681b7387d36a6b2557080ca8',

      // 🔥 El provider espera tipoTrabajo como ID, no objeto
      lineasServicio: [
        {
          tipoTrabajo: '68dc9ac76162927555649baa',
          descripcion: 'Instalación de sistema operativo y programas básicos',
          precioUnitario: 40,
          cantidad: 1,
        },
        {
          tipoTrabajo: '68e335329e1eff2fcb38b733',
          descripcion: 'Reemplazo completo de pantalla LCD',
          precioUnitario: 260,
          cantidad: 1,
        },
      ],

      diagnosticoCliente:
        'Cliente indica que la laptop dejó de encender después de una caída.',
      observaciones: 'Equipo con carcasa rota en la esquina superior derecha.',
      fechaIngreso: '2025-11-13T01:58:57.745Z',
      total: 300,
    },
  };
}
