const WHATSAPP_NUMBER = '523312472403';
const ROUTE_TITLES = {
  inicio: 'Dinix | Tecnología práctica para tu negocio',
  soluciones: 'Soluciones | Dinix',
  automatizacion: 'Automatización e IA | Dinix',
  'dinix-usa': 'Dinix USA | Tecnología en español',
  nosotros: 'Nosotros | Dinix',
  contacto: 'Contacto | Dinix',
  diagnostico: 'Diagnóstico | Dinix'
};

/* Configuración central: agrega una URL real para habilitar cada canal. */
const SOCIAL_LINKS = {
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb8SmLD1XqudjBhsP924',
  facebook: 'https://www.facebook.com/dinixtech',
  instagram: 'https://www.instagram.com/dinixtech/',
  tiktok: 'https://www.tiktok.com/@dinixtech?_r=1&_t=ZS-993K8dtfh4f',
  telegram: 'https://t.me/dinixtech'
};

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* Public navigation */
const views = [...document.querySelectorAll('[data-view]')];
const validRoutes = new Set(views.map((view) => view.dataset.view));
const routeLinks = document.querySelectorAll('[data-route-link]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const menuBackdrop = document.querySelector('.menu-backdrop');
let menuScrollPosition = 0;

function getRouteFromHash() {
  const route = decodeURIComponent(window.location.hash.slice(1)).split('/')[0];
  return validRoutes.has(route) ? route : 'inicio';
}

function showRoute(route, { focus = false, scroll = true } = {}) {
  const safeRoute = validRoutes.has(route) ? route : 'inicio';
  let activeView = null;

  views.forEach((view) => {
    const isActive = view.dataset.view === safeRoute;
    view.hidden = !isActive;
    view.classList.toggle('is-active', isActive);
    view.setAttribute('aria-hidden', String(!isActive));
    if (isActive) activeView = view;
  });

  routeLinks.forEach((link) => {
    if (link.dataset.routeLink === safeRoute) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  document.title = ROUTE_TITLES[safeRoute] || ROUTE_TITLES.inicio;
  if (scroll) window.scrollTo(0, 0);
  if (focus && activeView) {
    activeView.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => activeView.focus({ preventScroll: true }));
  }
}

function navigateTo(route) {
  if (!validRoutes.has(route)) route = 'inicio';
  if (getRouteFromHash() === route && window.location.hash) showRoute(route, { focus: true });
  else window.location.hash = route;
}

routeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const route = link.dataset.routeLink;
    if (!route) return;
    if (getRouteFromHash() === route && window.location.hash) {
      event.preventDefault();
      showRoute(route, { focus: true });
    }
    closeMenu();
  });
});

window.addEventListener('hashchange', () => showRoute(getRouteFromHash(), { focus: true }));
showRoute(getRouteFromHash());

function resetInitialRouteScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

window.addEventListener('load', () => {
  resetInitialRouteScroll();
  requestAnimationFrame(() => requestAnimationFrame(resetInitialRouteScroll));
  window.setTimeout(resetInitialRouteScroll, 150);
}, { once: true });

/* Mobile drawer */
function isMenuOpen() {
  return menuButton?.getAttribute('aria-expanded') === 'true';
}

function openMenu() {
  if (!menuButton || !navigation || window.innerWidth >= 1024) return;
  menuScrollPosition = window.scrollY;
  document.documentElement.classList.add('menu-open');
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Cerrar menú');
  navigation.classList.add('is-open');
  menuBackdrop?.classList.add('is-open');
  navigation.querySelector('a')?.focus({ preventScroll: true });
}

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !navigation) return;
  const wasOpen = isMenuOpen();
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('is-open');
  menuBackdrop?.classList.remove('is-open');
  document.documentElement.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  if (wasOpen && window.scrollY !== menuScrollPosition) window.scrollTo(0, menuScrollPosition);
  if (wasOpen && restoreFocus) requestAnimationFrame(() => menuButton.focus({ preventScroll: true }));
}

menuButton?.addEventListener('click', () => isMenuOpen() ? closeMenu({ restoreFocus: true }) : openMenu());
menuBackdrop?.addEventListener('click', () => closeMenu({ restoreFocus: true }));
navigation?.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth >= 1024 && isMenuOpen()) closeMenu(); });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (isMenuOpen()) closeMenu({ restoreFocus: true });
    document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
    if (document.body.classList.contains('sales-open')) closeSalesMode();
    return;
  }
  if (event.key !== 'Tab' || !isMenuOpen() || !navigation || !menuButton) return;
  const items = [menuButton, ...navigation.querySelectorAll('a[href]')];
  const index = items.indexOf(document.activeElement);
  if (event.shiftKey && index <= 0) { event.preventDefault(); items[items.length - 1].focus(); }
  else if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0].focus(); }
});

/* Generic solution tabs */
const solutionTabs = [...document.querySelectorAll('[data-tab]')];
const solutionPanels = [...document.querySelectorAll('[data-tab-panel]')];

function activateSolutionTab(panelId, { focus = false } = {}) {
  solutionTabs.forEach((tab) => {
    const active = tab.dataset.tab === panelId;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  solutionPanels.forEach((panel) => {
    const active = panel.id === panelId;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
}

solutionTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateSolutionTab(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % solutionTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + solutionTabs.length) % solutionTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = solutionTabs.length - 1;
    activateSolutionTab(solutionTabs[next].dataset.tab, { focus: true });
  });
});
activateSolutionTab('solution-help');

