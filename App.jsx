import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, MessageCircle, Waves, Users, ShieldCheck, Sparkles } from 'lucide-react';

const FORM_CONFIG = {
  googleFormAction:
    'https://docs.google.com/forms/d/e/1FAIpQLSdqxK4BQ3N90nsHHWw4GLQHf8nl9FKOVtxNbpHkeSB3OG5nZA/formResponse',
  fields: {
    nombreNino: 'entry.1632689659',
    tipoCliente: 'entry.1472800789',
    edad: 'entry.1212973234',
    sede: 'entry.1104574246',
    semanasTexto: 'entry.1069191589',
    padreMadre: 'entry.1381846823',
    telefono: 'entry.2012682352',
    segundoContacto: 'entry.188456918',
    telefono2: 'entry.2008672987',
    observaciones: 'entry.2062134869',
  },
};

const SEMANAS = [
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

const ACTIVIDADES = [
  ['Deportes y juegos grupales', 'Dinámicas activas para fomentar participación, equipo y diversión.'],
  ['Piscina y actividades acuáticas', 'Momentos refrescantes y supervisados para disfrutar del verano.'],
  ['Talleres creativos', 'Manualidades, pintura, expresión corporal y propuestas por temática.'],
  ['Gymkhanas y retos', 'Juegos cooperativos, búsqueda del tesoro y aventuras semanales.'],
  ['Ciencia, teatro y arte', 'Experiencias diferentes para aprender jugando.'],
  ['Actividades por edades', 'Organización pensada para que cada niño se sienta cómodo.'],
];

function precioSemana(semanas, tipo) {
  if (semanas <= 0) return 0;
  if (tipo === 'socio') {
    if (semanas <= 3) return 60;
    if (semanas <= 5) return 55;
    return 50;
  }
  if (semanas <= 3) return 70;
  if (semanas <= 5) return 65;
  return 60;
}

function calcularPrecioEstimado({ tipoCliente, numSemanas, diasSueltos, diasMatinal, diasPostcampus, diasComedor, matricula }) {
  const precioDiaSuelto = tipoCliente === 'socio' ? 15 : 18;
  const precioMatricula = matricula ? 12 : 0;
  const precioSemanasTotal = numSemanas * precioSemana(numSemanas, tipoCliente);
  const precioDiasSueltosTotal = diasSueltos * precioDiaSuelto;
  const precioMatinalTotal = diasMatinal * 3;
  const precioPostcampusTotal = diasPostcampus * 3;
  const precioComedorTotal = diasComedor * 7.5;
  const precioEstimado = precioMatricula + precioSemanasTotal + precioDiasSueltosTotal + precioMatinalTotal + precioPostcampusTotal + precioComedorTotal;

  return { precioDiaSuelto, precioMatricula, precioSemanasTotal, precioDiasSueltosTotal, precioMatinalTotal, precioPostcampusTotal, precioComedorTotal, precioEstimado };
}

function formatearEuros(valor) {
  return `${valor.toFixed(2).replace('.', ',')} €`;
}

const testCases = [
  { input: [1, 'socio'], expected: 60 },
  { input: [4, 'socio'], expected: 55 },
  { input: [6, 'socio'], expected: 50 },
  { input: [1, 'noSocio'], expected: 70 },
  { input: [4, 'noSocio'], expected: 65 },
  { input: [6, 'noSocio'], expected: 60 },
  { input: [0, 'socio'], expected: 0 },
];

if (typeof console !== 'undefined') {
  testCases.forEach(({ input, expected }) => {
    const actual = precioSemana(Number(input[0]), input[1]);
    console.assert(actual === expected, 'Error en precioSemana');
  });
}

export default function App() {
  const [tipoCliente, setTipoCliente] = useState('socio');
  const [numSemanas, setNumSemanas] = useState(1);
  const [diasSueltos, setDiasSueltos] = useState(0);
  const [diasMatinal, setDiasMatinal] = useState(0);
  const [diasPostcampus, setDiasPostcampus] = useState(0);
  const [diasComedor, setDiasComedor] = useState(0);
  const [matricula, setMatricula] = useState(true);

  const [nombreNino, setNombreNino] = useState('');
  const [edad, setEdad] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('El Carmen');
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);
  const [padreMadre, setPadreMadre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [segundoContacto, setSegundoContacto] = useState('');
  const [telefono2, setTelefono2] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [errores, setErrores] = useState({});
  const [estadoEnvio, setEstadoEnvio] = useState('idle');
  const [mensajeEnvio, setMensajeEnvio] = useState('');

  const resumen = useMemo(() => calcularPrecioEstimado({ tipoCliente, numSemanas, diasSueltos, diasMatinal, diasPostcampus, diasComedor, matricula }), [tipoCliente, numSemanas, diasSueltos, diasMatinal, diasPostcampus, diasComedor, matricula]);

  const semanasTextoFinal = semanasSeleccionadas.join(' | ');

  const resumenPrecioTexto = useMemo(() => {
    return [
      `Tipo: ${tipoCliente === 'socio' ? 'Socio' : 'No socio'}`,
      `Semanas completas calculadora: ${numSemanas}`,
      `Semanas elegidas: ${semanasTextoFinal || 'Pendiente de indicar'}`,
      `Días sueltos: ${diasSueltos}`,
      `Aula matinal: ${diasMatinal}`,
      `Postcampus: ${diasPostcampus}`,
      `Comedor: ${diasComedor}`,
      `Matrícula: ${matricula ? 'Sí' : 'No'}`,
      `Total estimado: ${formatearEuros(resumen.precioEstimado)}`,
    ].join(' | ');
  }, [tipoCliente, numSemanas, semanasTextoFinal, diasSueltos, diasMatinal, diasPostcampus, diasComedor, matricula, resumen.precioEstimado]);

  function toggleSemana(semana) {
    setSemanasSeleccionadas((prev) => {
      const nuevas = prev.includes(semana) ? prev.filter((item) => item !== semana) : [...prev, semana];
      setNumSemanas(nuevas.length || 0);
      return nuevas;
    });
  }

  function validarFormulario() {
    const nuevosErrores = {};
    if (!nombreNino.trim()) nuevosErrores.nombreNino = 'Introduce el nombre del niño o niña.';
    if (!edad.trim()) nuevosErrores.edad = 'Indica la edad.';
    if (!semanasTextoFinal.trim()) nuevosErrores.semanas = 'Selecciona al menos una semana.';
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
      formData.append(FORM_CONFIG.fields.tipoCliente, tipoCliente === 'socio' ? 'Sí' : 'No');
      formData.append(FORM_CONFIG.fields.edad, edad);
      formData.append(FORM_CONFIG.fields.sede, sedeSeleccionada);
      semanasSeleccionadas.forEach((semana) => formData.append(FORM_CONFIG.fields.semanasTexto, semana));
      formData.append(FORM_CONFIG.fields.padreMadre, padreMadre);
      formData.append(FORM_CONFIG.fields.telefono, telefono);
      formData.append(FORM_CONFIG.fields.segundoContacto, segundoContacto);
      formData.append(FORM_CONFIG.fields.telefono2, telefono2);
      formData.append(FORM_CONFIG.fields.observaciones, `${observaciones || 'Sin observaciones'}\n\nResumen web: ${resumenPrecioTexto}`);

      await fetch(FORM_CONFIG.googleFormAction, { method: 'POST', mode: 'no-cors', body: formData });

      setEstadoEnvio('success');
      setMensajeEnvio('Inscripción enviada correctamente. Revisa tu hoja de respuestas de Google Forms.');
      setNombreNino('');
      setEdad('');
      setSedeSeleccionada('El Carmen');
      setSemanasSeleccionadas([]);
      setNumSemanas(0);
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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-950">El Columpio Animación</p>
            <p className="text-sm text-slate-500">Campus de Verano 2026</p>
          </div>
          <a href="#inscripcion" className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700">Inscribir ahora</a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-amber-50">
          <div className="absolute right-[-10rem] top-[-10rem] h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-[-12rem] left-[-8rem] h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1 text-sm font-semibold text-sky-700">
                <Sparkles className="h-4 w-4" /> Campus de verano 2026
              </span>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">Un verano para disfrutar, crecer y conciliar con tranquilidad.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Campus de Verano El Columpio en El Carmen y El Mirador de Santa Eufemia. Deportes, piscina, talleres, juegos y semanas temáticas para que cada niño viva un verano inolvidable.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#inscripcion" className="rounded-2xl bg-sky-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700">Quiero inscribir a mi hijo</a>
                <a href="https://wa.me/34611503688" className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center text-base font-bold text-slate-800 transition hover:bg-slate-50"><MessageCircle className="mr-2 inline h-5 w-5" />Consultar por WhatsApp</a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <InfoCard icon={<CalendarDays />} title="Fechas" value="22 junio – 10 septiembre" />
                <InfoCard icon={<ShieldCheck />} title="Horario" value="8:00 – 16:00" />
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-100">
                <div className="rounded-[1.5rem] bg-sky-600 p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Lo que más valoran las familias</p>
                  <ul className="mt-5 space-y-4">
                    {['+250 niños cada verano', 'Desde 2018 creciendo con familias del Aljarafe', 'Monitores con experiencia y trato cercano', 'Comunicación directa con madres y padres'].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base leading-7"><CheckCircle2 className="mt-1 h-5 w-5 text-amber-300" /><span>{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-amber-50 p-4"><p className="text-sm text-slate-500">Sedes</p><p className="font-bold">El Carmen + El Mirador</p></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Contacto</p><p className="font-bold">611 503 688</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">Actividades</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Una experiencia completa cada día.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACTIVIDADES.map(([titulo, texto]) => (
              <div key={titulo} className="rounded-[1.5rem] border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700"><Waves className="h-5 w-5" /></div>
                <h3 className="text-lg font-bold text-slate-950">{titulo}</h3>
                <p className="mt-2 leading-7 text-slate-600">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-700">Tarifas y calculadora</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Calcula el precio orientativo.</h2>
            <p className="mt-4 max-w-3xl text-slate-600">Basado en los precios del año pasado. El pago se realizará en efectivo y el precio final se confirmará al validar la inscripción.</p>
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo de inscripción</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => setTipoCliente('socio')} className={`rounded-2xl border px-4 py-3 text-left font-semibold transition ${tipoCliente === 'socio' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-300 bg-white text-slate-700'}`}>Socio</button>
                  <button type="button" onClick={() => setTipoCliente('noSocio')} className={`rounded-2xl border px-4 py-3 text-left font-semibold transition ${tipoCliente === 'noSocio' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-300 bg-white text-slate-700'}`}>No socio</button>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <NumberField label="Semanas completas" value={numSemanas} onChange={setNumSemanas} />
                  <NumberField label="Días sueltos" value={diasSueltos} onChange={setDiasSueltos} />
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                  <NumberField label="Días aula matinal" value={diasMatinal} onChange={setDiasMatinal} />
                  <NumberField label="Días postcampus" value={diasPostcampus} onChange={setDiasPostcampus} />
                  <NumberField label="Días comedor" value={diasComedor} onChange={setDiasComedor} />
                </div>
                <label className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={matricula} onChange={(e) => setMatricula(e.target.checked)} className="h-4 w-4" /> Incluir matrícula de 12€
                </label>
              </div>

              <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Resumen estimado</p>
                <h3 className="mt-3 text-4xl font-black">{formatearEuros(resumen.precioEstimado)}</h3>
                <div className="mt-8 space-y-3 rounded-2xl bg-white/5 p-5 text-sm text-slate-300 ring-1 ring-white/10">
                  <SummaryRow label="Matrícula" value={resumen.precioMatricula} />
                  <SummaryRow label="Semanas" value={resumen.precioSemanasTotal} />
                  <SummaryRow label="Días sueltos" value={resumen.precioDiasSueltosTotal} />
                  <SummaryRow label="Aula matinal" value={resumen.precioMatinalTotal} />
                  <SummaryRow label="Postcampus" value={resumen.precioPostcampusTotal} />
                  <SummaryRow label="Comedor" value={resumen.precioComedorTotal} />
                </div>
                <p className="mt-6 rounded-2xl bg-amber-300/15 p-4 text-sm leading-7 text-amber-100">Precio orientativo. No incluye descuentos por hermanos ni promociones puntuales.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="inscripcion" className="bg-slate-950 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Inscripción</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Reserva la plaza de forma rápida.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">El formulario está conectado con tu Google Forms real y envía el resumen del cálculo en observaciones.</p>
              <div className="mt-8 rounded-[1.5rem] bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="text-xl font-bold">Cómo funcionará</h3>
                <ul className="mt-4 space-y-3 text-slate-300">
                  <li>• La familia marca semanas y servicios.</li>
                  <li>• Ve un precio orientativo.</li>
                  <li>• Tú recibes la inscripción en Google Forms.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 text-slate-900 shadow-2xl">
              <h3 className="text-2xl font-black">Solicita tu plaza</h3>
              <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
                <InputField placeholder="Nombre del niño/a" value={nombreNino} onChange={setNombreNino} error={errores.nombreNino} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField placeholder="Edad" value={edad} onChange={setEdad} error={errores.edad} />
                  <select value={sedeSeleccionada} onChange={(e) => setSedeSeleccionada(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100">
                    <option value="El Carmen">El Carmen</option>
                    <option value="El Mirador de Santa Eufemia">El Mirador de Santa Eufemia</option>
                  </select>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Semanas elegidas</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SEMANAS.map((semana) => (
                      <label key={semana} className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 text-sm transition ${semanasSeleccionadas.includes(semana) ? 'border-sky-600 bg-sky-50 text-sky-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>
                        <input type="checkbox" checked={semanasSeleccionadas.includes(semana)} onChange={() => toggleSemana(semana)} className="mt-1 h-4 w-4" />
                        <span>{semana}</span>
                      </label>
                    ))}
                  </div>
                  {errores.semanas ? <p className="mt-2 text-sm text-rose-600">{errores.semanas}</p> : null}
                </div>

                <InputField placeholder="Nombre del padre / madre" value={padreMadre} onChange={setPadreMadre} error={errores.padreMadre} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField placeholder="Teléfono principal" value={telefono} onChange={setTelefono} error={errores.telefono} />
                  <InputField placeholder="Segundo contacto (opcional)" value={segundoContacto} onChange={setSegundoContacto} />
                </div>
                <InputField placeholder="Teléfono segundo contacto (opcional)" value={telefono2} onChange={setTelefono2} />
                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder="Alergias, observaciones o información importante" />
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-semibold text-slate-800">Se enviará también este resumen:</p><p className="mt-2">{resumenPrecioTexto}</p></div>
                <button type="submit" disabled={estadoEnvio === 'loading'} className="mt-2 rounded-2xl bg-sky-600 px-6 py-4 text-base font-bold text-white transition hover:bg-sky-700 disabled:opacity-70">{estadoEnvio === 'loading' ? 'Enviando...' : 'Enviar inscripción'}</button>
              </form>
              {mensajeEnvio ? <div className={`mt-4 rounded-2xl p-4 text-sm ${estadoEnvio === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{mensajeEnvio}</div> : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div><p className="font-semibold text-slate-800">El Columpio Animación</p><p>Campus, eventos infantiles y experiencias para familias.</p></div>
          <div className="flex flex-col gap-1 text-left md:text-right"><a href="tel:+34611503688" className="hover:text-slate-800">611 503 688</a><a href="https://www.elcolumpioanimacion.com" className="hover:text-slate-800">elcolumpioanimacion.com</a></div>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"><div className="mb-2 h-5 w-5 text-sky-700">{icon}</div><p className="text-sm text-slate-500">{title}</p><p className="font-bold">{value}</p></div>;
}

function NumberField({ label, value, onChange }) {
  return <div><label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label><input type="number" min="0" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></div>;
}

function SummaryRow({ label, value }) {
  return <div className="flex items-center justify-between gap-4"><span>{label}</span><span className="font-semibold text-white">{formatearEuros(value)}</span></div>;
}

function InputField({ placeholder, value, onChange, error }) {
  return <div><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" placeholder={placeholder} />{error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}</div>;
}
