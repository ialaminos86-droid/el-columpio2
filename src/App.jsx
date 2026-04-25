import React, { useMemo, useState } from 'react';


const FORM_CONFIG = {
  googleFormAction:
    'https://docs.google.com/forms/d/e/1FAIpQLSdqxK4BQ3N90nsHHWw4GLQHf8nl9FKOVtxNbpHkeSB3OG5nZA/formResponse',
  fields: {
    nombreNino: 'entry.1632689659',
    edad: 'entry.1212973234',
    hermanosTexto: 'entry.367621578',
    propietario: 'entry.1387418677',
    direccionPropietario: 'entry.1599358046',
    sede: 'entry.1104574246',
    semanasTexto: 'entry.1069191589',
    diasSueltosTexto: 'entry.902508500',
    serviciosExtras: 'entry.981458518',
    padreMadre: 'entry.1381846823',
    telefono: 'entry.2012682352',
    segundoContacto: 'entry.188456918',
    telefono2: 'entry.2008672987',
    observaciones: 'entry.2062134869',
  },
};

function calcularPrecioSemanas(semanas, tipo) {
  if (semanas <= 0) return 0;

  const precioPrimerasTres = tipo === 'socio' ? 60 : 70;
  const precioCuartaYQuinta = tipo === 'socio' ? 55 : 65;
  const precioSextaEnAdelante = tipo === 'socio' ? 50 : 60;

  let total = 0;

  const semanasPrimerTramo = Math.min(semanas, 3);
  total += semanasPrimerTramo * precioPrimerasTres;

  if (semanas > 3) {
    const semanasSegundoTramo = Math.min(semanas - 3, 2);
    total += semanasSegundoTramo * precioCuartaYQuinta;
  }

  if (semanas > 5) {
    const semanasTercerTramo = semanas - 5;
    total += semanasTercerTramo * precioSextaEnAdelante;
  }

  return total;
}

function calcularPrecioEstimado({
  tipoCliente,
  numSemanas,
  diasSueltos,
  serviciosSeleccionados,
  matricula,
}) {
  const precioDiaSuelto = tipoCliente === 'socio' ? 15 : 18;
  const precioMatricula = matricula ? 12 : 0;
  const precioSemanasTotal = calcularPrecioSemanas(numSemanas, tipoCliente);
  const precioDiasSueltosTotal = diasSueltos * precioDiaSuelto;

  // Los extras se aplican a todos los días contratados.
  // Cada semana completa se considera de lunes a viernes: 5 días.
  const diasTotales = numSemanas * 5 + diasSueltos;
  const tieneMatinal = serviciosSeleccionados.includes('Aula matinal: 8:00 a 9:00');
  const tieneComedor = serviciosSeleccionados.includes('Comedor');
  const tienePostcampus = serviciosSeleccionados.includes('Postcampus');

  const precioMatinalTotal = tieneMatinal ? diasTotales * 3 : 0;
  const precioComedorTotal = tieneComedor ? diasTotales * 7.5 : 0;

  // Si hay comedor, el postcampus ya está incluido en los 7,5€/día.
  // Solo se cobra postcampus aparte cuando NO hay comedor.
  const precioPostcampusTotal = tienePostcampus && !tieneComedor ? diasTotales * 3 : 0;

  const precioEstimado =
    precioMatricula +
    precioSemanasTotal +
    precioDiasSueltosTotal +
    precioMatinalTotal +
    precioPostcampusTotal +
    precioComedorTotal;

  return {
    precioDiaSuelto,
    precioMatricula,
    precioSemanasTotal,
    precioDiasSueltosTotal,
    precioMatinalTotal,
    precioPostcampusTotal,
    precioComedorTotal,
    precioEstimado,
    diasTotales,
  };
}

function formatearEuros(valor) {
  return `${valor.toFixed(2).replace('.', ',')} €`;
}

const testCases = [
  { input: [1, 'socio'], expected: 60 },
  { input: [3, 'socio'], expected: 180 },
  { input: [4, 'socio'], expected: 235 },
  { input: [5, 'socio'], expected: 290 },
  { input: [6, 'socio'], expected: 340 },
  { input: [1, 'noSocio'], expected: 70 },
  { input: [3, 'noSocio'], expected: 210 },
  { input: [4, 'noSocio'], expected: 275 },
  { input: [5, 'noSocio'], expected: 340 },
  { input: [6, 'noSocio'], expected: 400 },
  { input: [0, 'socio'], expected: 0 },
];