/* Cómo te ayudamos */
const processNodes = document.querySelectorAll('[data-process]');
const processNumber = document.getElementById('process-number');
const processTitle = document.getElementById('process-title');
const processCopy = document.getElementById('process-copy');
processNodes.forEach((node, index) => {
  node.setAttribute('aria-pressed', String(index === 0));
  node.addEventListener('click', () => {
    processNodes.forEach((item) => {
      const active = item === node;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (processNumber) processNumber.textContent = String(index + 1).padStart(2, '0');
    if (processTitle) processTitle.textContent = node.dataset.title || '';
    if (processCopy) processCopy.textContent = node.dataset.copy || '';
  });
});

/* Horizontal carousels */
document.querySelectorAll('[data-carousel-prev], [data-carousel-next]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.dataset.carouselPrev || button.dataset.carouselNext;
    const carousel = document.querySelector(`[data-carousel="${id}"]`);
    if (!carousel) return;
    const direction = button.hasAttribute('data-carousel-prev') ? -1 : 1;
    carousel.scrollBy({ left: carousel.clientWidth * .82 * direction, behavior: 'smooth' });
  });
});

/* Según tu negocio */
const BUSINESS_CASES = {
  restaurante:{label:'Restaurante / cafetería',title:'Atiende pedidos sin perder el control del día.',copy:'Conecta cobro, pedidos, inventario, comunicación y seguridad sin llenar tu operación de sistemas innecesarios.',needs:['Pedidos','Punto de venta','Wi-Fi','Cámaras','Inventario','WhatsApp','Reservaciones','Automatización'],packages:'Negocio Organizado + Negocio Conectado',demo:'Pedido → cobro → cocina → seguimiento'},
  tienda:{label:'Tienda / abarrotes',title:'Cobra, controla y repón con más claridad.',copy:'Organiza ventas, existencias, tickets y seguridad para saber qué ocurre sin depender de libretas separadas.',needs:['Punto de venta','Tickets','Inventario','Lectores','Básculas','Cámaras'],packages:'Negocio Equipado + Negocio Seguro',demo:'Producto → cobro → inventario → reporte'},
  boutique:{label:'Boutique / zapatería',title:'Conecta tu catálogo con una venta más ordenada.',copy:'Prepara fotos y fichas de producto, controla inventario sencillo y da seguimiento a clientes interesados.',needs:['Catálogo digital','Fotos','Fichas','Publicaciones','Inventario','Seguimiento','Venta digital'],packages:'Negocio Organizado + Negocio Inteligente',demo:'Foto → catálogo → consulta → seguimiento'},
  taller:{label:'Taller / contratista',title:'Que cada trabajo tenga responsable y siguiente paso.',copy:'Organiza solicitudes, citas, cotizaciones, refacciones y avances para responder sin buscar entre mensajes.',needs:['Clientes','Citas','Cotizaciones','Trabajos','Refacciones','Recordatorios'],packages:'Negocio Organizado + Negocio Automatizado',demo:'Solicitud → cotización → trabajo → entrega'},
  estetica:{label:'Estética / barbería',title:'Convierte mensajes en citas confirmadas.',copy:'Ordena agenda, clientes frecuentes, recordatorios y promociones sin pasar el día respondiendo lo mismo.',needs:['Agenda','Recordatorios','Clientes frecuentes','Promociones','WhatsApp'],packages:'Negocio Automatizado + Negocio Organizado',demo:'Mensaje → horario → confirmación → recordatorio'},
  consultorio:{label:'Consultorio',title:'Atiende citas y documentos con más orden.',copy:'Facilita solicitudes, recordatorios y gestión documental respetando el proceso de atención.',needs:['Citas','Documentos','Recordatorios','Pagos','Seguimiento'],packages:'Negocio Organizado + Negocio Automatizado',demo:'Solicitud → cita → documento → seguimiento'},
  hotel:{label:'Hotel / turismo',title:'Coordina atención, conectividad y seguridad.',copy:'Integra reservaciones, Wi-Fi, cámaras, accesos y seguimiento en una propuesta proporcionada al lugar.',needs:['Reservas','Wi-Fi','Cámaras','Accesos','Atención','Automatización'],packages:'Negocio Conectado + Negocio Seguro',demo:'Consulta → reserva → acceso → atención'},
  rancho:{label:'Productor / rancho',title:'Mantén conectado lo que está lejos.',copy:'Combina internet, cámaras, sensores y datos para observar mejor la operación y tomar decisiones.',needs:['Internet satelital','Sensores','Cámaras','Monitoreo','Datos','Respaldo'],packages:'Negocio Conectado + Negocio Inteligente',demo:'Sensor → conexión → aviso → decisión'},
  fabrica:{label:'Fábrica / oficina',title:'Haz visible lo que sostiene la operación.',copy:'Integra redes, seguridad, equipos, documentos y reportes con una base que pueda crecer por etapas.',needs:['Redes','Cámaras','Sensores','Equipos','Documentos','Reportes'],packages:'Negocio Conectado + Negocio Organizado',demo:'Operación → dato → reporte → acción'}
};

