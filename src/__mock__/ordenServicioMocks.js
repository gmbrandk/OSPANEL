export async function mockGetOrdenServicioById(id) {
  // Simulamos un delay como si viniera del backend
  await new Promise((res) => setTimeout(res, 600));

  return {
    success: true,
    data: {
      _id: id,
      representante: {
        _id: '690d6f117be85ef8af7b79ce',
        dni: '12345678',
        nombres: 'Juan',
        apellidos: 'Pérez García',
        email: 'juan.perez@example.com',
        telefono: '+51 987654321',
        direccion: 'Av. Los Olivos 345, Lima',
      },
      equipo: {
        _id: '690d75a97be85ef8af7b7a0b',
        tipo: 'Laptop',
        marca: 'HP',
        modelo: 'Pavilion 15',
        nroSerie: 'HP12345LAP',
      },
      tecnico: {
        _id: '6811a47aebf66546dbed5910',
        nombres: 'Carlos',
        apellidos: 'Ramírez',
        email: 'c.ramirez@empresa.com',
        telefono: '+51 912345678',
      },
      lineasServicio: [
        {
          tipoTrabajo: {
            _id: '68dc9ac76162927555649baa',
            nombre: 'Instalacion de sistema windows 11',
          },
          descripcion: 'Instalación de sistema operativo y programas básicos',
          precioUnitario: 40,
          cantidad: 1,
        },
        {
          tipoTrabajo: {
            _id: '68e335329e1eff2fcb38b733',
            nombre: 'Cambio de pantalla',
          },
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
