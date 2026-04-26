import logo from "./assets/logocolumpiopng";
import React, { useMemo, useState } from "react";

const FORM_CONFIG = {
  formUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdqxK4BQ3N90nsHHWw4GLQHf8nl9FKOVtxNbpHkeSB3OG5nZA/formResponse",
  fields: {
    nombreNino: "entry.1632689659",
    edad: "entry.1212973234",
    hermanosTexto: "entry.367621578",
    propietario: "entry.1387418677",
    direccionPropietario: "entry.1599358046",
    sede: "entry.1104574246",
    semanasTexto: "entry.1069191589",
    diasSueltosTexto: "entry.902508500",
    serviciosExtras: "entry.981458518",
    padreMadre: "entry.1381846823",
    telefono: "entry.2012682352",
    segundoContacto: "entry.188456918",
    telefono2: "entry.2008672987",
    observaciones: "entry.2062134869",
  },
};

const SEMANAS = [
  "1º Semana Campus: Junio 22 al 26. Super héroes",
  "2º Semana Campus: Junio 29 a Julio 3. Ciencia",
  "3º Semana Campus: Julio 6 al 10. Olimpiadas",
  "4º Semana Campus: Julio 13 al 17. Circo",
  "5º Semana Campus: Julio 20 al 24. Aventureros",
  "6º Semana Campus: Julio 27 al 31. Carnaval",
  "7º Semana Campus: Agosto 3 al 7. Indios y Vaqueros",
  "8º Semana Campus: Agosto 10 al 14. Cartoons",
  "9º Semana Campus: Agosto 17 al 21. Piratas",
  "10º Semana Campus: Agosto 24 al 28. Profesiones",
  "11º Semana Campus: Agosto 31 a Septiembre 4. Vuelta al cole",
];

const SERVICIOS = ["Aula matinal: 8:00 a 9:00", "Postcampus", "Comedor"];

const ACTIVIDADES = [
  "Deportes y juegos grupales",
  "Piscina y actividades acuáticas",
  "Talleres creativos",
  "Gymkhanas y retos",
  "Ciencia, teatro y expresión corporal",
  "Actividades adaptadas por edades",
];

function calcularPrecioSemanas(numeroSemanas, tipoCliente) {
  let total = 0;

  for (let i = 1; i <= numeroSemanas; i += 1) {
    if (tipoCliente === "socio") {
      if (i <= 3) total += 60;
      else if (i <= 5) total += 55;
      else total += 50;
    } else {
      if (i <= 3) total += 70;
      else if (i <= 5) total += 65;
      else total += 60;
    }
  }

  return total;
}

function formatearEuros(valor) {
  return `${valor.toFixed(2).replace(".", ",")} €`;
}

function toggleArrayValue(array, value) {
  return array.includes(value)
    ? array.filter((item) => item !== value)
    : [...array, value];
}