const businessButtons = document.querySelectorAll('[data-business]');
function renderBusiness(key) {
  const data = BUSINESS_CASES[key];
  if (!data) return;
  businessButtons.forEach((button) => { const active = button.dataset.business === key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
  document.getElementById('business-kicker').textContent = data.label;
  document.getElementById('business-title').textContent = data.title;
  document.getElementById('business-copy').textContent = data.copy;
  document.getElementById('business-packages').textContent = data.packages;
  document.getElementById('business-demo-title').textContent = data.demo;
  const tagList = document.getElementById('business-needs');
  tagList.replaceChildren(...data.needs.map((need) => { const tag = document.createElement('span'); tag.textContent = need; return tag; }));
}
businessButtons.forEach((button) => button.addEventListener('click', () => renderBusiness(button.dataset.business)));

/* Proyectos especiales */
const PROJECT_CASES = {
  escuela:{label:'Escuela / universidad',title:'Una operación conectada y protegida.',copy:'Integramos la base tecnológica para alumnos, personal, accesos y administración.',chain:['Redes','Cámaras','Control de acceso','Equipos','Software','Automatización']},
  corporativo:{label:'Corporativo',title:'Una base común para equipos y áreas.',copy:'Conectamos infraestructura, comunicación, seguridad y procesos sin perder claridad.',chain:['Redes','Accesos','Equipos','Software','Datos','Soporte']},
  gobierno:{label:'Gobierno',title:'Tecnología explicada y dimensionada al servicio.',copy:'Estructuramos componentes y responsabilidades para facilitar la validación técnica.',chain:['Diagnóstico','Infraestructura','Seguridad','Software','Documentación','Soporte']},
  hotel:{label:'Hotel',title:'Experiencia del huésped y operación conectadas.',copy:'Integramos conectividad, seguridad, acceso y herramientas de atención.',chain:['Wi-Fi','Cámaras','Accesos','Reservas','Automatización','Soporte']},
  rancho:{label:'Rancho / agroindustria',title:'Conectividad y control donde hacen falta.',copy:'Diseñamos una solución que acerque señales, imágenes y datos a quien decide.',chain:['Internet','Cámaras','Sensores','Conectividad','Control','Datos']},
  fabrica:{label:'Fábrica',title:'Infraestructura que acompaña la operación.',copy:'Integramos red, monitoreo, equipos y datos de acuerdo con el proceso productivo.',chain:['Redes','Cámaras','Sensores','Equipos','Reportes','Respaldo']},
  transporte:{label:'Transporte',title:'Información y seguridad en movimiento.',copy:'Conectamos monitoreo, comunicación y control para facilitar la supervisión.',chain:['Conectividad','Cámaras','Ubicación','Alertas','Control','Reportes']},
  sucursales:{label:'Varias sucursales',title:'Una forma común de trabajar en varios lugares.',copy:'Definimos una base repetible y un control central sin sobredimensionar cada sede.',chain:['Red común','Seguridad','Software','Datos','Automatización','Soporte']}
};

const projectButtons = document.querySelectorAll('[data-project]');
function renderProject(key) {
  const data = PROJECT_CASES[key]; if (!data) return;
  projectButtons.forEach((button) => { const active = button.dataset.project === key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); });
  document.getElementById('project-label').textContent = data.label;
  document.getElementById('project-title').textContent = data.title;
  document.getElementById('project-copy').textContent = data.copy;
  const chain = document.getElementById('project-chain');
  const nodes = [];
  data.chain.forEach((item, index) => { const span = document.createElement('span'); span.textContent = item; nodes.push(span); if (index < data.chain.length - 1) { const plus = document.createElement('i'); plus.textContent = '+'; nodes.push(plus); } });
  chain.replaceChildren(...nodes);
}
projectButtons.forEach((button) => button.addEventListener('click', () => renderProject(button.dataset.project)));

/* Automatización e IA */
const AI_CASES = {
  responder:{
    label:'Responder',
    benefit:'Atiende lo frecuente sin empezar de cero cada vez.',
    tool:'Bot conectado a WhatsApp, chat web o canal de atención.',
    problem:'Las preguntas frecuentes se acumulan y algunas conversaciones quedan sin respuesta.',
    flow:[['Cliente','Envía una pregunta.'],['Bot','Pide los datos que hacen falta.'],['IA','Interpreta la necesidad y la información recibida.'],['Automatización','Responde o clasifica la conversación.'],['Persona','Recibe el caso ordenado cuando debe intervenir.']],
    result:'Menos mensajes sin responder y atención más rápida sin perder el trato humano.'
  },
  cotizar:{
    label:'Cotizar',
    benefit:'Prepara cotizaciones completas con menos captura manual.',
    tool:'Bot o formulario conectado con catálogo, reglas de precio y generador de cotizaciones.',
    problem:'Faltan datos para cotizar y cada solicitud obliga a buscar precios y escribir todo de nuevo.',
    flow:[['Cliente','Solicita precio y describe lo que necesita.'],['Bot o formulario','Obtiene cantidades, medidas y datos de contacto.'],['Sistema','Identifica el producto o servicio solicitado.'],['Automatización','Consulta catálogo y reglas de precio.'],['IA','Prepara un borrador claro de la cotización.'],['Persona','Revisa condiciones y la envía al cliente.']],
    result:'Cotizaciones más rápidas, con la información necesaria y control antes de enviarlas.'
  },
  seguimiento:{
    label:'Dar seguimiento',
    benefit:'Que cada oportunidad tenga un siguiente paso visible.',
    tool:'CRM conectado con automatización de tareas, avisos y registro de actividad.',
    problem:'Los prospectos quedan repartidos entre mensajes y la siguiente llamada depende de la memoria.',
    flow:[['Canal de entrada','Recibe al prospecto desde WhatsApp, web o llamada.'],['CRM','Crea su registro y conserva el contexto.'],['Responsable','Define la siguiente acción y su fecha.'],['Automatización','Vigila cuándo debe realizarse.'],['Sistema','Genera tarea o recordatorio.'],['Equipo','Registra lo ocurrido y programa el siguiente paso.']],
    result:'Seguimiento constante y oportunidades visibles para todo el equipo.'
  },
  resumir:{
    label:'Resumir',
    benefit:'Convierte contenido largo en información lista para actuar.',
    tool:'IA para analizar mensajes, notas, audios y documentos; transcripción cuando hace falta.',
    problem:'La información importante queda escondida en conversaciones, audios o archivos extensos.',
    flow:[['Fuentes','Reciben mensajes, notas, audios o documentos.'],['Transcripción','Convierte el audio en texto cuando corresponde.'],['IA','Analiza el contenido y detecta lo importante.'],['Clasificación','Separa datos, acuerdos y pendientes.'],['Sistema','Genera un resumen breve y utilizable.']],
    result:'Menos tiempo revisando contenido y más claridad sobre acuerdos y pendientes.'
  },
  organizar:{
    label:'Organizar',
    benefit:'Convierte datos dispersos en registros que sí se pueden usar.',
    tool:'Formularios, CRM o base de datos conectados mediante automatización e IA.',
    problem:'Clientes, solicitudes y documentos llegan por distintos lugares y terminan duplicados o incompletos.',
    flow:[['Canales','Reciben datos desde formularios, mensajes y archivos.'],['Formulario','Solicita y normaliza la información necesaria.'],['IA','Clasifica el tipo de solicitud y extrae datos.'],['Automatización','Crea o actualiza el registro correcto.'],['CRM o base','Muestra responsables, estado y siguiente acción.']],
    result:'Información consistente, localizable y preparada para operar o dar seguimiento.'
  },
  recordar:{
    label:'Recordar',
    benefit:'Actúa a tiempo sin depender de revisar una lista todo el día.',
    tool:'CRM o gestor de tareas conectado con una automatización programada.',
    problem:'Compromisos, renovaciones y fechas importantes se olvidan cuando aumenta el trabajo.',
    flow:[['Persona o sistema','Registra la tarea o el compromiso.'],['Gestor','Guarda responsable, fecha y prioridad.'],['Automatización','Monitorea el vencimiento.'],['Aviso','Llega por el canal y momento definidos.'],['Control','Cierra la tarea o escala el seguimiento si sigue pendiente.']],
    result:'Menos vencimientos olvidados y responsables claros para cada compromiso.'
  }
};

const aiButtons = document.querySelectorAll('[data-ai-case]');
const aiCasePanel = document.getElementById('ai-case-panel');

function restartPanelTransition(panel) {
  if (!panel) return;
  panel.classList.remove('is-refreshing');
  requestAnimationFrame(() => panel.classList.add('is-refreshing'));
}

function renderAiCase(key) {
  const data = AI_CASES[key]; if (!data) return;
  aiButtons.forEach((button) => { const active = button.dataset.aiCase === key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
  const activeButton = [...aiButtons].find((button) => button.dataset.aiCase === key);
  if (activeButton && aiCasePanel) aiCasePanel.setAttribute('aria-labelledby', activeButton.id);
  document.getElementById('ai-case-label').textContent = data.label;
  document.getElementById('ai-case-benefit').textContent = data.benefit;
  document.getElementById('ai-case-tool').textContent = data.tool;
  document.getElementById('ai-case-problem').textContent = data.problem;
  document.getElementById('ai-case-result').textContent = data.result;
  const flow = document.getElementById('ai-flow'); const nodes = [];
  data.flow.forEach(([actor, action]) => {
    const item = document.createElement('li');
    const label = document.createElement('b');
    const copy = document.createElement('span');
    label.textContent = actor;
    copy.textContent = action;
    item.append(label, copy);
    nodes.push(item);
  });
  flow.replaceChildren(...nodes);
  restartPanelTransition(aiCasePanel);
}
aiButtons.forEach((button) => button.addEventListener('click', () => renderAiCase(button.dataset.aiCase)));

/* Dinix USA remote examples */
const USA_CASES = {
  dinix:{label:'Dinix USA',title:'Usa la tecnología de tu negocio con más confianza.',copy:'Desde México te ayudamos a entender, configurar y aprovechar herramientas que normalmente encuentras en inglés.',flow:['Lo que ya usas','Explicación en español','Configuración','Uso con confianza']},
  programas:{label:'Programas y herramientas',title:'Entiende qué hace cada programa y úsalo en tu operación.',copy:'Te explicamos menús, funciones y procesos en español para que dejes de trabajar por ensayo y error.',flow:['Programa en inglés','Explicación clara','Configuración','Uso diario']},
  hardware:{label:'Hardware y equipos',title:'Elige equipo compatible sin comprar de más.',copy:'Revisamos lo que ya tienes y te orientamos sobre computadoras, cámaras o periféricos que realmente hagan falta.',flow:['Necesidad','Compatibilidad','Recomendación','Puesta en marcha']},
  ia:{label:'Automatización e IA',title:'Quita tareas repetitivas sin perder el control.',copy:'Conectamos herramientas para responder, organizar, recordar y dar seguimiento cuando realmente conviene.',flow:['Tarea manual','Automatización','Revisión humana','Seguimiento']},
  capacitacion:{label:'Capacitación en español',title:'Aprende paso a paso, sin tecnicismos.',copy:'Trabajamos sobre tus herramientas reales y te enseñamos lo necesario para que puedas usarlas con seguridad.',flow:['Duda','Demostración','Práctica','Confianza']},
  soporte:{label:'Soporte remoto',title:'Ayuda en español cuando una herramienta se atora.',copy:'Revisamos configuración y uso a distancia cuando el servicio puede resolverse remotamente.',flow:['Problema','Revisión remota','Ajuste','Explicación']},
  casos:{label:'Casos de uso',title:'Aterrizamos la tecnología en situaciones concretas.',copy:'Pedidos, seguimiento, documentos, cámaras, inventario o atención: empezamos por el problema que hoy te quita tiempo.',flow:['Situación real','Objetivo','Solución práctica','Acompañamiento']}
};

const usaButtons = document.querySelectorAll('[data-usa-case]');
const usaCasePanel = document.getElementById('usa-case-panel');
function renderUsaCase(key) {
  const data = USA_CASES[key]; if (!data) return;
  usaButtons.forEach((button) => { const active = button.dataset.usaCase === key; button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
  const activeButton = [...usaButtons].find((button) => button.dataset.usaCase === key);
  if (activeButton && usaCasePanel) usaCasePanel.setAttribute('aria-labelledby', activeButton.id);
  document.getElementById('usa-case-label').textContent = data.label;
  document.getElementById('usa-case-title').textContent = data.title;
  document.getElementById('usa-case-copy').textContent = data.copy;
  const flow = document.getElementById('usa-case-flow'); const nodes = [];
  data.flow.forEach((item, index) => { const span = document.createElement('span'); span.textContent = item; nodes.push(span); if (index < data.flow.length - 1) { const arrow = document.createElement('i'); arrow.textContent = '→'; nodes.push(arrow); } });
  flow.replaceChildren(...nodes);
  restartPanelTransition(usaCasePanel);
}
usaButtons.forEach((button) => button.addEventListener('click', () => renderUsaCase(button.dataset.usaCase)));

function enableArrowTabs(buttons) {
  buttons.forEach((button, index) => {
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = buttons.length - 1;
      buttons[nextIndex].focus();
      buttons[nextIndex].click();
    });
  });
}

enableArrowTabs(aiButtons);
enableArrowTabs(usaButtons);

/* Context links */
const contactNeed = document.getElementById('contact-need');
const diagnosisText = document.getElementById('diagnosis-text');
document.querySelectorAll('[data-interest]').forEach((link) => {
  link.addEventListener('click', () => {
    const interest = link.dataset.interest;
    if (contactNeed) contactNeed.value = `Quiero conocer más sobre ${interest}.`;
    if (diagnosisText) diagnosisText.value = `Quiero conocer más sobre ${interest}.`;
  });
});

/* Contact form -> user-controlled WhatsApp */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const data = new FormData(contactForm);
  const message = ['Hola, quiero orientación de Dinix.','',`Nombre: ${data.get('name') || ''}`,`Negocio: ${data.get('business') || 'No indicado'}`,`Ciudad / país: ${data.get('location') || ''}`,`WhatsApp o teléfono: ${data.get('phone') || ''}`,`Quiero mejorar: ${data.get('need') || ''}`,`Prefiero contacto: ${data.get('preference') || 'Por WhatsApp'}`].join('\n');
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
});

/* Social channels without invented URLs */
document.querySelectorAll('[data-social]').forEach((button) => {
  const url = SOCIAL_LINKS[button.dataset.social];
  if (!url) { button.disabled = true; button.setAttribute('aria-disabled', 'true'); button.title = 'Canal pendiente de configurar'; return; }
  button.disabled = false;
  button.removeAttribute('aria-disabled');
  button.removeAttribute('title');
  button.classList.add('is-live');
  button.addEventListener('click', () => window.open(url, '_blank', 'noopener,noreferrer'));
});

/* Diagnosis: files stay local; only filenames are included in the prepared message. */
const diagnosisForm = document.getElementById('diagnosis-form');
const audioStatus = document.getElementById('audio-status');
const videoStatus = document.getElementById('video-status');
const audioRemove = document.querySelector('[data-clear-file="audio"]');
const videoRemove = document.querySelector('[data-clear-file="video"]');
const audioRecordStart = document.querySelector('[data-audio-record-start]');
const audioRecordStop = document.querySelector('[data-audio-record-stop]');
const audioRecordAgain = document.querySelector('[data-audio-record-again]');
const audioRecordDownload = document.querySelector('[data-audio-record-download]');
const audioRecorderPanel = document.querySelector('[data-audio-recorder-panel]');
const audioRecorderState = document.getElementById('audio-recorder-state');
const audioRecorderTime = document.getElementById('audio-recorder-time');
const audioRecorderPreview = document.getElementById('audio-recorder-preview');
const audioRecorderHelp = document.getElementById('audio-recorder-help');
const audioFallbackInput = document.getElementById('diagnosis-audio-fallback');
const diagnosisResult = document.getElementById('diagnosis-result');
const diagnosisTalk = document.getElementById('diagnosis-talk');
const diagnosisWait = document.getElementById('diagnosis-wait');
const mediaSelections = { audio: null, video: null };
const mediaInputs = {
  audio: [...document.querySelectorAll('[data-media-input="audio"]')],
  video: [...document.querySelectorAll('[data-media-input="video"]')]
};
const mediaStatus = { audio: audioStatus, video: videoStatus };
const mediaRemove = { audio: audioRemove, video: videoRemove };
let audioRecorder = null;
let audioStream = null;
let audioChunks = [];
let audioPreviewUrl = '';
let audioTimerId = 0;
let audioStartedAt = 0;

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function updateFileStatus(type) {
  const target = mediaStatus[type];
  const removeButton = mediaRemove[type];
  if (!target) return;
  const selection = mediaSelections[type];
  const file = selection?.file;
  const size = file ? formatFileSize(file.size) : '';
  const label = type === 'audio' ? 'Audio' : 'Video';
  target.textContent = file ? `${label} ${selection.action} listo en tu dispositivo: ${file.name}${size ? ` · ${size}` : ''}` : `Ningún ${label.toLowerCase()} seleccionado.`;
  if (removeButton) removeButton.hidden = !file;
}

function selectMediaFile(input) {
  const type = input.dataset.mediaInput;
  const file = input.files?.[0];
  if (!type || !file || !(type in mediaSelections)) return;
  if (type === 'audio') resetAudioRecorderUi({ hidePanel: true });
  mediaInputs[type].forEach((otherInput) => { if (otherInput !== input) otherInput.value = ''; });
  mediaSelections[type] = { file, action: input.dataset.mediaAction || 'seleccionado' };
  updateFileStatus(type);
}

function clearSelectedFile(type) {
  if (!(type in mediaSelections)) return;
  mediaInputs[type].forEach((input) => { input.value = ''; });
  mediaSelections[type] = null;
  if (type === 'audio') resetAudioRecorderUi({ hidePanel: true });
  updateFileStatus(type);
}

function supportsInPageAudioRecording() {
  return Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
}

function releaseAudioStream() {
  audioStream?.getTracks().forEach((track) => track.stop());
  audioStream = null;
}

function clearAudioTimer({ reset = true } = {}) {
  window.clearInterval(audioTimerId);
  audioTimerId = 0;
  if (reset && audioRecorderTime) {
    audioRecorderTime.textContent = '00:00';
    audioRecorderTime.dateTime = 'PT0S';
  }
}

function updateAudioTimer() {
  if (!audioRecorderTime || !audioStartedAt) return;
  const seconds = Math.max(0, Math.floor((Date.now() - audioStartedAt) / 1000));
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  audioRecorderTime.textContent = `${minutes}:${remainder}`;
  audioRecorderTime.dateTime = `PT${seconds}S`;
}

function revokeAudioPreview() {
  if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
  audioPreviewUrl = '';
  if (audioRecordDownload) {
    audioRecordDownload.removeAttribute('href');
    audioRecordDownload.removeAttribute('download');
    audioRecordDownload.hidden = true;
  }
  if (!audioRecorderPreview) return;
  audioRecorderPreview.pause();
  audioRecorderPreview.removeAttribute('src');
  audioRecorderPreview.load();
  audioRecorderPreview.hidden = true;
}

function cancelActiveAudioRecording() {
  if (audioRecorder && audioRecorder.state !== 'inactive') {
    audioRecorder.ondataavailable = null;
    audioRecorder.onstop = null;
    audioRecorder.onerror = null;
    audioRecorder.stop();
  }
  audioRecorder = null;
  audioChunks = [];
  releaseAudioStream();
  clearAudioTimer();
}

function resetAudioRecorderUi({ hidePanel = false } = {}) {
  cancelActiveAudioRecording();
  revokeAudioPreview();
  audioRecorderPanel?.classList.remove('is-recording');
  audioRecordStart?.classList.remove('is-recording');
  audioRecordStart?.setAttribute('aria-pressed', 'false');
  if (audioRecordStart) audioRecordStart.disabled = false;
  if (audioRecordStop) audioRecordStop.disabled = true;
  if (audioRecordAgain) audioRecordAgain.hidden = true;
  if (audioRecorderState) audioRecorderState.textContent = 'Listo para grabar.';
  if (audioRecorderHelp) audioRecorderHelp.textContent = 'La grabación se conserva temporalmente en este dispositivo. Nada se envía automáticamente.';
  if (audioRecorderPanel && hidePanel) audioRecorderPanel.hidden = true;
}

function preferredAudioMimeType() {
  if (!window.MediaRecorder?.isTypeSupported) return '';
  return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function audioExtension(mimeType) {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  return 'webm';
}

async function startAudioRecording() {
  if (!supportsInPageAudioRecording()) {
    if (audioRecorderPanel) audioRecorderPanel.hidden = false;
    if (audioRecorderState) audioRecorderState.textContent = 'La grabadora interna no está disponible en este navegador.';
    if (audioRecorderHelp) audioRecorderHelp.textContent = 'Usaremos la opción de captura compatible del dispositivo como alternativa.';
    audioFallbackInput?.click();
    return;
  }

  cancelActiveAudioRecording();
  revokeAudioPreview();
  mediaInputs.audio.forEach((input) => { input.value = ''; });
  mediaSelections.audio = null;
  updateFileStatus('audio');
  if (audioRecorderPanel) audioRecorderPanel.hidden = false;
  if (audioRecorderState) audioRecorderState.textContent = 'Solicitando permiso para usar el micrófono…';
  if (audioRecorderHelp) audioRecorderHelp.textContent = 'Permite el micrófono para crear una nota nueva dentro de esta página.';
  if (audioRecordStart) audioRecordStart.disabled = true;
  if (audioRecordAgain) audioRecordAgain.hidden = true;

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = preferredAudioMimeType();
    const recorder = mimeType ? new MediaRecorder(audioStream, { mimeType }) : new MediaRecorder(audioStream);
    audioRecorder = recorder;
    audioChunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data?.size) audioChunks.push(event.data);
    };

    recorder.onstop = () => {
      clearAudioTimer({ reset: false });
      releaseAudioStream();
      audioRecorder = null;
      const recordedType = recorder.mimeType || mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunks, { type: recordedType });
      audioChunks = [];

      if (!audioBlob.size) {
        if (audioRecorderState) audioRecorderState.textContent = 'No se pudo crear el audio. Intenta grabarlo otra vez.';
        if (audioRecordStart) audioRecordStart.disabled = false;
        if (audioRecordStop) audioRecordStop.disabled = true;
        return;
      }

      const filename = `diagnostico-dinix-${Date.now()}.${audioExtension(recordedType)}`;
      const file = new File([audioBlob], filename, { type: recordedType, lastModified: Date.now() });
      mediaSelections.audio = { file, action: 'grabado' };
      audioPreviewUrl = URL.createObjectURL(audioBlob);
      if (audioRecorderPreview) {
        audioRecorderPreview.src = audioPreviewUrl;
        audioRecorderPreview.hidden = false;
      }
      if (audioRecordDownload) {
        audioRecordDownload.href = audioPreviewUrl;
        audioRecordDownload.download = filename;
        audioRecordDownload.hidden = false;
      }
      if (audioRecorderState) audioRecorderState.textContent = 'Grabación lista. Puedes escucharla antes de continuar.';
      if (audioRecorderHelp) audioRecorderHelp.textContent = 'Si no te convence, elimínala o toca “Volver a grabar”.';
      audioRecorderPanel?.classList.remove('is-recording');
      audioRecordStart?.classList.remove('is-recording');
      audioRecordStart?.setAttribute('aria-pressed', 'false');
      if (audioRecordStart) audioRecordStart.disabled = false;
      if (audioRecordStop) audioRecordStop.disabled = true;
      if (audioRecordAgain) audioRecordAgain.hidden = false;
      updateFileStatus('audio');
    };

    recorder.onerror = () => {
      releaseAudioStream();
      clearAudioTimer();
      audioRecorderPanel?.classList.remove('is-recording');
      if (audioRecorderState) audioRecorderState.textContent = 'La grabación se interrumpió. Inténtalo nuevamente.';
      if (audioRecordStart) audioRecordStart.disabled = false;
      if (audioRecordStop) audioRecordStop.disabled = true;
    };

    recorder.start(250);
    audioStartedAt = Date.now();
    updateAudioTimer();
    audioTimerId = window.setInterval(updateAudioTimer, 250);
    audioRecorderPanel?.classList.add('is-recording');
    audioRecordStart?.classList.add('is-recording');
    audioRecordStart?.setAttribute('aria-pressed', 'true');
    if (audioRecordStop) audioRecordStop.disabled = false;
    if (audioRecorderState) audioRecorderState.textContent = 'Grabando… habla cerca del micrófono.';
    if (audioRecorderHelp) audioRecorderHelp.textContent = 'Toca “Detener” cuando termines.';
  } catch (error) {
    releaseAudioStream();
    clearAudioTimer();
    audioRecorderPanel?.classList.remove('is-recording');
    if (audioRecordStart) audioRecordStart.disabled = false;
    if (audioRecordStop) audioRecordStop.disabled = true;
    if (audioRecorderState) audioRecorderState.textContent = error?.name === 'NotAllowedError' ? 'No se concedió permiso para usar el micrófono.' : 'No fue posible iniciar el micrófono.';
    if (audioRecorderHelp) audioRecorderHelp.textContent = 'Revisa el permiso del navegador e inténtalo de nuevo. También puedes subir un audio existente.';
  }
}