if (typeof console !== 'undefined') {
  testCases.forEach(({ input, expected }) => {
    const actual = calcularPrecioSemanas(Number(input[0]), input[1]);
    console.assert(actual === expected, 'Error en calcularPrecioSemanas');
  });
}

export default function App() {
  const semanas = [
    '1º Semana Campus: Junio 22 al 26. Super héroes',
    '2º Semana Campus: Junio 29 a Julio 3. Ciencia',
    '3º Semana Campus: Julio 6 al 10. Olimpiadas',
    '4º Semana Campus: Julio 13 al 17. Circo',
    '5º Semana Campus: Julio 20 al 24. Aventureros',
    '6º Semana Campus: Julio 27 al 31. Carnaval',
    '7º Semana Campus: Agosto 3 al 7. Indios y Vaqueros',
    '8º Semana Campus: Agosto 10 al 14. Cartoons',
    '9º Semana Campus: Agosto 17 al 21. Piratas',
    '10º Semana Campus: Agosto 24 al 28. Profesiones',
    '11º Semana Campus: Agosto 31 a Septiembre 4. Vuelta al cole',
  ];

  const [tipoCliente, setTipoCliente] = useState('socio');
  const [numSemanas, setNumSemanas] = useState(1);
  const [diasSueltos, setDiasSueltos] = useState(0);
    const [matricula, setMatricula] = useState(true);

  const [nombreNino, setNombreNino] = useState('');
  const [edad, setEdad] = useState('');
  const [hermanosTexto, setHermanosTexto] = useState('');
  const [propietario, setPropietario] = useState('No');
  const [direccionPropietario, setDireccionPropietario] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('El Carmen');
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [diasSueltosTexto, setDiasSueltosTexto] = useState('');
  const [padreMadre, setPadreMadre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [segundoContacto, setSegundoContacto] = useState('');
  const [telefono2, setTelefono2] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [errores, setErrores] = useState({});
  const [estadoEnvio, setEstadoEnvio] = useState('idle');
  const [mensajeEnvio, setMensajeEnvio] = useState('');

  const resumen = useMemo(
    () =>
      calcularPrecioEstimado({
        tipoCliente,
        numSemanas,
        diasSueltos,
        serviciosSeleccionados,
        matricula,
      }),
    [tipoCliente, numSemanas, diasSueltos, serviciosSeleccionados, matricula]
  );

  const semanasTextoFinal = semanasSeleccionadas.join(' | ');
  const serviciosTextoFinal = serviciosSeleccionados.join(' | ');

  const resumenPrecioTexto = useMemo(() => {
    return [
      `Tipo: ${tipoCliente === 'socio' ? 'Socio' : 'No socio'}`,
      `Semanas completas calculadora: ${numSemanas}`,
      `Semanas elegidas: ${semanasTextoFinal || 'Pendiente de indicar'}`,
      `Días sueltos especificados: ${diasSueltosTexto || 'No solicita días sueltos'}`,
      `Servicios extra: ${serviciosTextoFinal || 'Sin servicios extra'}`,
      `Días sueltos: ${diasSueltos}`,
      `Aula matinal: ${serviciosSeleccionados.includes('Aula matinal: 8:00 a 9:00') ? 'Sí' : 'No'}`,
      `Postcampus: ${serviciosSeleccionados.includes('Postcampus') ? 'Sí' : 'No'}`,
      `Comedor: ${serviciosSeleccionados.includes('Comedor') ? 'Sí' : 'No'}`,
      `Matrícula: ${matricula ? 'Sí' : 'No'}`,
      `Total estimado: ${formatearEuros(resumen.precioEstimado)}`,
    ].join(' | ');
  }, [tipoCliente, numSemanas, semanasTextoFinal, diasSueltosTexto, serviciosTextoFinal, diasSueltos, serviciosSeleccionados, matricula, resumen.precioEstimado]);

  function toggleSemana(semana) {
    setSemanasSeleccionadas((prev) => {
      const nuevas = prev.includes(semana)
        ? prev.filter((item) => item !== semana)
        : [...prev, semana];
      setNumSemanas(nuevas.length || 0);
      return nuevas;
    });
  }

  function toggleServicio(servicio) {
    setServiciosSeleccionados((prev) =>
      prev.includes(servicio)
        ? prev.filter((item) => item !== servicio)
        : [...prev, servicio]
    );
  }

  function validarFormulario() {
    const nuevosErrores = {};
    if (!nombreNino.trim()) nuevosErrores.nombreNino = 'Introduce el nombre del niño o niña.';
    if (!edad.trim()) nuevosErrores.edad = 'Indica la edad.';
    if (!semanasTextoFinal.trim()) nuevosErrores.semanas = 'Selecciona al menos una semana.';
    if (propietario === 'Si' && !direccionPropietario.trim()) nuevosErrores.direccionPropietario = 'Indica la dirección y nombre del propietario.';
    if (!padreMadre.trim()) nuevosErrores.padreMadre = 'Indica el nombre del padre o madre.';
    if (!telefono.trim()) nuevosErrores.telefono = 'Indica un teléfono de contacto.';
    return nuevosErrores;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setEstadoEnvio('error');
      setMensajeEnvio('Revisa los campos marcados antes de enviar la inscripción.');
      return;
    }

    try {
      setEstadoEnvio('loading');
      setMensajeEnvio('Enviando inscripción...');

      const formData = new FormData();
      formData.append(FORM_CONFIG.fields.nombreNino, nombreNino);
      formData.append(FORM_CONFIG.fields.edad, edad);
      formData.append(FORM_CONFIG.fields.hermanosTexto, hermanosTexto || 'No indicado');
      formData.append(FORM_CONFIG.fields.propietario, propietario);
      formData.append(FORM_CONFIG.fields.direccionPropietario, direccionPropietario);
      formData.append(FORM_CONFIG.fields.sede, sedeSeleccionada);
      formData.append(FORM_CONFIG.fields.semanasTexto, semanasSeleccionadas.join(' | '));
      formData.append(FORM_CONFIG.fields.diasSueltosTexto, diasSueltosTexto || 'No solicita días sueltos');
      formData.append(FORM_CONFIG.fields.serviciosExtras, serviciosSeleccionados.join(' | ') || 'Sin servicios extra');
      formData.append(FORM_CONFIG.fields.padreMadre, padreMadre);
      formData.append(FORM_CONFIG.fields.telefono, telefono);
      formData.append(FORM_CONFIG.fields.segundoContacto, segundoContacto);
      formData.append(FORM_CONFIG.fields.telefono2, telefono2);
      formData.append(
        FORM_CONFIG.fields.observaciones,
        `${observaciones || 'Sin observaciones'}\n\nResumen web: ${resumenPrecioTexto}`
      );

      await fetch(FORM_CONFIG.googleFormAction, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setEstadoEnvio('success');
      setMensajeEnvio('Inscripción enviada correctamente. Revisa tu hoja de respuestas de Google Forms.');
      setNombreNino('');
      setEdad('');
      setHermanosTexto('');
      setPropietario('No');
      setDireccionPropietario('');
      setSedeSeleccionada('El Carmen');
      setSemanasSeleccionadas([]);
      setServiciosSeleccionados([]);
      setDiasSueltosTexto('');
      setPadreMadre('');
      setTelefono('');
      setSegundoContacto('');
      setTelefono2('');
      setObservaciones('');
      setErrores({});
    } catch (error) {
      setEstadoEnvio('error');
      setMensajeEnvio('No se pudo enviar la inscripción. Revisa la configuración del formulario.');
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="rounded-2xl bg-white p-6 shadow-lg">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <p className="text-lg font-extrabold tracking-tight">El Columpio Animación</p>
            <p className="text-sm text-slate-500">Campus de Verano 2026</p>
          </div>
          <a href="#inscripcion" >
            Inscribir ahora
          </a>
        </div>
      </header>

      <main>
        <section className="min-h-screen bg-white text-slate-800">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div>
              <span className="mb-4 inline-flex rounded-full border border-sky-200 bg-white px-4 py-1 text-sm font-semibold text-sky-700">
                Campus de verano 2026
              </span>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                Un verano para disfrutar, crecer y conciliar con tranquilidad.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Campus de Verano El Columpio en El Carmen y El Mirador de Santa Eufemia. Deportes, piscina, talleres, juegos y semanas temáticas.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#inscripcion" className="rounded-2xl bg-sky-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-sky-700">
                  Quiero inscribir a mi hijo
                </a>
                <a href="https://wa.me/34611503688" className="rounded-2xl border border-slate-300 px-6 py-4 text-center text-base font-bold text-slate-800 transition hover:bg-slate-50">
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Lo que más valoran las familias</p>
                <ul className="mt-5 space-y-4">
                  <li>+250 niños cada verano</li>
                  <li>Desde 2018 creciendo con familias del Aljarafe</li>
                  <li>Monitores con experiencia y trato cercano</li>
                  <li>Comunicación directa con madres y padres</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="min-h-screen bg-white text-slate-800">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">Actividades</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Una experiencia completa cada día.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {['Deportes y juegos grupales', 'Piscina y actividades acuáticas', 'Talleres creativos', 'Gymkhanas', 'Ciencia y teatro', 'Actividades adaptadas por edades'].map((actividad) => (
              <div key={actividad} className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900">{actividad}</h3>
                <p className="mt-2 text-slate-600">Actividades pensadas para que los niños disfruten, participen y se lleven un recuerdo positivo.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-screen bg-white text-slate-800">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">Tarifas y calculadora</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Calcula el precio orientativo.</h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo de inscripción</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => setTipoCliente('socio')} className={`rounded-2xl border px-4 py-3 text-left font-semibold ${tipoCliente === 'socio' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-300 bg-white'}`}>Socio</button>
                    <button type="button" onClick={() => setTipoCliente('noSocio')} className={`rounded-2xl border px-4 py-3 text-left font-semibold ${tipoCliente === 'noSocio' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-300 bg-white'}`}>No socio</button>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Semanas completas</label>
                    <input type="number" min="0" value={numSemanas} onChange={(e) => setNumSemanas(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Días sueltos</label>
                    <input type="number" min="0" value={diasSueltos} onChange={(e) => setDiasSueltos(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-sm font-semibold text-slate-700">Servicios extra para calcular</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {['Aula matinal: 8:00 a 9:00', 'Postcampus', 'Comedor'].map((servicio) => (
                      <label
                        key={servicio}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${serviciosSeleccionados.includes(servicio) ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-300 bg-white text-slate-700'}`}
                      >
                        <input
                          type="checkbox"
                          checked={serviciosSeleccionados.includes(servicio)}
                          onChange={() => toggleServicio(servicio)}
                        />
                        <span>{servicio}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Los extras se aplican a todos los días contratados. Si seleccionas comedor, el postcampus ya queda incluido y no se cobra aparte.
                  </p>
                </div>

                <label className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={matricula} onChange={(e) => setMatricula(e.target.checked)} />
                  Incluir matrícula de 12€
                </label>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Resumen estimado</p>
                <h3 className="mt-3 text-4xl font-black">{formatearEuros(resumen.precioEstimado)}</h3>
                <div className="mt-8 space-y-3 text-sm text-slate-300">
                  <p>Matrícula: {formatearEuros(resumen.precioMatricula)}</p>
                  <p>Semanas: {formatearEuros(resumen.precioSemanasTotal)}</p>
                  <p>Días sueltos: {formatearEuros(resumen.precioDiasSueltosTotal)}</p>
                  <p>Días calculados para extras: {resumen.diasTotales}</p>
                  <p>Aula matinal: {formatearEuros(resumen.precioMatinalTotal)}</p>
                  <p>Postcampus: {formatearEuros(resumen.precioPostcampusTotal)}</p>
                  <p>Comedor: {formatearEuros(resumen.precioComedorTotal)}</p>
                </div>
                <p className="mt-6 text-sm text-amber-100">Precio orientativo. El pago será en efectivo y el importe final se confirmará después.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="inscripcion" className="min-h-screen bg-white text-slate-800">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Inscripción</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Reserva la plaza de forma rápida.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">El formulario está conectado con tu Google Forms real y envía el resumen del cálculo en observaciones.</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="text-2xl font-black">Solicita tu plaza</h3>
              <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
                <div>
                  <input value={nombreNino} onChange={(e) => setNombreNino(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Nombre del niño/a" />
                  {errores.nombreNino ? <p className="mt-2 text-sm text-rose-600">{errores.nombreNino}</p> : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <input value={edad} onChange={(e) => setEdad(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Edad" />
                    {errores.edad ? <p className="mt-2 text-sm text-rose-600">{errores.edad}</p> : null}
                  </div>
                  <select value={sedeSeleccionada} onChange={(e) => setSedeSeleccionada(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none">
                    <option value="El Carmen">El Carmen</option>
                    <option value="El Mirador de Santa Eufemia">El Mirador de Santa Eufemia</option>
                  </select>
                </div>

                <div>
                  <input value={hermanosTexto} onChange={(e) => setHermanosTexto(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Nombre del hermano/a y edad (si aplica)" />
                  <p className="mt-2 text-xs text-slate-500">Si los hermanos coinciden en las mismas semanas, basta con un único formulario. Si no coinciden, rellena uno por cada niño.</p>
                </div>

                {propietario === 'Si' ? (
                  <div>
                    <input value={direccionPropietario} onChange={(e) => setDireccionPropietario(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Dirección y nombre del propietario" />
                    {errores.direccionPropietario ? <p className="mt-2 text-sm text-rose-600">{errores.direccionPropietario}</p> : null}
                  </div>
                ) : null}

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Semanas elegidas</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {semanas.map((semana) => (
                      <label key={semana} className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 text-sm ${semanasSeleccionadas.includes(semana) ? 'border-sky-600 bg-sky-50' : 'border-slate-300 bg-white'}`}>
                        <input type="checkbox" checked={semanasSeleccionadas.includes(semana)} onChange={() => toggleSemana(semana)} />
                        <span>{semana}</span>
                      </label>
                    ))}
                  </div>
                  {errores.semanas ? <p className="mt-2 text-sm text-rose-600">{errores.semanas}</p> : null}
                </div>

                <div>
                  <input value={diasSueltosTexto} onChange={(e) => setDiasSueltosTexto(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Días sueltos: especificar si aplica (ej: lunes y miércoles de julio)" />
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Servicios extra</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {['Aula matinal: 8:00 a 9:00', 'Comedor', 'Postcampus'].map((servicio) => (
                      <label key={servicio} className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 text-sm ${serviciosSeleccionados.includes(servicio) ? 'border-sky-600 bg-sky-50' : 'border-slate-300 bg-white'}`}>
                        <input type="checkbox" checked={serviciosSeleccionados.includes(servicio)} onChange={() => toggleServicio(servicio)} />
                        <span>{servicio}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <input value={padreMadre} onChange={(e) => setPadreMadre(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Nombre del padre / madre" />
                  {errores.padreMadre ? <p className="mt-2 text-sm text-rose-600">{errores.padreMadre}</p> : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Teléfono principal" />
                    {errores.telefono ? <p className="mt-2 text-sm text-rose-600">{errores.telefono}</p> : null}
                  </div>
                  <input value={segundoContacto} onChange={(e) => setSegundoContacto(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Segundo contacto (opcional)" />
                </div>

                <input value={telefono2} onChange={(e) => setTelefono2(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Teléfono segundo contacto (opcional)" />

                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none" placeholder="Alergias, observaciones o información importante" />

                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Se enviará también este resumen:</p>
                  <p className="mt-2">{resumenPrecioTexto}</p>
                </div>

                <button type="submit" disabled={estadoEnvio === 'loading'} className="mt-2 rounded-2xl bg-sky-600 px-6 py-4 text-base font-bold text-white transition hover:bg-sky-700 disabled:opacity-70">
                  {estadoEnvio === 'loading' ? 'Enviando...' : 'Enviar inscripción'}
                </button>
              </form>

              {mensajeEnvio ? (
                <div className={`mt-4 rounded-2xl p-4 text-sm ${estadoEnvio === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {mensajeEnvio}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="min-h-screen bg-white text-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-800">El Columpio Animación</p>
            <p>Campus, eventos infantiles y experiencias para familias.</p>
          </div>
          <div className="flex flex-col gap-1 text-left md:text-right">
            <a href="tel:+34611503688" className="hover:text-slate-800">611 503 688</a>
            <a href="https://www.elcolumpioanimacion.com" className="hover:text-slate-800">elcolumpioanimacion.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