export default function App() {
  const [tipoCliente, setTipoCliente] = useState("socio");
  const [matricula, setMatricula] = useState(true);
  const [diasSueltosNumero, setDiasSueltosNumero] = useState(0);

  const [nombreNino, setNombreNino] = useState("");
  const [edad, setEdad] = useState("");
  const [hermanosTexto, setHermanosTexto] = useState("");
  const [propietario, setPropietario] = useState("No");
  const [direccionPropietario, setDireccionPropietario] = useState("");
  const [sede, setSede] = useState("El Carmen");
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);
  const [diasSueltosTexto, setDiasSueltosTexto] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [padreMadre, setPadreMadre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [segundoContacto, setSegundoContacto] = useState("");
  const [telefono2, setTelefono2] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errores, setErrores] = useState({});
  const [estadoEnvio, setEstadoEnvio] = useState("idle");
  const [mensajeEnvio, setMensajeEnvio] = useState("");

  const resumen = useMemo(() => {
    const numeroSemanas = semanasSeleccionadas.length;
    const diasTotales = numeroSemanas * 5 + diasSueltosNumero;
    const precioDiaSuelto = tipoCliente === "socio" ? 15 : 18;
    const precioMatricula = matricula ? 12 : 0;
    const precioSemanas = calcularPrecioSemanas(numeroSemanas, tipoCliente);
    const precioDiasSueltos = diasSueltosNumero * precioDiaSuelto;

    const tieneMatinal = serviciosSeleccionados.includes(
      "Aula matinal: 8:00 a 9:00"
    );
    const tienePostcampus = serviciosSeleccionados.includes("Postcampus");
    const tieneComedor = serviciosSeleccionados.includes("Comedor");

    const precioMatinal = tieneMatinal ? diasTotales * 3 : 0;
    const precioComedor = tieneComedor ? diasTotales * 7.5 : 0;
    const precioPostcampus =
      tienePostcampus && !tieneComedor ? diasTotales * 3 : 0;

    const total =
      precioMatricula +
      precioSemanas +
      precioDiasSueltos +
      precioMatinal +
      precioPostcampus +
      precioComedor;

    return {
      numeroSemanas,
      diasTotales,
      precioDiaSuelto,
      precioMatricula,
      precioSemanas,
      precioDiasSueltos,
      precioMatinal,
      precioPostcampus,
      precioComedor,
      total,
    };
  }, [
    tipoCliente,
    matricula,
    semanasSeleccionadas,
    diasSueltosNumero,
    serviciosSeleccionados,
  ]);

  const semanasTexto = semanasSeleccionadas.join(" | ");
  const serviciosTexto = serviciosSeleccionados.join(" | ");

  const resumenTexto = useMemo(() => {
    return [
      `Tipo: ${tipoCliente === "socio" ? "Socio" : "No socio"}`,
      `Semanas elegidas: ${semanasTexto || "Pendiente"}`,
      `Días sueltos: ${diasSueltosTexto || "No solicita"}`,
      `Días sueltos para cálculo: ${diasSueltosNumero}`,
      `Servicios extra: ${serviciosTexto || "Sin servicios extra"}`,
      `Días calculados para extras: ${resumen.diasTotales}`,
      `Matrícula: ${matricula ? "Sí" : "No"}`,
      `Total estimado: ${formatearEuros(resumen.total)}`,
    ].join(" | ");
  }, [
    tipoCliente,
    semanasTexto,
    diasSueltosTexto,
    diasSueltosNumero,
    serviciosTexto,
    resumen.diasTotales,
    resumen.total,
    matricula,
  ]);

  function validarFormulario() {
    const nuevosErrores = {};

    if (!nombreNino.trim())
      nuevosErrores.nombreNino = "Introduce el nombre del niño/a.";
    if (!edad.trim()) nuevosErrores.edad = "Indica la edad.";
    if (!semanasTexto.trim() && !diasSueltosTexto.trim()) {
      nuevosErrores.semanas = "Selecciona semanas o especifica días sueltos.";
    }
    if (propietario === "Si" && !direccionPropietario.trim()) {
      nuevosErrores.direccionPropietario =
        "Indica la dirección y nombre del propietario.";
    }
    if (!padreMadre.trim())
      nuevosErrores.padreMadre = "Indica el nombre del padre/madre.";
    if (!telefono.trim())
      nuevosErrores.telefono = "Indica un teléfono de contacto.";

    return nuevosErrores;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (estadoEnvio === "loading") return;

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setEstadoEnvio("error");
      setMensajeEnvio(
        "Revisa los campos marcados antes de enviar la inscripción."
      );
      return;
    }

    try {
      setEstadoEnvio("loading");
      setMensajeEnvio("Enviando inscripción...");

      const formData = new FormData();
      formData.append(FORM_CONFIG.fields.nombreNino, nombreNino);
      formData.append(FORM_CONFIG.fields.edad, edad);
      formData.append(
        FORM_CONFIG.fields.hermanosTexto,
        hermanosTexto || "No indicado"
      );
      formData.append(FORM_CONFIG.fields.propietario, propietario);
      formData.append(
        FORM_CONFIG.fields.direccionPropietario,
        propietario === "Si" ? direccionPropietario : "No aplica"
      );
      formData.append(FORM_CONFIG.fields.sede, sede);
      formData.append(
        FORM_CONFIG.fields.semanasTexto,
        semanasTexto || "No selecciona semanas completas"
      );
      formData.append(
        FORM_CONFIG.fields.diasSueltosTexto,
        diasSueltosTexto || "No solicita días sueltos"
      );
      formData.append(
        FORM_CONFIG.fields.serviciosExtras,
        serviciosTexto || "Sin servicios extra"
      );
      formData.append(FORM_CONFIG.fields.padreMadre, padreMadre);
      formData.append(FORM_CONFIG.fields.telefono, telefono);
      formData.append(
        FORM_CONFIG.fields.segundoContacto,
        segundoContacto || "No indicado"
      );
      formData.append(FORM_CONFIG.fields.telefono2, telefono2 || "No indicado");
      formData.append(
        FORM_CONFIG.fields.observaciones,
        `${observaciones || "Sin observaciones"}\n\nResumen web: ${resumenTexto}`
      );

      await fetch(FORM_CONFIG.formUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      setEstadoEnvio("success");
      setMensajeEnvio(
        "Inscripción enviada correctamente. Nos pondremos en contacto para confirmar la plaza."
      );
      setNombreNino("");
      setEdad("");
      setHermanosTexto("");
      setPropietario("No");
      setDireccionPropietario("");
      setSede("El Carmen");
      setSemanasSeleccionadas([]);
      setDiasSueltosTexto("");
      setDiasSueltosNumero(0);
      setServiciosSeleccionados([]);
      setPadreMadre("");
      setTelefono("");
      setSegundoContacto("");
      setTelefono2("");
      setObservaciones("");
      setErrores({});
    } catch (error) {
      setEstadoEnvio("error");
      setMensajeEnvio(
        "No se pudo enviar la inscripción. Inténtalo de nuevo o contacta por WhatsApp."
      );
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
<header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="El Columpio"
        className="h-14 w-auto"
      />
      <div>
        <p className="text-lg font-black text-slate-900">
          El Columpio Animación
        </p>
        <p className="text-sm text-slate-500">
          Campus de Verano 2026
        </p>
      </div>
    </div>

    <a
      href="#inscripcion"
      className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
    >
      Inscribir ahora
    </a>

  </div>
</header>

      <main>
        <section className="bg-gradient-to-br from-sky-50 via-white to-amber-50">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit rounded-full border border-sky-200 bg-white px-4 py-1 text-sm font-bold text-sky-700">
                Inscripciones abiertas próximamente
              </span>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                Un verano para disfrutar, crecer y conciliar con tranquilidad.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Campus de Verano El Columpio 2026 en El Carmen y El Mirador de
                Santa Eufemia. Deportes, piscina, talleres, juegos y semanas
                temáticas para que cada niño viva un verano inolvidable.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#inscripcion"
                  className="rounded-2xl bg-sky-600 px-6 py-4 text-center text-base font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
                >
                  Quiero inscribir a mi hijo
                </a>
                <a
                  href="https://wa.me/34611503688"
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center text-base font-black text-slate-800 transition hover:bg-slate-50"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-100">
              <div className="rounded-[1.5rem] bg-sky-600 p-6 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-100">
                  Lo que más valoran las familias
                </p>
                <ul className="mt-5 space-y-4 leading-7">
                  <li>• +250 niños cada verano</li>
                  <li>• Desde 2018 creciendo con familias del Aljarafe</li>
                  <li>• Monitores con experiencia y trato cercano</li>
                  <li>• Comunicación directa con madres y padres</li>
                </ul>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-sm text-slate-500">Fechas</p>
                  <p className="font-black">22 junio – 10 septiembre</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Horario</p>
                  <p className="font-black">8:00 – 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
            Actividades
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Una experiencia completa cada día.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACTIVIDADES.map((actividad) => (
              <div
                key={actividad}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 h-11 w-11 rounded-2xl bg-sky-100" />
                <h3 className="text-lg font-black text-slate-900">
                  {actividad}
                </h3>
                <p className="mt-2 leading-7 text-slate-600">
                  Actividades pensadas para que los niños disfruten, participen
                  y se lleven un recuerdo positivo del verano.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
              Calculadora orientativa
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Calcula el precio antes de inscribirte.
            </h2>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
                <label className="mb-3 block text-sm font-bold text-slate-700">
                  Tipo de inscripción
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["socio", "noSocio"].map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setTipoCliente(tipo)}
                      className={`rounded-2xl border px-4 py-3 text-left font-bold transition ${
                        tipoCliente === tipo
                          ? "border-sky-600 bg-sky-50 text-sky-700"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {tipo === "socio" ? "Socio" : "No socio"}
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Semanas completas seleccionadas
                    </label>
                    <input
                      type="number"
                      value={semanasSeleccionadas.length}
                      readOnly
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Días sueltos para cálculo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={diasSueltosNumero}
                      onChange={(e) =>
                        setDiasSueltosNumero(
                          Math.max(0, Number(e.target.value) || 0)
                        )
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    Servicios extra
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {SERVICIOS.map((servicio) => (
                      <label
                        key={servicio}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          serviciosSeleccionados.includes(servicio)
                            ? "border-sky-600 bg-sky-50 text-sky-700"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={serviciosSeleccionados.includes(servicio)}
                          onChange={() =>
                            setServiciosSeleccionados((prev) =>
                              toggleArrayValue(prev, servicio)
                            )
                          }
                        />
                        <span>{servicio}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    El comedor incluye postcampus. Si marcas comedor y
                    postcampus, solo se cobra comedor: 7,5€/día.
                  </p>
                </div>

                <label className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={matricula}
                    onChange={(e) => setMatricula(e.target.checked)}
                  />
                  Incluir matrícula orientativa de 12€
                </label>
              </div>

              <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-300">
                  Resumen estimado
                </p>
                <h3 className="mt-3 text-4xl font-black">
                  {formatearEuros(resumen.total)}
                </h3>
                <div className="mt-8 space-y-3 text-sm text-slate-300">
                  <p>Matrícula: {formatearEuros(resumen.precioMatricula)}</p>
                  <p>
                    Semanas completas: {formatearEuros(resumen.precioSemanas)}
                  </p>
                  <p>
                    Días sueltos: {formatearEuros(resumen.precioDiasSueltos)}
                  </p>
                  <p>Días calculados para extras: {resumen.diasTotales}</p>
                  <p>
                    Aula matinal: {formatearEuros(resumen.precioMatinal)}
                  </p>
                  <p>
                    Postcampus: {formatearEuros(resumen.precioPostcampus)}
                  </p>
                  <p>Comedor: {formatearEuros(resumen.precioComedor)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="inscripcion" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-300">
                Inscripción
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                Reserva la plaza de forma rápida.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Rellena los datos y recibiremos tu inscripción en nuestra hoja
                de gestión. Después confirmaremos plaza e importe final.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white p-8 text-slate-900 shadow-2xl">
              <form className="grid gap-5" onSubmit={handleSubmit}>
                <input
                  value={nombreNino}
                  onChange={(e) => setNombreNino(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Nombre del niño/a"
                />

                <input
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Edad"
                />

                <select
                  value={sede}
                  onChange={(e) => setSede(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                >
                  <option value="El Carmen">El Carmen</option>
                  <option value="El Mirador de Santa Eufemia">
                    El Mirador de Santa Eufemia
                  </option>
                </select>

                <input
                  value={hermanosTexto}
                  onChange={(e) => setHermanosTexto(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Nombre del hermano/a y edad, si aplica"
                />

                <div>
                  <p className="mb-3 text-sm font-bold text-slate-700">
                    ¿Es propietario de la urbanización?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {["Si", "No"].map((valor) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => setPropietario(valor)}
                        className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                          propietario === valor
                            ? "border-sky-600 bg-sky-50 text-sky-700"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {valor === "Si" ? "Sí" : "No"}
                      </button>
                    ))}
                  </div>
                </div>

                {propietario === "Si" && (
                  <input
                    value={direccionPropietario}
                    onChange={(e) =>
                      setDireccionPropietario(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                    placeholder="Dirección y nombre del propietario"
                  />
                )}

                <div>
                  <p className="mb-3 text-sm font-bold text-slate-700">
                    Semanas elegidas
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SEMANAS.map((semana) => (
                      <label
                        key={semana}
                        className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 text-sm ${
                          semanasSeleccionadas.includes(semana)
                            ? "border-sky-600 bg-sky-50 text-sky-700"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={semanasSeleccionadas.includes(semana)}
                          onChange={() =>
                            setSemanasSeleccionadas((prev) =>
                              toggleArrayValue(prev, semana)
                            )
                          }
                        />
                        <span>{semana}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  value={diasSueltosTexto}
                  onChange={(e) => setDiasSueltosTexto(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Días sueltos: especificar si aplica"
                />

                <div>
                  <p className="mb-3 text-sm font-bold text-slate-700">
                    Servicios extra
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {SERVICIOS.map((servicio) => (
                      <label
                        key={servicio}
                        className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 text-sm ${
                          serviciosSeleccionados.includes(servicio)
                            ? "border-sky-600 bg-sky-50 text-sky-700"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={serviciosSeleccionados.includes(servicio)}
                          onChange={() =>
                            setServiciosSeleccionados((prev) =>
                              toggleArrayValue(prev, servicio)
                            )
                          }
                        />
                        <span>{servicio}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  value={padreMadre}
                  onChange={(e) => setPadreMadre(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Nombre padre/madre"
                />

                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Teléfono 1"
                />

                <input
                  value={segundoContacto}
                  onChange={(e) => setSegundoContacto(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Nombre segundo padre/madre"
                />

                <input
                  value={telefono2}
                  onChange={(e) => setTelefono2(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Teléfono 2"
                />

                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Observaciones: alergias, medicación o información importante"
                />

                <button
                  type="submit"
                  disabled={estadoEnvio === "loading"}
                  className="rounded-2xl bg-sky-600 px-6 py-4 text-base font-black text-white transition hover:bg-sky-700 disabled:opacity-70"
                >
                  {estadoEnvio === "loading"
                    ? "Enviando..."
                    : "Enviar inscripción"}
                </button>
              </form>

              {mensajeEnvio && (
                <div
                  className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${
                    estadoEnvio === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {mensajeEnvio}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
