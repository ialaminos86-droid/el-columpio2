import React, { useEffect, useMemo, useState } from "react";

import logoColumpio from "./assets/logocolumpio.png";

const LOGO_SRC = logoColumpio;

const FORM_CONFIG = {
  formUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdqxK4BQ3N90nsHHWw4GLQHf8nl9FKOVtxNbpHkeSB3OG5nZA/formResponse",
  fields: {
    nombreNino: "entry.1632689659",
    edad: "entry.1212973234",
    email: "entry.1799819209",    
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

const SERVICIOS = [
  "Aula matinal: 8:00 a 9:00",
  "Postcampus: 14:00 a 16:00",
  "Postcampus+Comedor: 14:00 a 16:00",
];

const ACTIVIDADES = [
  { titulo: "Deportes", texto: "Juegos, retos y deportes adaptados por edades.", icono: "⚽" },
  { titulo: "Piscina", texto: "Actividades acuáticas y momentos refrescantes.", icono: "🌊" },
  { titulo: "Talleres", texto: "Creatividad, manualidades y expresión.", icono: "🎨" },
  { titulo: "Gymkhanas", texto: "Aventuras, pruebas y trabajo en equipo.", icono: "🏆" },
  { titulo: "Teatro y ciencia", texto: "Experimentos, juegos escénicos y diversión.", icono: "🎭" },
  { titulo: "Por edades", texto: "Actividades pensadas para cada etapa.", icono: "🧒" },
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

function Logo({ className = "h-14 w-auto object-contain" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="leading-tight">
        <p className="text-lg font-black text-blue-900">EL COLUMPIO</p>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
          Kids events & entertainment
        </p>
      </div>
    );
  }

  return (
    <img
      src={LOGO_SRC}
      alt="El Columpio"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function AnimatedCounter({ value, prefix = "", suffix = "", duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let frameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function App() {
  const [tipoCliente, setTipoCliente] = useState("socio");
  const [matricula, setMatricula] = useState(true);
  const [semanasCalculadora, setSemanasCalculadora] = useState(0);
const [diasSueltosCalculadora, setDiasSueltosCalculadora] = useState(0);

const [diasSueltosNumero, setDiasSueltosNumero] = useState(0);

  const [nombreNino, setNombreNino] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [hermanosTexto, setHermanosTexto] = useState("");
  const [propietario, setPropietario] = useState("No");
  const [direccionPropietario, setDireccionPropietario] = useState("");
  const [sede, setSede] = useState("El Carmen");
  const [semanasSeleccionadas, setSemanasSeleccionadas] = useState([]);
  const [diasSueltosTexto, setDiasSueltosTexto] = useState("");
  const [serviciosCalculadora, setServiciosCalculadora] = useState([]);
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
    const precioMatricula = 12;
    const precioSemanas = calcularPrecioSemanas(numeroSemanas, tipoCliente);
    const precioDiasSueltos = diasSueltosNumero * precioDiaSuelto;

    const tieneMatinal = serviciosSeleccionados.includes("Aula matinal: 8:00 a 9:00");
const tienePostcampus = serviciosSeleccionados.includes("Postcampus: 14:00 a 16:00");
const tieneComedor = serviciosSeleccionados.includes("Postcampus+Comedor: 14:00 a 16:00");
    
    const precioMatinal = tieneMatinal ? diasTotales * 3 : 0;
    const precioComedor = tieneComedor ? diasTotales * 7.5 : 0;
    const precioPostcampus = tienePostcampus && !tieneComedor ? diasTotales * 3 : 0;

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
  }, [tipoCliente, semanasSeleccionadas, diasSueltosNumero, serviciosSeleccionados]);
  
const resumenCalculadora = useMemo(() => {
  const numeroSemanas = semanasCalculadora;
  const diasTotales = numeroSemanas * 5 + diasSueltosCalculadora;
  const precioDiaSuelto = tipoCliente === "socio" ? 15 : 18;
  const precioMatricula = matricula ? 12 : 0;
  const precioSemanas = calcularPrecioSemanas(numeroSemanas, tipoCliente);
  const precioDiasSueltos = diasSueltosCalculadora * precioDiaSuelto;

  const tieneMatinal = serviciosCalculadora.includes("Aula matinal: 8:00 a 9:00");
  const tienePostcampus = serviciosCalculadora.includes("Postcampus: 14:00 a 16:00");
  const tieneComedor = serviciosCalculadora.includes("Postcampus+Comedor: 14:00 a 16:00");

  const precioMatinal = tieneMatinal ? diasTotales * 3 : 0;
  const precioComedor = tieneComedor ? diasTotales * 7.5 : 0;
  const precioPostcampus = tienePostcampus && !tieneComedor ? diasTotales * 3 : 0;

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
    precioMatricula,
    precioSemanas,
    precioDiasSueltos,
    precioMatinal,
    precioPostcampus,
    precioComedor,
    total,
  };
}, [tipoCliente, matricula, semanasCalculadora, diasSueltosCalculadora, serviciosCalculadora]);
  
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
      `Matrícula: Sí`,
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

    if (!nombreNino.trim()) nuevosErrores.nombreNino = "Introduce el nombre del niño/a.";
    if (!edad.trim()) nuevosErrores.edad = "Indica la edad.";
    if (!email.trim()) nuevosErrores.email = "Indica un email.";
    if (!semanasTexto.trim() && !diasSueltosTexto.trim()) {
      nuevosErrores.semanas = "Selecciona semanas o especifica días sueltos.";
    }
    if (propietario === "Si" && !direccionPropietario.trim()) {
      nuevosErrores.direccionPropietario = "Indica la dirección y nombre del propietario.";
    }
    if (!padreMadre.trim()) nuevosErrores.padreMadre = "Indica el nombre del padre/madre.";
    if (!telefono.trim()) nuevosErrores.telefono = "Indica un teléfono de contacto.";

    return nuevosErrores;
  }

  function enviarAGoogleForms(formData) {
    const iframeName = "google-forms-hidden-frame";
    let iframe = document.querySelector(`iframe[name="${iframeName}"]`);

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    const form = document.createElement("form");
    form.action = FORM_CONFIG.formUrl;
    form.method = "POST";
    form.target = iframeName;
    form.style.display = "none";

    formData.forEach((value, key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (estadoEnvio === "loading") return;

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setEstadoEnvio("error");
      setMensajeEnvio("Revisa los campos marcados antes de enviar la inscripción.");
      return;
    }

    try {
      setEstadoEnvio("loading");
      setMensajeEnvio("Enviando inscripción...");

      const codigoInscripcion = `WEB-${Date.now()}`;
const formData = new FormData();

formData.append(FORM_CONFIG.fields.nombreNino, nombreNino.trim());
formData.append(FORM_CONFIG.fields.edad, edad.trim());
formData.append(FORM_CONFIG.fields.email, email.trim());
formData.append(FORM_CONFIG.fields.hermanosTexto, hermanosTexto.trim() || "No indicado");
formData.append(FORM_CONFIG.fields.propietario, propietario);
formData.append(
  FORM_CONFIG.fields.direccionPropietario,
  propietario === "Si" ? direccionPropietario.trim() : "No aplica"
);
formData.append(FORM_CONFIG.fields.sede, sede);

semanasSeleccionadas.forEach((semana) => {
  formData.append(FORM_CONFIG.fields.semanasTexto, semana);
});

formData.append(
  FORM_CONFIG.fields.diasSueltosTexto,
  diasSueltosTexto.trim() || "No solicita días sueltos"
);

serviciosSeleccionados.forEach((servicio) => {
  formData.append(FORM_CONFIG.fields.serviciosExtras, servicio);
});

formData.append(FORM_CONFIG.fields.padreMadre, padreMadre.trim());
formData.append(FORM_CONFIG.fields.telefono, telefono.trim());
formData.append(FORM_CONFIG.fields.segundoContacto, segundoContacto.trim() || "No indicado");
formData.append(FORM_CONFIG.fields.telefono2, telefono2.trim() || "No indicado");
formData.append(
  FORM_CONFIG.fields.observaciones,
  `${observaciones.trim() || "Sin observaciones"}

Resumen web: ${resumenTexto}

Código inscripción: ${codigoInscripcion}`
);

enviarAGoogleForms(formData);

    setTimeout(() => {
  setEstadoEnvio("success");

  setMensajeEnvio(
    `Inscripción enviada. Código: ${codigoInscripcion}. Si no aparece en Google Sheets en unos segundos, revisa que el formulario siga aceptando respuestas.`
  );

  // 👉 MENSAJE WHATSAPP
  const mensajeWhatsApp = `Hola, acabo de realizar la inscripción al Campus de Verano El Columpio.

👤 Niño/a: ${nombreNino}
🎂 Edad: ${edad}
📍 Sede: ${sede}
📅 Semanas: ${semanasTexto || "Días sueltos"}
➕ Servicios: ${serviciosTexto || "Sin extras"}

💰 Total estimado: ${formatearEuros(resumen.total)}
🆔 Código: ${codigoInscripcion}`;

  // 👇 LIMPIAS FORMULARIO
  setNombreNino("");
  setEdad("");
  setEmail("");
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

  // 👉 WHATSAPP
        setTimeout(() => {
        window.location.href = `https://wa.me/34611503688?text=${encodeURIComponent(mensajeWhatsApp)}`;
      }, 500);

    }, 900);
  } catch (error) {
    setEstadoEnvio("error");
    setMensajeEnvio("No se pudo enviar la inscripción. Inténtalo de nuevo o contacta por WhatsApp.");
  }
}
  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#071B4D]">
  <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-5">
    <a href="#inicio" className="flex shrink-0 items-center">
      <Logo className="h-10 w-auto object-contain md:h-14" />
    </a>

    <nav className="hidden items-center gap-8 text-sm font-black text-[#071B4D] md:flex">
      <a href="#inicio" className="hover:text-blue-700">Inicio</a>
      <a href="#actividades" className="hover:text-blue-700">Actividades</a>
      <a href="#precios" className="hover:text-blue-700">Precios</a>
      <a href="#inscripcion" className="hover:text-blue-700">Inscripción</a>
      <a href="https://wa.me/34611503688" className="hover:text-blue-700">Contacto</a>
    </nav>

    <a
      href="#inscripcion"
      className="shrink-0 rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800 md:px-5 md:text-sm"
    >
      Inscribirme
    </a>
  </div>
</header>
     <main id="inicio">
  <section className="relative overflow-hidden bg-white">
    <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-blue-100 via-sky-50 to-transparent md:block" />

    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[0.95fr_1.05fr] md:py-16">
      
      <div className="relative z-10 flex flex-col justify-center">
        
        <div className="mb-6">
          <div className="inline-block rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-blue-50">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              Kids events & entertainment
            </p>
            <p className="text-sm font-black text-blue-800">
              Campus de Verano 2026
            </p>
          </div>
        </div>

              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-[#071B4D] md:text-6xl">
                Un verano para disfrutar, crecer y conciliar con <span className="text-amber-400">tranquilidad.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Campus de Verano El Columpio 2026 en El Carmen y El Mirador de Santa Eufemia. Deportes, piscina, talleres, juegos y semanas temáticas para que cada niño viva un verano inolvidable.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#inscripcion" className="rounded-xl bg-blue-700 px-6 py-4 text-center text-base font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800">
                  👤 Quiero plaza
                </a>
                <a href="https://wa.me/34611503688" className="rounded-xl border border-blue-200 bg-white px-6 py-4 text-center text-base font-black text-blue-700 transition hover:bg-blue-50">
                  💬 Consultar por WhatsApp
                </a>
              </div>

              <div className="mt-9 grid grid-cols-2 items-stretch gap-4 md:grid-cols-4">
                {[
                  ["👥", "+250", "niños cada verano"],
                  ["🏅", "Desde 2018", "creciendo juntos"],
                  ["❤️", "Monitores", "con experiencia"],
                  ["💬", "Comunicación", "directa con familias"],
                ].map(([icono, titulo, texto]) => (
                  <div key={titulo} className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-blue-50">
                    <span className="text-3xl">{icono}</span>
                    <p className="text-base font-black leading-tight text-blue-700">
                      {titulo === "+250" ? <AnimatedCounter prefix="+" value={250} /> : titulo}
                    </p>
                    <p className="text-xs leading-tight text-slate-500">{texto}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-sky-500 to-amber-300 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.22),transparent_28%)]" />
              <div className="absolute left-8 top-8 rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur">
                <p className="text-sm font-black text-blue-700">Fechas</p>
                <p className="text-lg font-black text-[#071B4D]">22 junio – 10 septiembre</p>
              </div>
              <div className="absolute right-8 top-32 rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur">
                <p className="text-sm font-black text-blue-700">Horario</p>
                <p className="text-lg font-black text-[#071B4D]">8:00 – 16:00</p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">Sedes</p>
                <p className="mt-2 text-xl font-black text-[#071B4D]">El Carmen · El Mirador de Santa Eufemia</p>
                <p className="mt-2 text-sm text-slate-600">Actividades, piscina, talleres y juegos organizados por semanas.</p>
              </div>
         <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 p-4 shadow-2xl ring-4 ring-white/40 sm:h-44 sm:w-44 sm:p-5 md:h-56 md:w-56 md:p-7">
  <Logo className="max-h-full max-w-full object-contain" />
</div>
            </div>
          </div>
        </section>

        <section id="actividades" className="mx-auto max-w-7xl px-5 py-10">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-blue-100" />
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">Actividades</p>
            <div className="h-px w-20 bg-blue-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {ACTIVIDADES.map((actividad) => (
              <div key={actividad.titulo} className="rounded-3xl bg-white p-5 text-center shadow-md ring-1 ring-blue-50 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">{actividad.icono}</div>
                <h3 className="font-black text-blue-800">{actividad.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{actividad.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="galeria" className="mx-auto max-w-7xl px-5 py-14">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">Galería</p>
            <h2 className="mt-2 text-3xl font-black text-[#071B4D]">Así se vive el campus</h2>
           <p className="mt-3 text-slate-600">Momentos de diversión, juegos y actividades del campus</p>
          </div>

<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {[
    "/galeria/img01.jpg",
    "/galeria/img02.jpg",
    "/galeria/img03.jpg",
    "/galeria/img04.jpg",
    "/galeria/img06.jpg",
    "/galeria/img07.jpg",
    "/galeria/img08.jpg",
    "/galeria/img09.jpg",
    "/galeria/img10.jpg",
    "/galeria/img12.jpg",
    "/galeria/img14.jpg",
    "/galeria/img15.jpg",
  ].map((src, index) => (
    <div
      key={src}
      className="group relative overflow-hidden rounded-2xl bg-slate-100"
    >
      <img
        src={src}
        alt={`Campus El Columpio ${index + 1}`}
        className="h-48 w-full object-cover transition duration-300 group-hover:scale-110"
        onError={(event) => {
          event.currentTarget.src = "/galeria/img1.jpg";
        }}
      />

      {/* Overlay efecto pro */}
      <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
    </div>
  ))}
</div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14">
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-700 to-sky-500 p-10 text-white shadow-2xl">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-200">Confianza de familias</p>
                <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                  Más de <span className="text-amber-300">250 niños cada verano</span> ya han vivido la experiencia El Columpio
                </h2>
                <p className="mt-5 text-lg leading-8 text-blue-100">
                  Sabemos lo importante que es para ti dejar a tu hijo en buenas manos. Por eso cuidamos cada detalle: desde el trato cercano hasta la seguridad, la organización y la diversión real.
                </p>
                <p className="mt-4 text-lg leading-8 text-blue-100">
                  Nuestro objetivo no es solo que se lo pasen bien, sino que tú estés tranquilo sabiendo que están en un entorno seguro, organizado y con profesionales que realmente disfrutan con lo que hacen.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href="#inscripcion" className="rounded-xl bg-white px-6 py-4 text-center text-base font-black text-blue-700 transition hover:bg-blue-50">
                    Reservar plaza
                  </a>
                  <a href="https://wa.me/34611503688" className="rounded-xl border border-white/30 px-6 py-4 text-center text-base font-black text-white transition hover:bg-white/10">
                    Hablar por WhatsApp
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["⭐", "Experiencia", "Desde 2018 organizando campus"],
                  ["🛟", "Seguridad", "Control y atención constante"],
                  ["🤝", "Cercanía", "Trato directo con familias"],
                  ["🎯", "Organización", "Todo planificado por semanas"],
                ].map(([icono, titulo, texto]) => (
                  <div key={titulo} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                    <p className="text-2xl">{icono}</p>
                    <p className="mt-2 font-black">{titulo}</p>
                    <p className="text-sm text-blue-100">{texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="precios" className="mx-auto max-w-7xl px-5 py-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-blue-50">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">🧮</span>
                <h2 className="text-2xl font-black text-[#071B4D]">Calcula el precio antes de inscribirte</h2>
              </div>

              <label className="mb-3 block text-sm font-black text-[#071B4D]">Tipo de inscripción</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["socio", "Socio"],
                  ["noSocio", "No socio"],
                ].map(([tipo, label]) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoCliente(tipo)}
                    className={`rounded-xl border px-5 py-3 text-center font-black transition ${
                      tipoCliente === tipo
                        ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-100"
                        : "border-slate-200 bg-white text-[#071B4D] hover:bg-blue-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black text-[#071B4D]">Semanas completas</label>
                  <input
                    type="number"
                    min="0"
                    value={semanasCalculadora}
                    onChange={(event) => setSemanasCalculadora(Math.max(0, Number(event.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-xl font-black outline-none focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">5 días por semana</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-black text-[#071B4D]">Días sueltos</label>
                  <input
                    type="number"
                    min="0"
                    value={diasSueltosCalculadora}
onChange={(event) => setDiasSueltosCalculadora(Math.max(0, Number(event.target.value) || 0))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-xl font-black outline-none focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">Se añadirán al total</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-3 block text-sm font-black text-[#071B4D]">Servicios extra</label>
                <div className="grid gap-3">
                  {SERVICIOS.map((servicio) => (
  <label key={servicio} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#071B4D] hover:bg-blue-50">
    <input
      type="checkbox"
      checked={serviciosCalculadora.includes(servicio)}
      onChange={() => setServiciosCalculadora((prev) => toggleArrayValue(prev, servicio))}
      className="h-4 w-4"
    />
    <span>{servicio}</span>
  </label>
))}
                </div>
              </div>

              <label className="mt-6 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-4 text-sm font-black text-[#071B4D] ring-1 ring-amber-100">
                <input type="checkbox" checked={matricula} onChange={(event) => setMatricula(event.target.checked)} />
                Incluir matrícula +12€
              </label>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-blue-900 to-blue-700 p-7 text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-200">Resumen estimado</p>
              <h3 className="mt-4 text-5xl font-black text-amber-300">
  {formatearEuros(resumenCalculadora.total)}
</h3>
              <p className="mt-2 text-center text-xs text-blue-100">
  {resumenCalculadora.diasTotales > 0
    ? `(${formatearEuros(resumenCalculadora.total / resumenCalculadora.diasTotales)} / día)`
    : ""}
</p>
              <p className="mt-2 text-center text-sm text-green-200 font-bold">
  ✅ Reserva tu plaza en menos de 1 minuto
</p>
              <div className="mt-8 space-y-4 text-sm">
                {[
  ["Matrícula", resumenCalculadora.precioMatricula],
  [`Semanas completas (${resumenCalculadora.numeroSemanas})`, resumenCalculadora.precioSemanas],
  [`Días sueltos (${diasSueltosCalculadora})`, resumenCalculadora.precioDiasSueltos],
  [`Aula matinal (${resumenCalculadora.diasTotales} días)`, resumenCalculadora.precioMatinal],
  ["Postcampus", resumenCalculadora.precioPostcampus],
  ["Comedor", resumenCalculadora.precioComedor],
].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-blue-100">{label}</span>
                    <span className="font-black">{formatearEuros(value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 text-lg font-black">
                  <span>TOTAL ESTIMADO</span>
                  <span className="text-amber-300">{formatearEuros(resumenCalculadora.total)}</span>
                </div>
              </div>
              <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-blue-50">Precio orientativo. El importe final se confirmará tras revisar la inscripción.</p>
            </div>
          </div>
        </section>

        <section id="inscripcion" className="mx-auto max-w-7xl px-5 py-10">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-blue-50">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">👤</span>
                <h2 className="text-2xl font-black text-blue-800">Formulario de inscripción</h2>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Nombre del niño/a *</label>
                    <input value={nombreNino} onChange={(event) => setNombreNino(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Escribe el nombre" />
                    {errores.nombreNino ? <p className="mt-1 text-xs text-rose-600">{errores.nombreNino}</p> : null}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Edad *</label>
                    <input value={edad} onChange={(event) => setEdad(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Ej: 6" />
                    {errores.edad ? <p className="mt-1 text-xs text-rose-600">{errores.edad}</p> : null}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Sede *</label>
                    <select value={sede} onChange={(event) => setSede(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
                      <option value="El Carmen">El Carmen</option>
                      <option value="El Mirador de Santa Eufemia">El Mirador de Santa Eufemia</option>
                    </select>
                  </div>
</div>

<div>
  <label className="mb-1 block text-sm font-bold text-[#071B4D]">
    Email *
  </label>
  <input
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
    placeholder="Ej: padre@email.com"
  />
  {errores.email ? (
    <p className="mt-1 text-xs text-rose-600">{errores.email}</p>
  ) : null}
</div>
    
                <input value={hermanosTexto} onChange={(event) => setHermanosTexto(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Hermano/a y edad si aplica" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#071B4D]">¿Es propietario de la urbanización? *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Si", "No"].map((valor) => (
                        <button key={valor} type="button" onClick={() => setPropietario(valor)} className={`rounded-xl border px-4 py-3 font-black ${propietario === valor ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-white text-[#071B4D]"}`}>
                          {valor === "Si" ? "Sí" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {propietario === "Si" ? (
                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#071B4D]">Dirección y propietario *</label>
                      <input value={direccionPropietario} onChange={(event) => setDireccionPropietario(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Dirección y nombre" />
                      {errores.direccionPropietario ? <p className="mt-1 text-xs text-rose-600">{errores.direccionPropietario}</p> : null}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#071B4D]">Semanas elegidas *</label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {SEMANAS.map((semana) => (
                      <label key={semana} className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-3 text-sm ${semanasSeleccionadas.includes(semana) ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-[#071B4D]"}`}>
                        <input
                          type="checkbox"
                          checked={semanasSeleccionadas.includes(semana)}
                          onChange={() => setSemanasSeleccionadas((prev) => {
                            const nuevas = toggleArrayValue(prev, semana)
                            return nuevas;
                          })}
                        />
                        <span>{semana}</span>
                      </label>
                    ))}
                  </div>
                  {errores.semanas ? <p className="mt-2 text-xs text-rose-600">{errores.semanas}</p> : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
  <div>
    <label className="mb-1 block text-sm font-bold text-[#071B4D]">
      Días sueltos: especificar fechas
    </label>
    <input
      value={diasSueltosTexto}
      onChange={(event) => setDiasSueltosTexto(event.target.value)}
      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
      placeholder="Ej: 24 junio, 25 junio..."
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-bold text-[#071B4D]">
      Nº de días sueltos
    </label>
    <input
      type="number"
      min="0"
      value={diasSueltosNumero}
      onChange={(event) =>
        setDiasSueltosNumero(Math.max(0, Number(event.target.value) || 0))
      }
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg font-black outline-none focus:border-blue-500"
      placeholder="0"
    />
  </div>
</div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#071B4D]">Servicios extra</label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {SERVICIOS.map((servicio) => (
                      <label key={servicio} className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-3 text-sm font-bold ${serviciosSeleccionados.includes(servicio) ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-[#071B4D]"}`}>
                        <input type="checkbox" checked={serviciosSeleccionados.includes(servicio)} onChange={() => setServiciosSeleccionados((prev) => toggleArrayValue(prev, servicio))} />
                        <span>{servicio}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-1">
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Padre/madre *</label>
                    <input value={padreMadre} onChange={(event) => setPadreMadre(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Nombre" />
                    {errores.padreMadre ? <p className="mt-1 text-xs text-rose-600">{errores.padreMadre}</p> : null}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Teléfono 1 *</label>
                    <input value={telefono} onChange={(event) => setTelefono(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Ej: 600 123 456" />
                    {errores.telefono ? <p className="mt-1 text-xs text-rose-600">{errores.telefono}</p> : null}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Segundo contacto</label>
                    <input value={segundoContacto} onChange={(event) => setSegundoContacto(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Nombre" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-[#071B4D]">Teléfono 2</label>
                    <input value={telefono2} onChange={(event) => setTelefono2(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Ej: 600 123 456" />
                  </div>
                </div>

                <textarea value={observaciones} onChange={(event) => setObservaciones(event.target.value)} className="min-h-[110px] w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Observaciones: alergias, medicación o información importante" />
<p className="rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-700 ring-1 ring-amber-100">
  ⚠️ Plazas limitadas por grupo de edad y sede
</p>
                <button type="submit" disabled={estadoEnvio === "loading"} className="rounded-xl bg-blue-700 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800 disabled:opacity-70">
                  ✈️ {estadoEnvio === "loading" ? "Enviando..." : "Enviar inscripción"}
                </button>
              </form>

              {mensajeEnvio ? (
                <div className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${estadoEnvio === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  {mensajeEnvio}
                </div>
              ) : null}
            </div>

            <aside className="rounded-[2rem] bg-amber-50 p-6 text-[#071B4D] shadow-xl ring-1 ring-amber-100 lg:sticky lg:top-28 lg:self-start">
              <h3 className="text-xl font-black text-blue-800">Resumen de tu inscripción</h3>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4"><span>👤 Tipo</span><strong>{tipoCliente === "socio" ? "Socio" : "No socio"}</strong></div>
                <div className="flex justify-between gap-4"><span>🔗 Semanas completas</span><strong>{resumen.numeroSemanas}</strong></div>
                <div className="flex justify-between gap-4"><span>📅 Días sueltos</span><strong>{diasSueltosNumero}</strong></div>
                <div className="flex justify-between gap-4"><span>⏱️ Días para extras</span><strong>{resumen.diasTotales}</strong></div>
                <div className="flex justify-between gap-4"><span>🧩 Servicios</span><strong className="text-right">{serviciosTexto || "Sin extras"}</strong></div>
                <div className="flex justify-between gap-4"><span>🧾 Matrícula</span><strong>Sí</strong></div>
              </div>
              <div className="my-6 border-t border-dashed border-amber-300" />
              <p className="text-center text-sm font-black uppercase text-blue-800">Precio orientativo</p>
              <p className="mt-2 text-center text-4xl font-black text-blue-900">{formatearEuros(resumen.total)}</p>
              <p className="mt-2 text-center text-xs text-slate-500">
  {resumen.diasTotales > 0
    ? `(${formatearEuros(resumen.total / resumen.diasTotales)} / día)`
    : ""}
</p>
              <p className="mt-2 text-center text-sm text-green-700 font-bold">
  ✅ Inscripción rápida en menos de 1 minuto
</p>
              <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">Este es el precio orientativo según los datos introducidos. El importe final se confirmará tras revisar la inscripción.</p>
              <a href="https://wa.me/34611503688" className="mt-5 flex items-center justify-center rounded-2xl border border-emerald-200 bg-white p-4 text-center font-black text-emerald-700">
                💬 ¿Dudas? 611 503 688
              </a>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 border-t border-blue-100 pt-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Logo className="h-12 w-auto object-contain md:h-14" />
            <div>
              <p className="font-black text-blue-900">El Columpio Animación</p>
              <p className="text-sm text-slate-500">Campus, eventos infantiles y experiencias familiares</p>
            </div>
          </div>
          <a href="https://wa.me/34611503688" className="rounded-2xl bg-emerald-50 px-5 py-3 font-black text-emerald-700 ring-1 ring-emerald-100">
            WhatsApp: 611 503 688
          </a>
        </div>
      </footer>
    </div>
  );
}