function stopAudioRecording() {
  if (audioRecorder?.state === 'recording') audioRecorder.stop();
}

Object.values(mediaInputs).flat().forEach((input) => input.addEventListener('change', () => selectMediaFile(input)));
audioRecordStart?.addEventListener('click', startAudioRecording);
audioRecordStop?.addEventListener('click', stopAudioRecording);
audioRecordAgain?.addEventListener('click', startAudioRecording);
audioRemove?.addEventListener('click', () => clearSelectedFile('audio'));
videoRemove?.addEventListener('click', () => clearSelectedFile('video'));
window.addEventListener('pagehide', () => {
  cancelActiveAudioRecording();
  revokeAudioPreview();
});

diagnosisForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const story = diagnosisText?.value.trim() || '';
  const areas = [...diagnosisForm.querySelectorAll('input[name="areas"]:checked')].map((input) => input.value);
  const audio = mediaSelections.audio;
  const video = mediaSelections.video;

  if (!story && !areas.length && !audio?.file && !video?.file) {
    diagnosisText?.setCustomValidity('Escribe algo, elige una opción o selecciona un archivo.');
    diagnosisText?.reportValidity();
    return;
  }
  diagnosisText?.setCustomValidity('');

  const message = ['Hola, preparé un diagnóstico para Dinix.','',`Lo que está pasando: ${story || 'Prefiero explicarlo por audio o video.'}`,`Áreas que quiero mejorar: ${areas.length ? areas.join(', ') : 'No seleccionadas'}`,audio?.file ? `Audio ${audio.action}: ${audio.file.name} (lo adjuntaré manualmente).` : '',video?.file ? `Video ${video.action}: ${video.file.name} (lo adjuntaré manualmente).` : ''].filter(Boolean).join('\n');
  const waitMessage = `${message}\n\nPrefiero que Dinix revise este contexto y me contacte.`;
  if (diagnosisTalk) diagnosisTalk.href = buildWhatsAppUrl(message);
  if (diagnosisWait) diagnosisWait.href = buildWhatsAppUrl(waitMessage);
  if (diagnosisResult) { diagnosisResult.hidden = false; diagnosisResult.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
});
diagnosisText?.addEventListener('input', () => diagnosisText.setCustomValidity(''));

/* Legal dialogs */
const legalDialog = document.getElementById('legal-dialog');
const legalTitle = document.getElementById('legal-title');
const legalCopy = document.getElementById('legal-copy');
function openDialog(dialog) { if (!dialog) return; if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', ''); }
document.querySelectorAll('[data-legal]').forEach((button) => button.addEventListener('click', () => {
  const privacy = button.dataset.legal === 'privacy';
  if (legalTitle) legalTitle.textContent = privacy ? 'Aviso de privacidad' : 'Términos de uso';
  if (legalCopy) legalCopy.innerHTML = privacy ? '<p>Esta versión del sitio no almacena formularios en un servidor. Los mensajes se preparan localmente y sólo se comparten cuando el usuario decide enviarlos mediante WhatsApp.</p><p>Antes de habilitar CRM, carga de archivos o almacenamiento, Dinix deberá publicar el documento legal completo correspondiente.</p>' : '<p>La información del sitio es orientativa. El alcance, disponibilidad, tiempos y condiciones de cada solución se confirman mediante una propuesta específica.</p><p>Este texto debe revisarse y sustituirse por los términos legales definitivos antes de habilitar pagos, cuentas o contratación en línea.</p>';
  openDialog(legalDialog);
}));
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));

/* Discreet internal presentation; intentionally removed from public navigation. */
const salesRoutes = ['inicio','soluciones','automatizacion','dinix-usa','nosotros','contacto','diagnostico'];
const salesToolbar = document.getElementById('sales-toolbar');
const salesCounter = document.getElementById('sales-counter');
const salesTitle = document.getElementById('sales-title');
const salesPrevious = document.querySelector('[data-sales-prev]');
const salesNext = document.querySelector('[data-sales-next]');
let salesIndex = 0;

function updateSalesToolbar() {
  const route = salesRoutes[salesIndex];
  if (salesCounter) salesCounter.textContent = `${salesIndex + 1} / ${salesRoutes.length}`;
  if (salesTitle) salesTitle.textContent = ROUTE_TITLES[route].split(' | ')[0];
  if (salesPrevious) salesPrevious.disabled = salesIndex === 0;
  if (salesNext) salesNext.innerHTML = salesIndex === salesRoutes.length - 1 ? 'Finalizar' : 'Siguiente <span aria-hidden="true">→</span>';
}
function goToSalesIndex(index) { salesIndex = Math.max(0, Math.min(index, salesRoutes.length - 1)); updateSalesToolbar(); navigateTo(salesRoutes[salesIndex]); }
function openSalesMode() { document.body.classList.add('sales-open'); salesToolbar?.classList.add('is-open'); salesToolbar?.setAttribute('aria-hidden', 'false'); goToSalesIndex(0); }
function closeSalesMode() { document.body.classList.remove('sales-open'); salesToolbar?.classList.remove('is-open'); salesToolbar?.setAttribute('aria-hidden', 'true'); }
document.querySelectorAll('[data-sales-start]').forEach((button) => button.addEventListener('click', openSalesMode));
document.querySelector('[data-sales-close]')?.addEventListener('click', closeSalesMode);
salesPrevious?.addEventListener('click', () => goToSalesIndex(salesIndex - 1));
salesNext?.addEventListener('click', () => salesIndex === salesRoutes.length - 1 ? closeSalesMode() : goToSalesIndex(salesIndex + 1));
document.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey && event.altKey && event.key.toLowerCase() === 'p')) return;
  event.preventDefault();
  document.body.classList.contains('sales-open') ? closeSalesMode() : openSalesMode();
});
if (new URLSearchParams(window.location.search).get('modo') === 'vendedor') openSalesMode();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
