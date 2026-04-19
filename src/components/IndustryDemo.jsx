import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT, useI18n } from '../i18n/I18nProvider';
import { t as Trans } from '../i18n/translations';
import './IndustryDemo.css';

const INDUSTRY_I18N_KEYS = {
  hospitality: 'hospitality', clinics: 'clinics', realestate: 'realestate',
  barbershop: 'barbershop', optical: 'optical', hardware: 'hardware',
  veterinary: 'veterinary', buildsupply: 'buildsupply', accounting: 'accounting',
  supermarket: 'supermarket', gym: 'gym', law: 'law',
  photography: 'photography', cardealer: 'cardealer', cafe: 'cafe',
  school: 'school', retail: 'retail', bakery: 'bakery',
  bank: 'bank', tattoo: 'tattoo',
};

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════
   DASHBOARD I18N — en→es dictionary
   ═══════════════════════════════════════════════════ */
const DASH_ES = {
  // ── Shared / Nav ──
  'Overview': 'Vista general', 'Reservations': 'Reservas', 'Rooms': 'Habitaciones',
  'Staff': 'Personal', 'Revenue': 'Ingresos', 'Schedule': 'Agenda', 'Patients': 'Pacientes',
  'Reports': 'Reportes', 'Listings': 'Propiedades', 'Leads': 'Leads', 'Calendar': 'Calendario',
  'Bookings': 'Reservas', 'Services': 'Servicios', 'Appointments': 'Turnos',
  'Reminders': 'Recordatorios', 'Prescriptions': 'Recetas', 'Catalog': 'Catálogo',
  'Cases': 'Causas', 'Clients': 'Clientes', 'Documents': 'Documentos', 'Billing': 'Facturación',
  'Consultations': 'Consultas', 'Portfolio': 'Portfolio', 'Gallery Delivery': 'Entrega de galerías',
  'Inventory': 'Inventario', 'Test Drives': 'Pruebas de manejo', 'Orders': 'Pedidos',
  'Menu': 'Menú', 'Events': 'Eventos', 'Classes': 'Clases', 'Members': 'Miembros',
  'Trainers': 'Entrenadores', 'Students': 'Estudiantes', 'Communications': 'Comunicaciones',
  'Deadlines': 'Vencimientos', 'Promotions': 'Promociones', 'Materials': 'Materiales',
  'Quotes': 'Presupuestos', 'Delivery': 'Entregas', 'Trade Accounts': 'Cuentas corrientes',
  'Artists': 'Artistas', 'Pre-orders': 'Pre-pedidos', 'Daily Menu': 'Menú del día',
  'Client Portal': 'Portal de clientes', 'In-Store': 'En tienda', 'Online': 'Online',
  'Counter': 'Mostrador',

  // ── Dashboard titles ──
  'Hotel Dashboard': 'Panel del Hotel', 'Clinic Dashboard': 'Panel de Clínica',
  'Real Estate CRM': 'CRM Inmobiliaria', 'Barbershop': 'Barbería',
  'Barbershop Manager': 'Gestor de Barbería', 'Vet Clinic': 'Clínica Veterinaria',
  'Veterinary Dashboard': 'Panel Veterinaria', 'Gym Dashboard': 'Panel del Gimnasio',
  'Gym & Fitness': 'Gimnasio', 'Optical Store': 'Óptica',
  'Optical Dashboard': 'Panel de Óptica', 'Law Firm': 'Estudio Jurídico',
  'Law Firm Dashboard': 'Panel Estudio Jurídico', 'Accounting': 'Contabilidad',
  'Accounting Studio': 'Estudio Contable', 'Hardware Dashboard': 'Panel de Ferretería',
  'Hardware Store': 'Ferretería', 'Corralón Dashboard': 'Panel del Corralón',
  'Building Supply': 'Corralón', 'Photo Dashboard': 'Panel de Fotografía',
  'Photography Studio': 'Estudio Fotográfico', 'Dealer Dashboard': 'Panel de Concesionaria',
  'Car Dealership': 'Concesionaria', 'Café Dashboard': 'Panel de Cafetería',
  'Café & Coffee': 'Cafetería', 'School Dashboard': 'Panel de Escuela',
  'School & Academy': 'Escuela y Academia', 'Retail Dashboard': 'Panel de Comercio',
  'Retail & Commerce': 'Comercio Minorista', 'Bakery Dashboard': 'Panel de Panadería',
  'Bakery & Pastry': 'Panadería y Pastelería', 'Finance Dashboard': 'Panel Financiero',
  'Financial Services': 'Servicios Financieros', 'Tattoo Dashboard': 'Panel de Tatuajes',
  'Tattoo Studio': 'Estudio de Tatuajes', 'Super Dashboard': 'Panel de Supermercado',
  'Supermarket': 'Supermercado',

  // ── Stat labels ──
  'Occupied Rooms': 'Habitaciones ocupadas', 'Check-ins Today': 'Check-ins hoy',
  'Check-outs Today': 'Check-outs hoy', 'Monthly Revenue': 'Ingresos mensuales',
  'Appointments Today': 'Turnos hoy', 'No-shows Prevented': 'Ausencias prevenidas',
  'Patients Waiting': 'Pacientes en espera', 'New Patients': 'Pacientes nuevos',
  'Total Appointments': 'Total de turnos', 'Cancellation Rate': 'Tasa de cancelación',
  'Avg. Wait Time': 'Tiempo de espera prom.', 'Active Listings': 'Propiedades activas',
  'New Inquiries Today': 'Consultas nuevas hoy', 'Hot Leads': 'Leads calientes',
  'Qualified Leads': 'Leads calificados', 'Walk-ins Today': 'Sin turno hoy',
  'Top Service': 'Servicio principal', 'Bookings (month)': 'Reservas (mes)',
  'Today\'s Appointments': 'Turnos de hoy', 'Patients Today': 'Pacientes hoy',
  'Visits Scheduled': 'Visitas programadas', 'Surgeries Scheduled': 'Cirugías programadas',
  'Active Members': 'Miembros activos', 'Classes Today': 'Clases hoy',
  'Appointments (week)': 'Turnos (semana)', 'Frames Sold': 'Monturas vendidas',
  'Active Cases': 'Causas activas',
  'Pending Docs': 'Docs pendientes', 'Monthly Billing': 'Facturación mensual',
  'Active Clients': 'Clientes activos', 'This Month Billed': 'Facturado este mes',
  'Pending Payments': 'Pagos pendientes', 'Overdue': 'Vencido',
  'Pending Quotes': 'Presupuestos pendientes', 'Active Deliveries': 'Entregas activas',
  'Low Stock Items': 'Items con bajo stock', 'Quotes Today': 'Presupuestos hoy',
  'Sessions This Month': 'Sesiones este mes', 'Pending Edits': 'Ediciones pendientes',
  'Galleries Delivered': 'Galerías entregadas', 'Avg. Session': 'Sesión prom.',
  'Cars Available': 'Autos disponibles', 'Test Drives (week)': 'Pruebas (semana)',
  'Leads Qualified': 'Leads calificados', 'Orders Today': 'Pedidos hoy',
  'Loyalty Members': 'Miembros fidelidad', 'Avg. Ticket': 'Ticket promedio',
  'Enrolled Students': 'Estudiantes inscriptos', 'Pending Enrollments': 'Inscripciones pendientes',
  'Enrollment Fees': 'Cuotas de inscripción', 'Units Sold': 'Unidades vendidas',
  'Products Live': 'Productos activos', 'Low Stock': 'Stock bajo',
  'Online Sales': 'Ventas online', 'In-Store Sales': 'Ventas en tienda',
  'Pre-orders Today': 'Pre-pedidos hoy', 'Pending Pickups': 'Retiros pendientes',
  'Avg Ticket': 'Ticket promedio', 'Walk-in': 'Sin turno',
  'Pending Deposits': 'Señas pendientes', 'Deposits Collected': 'Señas cobradas',
  'MRR': 'Ingresos recurrentes', 'Commissions': 'Comisiones', 'Fees': 'Honorarios',
  'Advisory': 'Asesoramiento', 'Outstanding': 'Pendiente', 'Awaiting Review': 'En revisión',
  'Hourly Rate': 'Tarifa/hora', 'Target Progress': 'Progreso objetivo',
  'Avg Daily': 'Diario prom.', 'Avg. Daily': 'Diario prom.', 'Occupancy': 'Ocupación',
  'Change': 'Variación', 'Growth': 'Crecimiento', 'vs Last Week': 'vs semana pasada',
  'Progress': 'Progreso', 'Target': 'Objetivo', 'Last Month': 'Mes anterior',
  'This Month': 'Este mes', 'Total Monthly': 'Total mensual', 'AOV': 'Ticket prom.',
  'Tuition': 'Cuotas', 'Check-ins': 'Check-ins', 'Extras': 'Extras',

  // ── Panel titles ──
  "Today's Arrivals": 'Llegadas de hoy', 'Room Status': 'Estado de habitaciones',
  'Staff Schedule Today': 'Agenda del personal hoy', 'Upcoming Deliveries': 'Entregas próximas',
  'Room Management — 24 Rooms': 'Gestión de habitaciones — 24 habitaciones',
  'Staff Management': 'Gestión del personal', '7-Day Revenue': 'Ingresos 7 días',
  'Revenue Breakdown': 'Desglose de ingresos', "Today's Schedule": 'Agenda de hoy',
  'Reminder Status': 'Estado de recordatorios', 'Full Day Schedule': 'Agenda completa',
  'Patient Records': 'Fichas de pacientes', 'Weekly Revenue': 'Ingresos semanales',
  'Top Procedures': 'Procedimientos principales', 'Conversion Funnel': 'Embudo de conversión',
  'Lead Pipeline': 'Pipeline de leads',
  'Property Listings': 'Listado de propiedades', 'Weekly Visit Calendar': 'Calendario semanal de visitas',
  "This Week's Visits": 'Visitas de esta semana', 'Service Menu — click values to edit': 'Menú de servicios — click para editar',
  'All Bookings': 'Todas las reservas', 'Revenue by Service': 'Ingresos por servicio',
  'Barbers Today': 'Barberos hoy', 'Chair Status': 'Estado de sillas',
  'Pending Reminders': 'Recordatorios pendientes',
  'Patient Database': 'Base de pacientes', "This Week's Classes — click Book to reserve": 'Clases de esta semana — click Reservar',
  'Active Memberships by Plan': 'Membresías activas por plan', 'Live Check-ins': 'Check-ins en vivo',
  "Today's Classes": 'Clases de hoy', 'Recent Prescriptions': 'Recetas recientes',
  'All Appointments Today': 'Todos los turnos de hoy', 'Top Brands by Sales': 'Marcas más vendidas',
  'Upcoming Consultations': 'Próximas consultas', 'Recent Activity': 'Actividad reciente',
  'Pending Documents': 'Documentos pendientes',
  'Upcoming Deadlines': 'Próximos vencimientos', "All Deadlines — sorted by urgency": 'Todos los vencimientos — por urgencia',
  'Pending Invoices': 'Facturas pendientes', "Top 5 Clients by Billing": 'Top 5 clientes por facturación',
  'Revenue by Category': 'Ingresos por categoría', 'Recent Quotes': 'Presupuestos recientes',
  'Material Categories': 'Categorías de materiales', 'Top Materials by Revenue': 'Materiales por ingresos',
  'Scheduled Deliveries': 'Entregas programadas', 'Fleet Status': 'Estado de flota',
  'Documents to Request': 'Documentos a solicitar',
  'Portfolio Gallery': 'Galería de portfolio', 'Pending Galleries': 'Galerías pendientes',
  'Upcoming Sessions': 'Próximas sesiones', 'Revenue by Package': 'Ingresos por paquete',
  'Vehicle Inventory': 'Inventario de vehículos', "This Week's Test Drives": 'Pruebas de manejo de esta semana',
  "Today's Test Drives": 'Pruebas de manejo de hoy', 'Channel Breakdown': 'Desglose por canal',
  'Active Orders': 'Pedidos activos', 'Menu Items': 'Items del menú',
  'Upcoming Events': 'Próximos eventos', 'Top Items Today': 'Items más vendidos hoy',
  'Revenue by Time of Day': 'Ingresos por franja horaria', 'Weekly Schedule': 'Horario semanal',
  'Recent Communications': 'Comunicaciones recientes', 'Monthly Breakdown': 'Desglose mensual',
  "Today's Orders": 'Pedidos de hoy', "Today's Pre-orders": 'Pre-pedidos de hoy',
  "Today's Deliveries": 'Entregas de hoy', "All Pre-orders": 'Todos los pre-pedidos',
  'Product Catalog': 'Catálogo de productos', 'Top Products by Revenue': 'Productos por ingresos',
  'Recent Orders': 'Pedidos recientes', 'Top 5 Products': 'Top 5 productos',
  'Active Promotions': 'Promociones activas', 'Sales by Seller': 'Ventas por vendedor',
  'Revenue by Artist': 'Ingresos por artista', 'Response Time': 'Tiempo de respuesta',
  'Delivery Zones': 'Zonas de entrega', 'Live Orders': 'Pedidos en vivo',
  "86'd Today": 'Agotados hoy', 'Top 5 Clients': 'Top 5 clientes',
  'Received This Week': 'Recibidos esta semana', 'Table Status': 'Estado de mesas',
  "This Week — Available Slots": 'Esta semana — Turnos disponibles',
  'Clients — {planFilter}': 'Clientes — {planFilter}',
  'Members — {planFilter}': 'Miembros — {planFilter}',
  'Upcoming Appointments — {filter}': 'Próximos turnos — {filter}',
  'All Cases — {caseFilter}': 'Todas las causas — {caseFilter}',

  // ── Table headers ──
  'Guest': 'Huésped', 'Room': 'Habitación', 'Time': 'Hora', 'Status': 'Estado',
  'ID': 'ID', 'Check-in': 'Entrada', 'Check-out': 'Salida', 'Nights': 'Noches',
  'Actions': 'Acciones', 'Name': 'Nombre', 'Role': 'Rol', 'Shift': 'Turno',
  'Phone': 'Teléfono', 'Source': 'Fuente', 'Amount': 'Monto', 'Last Visit': 'Última visita',
  'Next Appt': 'Próx. turno', 'Notes': 'Notas', 'Address': 'Dirección', 'Type': 'Tipo',
  'Price': 'Precio', 'Beds': 'Amb.', 'Contact': 'Contacto', 'Property Interest': 'Propiedad',
  'Property': 'Propiedad', 'Budget': 'Presupuesto', 'Stage': 'Etapa', 'Last Contact': 'Último contacto',
  'Service': 'Servicio', 'Barber': 'Barbero', 'Client': 'Cliente', 'Date': 'Fecha',
  'Duration': 'Duración', 'Pet': 'Mascota', 'Owner': 'Dueño', 'Species': 'Especie',
  'Vet': 'Veterinario', 'Last Review': 'Última revisión', 'Next Visit': 'Próx. visita',
  'Class': 'Clase', 'Trainer': 'Entrenador', 'Spots': 'Lugares', 'Plan': 'Plan',
  'Attendance': 'Asistencia', 'Joined': 'Ingreso', 'Optometrist': 'Optometrista',
  'OD (sph/cyl)': 'OD (esf/cil)', 'OI (sph/cyl)': 'OI (esf/cil)', 'Expires': 'Vence',
  'Brand': 'Marca', 'Category': 'Categoría', 'Stock': 'Stock', 'Sold': 'Vendido',
  'Case': 'Causa', 'Lawyer': 'Abogado', 'Next Action': 'Próx. acción',
  'Next Deadline': 'Próx. vencimiento', 'Company': 'Empresa', 'Advisor': 'Asesor',
  'Docs Pending': 'Docs pendientes', 'Deadline': 'Vencimiento', 'Days Overdue': 'Días vencidos',
  'Spent': 'Gastado', 'Limit': 'Límite', 'Last': 'Último', 'Material': 'Material',
  'Qty': 'Cant.', 'Unit Price': 'Precio unit.', 'Total': 'Total', 'Truck': 'Camión',
  'Items': 'Items', 'ETA': 'ETA', 'Quote': 'Presupuesto', 'Session': 'Sesión',
  'Package': 'Paquete', 'Photos': 'Fotos', 'Deposit': 'Seña', 'Model': 'Modelo',
  'Year': 'Año', 'KM': 'KM', 'Available': 'Disponible', 'Day': 'Día',
  'Order': 'Pedido', 'Item': 'Item', 'Zone': 'Zona', 'Subject': 'Materia',
  'Teacher': 'Profesor', 'Period 1': 'Período 1', 'Period 2': 'Período 2',
  'Period 3': 'Período 3', 'Grade': 'Nota', 'Parent': 'Padre/madre', 'Enrolled': 'Inscriptos',
  'Product': 'Producto', 'Sales': 'Ventas', 'Seller': 'Vendedor', 'Discount': 'Descuento',
  'Promotion': 'Promoción', 'Products': 'Productos', 'Ends': 'Termina', 'Used': 'Usados',
  'Monthly': 'Mensual', 'Payment': 'Pago',
  'Piece': 'Pieza', 'Artist': 'Artista', 'Style': 'Estilo', 'Likes': 'Likes',
  'Ready': 'Listo', 'Pickup': 'Retiro', 'Recipients': 'Destinatarios', 'Event': 'Evento',
  'Location': 'Ubicación', 'Capacity': 'Capacidad',
  'Wait': 'Espera', 'Hours': 'Horas', 'Next': 'Próx.',

  // ── Button labels ──
  '+ New Reservation': '+ Nueva reserva', '+ Add Staff': '+ Agregar personal',
  '+ Add Lead': '+ Agregar lead', 'Export Report': 'Exportar reporte',
  'Edit': 'Editar', 'Cancel': 'Cancelar', 'Book': 'Reservar',
  'Request': 'Solicitar', 'Confirm': 'Confirmar', 'Send': 'Enviar',
  'View': 'Ver', 'Details': 'Detalles', 'Mark Delivered': 'Marcar entregado',
  'Dispatch': 'Despachar', 'Send Link': 'Enviar link', 'Reserve': 'Reservar',
  'Collect': 'Cobrar', '↺ Reset': '↺ Reiniciar',

  // ── Status badges / labels ──
  'Confirmed': 'Confirmado', 'Pending': 'Pendiente', 'Cancelled': 'Cancelado',
  'Confirmed ✓': 'Confirmado ✓', 'Pending ⏳': 'Pendiente ⏳',
  'On Duty': 'En turno', 'On Break': 'En descanso', 'Off Duty': 'Fuera de turno',
  'Active': 'Activo', 'Inactive': 'Inactivo', 'In Chair': 'En silla', 'Done': 'Listo',
  'Under Offer': 'En oferta', 'Open': 'Abierto', 'Closed': 'Cerrado',
  'In Progress': 'En progreso', 'In Review': 'En revisión', 'Complete': 'Completo',
  'Signed': 'Firmado', 'Sent': 'Enviado', 'Due': 'Vence',
  'Booked': 'Reservado', 'Completed': 'Completado', 'Delivered': 'Entregado',
  'Preparing': 'Preparando', 'Picked Up': 'Retirado',
  'Starting Soon': 'Empieza pronto', 'In Transit': 'En tránsito', 'Scheduled': 'Programado',
  'Qualified': 'Calificado', 'Offer': 'Oferta', 'Inquiry': 'Consulta',
  'Referral': 'Referido', 'New Lead': 'Nuevo lead', 'Accepted': 'Aceptado',
  'En Route': 'En camino', 'Loading': 'Cargando', 'On Track': 'Al día',
  'At Risk': 'En riesgo', 'Near limit': 'Cerca del límite', 'Ordered': 'Pedido',
  'Waiting': 'En espera', 'In Use': 'En uso', 'On-site': 'En obra',
  'Walk-in booked': 'Turno agregado', 'Permanent': 'Permanente',
  'Follow-up': 'Seguimiento', 'Take': 'Para llevar', 'Dine-in': 'En local',
  'Takeaway': 'Para llevar', 'Full': 'Completo', 'All': 'Todos',

  // ── Room states ──
  'Occupied': 'Ocupado', 'Cleaning': 'Limpieza', 'Maintenance': 'Mantenimiento',

  // ── Toast messages ──
  'Room status changed': 'Estado de habitación actualizado',
  'New reservation added': 'Nueva reserva agregada',
  'Reservation cancelled': 'Reserva cancelada',
  'Staff status updated': 'Estado del personal actualizado',
  'Staff member added': 'Personal agregado',
  'Appointment cancelled': 'Turno cancelado',
  'Patient status updated': 'Estado del paciente actualizado',
  'Lead status updated': 'Estado del lead actualizado',
  'Lead added': 'Lead agregado',
  'Listing status updated': 'Estado de propiedad actualizado',
  'Status updated': 'Estado actualizado',
  'Class booked': 'Clase reservada',
  'Order marked as delivered': 'Pedido marcado como entregado',
  'Report exported ✓': 'Reporte exportado ✓',
  'Settings available in your live system': 'Configuraciones disponibles en tu sistema real',
  'Event management available in your live system': 'Gestión de eventos disponible en tu sistema real',
  'Promotion builder available in your live system': 'Constructor de promociones disponible en tu sistema real',
  'Request sent ✓': 'Solicitud enviada ✓',
  'Request sent via email ✓': 'Solicitud enviada por email ✓',
  '✓ Appointment confirmed': '✓ Turno confirmado',
  '✓ Reminder sent': '✓ Recordatorio enviado',
  '✓ Car marked as reserved': '✓ Auto reservado',
  '✓ Test drive confirmed': '✓ Prueba de manejo confirmada',
  '✓ Contact logged': '✓ Contacto registrado',
  '✓ Contract sent': '✓ Contrato enviado',
  '✓ Deposit collected — booking confirmed': '✓ Seña cobrada — reserva confirmada',
  '✓ Document request sent': '✓ Solicitud de documento enviada',
  '✓ Gallery link sent to client': '✓ Link de galería enviado al cliente',
  '✓ Order confirmed': '✓ Pedido confirmado',
  '✓ Order placed': '✓ Pedido realizado',
  '✓ Order ready for pickup': '✓ Pedido listo para retiro',
  '✓ Order ready': '✓ Pedido listo',
  '✓ Order shipped': '✓ Pedido despachado',
  '✓ Quote sent': '✓ Presupuesto enviado',
  '✓ Restock order sent': '✓ Pedido de reposición enviado',
  '✓ Announcement sent to all parents': '✓ Comunicado enviado a todos los padres',

  // ── Callout & shared UI ──
  'Talk to us →': 'Hablemos →',
  'alerts': 'alertas', 'Settings': 'Configuración',

  // ── Misc stat notes ──
  'guests arriving': 'huéspedes llegando', 'rooms freeing up': 'habitaciones liberándose',
  'this month': 'este mes', 'this week': 'esta semana', 'today': 'hoy',
  'avg order value': 'ticket promedio', 'per visit': 'por visita',
  'Auto-reminded': 'Auto-recordados',
  'no-shows prevented this week': 'ausencias prevenidas esta semana',
  'recovered': 'recuperados',

  // ── Inline texts ──
  'available': 'disponibles', 'occupied': 'ocupadas', 'cleaning': 'en limpieza',
  'maintenance': 'en mantenimiento', 'booked': 'reservados', 'total slots': 'turnos totales',
  'Available — click to book': 'Disponible — click para reservar',
  'Click to cancel': 'Click para cancelar', 'Click to book walk-in': 'Click para agendar sin turno',
  'Click to toggle': 'Click para cambiar', 'Click to cycle': 'Click para cambiar',
  'Click to cycle status': 'Click para cambiar estado', 'Click to edit': 'Click para editar',
  'Click to adjust': 'Click para ajustar',
  '✅ Reminded': '✅ Recordado', '⏳ Pending': '⏳ Pendiente',
  'General checkup': 'Control general',
  'New Staff': 'Nuevo empleado', 'Unassigned': 'Sin asignar',
  'New Guest': 'Nuevo huésped',

  // ── Day names ──
  'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mié', 'Thu': 'Jue', 'Fri': 'Vie', 'Sat': 'Sáb', 'Sun': 'Dom',

  // ── Time periods ──
  'Morning (7-12)': 'Mañana (7-12)', 'Afternoon (12-17)': 'Tarde (12-17)', 'Evening (17-21)': 'Noche (17-21)',
  'This Week': 'Esta semana', 'Today': 'Hoy', 'Tomorrow': 'Mañana', 'Yesterday': 'Ayer',

  // ── Revenue breakdown sources ──
  'Room Revenue': 'Ingresos por habitaciones', 'F&B': 'Gastronomía',

  // ── Clinic-specific ──
  'Follow-up visit': 'Visita de seguimiento',
  'Dental cleaning': 'Limpieza dental', 'Dermatology': 'Dermatología',

  // ── RE Status labels ──
  '🔥 High intent': '🔥 Alta intención', '📞 Call scheduled': '📞 Llamada agendada',
  '📧 Followed up': '📧 Seguimiento hecho',

  // ── Filter labels (All and This Week already defined above) ──

  // ── Delivery / fleet ──
  'Camión 1': 'Camión 1', 'Camión 2': 'Camión 2',

  // ── Photography ──
  'Wedding': 'Bodas', 'Portrait': 'Retrato', 'Commercial': 'Comercial', 'Family': 'Familia',
  'Standard': 'Estándar', 'Premium': 'Premium', 'Elite': 'Elite', 'Basic': 'Básico',

  // ── Tattoo styles ──
  'Traditional': 'Tradicional', 'Realism': 'Realismo', 'Blackwork': 'Blackwork',
  'Watercolor': 'Acuarela', 'Geometric': 'Geométrico', 'Japanese': 'Japonés', 'Art': 'Arte',

  // ── Gym classes ──
  'Yoga Flow': 'Yoga Flow', 'HIIT': 'HIIT', 'CrossFit': 'CrossFit', 'Pilates': 'Pilates', 'Boxing': 'Boxeo',
  'Yoga & Pilates': 'Yoga y Pilates', 'CrossFit & Strength': 'CrossFit y Fuerza',
  'HIIT & Cardio': 'HIIT y Cardio', 'Boxing & MMA': 'Boxeo y MMA',

  // ── Barber services ──
  'Classic Cut': 'Corte clásico', 'Fade + Beard': 'Fade + Barba',
  'Hot Towel Shave': 'Afeitado con toalla caliente', 'Kids Cut': 'Corte niños',
  'Hair Color': 'Color de pelo', 'Color & Style': 'Color y estilo',
  'Full Service': 'Servicio completo', 'Highlights': 'Reflejos',
  'Fades & Cuts': 'Fades y cortes', 'Beard Specialist': 'Especialista en barba',

  // ── Optical ──
  'Frames': 'Monturas', 'Lenses': 'Lentes', 'Sunglasses': 'Anteojos de sol',
  'Contacts': 'Contacto', 'Insurance': 'Obras sociales',
  'Eye exam': 'Examen visual', 'Frame fitting': 'Ajuste de montura',
  'Contact lens trial': 'Prueba de lentes de contacto', 'Frame pickup': 'Retiro de montura',
  'Prescription renewal': 'Renovación de receta',

  // ── Car types ──
  'Sedan': 'Sedán', 'SUV': 'SUV', 'Compact': 'Compacto', 'Sports': 'Deportivo',

  // ── School ──
  'Mathematics': 'Matemáticas', 'Science': 'Ciencias', 'English': 'Inglés', 'History': 'Historia',
  'Enter': 'Ingresar', 'Escape': 'Escape',

  // ── Café ──
  'Coffee': 'Café', 'Food': 'Comida', 'Pastries': 'Pastelería', 'Tea': 'Té',
  'Espresso': 'Espresso', 'Flat White': 'Flat White', 'Matcha Latte': 'Matcha Latte',
  'Cold Brew': 'Cold Brew', 'Croissant': 'Croissant', 'Sourdough Bread': 'Pan de masa madre',
  'Caesar Salad': 'Ensalada César', 'Club Sandwich': 'Club Sándwich',
  'Banana Bread': 'Banana Bread', 'Pain au Chocolat': 'Pain au Chocolat',
  'Cinnamon Roll': 'Rol de canela',

  // ── Retail ──
  'Clothing': 'Ropa', 'Footwear': 'Calzado', 'Accessories': 'Accesorios',
  'All clothing': 'Toda la ropa', 'All parents': 'Todos los padres',

  // ── Supermarket ──
  'Lácteos': 'Lácteos', 'Bebidas': 'Bebidas', 'Limpieza': 'Limpieza', 'Frescos': 'Frescos',

  // ── Legal ──
  'Labor': 'Laboral', 'Criminal': 'Penal', 'Tax': 'Impositivo',
  'Corporate Tax': 'Impuestos corporativos', 'Tax Filing': 'Declaración impositiva',
  'Mortgage': 'Hipoteca', 'Inheritance': 'Herencia', 'Investment': 'Inversión',
  'Bookkeeping': 'Contabilidad', 'Payroll': 'Nómina', 'Tax planning': 'Planificación fiscal',

  // ── Finance ──
  'Mortgage consult': 'Consulta hipotecaria', 'Investment review': 'Revisión de inversión',
  'Insurance review': 'Revisión de seguro', 'Investment + Tax': 'Inversión + Impuestos',
  'Consultation': 'Consulta',

  // ── Construction ──
  'Steel': 'Acero', 'Wood': 'Madera', 'Masonry': 'Albañilería',
  'Plumbing': 'Plomería', 'Electrical': 'Electricidad', 'Aggregates': 'Áridos',
  'Finishing': 'Terminaciones', 'Tools': 'Herramientas',

  // ── Callout template ──
  'This is what a CorexaStudio': 'Así se ve un sistema de CorexaStudio para',
  'system looks like — built around your real data, workflows, and team.': '— diseñado en base a tus datos reales, procesos y equipo.',

  // ── Free delivery / promo texts ──
  'Free delivery': 'Envío gratis', 'Free shipping +€50': 'Envío gratis +€50',
  'Spring Sale -30%': 'Oferta primavera -30%',

  // ── Auto-response ──
  'Auto-response': 'Respuesta automática',
  'Auto-response active — industry avg: 2–3 hours': 'Respuesta automática activa — promedio del rubro: 2-3 horas',
  'Auto-response OFF — manual replies only': 'Respuesta automática OFF — solo respuestas manuales',
};

function useDashT() {
  const { lang } = useI18n();
  if (lang === 'en') return (s) => s;
  return (s) => DASH_ES[s] || s;
}

const clone = o => JSON.parse(JSON.stringify(o));
const fmt = n => typeof n === 'number' && n >= 1000
  ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  : String(n);
const ROOM_STATES = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];
const ROOM_CSS = ['avail', 'occ', 'clean', 'maint'];
const STAFF_CYCLE = { 'on-duty': 'on-break', 'on-break': 'off-duty', 'off-duty': 'on-duty' };
const STAFF_LABEL = { 'on-duty': 'On Duty', 'on-break': 'On Break', 'off-duty': 'Off Duty' };
const STAFF_CSS = { 'on-duty': 'idash__badge--ok', 'on-break': 'idash__badge--hot', 'off-duty': 'idash__badge--wait' };
const RES_CSS = { confirmed: 'idash__badge--ok', pending: 'idash__badge--wait', cancelled: 'idash__badge--cancel' };
const RE_STATUS_CYCLE = { hot: 'call', call: 'followed', followed: 'hot' };
const RE_STATUS_LABELS = { hot: '🔥 High intent', call: '📞 Call scheduled', followed: '📧 Followed up' };
const RE_STATUS_CLASS = { hot: 'idash__badge--hot', call: 'idash__badge--ok', followed: 'idash__badge--wait' };
const PROP_STATUS_CYCLE = { active: 'under-offer', 'under-offer': 'sold', sold: 'active' };
const PROP_STATUS_LABEL = { active: 'Active', 'under-offer': 'Under Offer', sold: 'Sold' };
const PROP_STATUS_CSS = { active: 'idash__badge--ok', 'under-offer': 'idash__badge--hot', sold: 'idash__badge--wait' };

const INDUSTRIES = [
  {
    id: 'hospitality', label: 'Hospitality & Food', icon: '🏨',
    desc: 'Reservations, rooms, staff & revenue',
    features: ['Online reservations', 'Room/table availability', 'Menu or room showcase', 'Review integration'],
  },
  {
    id: 'clinics', label: 'Clinics & Health', icon: '🏥',
    desc: 'Appointments, patients & reminders',
    features: ['Appointment booking', 'Patient reminders', 'Service catalog', 'Insurance info'],
  },
  {
    id: 'realestate', label: 'Real Estate', icon: '🏢',
    desc: 'Listings, leads & conversions',
    features: ['Property listings with filters', 'Virtual tour links', 'Lead capture forms', 'Agent profiles'],
  },
  {
    id: 'barbershop', label: 'Barbershop & Beauty', icon: '✂️',
    desc: 'Bookings, schedule & revenue',
    features: ['Service booking', 'Staff schedules', 'Price list', 'Gallery of work'],
  },
  {
    id: 'optical', label: 'Optical Store', icon: '👓',
    desc: 'Appointments, prescriptions & eyewear catalog',
    impactStats: {
      stat1: { value: '+42%',    label: 'More repeat clients via auto-reminder system' },
      stat2: { value: '6hrs',    label: 'Saved weekly on prescription tracking' },
      stat3: { value: '+1,250€', label: 'Avg. monthly sales from catalog visibility' },
    },
    features: ['Online appointment booking', 'Prescription management', 'Eyewear catalog with filters', 'Patient reminder system'],
  },
  {
    id: 'hardware', label: 'Hardware Store', icon: '🔧',
    desc: 'Inventory, quotes & trade accounts',
    impactStats: {
      stat1: { value: '+35%',    label: 'Faster quote turnaround for trade accounts' },
      stat2: { value: '8hrs',    label: 'Saved weekly on inventory counts' },
      stat3: { value: '+2,100€', label: 'Monthly revenue from recovered quotes' },
    },
    features: ['Quote generator', 'Trade account portal', 'Inventory browser', 'Delivery scheduling'],
  },
  {
    id: 'veterinary', label: 'Veterinary Clinic', icon: '🐾',
    desc: 'Pet records, appointments & reminders',
    impactStats: {
      stat1: { value: '-68%', label: 'Drop in missed appointments with reminders' },
      stat2: { value: '+47%', label: 'More returning pet owners per quarter' },
      stat3: { value: '4hrs', label: 'Admin hours saved per week' },
    },
    features: ['Pet profiles & medical history', 'Appointment reminders', 'Vaccination tracking', 'Online consultations'],
  },
  {
    id: 'buildsupply', label: 'Building Supply / Corralón', icon: '🏗️',
    desc: 'Quotes, delivery & bulk orders',
    impactStats: {
      stat1: { value: '3×',     label: 'Faster quote-to-delivery turnaround' },
      stat2: { value: '+28%',   label: 'Increase in bulk order conversion' },
      stat3: { value: '1,900€', label: 'Avg. monthly savings on dispatch errors' },
    },
    features: ['Bulk order quotes', 'Material calculator', 'Delivery tracking', 'Contractor accounts'],
  },
  {
    id: 'accounting', label: 'Accounting Studio', icon: '📊',
    desc: 'Client portal, documents & deadlines',
    impactStats: {
      stat1: { value: '+52%', label: 'Faster document collection from clients' },
      stat2: { value: '9hrs', label: 'Saved weekly on deadline tracking' },
      stat3: { value: '-84%', label: 'Drop in missed filing deadlines' },
    },
    features: ['Client document portal', 'Deadline calendar', 'Secure file sharing', 'Invoice tracking'],
  },
  {
    id: 'supermarket', label: 'Supermarket', icon: '🛒',
    desc: 'Online orders, delivery & promotions',
    impactStats: {
      stat1: { value: '+38%',    label: 'Growth in online order volume' },
      stat2: { value: '+2,800€', label: 'Avg. monthly revenue from automated promos' },
      stat3: { value: '22%',     label: 'Faster delivery dispatch on average' },
    },
    features: ['Online ordering', 'Delivery zones', 'Weekly promotions', 'Loyalty program'],
  },
  {
    id: 'gym', label: 'Gym & Fitness', icon: '💪',
    desc: 'Classes, memberships & progress tracking',
    impactStats: {
      stat1: { value: '+61%', label: 'Class attendance with auto-reminders' },
      stat2: { value: '+34%', label: 'Higher membership renewal rate' },
      stat3: { value: '7hrs', label: 'Saved weekly on schedule management' },
    },
    features: ['Class booking system', 'Membership management', 'Progress tracking', 'Trainer profiles'],
  },
  {
    id: 'law', label: 'Law Firm', icon: '⚖️',
    desc: 'Consultations, case tracking & documents',
    impactStats: {
      stat1: { value: '5hrs', label: 'Saved weekly on case document tracking' },
      stat2: { value: '+43%', label: 'Faster client onboarding process' },
      stat3: { value: '-76%', label: 'Drop in consultation no-shows' },
    },
    features: ['Consultation booking', 'Case status portal', 'Secure document sharing', 'Billing transparency'],
  },
  {
    id: 'photography', label: 'Photography Studio', icon: '📷',
    desc: 'Portfolio, bookings & galleries',
    impactStats: {
      stat1: { value: '+55%',  label: 'Bookings driven by portfolio visibility' },
      stat2: { value: '3hrs',  label: 'Saved per session on gallery delivery' },
      stat3: { value: '+720€', label: 'Avg. monthly upsell from private galleries' },
    },
    features: ['Portfolio galleries', 'Session booking', 'Gallery delivery to clients', 'Package selection'],
  },
  {
    id: 'cardealer', label: 'Car Dealership', icon: '🚗',
    desc: 'Inventory, test drives & financing leads',
    impactStats: {
      stat1: { value: '+46%',   label: 'Test drive booking conversion rate' },
      stat2: { value: '2×',     label: 'Faster response to financing leads' },
      stat3: { value: '4,300€', label: 'Avg. monthly value from recovered leads' },
    },
    features: ['Live inventory', 'Test drive booking', 'Finance calculator', 'Lead capture'],
  },
  {
    id: 'cafe', label: 'Café & Coffee Shop', icon: '☕',
    desc: 'Orders, loyalty & events',
    impactStats: {
      stat1: { value: '+34%',    label: 'Increase in repeat customers' },
      stat2: { value: '6hrs',    label: 'Saved weekly on manual orders' },
      stat3: { value: '+1,800€', label: 'Monthly revenue from online orders' },
    },
    features: ['Online ordering', 'Loyalty program', 'Event bookings', 'Menu management'],
  },
  {
    id: 'school', label: 'School & Academy', icon: '🎓',
    desc: 'Enrollment, schedules & communication',
    impactStats: {
      stat1: { value: '+41%', label: 'Faster enrollment process' },
      stat2: { value: '10hrs', label: 'Saved weekly on admin tasks' },
      stat3: { value: '-67%', label: 'Drop in missed communications' },
    },
    features: ['Online enrollment', 'Class schedules', 'Parent portal', 'Event calendar'],
  },
  {
    id: 'retail', label: 'Retail & Commerce', icon: '🛍️',
    desc: 'Catalog, stock & online sales',
    impactStats: {
      stat1: { value: '+48%',    label: 'Increase in online sales' },
      stat2: { value: '12hrs',   label: 'Saved weekly on stock management' },
      stat3: { value: '+3,200€', label: 'Monthly revenue from new channel' },
    },
    features: ['Product catalog', 'Online store', 'Stock management', 'Promotions & discounts'],
  },
  {
    id: 'bakery', label: 'Bakery & Pastry', icon: '🥐',
    desc: 'Pre-orders, schedule & delivery',
    impactStats: {
      stat1: { value: '+52%',    label: 'Increase in pre-orders' },
      stat2: { value: '5hrs',    label: 'Saved weekly on phone orders' },
      stat3: { value: '+1,400€', label: 'Monthly revenue from online pre-orders' },
    },
    features: ['Pre-order system', 'Daily menu', 'Delivery zones', 'WhatsApp integration'],
  },
  {
    id: 'bank', label: 'Financial Services', icon: '🏦',
    desc: 'Appointments, leads & client portal',
    impactStats: {
      stat1: { value: '+38%', label: 'More qualified leads per month' },
      stat2: { value: '9hrs', label: 'Saved weekly on appointment scheduling' },
      stat3: { value: '-71%', label: 'Drop in no-shows' },
    },
    features: ['Appointment booking', 'Lead capture forms', 'Client portal', 'Document requests'],
  },
  {
    id: 'tattoo', label: 'Tattoo Studio', icon: '🎨',
    desc: 'Bookings, portfolio & deposits',
    impactStats: {
      stat1: { value: '+44%', label: 'More bookings per month' },
      stat2: { value: '7hrs', label: 'Saved weekly on DM management' },
      stat3: { value: '-89%', label: 'Drop in ghost appointments' },
    },
    features: ['Portfolio gallery', 'Booking + deposit system', 'Artist profiles', 'Style filtering'],
  },
];

/* ═══════════════════════════════════════════════════
   DEFAULTS
   ═══════════════════════════════════════════════════ */
const HOSP_DEFAULTS = {
  roomGrid: [[1,1,0,1,1,0],[1,0,2,1,1,1],[0,1,1,0,1,1],[1,1,1,2,0,1]],
  checkIns: 6, checkOuts: 4, revenue: 24840,
  arrivals: [
    { guest: 'Sarah M.', room: '204', time: '14:00', status: 'confirmed' },
    { guest: 'James K.', room: '108', time: '15:30', status: 'pending' },
    { guest: 'Ana R.',   room: '312', time: '16:00', status: 'confirmed' },
  ],
  reservations: [
    { id: 'R-1001', guest: 'Sarah Mitchell',  room: '204', checkIn: 'Apr 7',  checkOut: 'Apr 10', nights: 3, status: 'confirmed' },
    { id: 'R-1002', guest: 'James Kim',       room: '108', checkIn: 'Apr 7',  checkOut: 'Apr 9',  nights: 2, status: 'pending' },
    { id: 'R-1003', guest: 'Ana Rodriguez',   room: '312', checkIn: 'Apr 7',  checkOut: 'Apr 12', nights: 5, status: 'confirmed' },
    { id: 'R-1004', guest: 'Michael Chen',    room: '205', checkIn: 'Apr 8',  checkOut: 'Apr 11', nights: 3, status: 'confirmed' },
    { id: 'R-1005', guest: 'Laura Patel',     room: '401', checkIn: 'Apr 8',  checkOut: 'Apr 10', nights: 2, status: 'pending' },
    { id: 'R-1006', guest: 'Thomas Berg',     room: '102', checkIn: 'Apr 9',  checkOut: 'Apr 13', nights: 4, status: 'confirmed' },
    { id: 'R-1007', guest: 'Sofia Morales',   room: '310', checkIn: 'Apr 9',  checkOut: 'Apr 11', nights: 2, status: 'cancelled' },
    { id: 'R-1008', guest: "David O'Brien",   room: '203', checkIn: 'Apr 10', checkOut: 'Apr 14', nights: 4, status: 'confirmed' },
    { id: 'R-1009', guest: 'Emma Walsh',      room: '305', checkIn: 'Apr 10', checkOut: 'Apr 12', nights: 2, status: 'pending' },
  ],
  staff: [
    { name: 'María López',   role: 'Front Desk Manager', shift: '07:00 – 15:00', status: 'on-duty',  phone: '+353 87 123 4567' },
    { name: 'David Park',    role: 'Housekeeping Lead',  shift: '08:00 – 16:00', status: 'on-duty',  phone: '+353 87 234 5678' },
    { name: 'Elena Santos',  role: 'Night Auditor',      shift: '22:00 – 06:00', status: 'off-duty', phone: '+353 87 345 6789' },
    { name: 'Tomás Murphy',  role: 'Concierge',          shift: '09:00 – 17:00', status: 'on-duty',  phone: '+353 87 456 7890' },
    { name: 'Claire Dubois', role: 'F&B Manager',        shift: '06:00 – 14:00', status: 'on-break', phone: '+353 87 567 8901' },
    { name: 'Raj Sharma',    role: 'Maintenance Tech',   shift: '08:00 – 16:00', status: 'on-duty',  phone: '+353 87 678 9012' },
  ],
  weekRev: [3200, 2800, 3600, 3100, 3800, 4200, 4100],
  breakdown: { rooms: 18600, fnb: 4200, extras: 2040 },
};

const CLINIC_DEFAULTS = {
  schedule: [
    { time: '09:00', patient: 'Carlos M.', proc: 'General checkup', doc: 'Dr. Pérez', filled: true },
    { time: '10:00', patient: null, proc: null, doc: null, filled: false },
    { time: '10:30', patient: 'Laura S.',  proc: 'Follow-up',       doc: 'Dr. Pérez', filled: true },
    { time: '11:30', patient: 'María G.',  proc: 'Blood work',      doc: 'Dr. López', filled: true },
    { time: '12:00', patient: null, proc: null, doc: null, filled: false },
    { time: '14:00', patient: 'Ana G.',    proc: 'Dental cleaning',  doc: 'Dr. Ruiz',  filled: true },
    { time: '15:30', patient: 'Pedro L.',  proc: 'Dermatology',      doc: 'Dr. López', filled: true },
    { time: '16:00', patient: 'Marco T.',  proc: 'Consultation',     doc: 'Dr. Pérez', filled: true },
  ],
  reminders: [
    { label: 'Ana G. — 14:00',   sent: true },
    { label: 'Pedro L. — 15:30', sent: true },
    { label: 'Marco T. — 16:00', sent: false },
  ],
  weekRev: [62, 45, 78, 55, 71, 40, 80],
  revenue: 8200, waiting: 2,
  patients: [
    { name: 'Carlos Mendoza', lastVisit: 'Mar 28', nextAppt: 'Apr 14', phone: '+353 87 111 2233', notes: 'Annual checkup due',   status: 'active' },
    { name: 'Laura Stevens',  lastVisit: 'Apr 2',  nextAppt: 'Apr 9',  phone: '+353 87 222 3344', notes: 'Follow-up blood work', status: 'active' },
    { name: 'María García',   lastVisit: 'Mar 15', nextAppt: 'Apr 20', phone: '+353 87 333 4455', notes: 'Dental cleaning due',  status: 'active' },
    { name: 'Ana Gutierrez',  lastVisit: 'Apr 5',  nextAppt: 'Apr 7',  phone: '+353 87 444 5566', notes: 'Post-op follow-up',    status: 'active' },
    { name: 'Pedro López',    lastVisit: 'Feb 20', nextAppt: '—',      phone: '+353 87 555 6677', notes: 'Referred to specialist', status: 'inactive' },
    { name: 'Marco Torres',   lastVisit: 'Apr 1',  nextAppt: 'May 1',  phone: '+353 87 666 7788', notes: 'Dermatology ongoing',  status: 'active' },
    { name: 'Isabel Ruiz',    lastVisit: 'Mar 10', nextAppt: 'Apr 10', phone: '+353 87 777 8899', notes: 'Prescription renewal', status: 'active' },
    { name: 'Javier Díaz',    lastVisit: 'Jan 5',  nextAppt: '—',      phone: '+353 87 888 9900', notes: 'Lost to follow-up',    status: 'inactive' },
  ],
};

const RE_DEFAULTS = {
  listings: 23, inquiries: 8, visits: 5,
  leads: [
    { name: 'Michael R.', prop: 'Penthouse 4BR',  budget: '€850K', status: 'hot' },
    { name: 'Clara S.',   prop: 'Villa seafront',  budget: '€1.2M', status: 'call' },
    { name: 'Tom B.',     prop: 'City apt 2BR',    budget: '€320K', status: 'followed' },
  ],
  funnel: [
    { s: 'Inquiry', n: 48 }, { s: 'Qualified', n: 24 },
    { s: 'Visit', n: 12 },   { s: 'Offer', n: 5 },
  ],
  autoResponse: true,
  properties: [
    { addr: '12 Marine Terrace',        type: 'House',     price: '€485,000',   beds: 3, status: 'active' },
    { addr: 'Penthouse 4BR, The Docks', type: 'Apartment', price: '€850,000',   beds: 4, status: 'active' },
    { addr: 'Villa Seafront, Dalkey',   type: 'Villa',     price: '€1,200,000', beds: 5, status: 'under-offer' },
    { addr: 'City Apt 3C, Temple Bar',  type: 'Apartment', price: '€320,000',   beds: 2, status: 'active' },
    { addr: 'Studio Downtown',          type: 'Studio',    price: '€195,000',   beds: 1, status: 'active' },
    { addr: '8 Oak Lane, Ranelagh',     type: 'House',     price: '€395,000',   beds: 3, status: 'sold' },
    { addr: 'Riverside 2B, Grand Canal',type: 'Apartment', price: '€275,000',   beds: 2, status: 'active' },
  ],
};

const RE_VISITS = {
  Mon: [{ p: '12 Marine Terrace', c: 'Michael R.', t: '10:00' }],
  Tue: [{ p: 'Villa Seafront', c: 'Clara S.', t: '11:00' }, { p: 'City Apt 3C', c: 'Tom B.', t: '15:00' }],
  Wed: [],
  Thu: [{ p: 'Penthouse 4BR', c: 'Michael R.', t: '14:00' }],
  Fri: [{ p: 'Studio Downtown', c: 'Anna L.', t: '09:30' }],
};

/* Barbershop + 5 new dashboards defaults live near their components below */

/* ═══════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════ */
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (text) => { setMsg(text); setTimeout(() => setMsg(null), 2500); };
  return [msg, show];
}

function Toast({ message }) {
  if (!message) return null;
  return <div className="idash__toast">{message}</div>;
}

function InlineEdit({ value, onChange, onInteract, prefix = '', suffix = '', className = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  function start() { setDraft(String(value)); setEditing(true); onInteract?.(); }
  function commit() {
    const num = parseFloat(draft.replace(/[^0-9.-]/g, ''));
    if (!isNaN(num) && num >= 0) onChange(num);
    setEditing(false);
  }
  if (editing) return (
    <input className={`idash__inline-input ${className}`} value={draft}
      onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      autoFocus />
  );
  return <span className={`idash__editable ${className}`} onClick={start} title={d('Click to edit')}>{prefix}{fmt(value)}{suffix}</span>;
}

function InlineText({ value, onChange, onInteract, className = '' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  function start() { setDraft(value); setEditing(true); onInteract?.(); }
  function commit() { if (draft.trim()) onChange(draft.trim()); setEditing(false); }
  if (editing) return (
    <input className={`idash__inline-input idash__inline-input--wide ${className}`} value={draft}
      onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      autoFocus />
  );
  return <span className={`idash__editable ${className}`} onClick={start} title={d('Click to edit')}>{value}</span>;
}

function Toggle({ on, onToggle, label, onInteract }) {
  return (
    <div className="idash__toggle-wrap" onClick={() => { onToggle(!on); onInteract?.(); }}>
      <div className={`idash__toggle ${on ? 'is-on' : ''}`}><div className="idash__toggle-knob" /></div>
      {label && <span className="idash__toggle-label">{label}</span>}
    </div>
  );
}

function ResetBtn({ onReset, d }) {
  return <button className="idash__reset-btn" onClick={onReset} type="button">{d('↺ Reset')}</button>;
}

function Callout({ industry, d }) {
  return (
    <div className="idash__callout">
      <p className="idash__callout-text">{d('This is what a CorexaStudio')} <strong>{d(industry)}</strong> {d('system looks like — built around your real data, workflows, and team.')}</p>
      <Link to="/contact" className="idash__callout-link">{d('Talk to us →')}</Link>
    </div>
  );
}

function DashSidebar({ title, items, active, onNav, d }) {
  return (
    <aside className="idash__sidebar">
      <p className="idash__logo">{d(title)}</p>
      <nav className="idash__nav">
        {items.map(it => (
          <span key={it.id} className={`idash__nav-item ${active === it.id ? 'is-active' : ''}`}
            onClick={() => onNav(it.id)}>{d(it.label)}</span>
        ))}
      </nav>
    </aside>
  );
}

function DashTopbar({ title, alerts, onSettings, children, d }) {
  const { lang } = useI18n();
  const dateStr = new Date().toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-IE', { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <div className="idash__topbar">
      <div className="idash__topbar-left">
        <span className="idash__topbar-title">{d(title)}</span>
        <span className="idash__topbar-date">{dateStr}</span>
      </div>
      <div className="idash__topbar-right">
        {alerts > 0 && <span className="idash__topbar-alerts">🔔 {alerts} {d('alerts')}</span>}
        <button className="idash__topbar-btn" type="button" onClick={onSettings}>{d('Settings')}</button>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HOSPITALITY DASHBOARD
   ═══════════════════════════════════════════════════ */
const HOSP_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'reservations', label: 'Reservations' },
  { id: 'rooms', label: 'Rooms' }, { id: 'staff', label: 'Staff' }, { id: 'revenue', label: 'Revenue' },
];

function HospitalityDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(HOSP_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  const grid = data.roomGrid;
  const totalRooms = grid.flat().length;
  const occupied = grid.flat().filter(s => s === 1).length;
  const cleaning = grid.flat().filter(s => s === 2).length;
  const maint = grid.flat().filter(s => s === 3).length;
  const available = totalRooms - occupied - cleaning - maint;
  const occPct = Math.round((occupied / totalRooms) * 100);

  function cycleRoom(row, col) {
    act();
    setData(prev => { const n = clone(prev); n.roomGrid[row][col] = (n.roomGrid[row][col] + 1) % 4; return n; });
    showToast(d('Room status changed'));
  }
  function cycleArrivalStatus(idx) {
    act();
    setData(prev => { const n = clone(prev); n.arrivals[idx].status = n.arrivals[idx].status === 'confirmed' ? 'pending' : 'confirmed'; return n; });
  }
  function setResStatus(idx, status) {
    act();
    setData(prev => { const n = clone(prev); n.reservations[idx].status = status; return n; });
    if (status === 'cancelled') showToast(d('Reservation cancelled'));
  }
  function addReservation() {
    act();
    const maxId = data.reservations.reduce((m, r) => Math.max(m, parseInt(r.id.replace('R-', ''))), 1000);
    const nr = { id: `R-${maxId + 1}`, guest: 'New Guest', room: '—', checkIn: 'TBD', checkOut: 'TBD', nights: 0, status: 'pending' };
    setData(prev => ({ ...prev, reservations: [nr, ...prev.reservations] }));
    showToast(d('New reservation added'));
  }
  function cycleStaffStatus(idx) {
    act();
    setData(prev => { const n = clone(prev); n.staff[idx].status = STAFF_CYCLE[n.staff[idx].status]; return n; });
    showToast(d('Staff status updated'));
  }
  function updateStaff(idx, field, val) {
    act();
    setData(prev => { const n = clone(prev); n.staff[idx][field] = val; return n; });
  }
  function addStaff() {
    act();
    setData(prev => ({ ...prev, staff: [...prev.staff, { name: 'New Staff', role: 'Unassigned', shift: '09:00 – 17:00', status: 'off-duty', phone: '—' }] }));
    showToast(d('Staff member added'));
  }
  function bumpRevBar(idx) {
    act();
    setData(prev => { const n = clone(prev); n.weekRev[idx] = n.weekRev[idx] + 400 > 6000 ? 1000 : n.weekRev[idx] + 400; return n; });
  }
  function setBreakdown(key, val) { setData(prev => { const n = clone(prev); n.breakdown[key] = val; return n; }); }
  const set = (field, val) => setData(prev => ({ ...prev, [field]: val }));

  function roomNum(ri, ci) { return (ri + 1) * 100 + (ci + 1); }

  return (
    <div className="idash idash--hosp">
      <DashSidebar title="Hotel Dashboard" items={HOSP_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Hotel Dashboard" alerts={3} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {/* ── OVERVIEW ── */}
        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Occupied Rooms')}</span>
              <span className="idash__stat-value">{occupied}<span className="idash__stat-dim">/{totalRooms}</span></span>
              <div className="idash__bar"><div className="idash__bar-fill" style={{ width: `${occPct}%` }} /></div>
            </div>
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Check-ins Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.checkIns} onChange={v => set('checkIns', v)} onInteract={act} /></span>
              <span className="idash__stat-note">{d('guests arriving')}</span>
            </div>
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Check-outs Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.checkOuts} onChange={v => set('checkOuts', v)} onInteract={act} /></span>
              <span className="idash__stat-note">{d('rooms freeing up')}</span>
            </div>
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.revenue} onChange={v => set('revenue', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+12%')}</span>
            </div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Arrivals')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Guest')}</th><th>{d('Room')}</th><th>{d('Time')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.arrivals.map((a, i) => (
                  <tr key={i}><td>{a.guest}</td><td>{a.room}</td><td>{a.time}</td><td>
                    <span className={`idash__badge idash__badge--${a.status === 'confirmed' ? 'ok' : 'wait'} idash__editable`}
                      onClick={() => cycleArrivalStatus(i)} title={d('Click to toggle')}>{a.status === 'confirmed' ? d('Confirmed ✓') : d('Pending ⏳')}</span>
                  </td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Room Status')}</h4>
              <div className="idash__room-grid">
                {grid.map((row, ri) => row.map((s, ci) => (
                  <span key={`${ri}-${ci}`} className={`idash__room idash__room--${ROOM_CSS[s]} idash__room--clickable`}
                    onClick={() => cycleRoom(ri, ci)} title={`Room ${roomNum(ri, ci)} — ${d(ROOM_STATES[s])}`} />
                )))}
              </div>
              <div className="idash__legend">
                <span><span className="idash__room idash__room--avail" />{d('Available')}</span>
                <span><span className="idash__room idash__room--occ" />{d('Occupied')}</span>
                <span><span className="idash__room idash__room--clean" />{d('Cleaning')}</span>
                <span><span className="idash__room idash__room--maint" />{d('Maintenance')}</span>
              </div>
            </div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Staff Schedule Today')}</h4>
              <div className="idash__staff-list">
                {data.staff.slice(0, 3).map(s => (
                  <div key={s.name} className="idash__staff-card">
                    <span className="idash__staff-name">{s.name}</span>
                    <span className="idash__staff-role">{s.role}</span>
                    <span className="idash__staff-shift">{s.shift}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Upcoming Deliveries')}</h4>
              <div className="idash__deliveries">
                {[{ sup: 'FreshFoods Ltd', t: '09:00', items: 'Produce, dairy, bread' },
                  { sup: 'CleanPro', t: '11:30', items: 'Cleaning supplies, linens' },
                  { sup: 'BevCo', t: '14:00', items: 'Beverages, minibar restock' }].map(dl => (
                  <div key={dl.sup} className="idash__delivery-row">
                    <span className="idash__delivery-sup">{dl.sup}</span>
                    <span className="idash__delivery-time">{dl.t}</span>
                    <span className="idash__delivery-items">{dl.items}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {/* ── RESERVATIONS ── */}
        {view === 'reservations' && <>
          <div className="idash__panel">
            <div className="idash__panel-head"><h4 className="idash__panel-title">{d('Reservations')}</h4>
              <button className="idash__add-btn" onClick={addReservation} type="button">{d('+ New Reservation')}</button></div>
            <table className="idash__table"><thead><tr><th>{d('ID')}</th><th>{d('Guest')}</th><th>{d('Room')}</th><th>{d('Check-in')}</th><th>{d('Check-out')}</th><th>{d('Nights')}</th><th>{d('Status')}</th><th>{d('Actions')}</th></tr></thead><tbody>
              {data.reservations.map((r, i) => (
                <tr key={r.id}><td>{r.id}</td><td>{r.guest}</td><td>{r.room}</td><td>{r.checkIn}</td><td>{r.checkOut}</td><td>{r.nights}</td>
                  <td><span className={`idash__badge ${RES_CSS[r.status]}`}>{d(r.status.charAt(0).toUpperCase() + r.status.slice(1))}</span></td>
                  <td className="idash__actions">
                    {r.status !== 'cancelled' && <>
                      <button className="idash__action-btn" onClick={() => setResStatus(i, r.status === 'confirmed' ? 'pending' : 'confirmed')}>Edit</button>
                      <button className="idash__action-btn idash__action-btn--danger" onClick={() => setResStatus(i, 'cancelled')}>Cancel</button>
                    </>}
                  </td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {/* ── ROOMS ── */}
        {view === 'rooms' && <>
          <div className="idash__room-summary">
            <span>{available} {d('available')}</span><span className="idash__room-summary-dot">·</span>
            <span>{occupied} {d('occupied')}</span><span className="idash__room-summary-dot">·</span>
            <span>{cleaning} {d('cleaning')}</span><span className="idash__room-summary-dot">·</span>
            <span>{maint} {d('maintenance')}</span>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Room Management — 24 Rooms')}</h4>
            <div className="idash__room-mgmt">
              {grid.map((row, ri) => row.map((s, ci) => (
                <div key={`${ri}-${ci}`} className={`idash__room-cell idash__room-cell--${ROOM_CSS[s]}`}
                  onClick={() => cycleRoom(ri, ci)} title={d('Click to cycle status')}>
                  <span className="idash__room-cell-num">{roomNum(ri, ci)}</span>
                  <span className="idash__room-cell-label">{d(ROOM_STATES[s])}</span>
                </div>
              )))}
            </div>
            <div className="idash__legend" style={{ marginTop: 16 }}>
              {ROOM_STATES.map((label, i) => <span key={label}><span className={`idash__room idash__room--${ROOM_CSS[i]}`} />{label}</span>)}
            </div>
          </div>
        </>}

        {/* ── STAFF ── */}
        {view === 'staff' && <>
          <div className="idash__panel">
            <div className="idash__panel-head"><h4 className="idash__panel-title">{d('Staff Management')}</h4>
              <button className="idash__add-btn" onClick={addStaff} type="button">{d('+ Add Staff')}</button></div>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Role')}</th><th>{d('Shift')}</th><th>{d('Status')}</th><th>{d('Phone')}</th></tr></thead><tbody>
              {data.staff.map((s, i) => (
                <tr key={i}>
                  <td><InlineText value={s.name} onChange={v => updateStaff(i, 'name', v)} onInteract={act} /></td>
                  <td>{s.role}</td>
                  <td><InlineText value={s.shift} onChange={v => updateStaff(i, 'shift', v)} onInteract={act} /></td>
                  <td><span className={`idash__badge ${STAFF_CSS[s.status]} idash__editable`} onClick={() => cycleStaffStatus(i)} title={d('Click to cycle')}>{d(STAFF_LABEL[s.status])}</span></td>
                  <td className="idash__mono">{s.phone}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {/* ── REVENUE ── */}
        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.revenue} onChange={v => set('revenue', v)} onInteract={act} prefix="€" /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Avg. Daily')}</span>
              <span className="idash__stat-value">€{fmt(Math.round(data.revenue / 30))}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Occupancy')}</span>
              <span className="idash__stat-value">{occPct}%</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('7-Day Revenue')}</h4>
              <div className="idash__chart">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                  const maxR = Math.max(...data.weekRev);
                  return (
                    <div key={day} className="idash__chart-col">
                      <div className="idash__chart-bar idash__chart-bar--interactive"
                        style={{ height: `${(data.weekRev[i] / Math.max(maxR, 1)) * 100}%` }}
                        onClick={() => bumpRevBar(i)} title={`€${fmt(data.weekRev[i])} — ${d('Click to adjust')}`} />
                      <span className="idash__chart-label">{d(day)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Revenue Breakdown')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Source')}</th><th>{d('Amount')}</th></tr></thead><tbody>
                <tr><td>Room Revenue</td><td><InlineEdit value={data.breakdown.rooms} onChange={v => setBreakdown('rooms', v)} onInteract={act} prefix="€" /></td></tr>
                <tr><td>F&B</td><td><InlineEdit value={data.breakdown.fnb} onChange={v => setBreakdown('fnb', v)} onInteract={act} prefix="€" /></td></tr>
                <tr><td>Extras</td><td><InlineEdit value={data.breakdown.extras} onChange={v => setBreakdown('extras', v)} onInteract={act} prefix="€" /></td></tr>
                <tr><td><strong>Total</strong></td><td><strong>€{fmt(data.breakdown.rooms + data.breakdown.fnb + data.breakdown.extras)}</strong></td></tr>
              </tbody></table>
              <button className="idash__add-btn" style={{ marginTop: 12 }} onClick={() => showToast(d('Report exported ✓'))} type="button">Export Report</button>
            </div>
          </div>
        </>}

        <Callout industry="hospitality" d={d} />
        <ResetBtn onReset={() => { setData(clone(HOSP_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CLINICS DASHBOARD
   ═══════════════════════════════════════════════════ */
const CLINIC_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'schedule', label: 'Schedule' },
  { id: 'patients', label: 'Patients' }, { id: 'reports', label: 'Reports' },
];

function ClinicsDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(CLINIC_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  const apptCount = data.schedule.filter(s => s.filled).length;
  const reminded = data.reminders.filter(r => r.sent).length;

  function toggleSlot(idx) {
    act();
    setData(prev => {
      const n = clone(prev); const sl = n.schedule[idx];
      if (sl.filled) { sl.filled = false; sl.patient = null; sl.proc = null; sl.doc = null; }
      else { sl.filled = true; sl.patient = 'Walk-in'; sl.proc = 'General checkup'; sl.doc = 'Dr. Pérez'; }
      return n;
    });
    showToast(data.schedule[idx].filled ? 'Appointment cancelled' : 'Walk-in booked');
  }
  function toggleReminder(idx) {
    act();
    setData(prev => { const n = clone(prev); n.reminders[idx].sent = !n.reminders[idx].sent; return n; });
  }
  function bumpBar(idx) {
    act();
    setData(prev => { const n = clone(prev); n.weekRev[idx] = n.weekRev[idx] + 10 > 100 ? 20 : n.weekRev[idx] + 10; return n; });
  }
  function togglePatientStatus(idx) {
    act();
    setData(prev => { const n = clone(prev); n.patients[idx].status = n.patients[idx].status === 'active' ? 'inactive' : 'active'; return n; });
    showToast(d('Patient status updated'));
  }
  const set = (field, val) => setData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="idash">
      <DashSidebar title="Clinic Dashboard" items={CLINIC_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Clinic Dashboard" alerts={2} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {/* ── OVERVIEW ── */}
        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Appointments Today')}</span><span className="idash__stat-value">{apptCount}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('No-shows Prevented')}</span><span className="idash__stat-value">{reminded}</span><span className="idash__stat-badge idash__stat-badge--up">{d('Auto-reminded')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Patients Waiting')}</span><span className="idash__stat-value"><InlineEdit value={data.waiting} onChange={v => set('waiting', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.revenue} onChange={v => set('revenue', v)} onInteract={act} prefix="€" /></span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Schedule')}</h4>
              <div className="idash__timeline">
                {data.schedule.map((s, i) => (
                  <div key={i} className={`idash__tl-slot ${s.filled ? 'is-filled' : 'is-empty'} idash__tl-slot--clickable`}
                    onClick={() => toggleSlot(i)} title={s.filled ? 'Click to cancel' : 'Click to book walk-in'}>
                    <span className="idash__tl-time">{s.time}</span>
                    {s.filled ? <span className="idash__tl-info">{s.patient} — {s.proc} — {s.doc}</span>
                      : <span className="idash__tl-avail">{d('Available — click to book')}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Reminder Status')}</h4>
              <div className="idash__reminder-list">
                {data.reminders.map((r, i) => (
                  <div key={i} className="idash__reminder-row"><span>{r.label}</span>
                    <span className={`idash__badge ${r.sent ? 'idash__badge--ok' : 'idash__badge--wait'} idash__editable`}
                      onClick={() => toggleReminder(i)} title={d('Click to toggle')}>{r.sent ? d('✅ Reminded') : d('⏳ Pending')}</span>
                  </div>
                ))}
              </div>
              <p className="idash__reminder-note">{reminded} {d('no-shows prevented this week')} — €{reminded * 113} {d('recovered')}</p>
            </div>
          </div>
        </>}

        {/* ── SCHEDULE ── */}
        {view === 'schedule' && <>
          <div className="idash__room-summary">
            <span>{apptCount} {d('booked')}</span><span className="idash__room-summary-dot">·</span>
            <span>{data.schedule.length - apptCount} {d('available')}</span><span className="idash__room-summary-dot">·</span>
            <span>{data.schedule.length} {d('total slots')}</span>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Full Day Schedule')}</h4>
            <div className="idash__timeline">
              {data.schedule.map((s, i) => (
                <div key={i} className={`idash__tl-slot ${s.filled ? 'is-filled' : 'is-empty'} idash__tl-slot--clickable`}
                  onClick={() => toggleSlot(i)} title={s.filled ? 'Click to cancel' : 'Click to book walk-in'}>
                  <span className="idash__tl-time">{s.time}</span>
                  {s.filled ? <span className="idash__tl-info">{s.patient} — {s.proc} — {s.doc}</span>
                    : <span className="idash__tl-avail">{d('Available — click to book')}</span>}
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ── PATIENTS ── */}
        {view === 'patients' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Patient Records')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Last Visit')}</th><th>{d('Next Appt')}</th><th>{d('Phone')}</th><th>{d('Notes')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.patients.map((p, i) => (
                <tr key={i}><td>{p.name}</td><td>{p.lastVisit}</td><td>{p.nextAppt}</td><td className="idash__mono">{p.phone}</td><td>{p.notes}</td>
                  <td><span className={`idash__badge ${p.status === 'active' ? 'idash__badge--ok' : 'idash__badge--wait'} idash__editable`}
                    onClick={() => togglePatientStatus(i)} title={d('Click to toggle')}>{p.status === 'active' ? d('Active') : d('Inactive')}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {/* ── REPORTS ── */}
        {view === 'reports' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Total Appointments')}</span><span className="idash__stat-value">124</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Cancellation Rate')}</span><span className="idash__stat-value">4.2%</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Avg. Wait Time')}</span><span className="idash__stat-value">8 min</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value">€{fmt(data.revenue)}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Weekly Revenue')}</h4>
              <div className="idash__chart">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => (
                    <div key={day} className="idash__chart-col">
                    <div className="idash__chart-bar idash__chart-bar--interactive" style={{ height: `${data.weekRev[i]}%` }}
                      onClick={() => bumpBar(i)} title={d('Click to adjust')} />
                    <span className="idash__chart-label">{d(day)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Top Procedures')}</h4>
              <div className="idash__proc-list">
                {[{ n: 'General checkup', c: 34, rev: 2040 }, { n: 'Follow-up visit', c: 22, rev: 1100 }, { n: 'Dental cleaning', c: 18, rev: 1440 }, { n: 'Dermatology', c: 14, rev: 1120 }].map(p => (
                  <div key={p.n} className="idash__proc-row"><span>{p.n}</span><span className="idash__proc-count">{p.c} × — €{fmt(p.rev)}</span></div>
                ))}
              </div>
              <button className="idash__add-btn" style={{ marginTop: 12 }} onClick={() => showToast(d('Report exported ✓'))} type="button">Export Report</button>
            </div>
          </div>
        </>}

        <Callout industry="clinics" d={d} />
        <ResetBtn onReset={() => { setData(clone(CLINIC_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REAL ESTATE DASHBOARD
   ═══════════════════════════════════════════════════ */
const RE_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'listings', label: 'Listings' },
  { id: 'leads', label: 'Leads' }, { id: 'calendar', label: 'Calendar' },
];

function RealEstateDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(RE_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function cycleLeadStatus(idx) { act(); setData(prev => { const n = clone(prev); n.leads[idx].status = RE_STATUS_CYCLE[n.leads[idx].status]; return n; }); showToast(d('Lead status updated')); }
  function adjustInquiries(delta) { act(); setData(prev => ({ ...prev, inquiries: Math.max(0, prev.inquiries + delta) })); }
  function updateFunnel(idx, val) { setData(prev => { const n = clone(prev); n.funnel[idx].n = val; return n; }); }
  function cyclePropStatus(idx) { act(); setData(prev => { const n = clone(prev); n.properties[idx].status = PROP_STATUS_CYCLE[n.properties[idx].status]; return n; }); showToast(d('Listing status updated')); }
  function addLead() {
    act();
    setData(prev => ({ ...prev, leads: [{ name: 'New Lead', prop: '—', budget: '—', status: 'followed' }, ...prev.leads] }));
    showToast(d('Lead added'));
  }
  const set = (field, val) => setData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="idash">
      <DashSidebar title="Real Estate CRM" items={RE_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Real Estate CRM" alerts={5} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {/* ── OVERVIEW ── */}
        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Active Listings')}</span><span className="idash__stat-value"><InlineEdit value={data.listings} onChange={v => set('listings', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('New Inquiries Today')}</span><span className="idash__stat-value">
              <span className="idash__adj-group"><button className="idash__adj-btn" onClick={() => adjustInquiries(-1)}>−</button><span>{data.inquiries}</span><button className="idash__adj-btn" onClick={() => adjustInquiries(1)}>+</button></span>
            </span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Visits Scheduled')}</span><span className="idash__stat-value"><InlineEdit value={data.visits} onChange={v => set('visits', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Leads Qualified')}</span><span className="idash__stat-value">12</span><span className="idash__stat-badge idash__stat-badge--up">{d('Auto-qualified')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Hot Leads')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Property')}</th><th>{d('Budget')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.leads.map((l, i) => (
                  <tr key={i}><td>{l.name}</td><td>{l.prop}</td><td>{l.budget}</td><td>
                    <span className={`idash__badge ${RE_STATUS_CLASS[l.status]} idash__editable`} onClick={() => cycleLeadStatus(i)} title={d('Click to cycle')}>{d(RE_STATUS_LABELS[l.status])}</span>
                  </td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Response Time')}</h4>
              <div className="idash__response-row">
                <span className="idash__big-metric">Avg. 4 min</span>
                <Toggle on={data.autoResponse} onToggle={v => set('autoResponse', v)} label={d('Auto-response')} onInteract={act} />
              </div>
              <p className="idash__metric-note">{data.autoResponse ? d('Auto-response active — industry avg: 2–3 hours') : d('Auto-response OFF — manual replies only')}</p>
            </div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('This Week\'s Visits')}</h4>
              <div className="idash__week-cal">
                {Object.entries(RE_VISITS).map(([day, visits]) => (
                  <div key={day} className="idash__cal-day"><span className="idash__cal-day-label">{day}</span>
                    {visits.length ? visits.map((v, i) => (
                      <div key={i} className="idash__cal-card"><span className="idash__cal-prop">{v.p}</span><span className="idash__cal-client">{v.c} · {v.t}</span></div>
                    )) : <span className="idash__cal-empty">—</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Conversion Funnel')}</h4>
              <div className="idash__funnel">
                {data.funnel.map((f, i) => (
                  <div key={f.s} className="idash__funnel-step">
                    <span className="idash__funnel-num"><InlineEdit value={f.n} onChange={v => updateFunnel(i, v)} onInteract={act} /></span>
                    <span className="idash__funnel-label">{f.s}</span>
                    {i < 3 && <span className="idash__funnel-arrow">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {/* ── LISTINGS ── */}
        {view === 'listings' && <>
          <div className="idash__room-summary">
            <span>{data.properties.filter(p => p.status === 'active').length} active</span><span className="idash__room-summary-dot">·</span>
            <span>{data.properties.filter(p => p.status === 'under-offer').length} under offer</span><span className="idash__room-summary-dot">·</span>
            <span>{data.properties.filter(p => p.status === 'sold').length} sold</span>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Property Listings')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Address')}</th><th>{d('Type')}</th><th>{d('Beds')}</th><th>{d('Price')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.properties.map((p, i) => (
                <tr key={i}><td>{p.addr}</td><td>{p.type}</td><td>{p.beds}</td><td>{p.price}</td>
                  <td><span className={`idash__badge ${PROP_STATUS_CSS[p.status]} idash__editable`} onClick={() => cyclePropStatus(i)} title={d('Click to cycle')}>{d(PROP_STATUS_LABEL[p.status])}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {/* ── LEADS ── */}
        {view === 'leads' && <>
          <div className="idash__panel">
            <div className="idash__panel-head"><h4 className="idash__panel-title">{d('Lead Pipeline')}</h4>
              <button className="idash__add-btn" onClick={addLead} type="button">{d('+ Add Lead')}</button></div>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Property Interest')}</th><th>{d('Budget')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.leads.map((l, i) => (
                <tr key={i}><td>{l.name}</td><td>{l.prop}</td><td>{l.budget}</td>
                  <td><span className={`idash__badge ${RE_STATUS_CLASS[l.status]} idash__editable`} onClick={() => cycleLeadStatus(i)} title={d('Click to cycle')}>{d(RE_STATUS_LABELS[l.status])}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {/* ── CALENDAR ── */}
        {view === 'calendar' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Weekly Visit Calendar')}</h4>
            <div className="idash__week-cal">
              {Object.entries(RE_VISITS).map(([day, visits]) => (
                <div key={day} className="idash__cal-day"><span className="idash__cal-day-label">{day}</span>
                  {visits.length ? visits.map((v, i) => (
                    <div key={i} className="idash__cal-card"><span className="idash__cal-prop">{v.p}</span><span className="idash__cal-client">{v.c} · {v.t}</span></div>
                  )) : <span className="idash__cal-empty">No visits</span>}
                </div>
              ))}
            </div>
          </div>
        </>}

        <Callout industry="real estate" d={d} />
        <ResetBtn onReset={() => { setData(clone(RE_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BARBERSHOP DASHBOARD
   ═══════════════════════════════════════════════════ */
const BARBER_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'appointments', label: 'Appointments' },
  { id: 'staff', label: 'Staff' }, { id: 'services', label: 'Services' }, { id: 'revenue', label: 'Revenue' },
];
const BARBER_STATUS_CYCLE = { confirmed: 'in-chair', 'in-chair': 'done', done: 'confirmed' };
const BARBER_STATUS_LABEL = { confirmed: 'Confirmed', 'in-chair': 'In Chair', done: 'Done' };
const BARBER_STATUS_CSS = { confirmed: 'idash__badge--wait', 'in-chair': 'idash__badge--hot', done: 'idash__badge--ok' };
const CHAIR_CSS = { available: 'avail', occupied: 'occ', break: 'clean' };
const CHAIR_LABEL = { available: 'Available', occupied: 'Occupied', break: 'On Break' };

const BARBER_DEFAULTS = {
  todayAppts: 8, todayCap: 12, walkIns: 3, avgTicket: 38, monthlyRev: 4240,
  schedule: [
    { time: '10:00', client: 'Marco R.', service: 'Classic Cut',     barber: 'Miguel', status: 'in-chair' },
    { time: '11:00', client: 'James K.', service: 'Fade + Beard',    barber: 'Carlos', status: 'confirmed' },
    { time: '12:30', client: 'Sarah M.', service: 'Hair Color',      barber: 'Ana',    status: 'confirmed' },
    { time: '14:00', client: 'Luis V.',  service: 'Hot Towel Shave', barber: 'Miguel', status: 'confirmed' },
    { time: '15:30', client: 'Emma D.',  service: 'Highlights',      barber: 'Ana',    status: 'confirmed' },
    { time: '16:30', client: 'Tom P.',   service: 'Classic Cut',     barber: 'Carlos', status: 'confirmed' },
  ],
  chairs: [
    { n: 1, status: 'occupied',  who: 'Miguel — Marco R.' },
    { n: 2, status: 'available', who: 'Open' },
    { n: 3, status: 'break',     who: 'Carlos — on break' },
    { n: 4, status: 'available', who: 'Ana' },
  ],
  upcoming: [
    { time: '14:00', client: 'Luis V.',  service: 'Hot Towel Shave', day: 'Today' },
    { time: '15:30', client: 'Emma D.',  service: 'Highlights',      day: 'Today' },
    { time: '16:30', client: 'Tom P.',   service: 'Classic Cut',     day: 'Today' },
    { time: '09:00', client: 'Pedro L.', service: 'Classic Cut',     day: 'Tomorrow' },
    { time: '10:30', client: 'Ana K.',   service: 'Hair Color',      day: 'Tomorrow' },
    { time: '13:00', client: 'Hugo F.',  service: 'Fade + Beard',    day: 'This Week' },
    { time: '15:00', client: 'Rita B.',  service: 'Highlights',      day: 'This Week' },
  ],
  staff: [
    { name: 'Miguel Santos', specialty: 'Fades & Cuts',     appts: 6, rating: 4.9, hours: '09:00 – 18:00' },
    { name: 'Carlos Rivera', specialty: 'Beard Specialist', appts: 4, rating: 4.8, hours: '10:00 – 19:00' },
    { name: 'Ana Lima',      specialty: 'Color & Style',    appts: 5, rating: 5.0, hours: '09:00 – 17:00' },
  ],
  services: [
    { name: 'Classic Cut',     price: 25, minutes: 30 },
    { name: 'Fade + Beard',    price: 40, minutes: 45 },
    { name: 'Hot Towel Shave', price: 30, minutes: 30 },
    { name: 'Kids Cut',        price: 18, minutes: 20 },
    { name: 'Hair Color',      price: 65, minutes: 90 },
    { name: 'Highlights',      price: 85, minutes: 120 },
  ],
  weekRev: [820, 1040, 950, 1430],
};

function BarbershopDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(BARBER_DEFAULTS));
  const [view, setView] = useState('overview');
  const [filter, setFilter] = useState('Today');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();
  const set = (f, v) => setData(prev => ({ ...prev, [f]: v }));

  function cycleSchedStatus(i) {
    act();
    setData(prev => { const n = clone(prev); n.schedule[i].status = BARBER_STATUS_CYCLE[n.schedule[i].status]; return n; });
    showToast(d('Status updated'));
  }
  function updateService(i, field, val) {
    act();
    setData(prev => { const n = clone(prev); n.services[i][field] = val; return n; });
  }
  function confirmAppt(client) { act(); showToast(`${client} confirmed ✓`); }
  function cancelAppt(idx) {
    act();
    setData(prev => ({ ...prev, upcoming: prev.upcoming.filter((_, j) => j !== idx) }));
    showToast(d('Appointment cancelled'));
  }

  const filteredUpcoming = data.upcoming.filter(u => u.day === filter);
  const topService = data.services.reduce((a, b) => (b.price > a.price ? b : a));

  return (
    <div className="idash">
      <DashSidebar title="Barbershop" items={BARBER_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Barbershop Manager" alerts={1} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Today\'s Appointments')}</span>
              <span className="idash__stat-value">{data.todayAppts}<span className="idash__stat-dim">/{data.todayCap}</span></span>
            </div>
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Walk-ins Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.walkIns} onChange={v => set('walkIns', v)} onInteract={act} /></span>
            </div>
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Avg Ticket')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.avgTicket} onChange={v => set('avgTicket', v)} onInteract={act} prefix="€" /></span>
            </div>
            <div className="idash__stat">
              <span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => set('monthlyRev', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+8%')}</span>
            </div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Schedule')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Client')}</th><th>{d('Service')}</th><th>{d('Barber')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.schedule.map((s, i) => (
                  <tr key={i}>
                    <td>{s.time}</td><td>{s.client}</td><td>{s.service}</td><td>{s.barber}</td>
                    <td><span className={`idash__badge ${BARBER_STATUS_CSS[s.status]} idash__editable`} onClick={() => cycleSchedStatus(i)} title={d('Click to cycle')}>{d(BARBER_STATUS_LABEL[s.status])}</span></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Chair Status')}</h4>
              <div className="idash__room-mgmt" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {data.chairs.map(c => (
                  <div key={c.n} className={`idash__room-cell idash__room-cell--${CHAIR_CSS[c.status]}`}>
                    <span className="idash__room-cell-num">Chair {c.n}</span>
                    <span className="idash__room-cell-label">{CHAIR_LABEL[c.status]}</span>
                    <span className="idash__room-cell-label" style={{ fontSize: '0.62rem', opacity: 0.65 }}>{c.who}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'appointments' && <>
          <div className="idash__filter-bar">
            {['Today', 'Tomorrow', 'This Week'].map(f => (
              <button key={f} type="button" className={`idash__filter-btn ${filter === f ? 'is-active' : ''}`} onClick={() => { setFilter(f); act(); }}>{d(f)}</button>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Appointments')} — {d(filter)}</h4>
            <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Client')}</th><th>{d('Service')}</th><th>{d('Actions')}</th></tr></thead><tbody>
              {filteredUpcoming.length === 0 ? (
                <tr><td colSpan={4} style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '18px 0' }}>No appointments</td></tr>
              ) : filteredUpcoming.map(u => {
                const origIdx = data.upcoming.indexOf(u);
                return (
                  <tr key={origIdx}>
                    <td>{u.time}</td><td>{u.client}</td><td>{u.service}</td>
                    <td className="idash__actions">
                      <button className="idash__action-btn" onClick={() => confirmAppt(u.client)}>Confirm</button>
                      <button className="idash__action-btn idash__action-btn--danger" onClick={() => cancelAppt(origIdx)}>Cancel</button>
                    </td>
                  </tr>
                );
              })}
            </tbody></table>
          </div>
        </>}

        {view === 'staff' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Barbers Today')}</h4>
            <div className="idash__staff-list">
              {data.staff.map(s => (
                <div key={s.name} className="idash__staff-card">
                  <span className="idash__staff-name">{s.name}</span>
                  <span className="idash__staff-shift">{s.hours}</span>
                  <span className="idash__staff-role">{s.specialty} · {s.appts} appts today · ⭐ {s.rating.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'services' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Service Menu — click values to edit')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Service')}</th><th>{d('Price')}</th><th>{d('Duration')}</th></tr></thead><tbody>
              {data.services.map((s, i) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td><InlineEdit value={s.price} onChange={v => updateService(i, 'price', v)} onInteract={act} prefix="€" /></td>
                  <td><InlineEdit value={s.minutes} onChange={v => updateService(i, 'minutes', v)} onInteract={act} suffix=" min" /></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('This Month')}</span><span className="idash__stat-value">€{fmt(data.monthlyRev)}</span><span className="idash__stat-badge idash__stat-badge--up">{d('+8% vs last')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Last Month')}</span><span className="idash__stat-value">€3,925</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Top Service')}</span><span className="idash__stat-value idash__stat-value--sm">{topService.name}</span><span className="idash__stat-note">€{topService.price} {d('per visit')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Monthly Breakdown')}</h4>
              <div className="idash__week-stats">
                {data.weekRev.map((r, i) => (
                  <div key={i} className="idash__ws-row">
                    <span>Week {i + 1}</span>
                    <span className="idash__ws-val">€{fmt(r)}</span>
                  </div>
                ))}
                <div className="idash__bar" style={{ marginTop: 10 }}><div className="idash__bar-fill" style={{ width: `${Math.min(100, (data.monthlyRev / 5000) * 100)}%` }} /></div>
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Top Services by Revenue')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Service')}</th><th>{d('Bookings')}</th><th>{d('Revenue')}</th></tr></thead><tbody>
                {[['Fade + Beard', 28, 1120], ['Classic Cut', 34, 850], ['Highlights', 9, 765], ['Hair Color', 12, 780], ['Hot Towel Shave', 18, 540]].map(([n, b, r]) => (
                  <tr key={n}><td>{n}</td><td>{b}</td><td>€{fmt(r)}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </>}

        <Callout industry="barbershop & beauty" d={d} />
        <ResetBtn onReset={() => { setData(clone(BARBER_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VETERINARY DASHBOARD
   ═══════════════════════════════════════════════════ */
const VET_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'appointments', label: 'Appointments' },
  { id: 'patients', label: 'Patients' }, { id: 'reminders', label: 'Reminders' }, { id: 'revenue', label: 'Revenue' },
];
const VET_STATUS_CSS = { 'in-room': 'idash__badge--hot', waiting: 'idash__badge--wait', confirmed: 'idash__badge--ok' };
const VET_STATUS_LABEL = { 'in-room': 'In Room', waiting: 'Waiting', confirmed: 'Confirmed' };
const VET_ROOM_CSS = { available: 'avail', 'in-use': 'occ', cleaning: 'clean' };
const VET_ROOM_LABEL = { available: 'Available', 'in-use': 'In Use', cleaning: 'Cleaning' };

const VET_DEFAULTS = {
  patientsToday: 11, surgeries: 2, newPatients: 5, monthlyRev: 8640,
  todayAppts: [
    { time: '09:00', pet: 'Luna (Golden)',  owner: 'García family', reason: 'Annual checkup', vet: 'Dr. Martínez', status: 'in-room' },
    { time: '10:30', pet: 'Max (Bulldog)',  owner: 'Smith',         reason: 'Vaccination',    vet: 'Dr. López',    status: 'waiting' },
    { time: '11:00', pet: 'Mia (Cat)',      owner: 'Wilson',        reason: 'Dental clean',   vet: 'Dr. Martínez', status: 'confirmed' },
    { time: '13:00', pet: 'Rocky (Lab)',    owner: "O'Brien",       reason: 'Post-op check',  vet: 'Dr. López',    status: 'confirmed' },
    { time: '15:30', pet: 'Bella (Poodle)', owner: 'Fernández',     reason: 'Grooming',       vet: 'Dr. Martínez', status: 'confirmed' },
  ],
  rooms: [
    { n: 1, status: 'in-use' },
    { n: 2, status: 'available' },
    { n: 3, status: 'cleaning' },
  ],
  patients: [
    { pet: 'Luna',   species: 'Golden Retriever', owner: 'García family', last: 'Mar 14', next: 'Apr 12' },
    { pet: 'Max',    species: 'Bulldog',          owner: 'Smith',         last: 'Feb 28', next: 'Apr 11' },
    { pet: 'Mia',    species: 'Persian Cat',      owner: 'Wilson',        last: 'Mar 20', next: 'Apr 11' },
    { pet: 'Rocky',  species: 'Labrador',         owner: "O'Brien",       last: 'Apr 2',  next: 'Apr 18' },
    { pet: 'Bella',  species: 'Poodle',           owner: 'Fernández',     last: 'Mar 5',  next: 'Apr 11' },
    { pet: 'Coco',   species: 'Siamese Cat',      owner: 'Kim',           last: 'Feb 10', next: '—' },
    { pet: 'Simba',  species: 'Maine Coon',       owner: 'Patel',         last: 'Mar 29', next: 'Apr 25' },
  ],
  reminders: [
    { pet: 'Luna García',  note: 'Annual vaccination due in 3 days',  sent: false },
    { pet: 'Max Smith',    note: 'Deworming due tomorrow',            sent: false },
    { pet: 'Mia Wilson',   note: 'Dental follow-up in 1 week',        sent: false },
    { pet: 'Bella Fernández', note: 'Grooming appointment in 5 days', sent: false },
  ],
  revenueByService: [
    { svc: 'Consultations', amount: 3240 },
    { svc: 'Vaccinations',  amount: 1820 },
    { svc: 'Surgery',       amount: 2400 },
    { svc: 'Grooming',      amount: 1180 },
  ],
};

function VeterinaryDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(VET_DEFAULTS));
  const [view, setView] = useState('overview');
  const [search, setSearch] = useState('');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();
  const set = (f, v) => setData(prev => ({ ...prev, [f]: v }));

  function sendReminder(i, via) {
    act();
    setData(prev => { const n = clone(prev); n.reminders[i].sent = true; n.reminders[i].via = via; return n; });
    showToast(`Reminder sent via ${via}`);
  }

  const filteredPatients = data.patients.filter(p =>
    !search || p.pet.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase())
  );
  const totalRev = data.revenueByService.reduce((s, r) => s + r.amount, 0);
  const maxRev = Math.max(...data.revenueByService.map(r => r.amount));

  return (
    <div className="idash">
      <DashSidebar title="Vet Clinic" items={VET_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Veterinary Dashboard" alerts={2} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Patients Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.patientsToday} onChange={v => set('patientsToday', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Surgeries Scheduled')}</span>
              <span className="idash__stat-value">{data.surgeries}</span><span className="idash__stat-note">{d('today')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('New Patients')}</span>
              <span className="idash__stat-value">{data.newPatients}</span><span className="idash__stat-note">{d('this week')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => set('monthlyRev', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+15%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Appointments')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Pet')}</th><th>{d('Owner')}</th><th>{d('Reason')}</th><th>{d('Vet')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.todayAppts.map((a, i) => (
                  <tr key={i}><td>{a.time}</td><td>{a.pet}</td><td>{a.owner}</td><td>{a.reason}</td><td>{a.vet}</td>
                    <td><span className={`idash__badge ${VET_STATUS_CSS[a.status]}`}>{VET_STATUS_LABEL[a.status]}</span></td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Room Status')}</h4>
              <div className="idash__room-mgmt" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {data.rooms.map(r => (
                  <div key={r.n} className={`idash__room-cell idash__room-cell--${VET_ROOM_CSS[r.status]}`}>
                    <span className="idash__room-cell-num">Room {r.n}</span>
                    <span className="idash__room-cell-label">{VET_ROOM_LABEL[r.status]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'appointments' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('All Appointments Today')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Pet')}</th><th>{d('Owner')}</th><th>{d('Reason')}</th><th>{d('Vet')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.todayAppts.map((a, i) => (
                <tr key={i}><td>{a.time}</td><td>{a.pet}</td><td>{a.owner}</td><td>{a.reason}</td><td>{a.vet}</td>
                  <td><span className={`idash__badge ${VET_STATUS_CSS[a.status]}`}>{VET_STATUS_LABEL[a.status]}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'patients' && <>
          <div className="idash__panel">
            <div className="idash__panel-head">
              <h4 className="idash__panel-title">{d('Patient Database')}</h4>
              <input type="text" className="idash__search-input" placeholder="Search by pet or owner..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <table className="idash__table"><thead><tr><th>{d('Pet')}</th><th>{d('Species')}</th><th>{d('Owner')}</th><th>{d('Last Visit')}</th><th>{d('Next Visit')}</th></tr></thead><tbody>
              {filteredPatients.map((p, i) => (
                <tr key={i}><td>{p.pet}</td><td>{p.species}</td><td>{p.owner}</td><td>{p.last}</td><td>{p.next}</td></tr>
              ))}
              {filteredPatients.length === 0 && <tr><td colSpan={5} style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '18px 0' }}>No patients found</td></tr>}
            </tbody></table>
          </div>
        </>}

        {view === 'reminders' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Pending Reminders')}</h4>
            <div className="idash__reminder-list">
              {data.reminders.map((r, i) => (
                <div key={i} className="idash__reminder-row">
                  <span><strong>{r.pet}</strong> — {r.note}</span>
                  {r.sent ? (
                    <span className="idash__badge idash__badge--ok">✓ Sent via {r.via}</span>
                  ) : (
                    <span className="idash__actions">
                      <button className="idash__action-btn" onClick={() => sendReminder(i, 'WhatsApp')}>Send WhatsApp</button>
                      <button className="idash__action-btn" onClick={() => sendReminder(i, 'Email')}>Send Email</button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Total Monthly')}</span><span className="idash__stat-value">€{fmt(totalRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Avg Daily')}</span><span className="idash__stat-value">€{fmt(Math.round(totalRev / 30))}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Growth')}</span><span className="idash__stat-value">+15%</span><span className="idash__stat-badge idash__stat-badge--up">{d('vs last month')}</span></div>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Revenue by Service')}</h4>
            <div className="idash__week-stats">
              {data.revenueByService.map(r => (
                <div key={r.svc} className="idash__ws-row">
                  <span>{r.svc}</span>
                  <span className="idash__ws-val">€{fmt(r.amount)}</span>
                </div>
              ))}
            </div>
            <div className="idash__chart" style={{ marginTop: 16 }}>
              {data.revenueByService.map(r => (
                <div key={r.svc} className="idash__chart-col">
                  <div className="idash__chart-bar" style={{ height: `${(r.amount / maxRev) * 100}%` }} />
                  <span className="idash__chart-label">{r.svc.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        <Callout industry="veterinary" d={d} />
        <ResetBtn onReset={() => { setData(clone(VET_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GYM & FITNESS DASHBOARD
   ═══════════════════════════════════════════════════ */
const GYM_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'classes', label: 'Classes' },
  { id: 'members', label: 'Members' }, { id: 'trainers', label: 'Trainers' }, { id: 'revenue', label: 'Revenue' },
];
const GYM_CLASS_CSS = { 'in-progress': 'idash__badge--hot', 'starting-soon': 'idash__badge--wait', open: 'idash__badge--ok', full: 'idash__badge--cancel' };
const GYM_CLASS_LABEL = { 'in-progress': 'In Progress', 'starting-soon': 'Starting Soon', open: 'Open', full: 'Full' };
const GYM_MEMBER_CSS = { active: 'idash__badge--ok', expiring: 'idash__badge--wait', expired: 'idash__badge--cancel' };

const GYM_DEFAULTS = {
  activeMembers: 247, classesToday: 8, checkInsToday: 43, monthlyRev: 12480,
  todayClasses: [
    { time: '07:00', name: 'CrossFit',  trainer: 'Mike R.',  cap: 18, max: 20, status: 'in-progress' },
    { time: '09:00', name: 'Yoga Flow', trainer: 'Sara M.',  cap: 12, max: 15, status: 'starting-soon' },
    { time: '11:00', name: 'HIIT',      trainer: 'Carlos V.', cap: 8,  max: 20, status: 'open' },
    { time: '18:00', name: 'Boxing',    trainer: 'Jake T.',   cap: 20, max: 20, status: 'full' },
  ],
  liveCheckIns: [
    { name: 'Laura P.',   time: '08:42' },
    { name: 'Marco D.',   time: '08:38' },
    { name: 'Sofia K.',   time: '08:31' },
    { name: 'Daniel R.',  time: '08:24' },
    { name: 'Elena M.',   time: '08:19' },
  ],
  weekClasses: [
    { day: 'Mon', name: 'CrossFit',  trainer: 'Mike R.',  time: '07:00', spots: 2, max: 20 },
    { day: 'Mon', name: 'Yoga Flow', trainer: 'Sara M.',  time: '18:00', spots: 5, max: 15 },
    { day: 'Tue', name: 'HIIT',      trainer: 'Carlos V.', time: '11:00', spots: 12, max: 20 },
    { day: 'Tue', name: 'Boxing',    trainer: 'Jake T.',   time: '19:00', spots: 0,  max: 20 },
    { day: 'Wed', name: 'Pilates',   trainer: 'Sara M.',  time: '09:30', spots: 4, max: 15 },
    { day: 'Thu', name: 'CrossFit',  trainer: 'Mike R.',  time: '07:00', spots: 3, max: 20 },
  ],
  members: [
    { name: 'Laura Pérez',    plan: 'Premium', checkIns: 14, expires: 'May 12', status: 'active' },
    { name: 'Marco Díaz',     plan: 'Elite',   checkIns: 22, expires: 'Jun 03', status: 'active' },
    { name: 'Sofia Kim',      plan: 'Basic',   checkIns: 8,  expires: 'Apr 18', status: 'expiring' },
    { name: 'Daniel Ruiz',    plan: 'Premium', checkIns: 12, expires: 'May 28', status: 'active' },
    { name: 'Elena Moreno',   plan: 'Elite',   checkIns: 19, expires: 'Jul 10', status: 'active' },
    { name: 'Hugo Vega',      plan: 'Basic',   checkIns: 3,  expires: 'Apr 02', status: 'expired' },
    { name: 'Carla Romero',   plan: 'Premium', checkIns: 16, expires: 'May 20', status: 'active' },
  ],
  trainers: [
    { name: 'Mike R.',   specialty: 'CrossFit & Strength', classes: 12, rating: 4.9 },
    { name: 'Sara M.',   specialty: 'Yoga & Pilates',      classes: 10, rating: 5.0 },
    { name: 'Carlos V.', specialty: 'HIIT & Cardio',       classes: 8,  rating: 4.7 },
    { name: 'Jake T.',   specialty: 'Boxing & MMA',        classes: 6,  rating: 4.8 },
  ],
  plans: [
    { name: 'Basic',   price: 29, members: 98,  target: 120 },
    { name: 'Premium', price: 49, members: 112, target: 130 },
    { name: 'Elite',   price: 79, members: 37,  target: 50 },
  ],
  mrrTarget: 14000,
};

function GymDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(GYM_DEFAULTS));
  const [view, setView] = useState('overview');
  const [planFilter, setPlanFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();
  const set = (f, v) => setData(prev => ({ ...prev, [f]: v }));

  function bookClass(i) {
    act();
    setData(prev => { const n = clone(prev); const c = n.weekClasses[i]; if (c.spots > 0) c.spots--; return n; });
    showToast(d('Class booked'));
  }

  const filteredMembers = data.members.filter(m => planFilter === 'All' || m.plan === planFilter);
  const mrr = data.plans.reduce((s, p) => s + p.price * p.members, 0);
  const mrrPct = Math.min(100, Math.round((mrr / data.mrrTarget) * 100));

  return (
    <div className="idash">
      <DashSidebar title="Gym Dashboard" items={GYM_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Gym & Fitness" alerts={4} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Active Members')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.activeMembers} onChange={v => set('activeMembers', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Classes Today')}</span><span className="idash__stat-value">{data.classesToday}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Check-ins Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.checkInsToday} onChange={v => set('checkInsToday', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => set('monthlyRev', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+6%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Classes')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Class')}</th><th>{d('Trainer')}</th><th>{d('Capacity')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.todayClasses.map((c, i) => (
                  <tr key={i}><td>{c.time}</td><td>{c.name}</td><td>{c.trainer}</td>
                    <td>{c.cap}/{c.max}</td>
                    <td><span className={`idash__badge ${GYM_CLASS_CSS[c.status]}`}>{GYM_CLASS_LABEL[c.status]}</span></td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Live Check-ins')}</h4>
              <div className="idash__staff-list">
                {data.liveCheckIns.map((c, i) => (
                  <div key={i} className="idash__staff-card">
                    <span className="idash__staff-name">{c.name}</span>
                    <span className="idash__staff-shift">{c.time}</span>
                    <span className="idash__staff-role">Checked in</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'classes' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('This Week\'s Classes — click Book to reserve')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Day')}</th><th>{d('Class')}</th><th>{d('Trainer')}</th><th>{d('Time')}</th><th>{d('Spots')}</th><th></th></tr></thead><tbody>
              {data.weekClasses.map((c, i) => (
                <tr key={i}><td>{c.day}</td><td>{c.name}</td><td>{c.trainer}</td><td>{c.time}</td>
                  <td>{c.spots}/{c.max}</td>
                  <td className="idash__actions">
                    <button className="idash__action-btn" disabled={c.spots === 0} onClick={() => bookClass(i)}>{c.spots === 0 ? 'Full' : 'Book'}</button>
                  </td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'members' && <>
          <div className="idash__filter-bar">
            {['All', 'Basic', 'Premium', 'Elite'].map(p => (
              <button key={p} type="button" className={`idash__filter-btn ${planFilter === p ? 'is-active' : ''}`} onClick={() => { setPlanFilter(p); act(); }}>{d(p)}</button>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Members')} — {d(planFilter)}</h4>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Plan')}</th><th>{d('Check-ins')}</th><th>{d('Expires')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {filteredMembers.map((m, i) => (
                <tr key={i}><td>{m.name}</td><td>{m.plan}</td><td>{m.checkIns}</td><td>{m.expires}</td>
                  <td><span className={`idash__badge ${GYM_MEMBER_CSS[m.status]}`}>{m.status.charAt(0).toUpperCase() + m.status.slice(1)}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'trainers' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Trainers')}</h4>
            <div className="idash__staff-list">
              {data.trainers.map(t => (
                <div key={t.name} className="idash__staff-card">
                  <span className="idash__staff-name">{t.name}</span>
                  <span className="idash__staff-shift">⭐ {t.rating.toFixed(1)}</span>
                  <span className="idash__staff-role">{t.specialty} · {t.classes} classes this week</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('MRR')}</span><span className="idash__stat-value">€{fmt(mrr)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Target')}</span><span className="idash__stat-value">€{fmt(data.mrrTarget)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Progress')}</span><span className="idash__stat-value">{mrrPct}%</span>
              <div className="idash__bar"><div className="idash__bar-fill" style={{ width: `${mrrPct}%` }} /></div></div>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Active Memberships by Plan')}</h4>
            <div className="idash__week-stats">
              {data.plans.map(p => {
                const pct = Math.min(100, Math.round((p.members / p.target) * 100));
                return (
                  <div key={p.name} className="idash__ws-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                    <span>{p.name} (€{p.price}/mo) — {p.members}/{p.target}</span>
                    <div className="idash__bar"><div className="idash__bar-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>}

        <Callout industry="gym & fitness" d={d} />
        <ResetBtn onReset={() => { setData(clone(GYM_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OPTICAL STORE DASHBOARD
   ═══════════════════════════════════════════════════ */
const OPT_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'appointments', label: 'Appointments' },
  { id: 'prescriptions', label: 'Prescriptions' }, { id: 'inventory', label: 'Inventory' }, { id: 'revenue', label: 'Revenue' },
];
const OPT_APPT_CSS = { 'in-progress': 'idash__badge--hot', waiting: 'idash__badge--wait', confirmed: 'idash__badge--ok' };
const OPT_APPT_LABEL = { 'in-progress': 'In Progress', waiting: 'Waiting', confirmed: 'Confirmed' };
const OPT_RX_CSS = { ordered: 'idash__badge--wait', ready: 'idash__badge--hot', 'picked-up': 'idash__badge--ok' };
const OPT_RX_LABEL = { ordered: 'Ordered', ready: 'Ready', 'picked-up': 'Picked Up' };

const OPT_DEFAULTS = {
  apptsToday: 9, framesSold: 34, pendingPickups: 7, monthlyRev: 6840,
  todayAppts: [
    { time: '10:00', client: 'Emma R.', type: 'Eye exam',          doc: 'Dr. Santos', status: 'in-progress' },
    { time: '11:30', client: 'Tom K.',  type: 'Frame fitting',     doc: 'Dr. Santos', status: 'waiting' },
    { time: '14:00', client: 'Lisa M.', type: 'Contact lens trial', doc: 'Dr. López',  status: 'confirmed' },
    { time: '15:30', client: 'Peter G.', type: 'Annual checkup',    doc: 'Dr. Santos', status: 'confirmed' },
    { time: '16:30', client: 'Julia W.', type: 'Frame pickup',      doc: 'Dr. López',  status: 'confirmed' },
  ],
  pickups: [
    { client: 'John B.',    order: '#OPT-1042', ready: 'Apr 9' },
    { client: 'Sandra L.',  order: '#OPT-1043', ready: 'Apr 9' },
    { client: 'Nicolás F.', order: '#OPT-1041', ready: 'Apr 8' },
    { client: 'Marta V.',   order: '#OPT-1040', ready: 'Apr 8' },
    { client: 'Robert H.',  order: '#OPT-1039', ready: 'Apr 7' },
  ],
  prescriptions: [
    { client: 'Emma R.',   date: 'Apr 8', od: '-2.25 / -0.75', oi: '-2.00 / -0.50', status: 'ordered' },
    { client: 'Tom K.',    date: 'Apr 7', od: '-1.50 / -0.25', oi: '-1.75 / —',     status: 'ready' },
    { client: 'Lisa M.',   date: 'Apr 6', od: '-3.00 / -1.00', oi: '-2.75 / -0.75', status: 'ready' },
    { client: 'Peter G.',  date: 'Apr 5', od: '+1.25 / —',     oi: '+1.00 / —',     status: 'picked-up' },
    { client: 'Julia W.',  date: 'Apr 4', od: '-0.75 / -0.50', oi: '-0.50 / -0.25', status: 'ordered' },
  ],
  inventory: [
    { cat: 'Frames',      units: 124, lowStock: false },
    { cat: 'Lenses',      units: 89,  lowStock: false },
    { cat: 'Contacts',    units: 210, lowStock: false },
    { cat: 'Accessories', units: 45,  lowStock: true },
  ],
  topBrands: [
    { brand: 'Ray-Ban',    sold: 12 },
    { brand: 'Persol',     sold: 8 },
    { brand: 'Oakley',     sold: 6 },
    { brand: 'Tom Ford',   sold: 5 },
    { brand: 'Gucci',      sold: 3 },
  ],
  revenueByCat: [
    { cat: 'Frames',      amount: 3240 },
    { cat: 'Lenses',      amount: 1820 },
    { cat: 'Contacts',    amount: 1160 },
    { cat: 'Accessories', amount: 620 },
  ],
};

function OpticalDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(OPT_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();
  const set = (f, v) => setData(prev => ({ ...prev, [f]: v }));

  const totalRev = data.revenueByCat.reduce((s, r) => s + r.amount, 0);
  const aov = Math.round(totalRev / data.framesSold);

  return (
    <div className="idash">
      <DashSidebar title="Optical Store" items={OPT_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Optical Dashboard" alerts={3} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Appointments Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.apptsToday} onChange={v => set('apptsToday', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Frames Sold')}</span>
              <span className="idash__stat-value">{data.framesSold}</span><span className="idash__stat-note">{d('this month')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Pickups')}</span>
              <span className="idash__stat-value">{data.pendingPickups}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => set('monthlyRev', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+11%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Appointments')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Optometrist')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.todayAppts.map((a, i) => (
                  <tr key={i}><td>{a.time}</td><td>{a.client}</td><td>{a.type}</td><td>{a.doc}</td>
                    <td><span className={`idash__badge ${OPT_APPT_CSS[a.status]}`}>{OPT_APPT_LABEL[a.status]}</span></td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Pending Pickups')}</h4>
              <div className="idash__staff-list">
                {data.pickups.map(p => (
                  <div key={p.order} className="idash__staff-card">
                    <span className="idash__staff-name">{p.client}</span>
                    <span className="idash__staff-shift">Ready {p.ready}</span>
                    <span className="idash__staff-role">{p.order}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'appointments' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Appointments')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Time')}</th><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Optometrist')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.todayAppts.map((a, i) => (
                <tr key={i}><td>{a.time}</td><td>{a.client}</td><td>{a.type}</td><td>{a.doc}</td>
                  <td><span className={`idash__badge ${OPT_APPT_CSS[a.status]}`}>{OPT_APPT_LABEL[a.status]}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'prescriptions' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Recent Prescriptions')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Date')}</th><th>{d('OD (sph/cyl)')}</th><th>{d('OI (sph/cyl)')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.prescriptions.map((p, i) => (
                <tr key={i}><td>{p.client}</td><td>{p.date}</td><td className="idash__mono">{p.od}</td><td className="idash__mono">{p.oi}</td>
                  <td><span className={`idash__badge ${OPT_RX_CSS[p.status]}`}>{OPT_RX_LABEL[p.status]}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'inventory' && <>
          <div className="idash__stats">
            {data.inventory.map(c => (
              <div key={c.cat} className="idash__stat">
                <span className="idash__stat-label">{c.cat}</span>
                <span className="idash__stat-value">{c.units}<span className="idash__stat-dim"> units</span></span>
                {c.lowStock && <span className="idash__stat-badge" style={{ background: 'rgba(255, 100, 100, 0.15)', color: 'rgba(255, 150, 150, 0.95)' }}>{d('Low Stock')}</span>}
              </div>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Top Brands by Sales')}</h4>
            <div className="idash__week-stats">
              {data.topBrands.map(b => (
                <div key={b.brand} className="idash__ws-row">
                  <span>{b.brand}</span>
                  <span className="idash__ws-val">{b.sold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Total Monthly')}</span><span className="idash__stat-value">€{fmt(totalRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('AOV')}</span><span className="idash__stat-value">€{aov}</span><span className="idash__stat-note">{d('avg order value')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Growth')}</span><span className="idash__stat-value">+11%</span><span className="idash__stat-badge idash__stat-badge--up">{d('vs last month')}</span></div>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Revenue by Category')}</h4>
            <div className="idash__week-stats">
              {data.revenueByCat.map(r => {
                const pct = Math.round((r.amount / totalRev) * 100);
                return (
                  <div key={r.cat} className="idash__ws-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                    <span>{r.cat} — €{fmt(r.amount)} ({pct}%)</span>
                    <div className="idash__bar"><div className="idash__bar-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>}

        <Callout industry="optical store" d={d} />
        <ResetBtn onReset={() => { setData(clone(OPT_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LAW FIRM DASHBOARD
   ═══════════════════════════════════════════════════ */
const LAW_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'cases', label: 'Cases' },
  { id: 'consultations', label: 'Consultations' }, { id: 'documents', label: 'Documents' }, { id: 'billing', label: 'Billing' },
];
const LAW_CASE_CSS = { active: 'idash__badge--ok', pending: 'idash__badge--wait', closed: 'idash__badge--cancel' };
const LAW_DOC_CSS = { pending: 'idash__badge--wait', signed: 'idash__badge--ok', review: 'idash__badge--hot' };
const LAW_DOC_LABEL = { pending: 'Pending', signed: 'Signed', review: 'In Review' };

const LAW_DEFAULTS = {
  activeCases: 28, consultsWeek: 12, pendingDocs: 5, monthlyBilling: 18400,
  cases: [
    { id: '#2024-089', client: 'García Corp',  type: 'Commercial',  lawyer: 'Ana Ruiz',  action: 'File motion',     deadline: 'Apr 15', status: 'active' },
    { id: '#2024-091', client: 'Smith Estate', type: 'Inheritance', lawyer: 'Carlos M.', action: 'Client meeting',  deadline: 'Apr 18', status: 'active' },
    { id: '#2024-094', client: 'López divorce', type: 'Family',     lawyer: 'Ana Ruiz',  action: 'Document review', deadline: 'Apr 22', status: 'active' },
    { id: '#2024-082', client: 'Delgado Ltd',   type: 'Commercial', lawyer: 'Carlos M.', action: 'Contract draft',  deadline: 'Apr 25', status: 'pending' },
    { id: '#2024-078', client: 'Ruiz vs Pérez', type: 'Labor',      lawyer: 'Ana Ruiz',  action: 'Court hearing',   deadline: 'Apr 28', status: 'active' },
    { id: '#2024-061', client: 'Fernández case', type: 'Criminal',  lawyer: 'Marcos L.', action: 'Evidence review', deadline: '—',      status: 'closed' },
  ],
  upcomingConsults: [
    { time: 'Mon 10:00', client: 'Patricia Vega', type: 'Initial consult' },
    { time: 'Tue 14:30', client: 'Hugo Salazar',  type: 'Follow-up' },
    { time: 'Wed 11:00', client: 'Roberto Lima',  type: 'Commercial' },
  ],
  weekSlots: [
    { day: 'Mon', slots: [{ t: '10:00', taken: true }, { t: '14:00', taken: false }, { t: '16:00', taken: true }] },
    { day: 'Tue', slots: [{ t: '09:00', taken: false }, { t: '14:30', taken: true }] },
    { day: 'Wed', slots: [{ t: '11:00', taken: true }, { t: '15:00', taken: false }] },
    { day: 'Thu', slots: [{ t: '10:00', taken: false }, { t: '13:00', taken: false }] },
    { day: 'Fri', slots: [{ t: '09:30', taken: true }, { t: '11:30', taken: false }] },
  ],
  documents: [
    { client: 'García Corp',   type: 'Service agreement',  deadline: 'Apr 14', status: 'pending' },
    { client: 'Smith Estate',  type: 'Will revision',      deadline: 'Apr 17', status: 'review' },
    { client: 'Delgado Ltd',   type: 'NDA',                deadline: 'Apr 20', status: 'pending' },
    { client: 'Ruiz vs Pérez', type: 'Court filing',       deadline: 'Apr 16', status: 'review' },
    { client: 'Patricia Vega', type: 'Engagement letter',  deadline: 'Apr 12', status: 'signed' },
  ],
  invoices: [
    { client: 'García Corp',  amount: 2400, overdueDays: 5 },
    { client: 'Delgado Ltd',  amount: 1800, overdueDays: 12 },
    { client: 'Smith Estate', amount: 3200, overdueDays: 0 },
    { client: 'López family', amount: 1600, overdueDays: 3 },
    { client: 'Ruiz vs Pérez', amount: 2800, overdueDays: 0 },
  ],
};

function LawDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(LAW_DEFAULTS));
  const [view, setView] = useState('overview');
  const [caseFilter, setCaseFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();
  const set = (f, v) => setData(prev => ({ ...prev, [f]: v }));

  function requestSignature(i) {
    act();
    setData(prev => { const n = clone(prev); n.documents[i].status = 'signed'; return n; });
    showToast(d('Request sent ✓'));
  }
  function sendConsultReminder(client) { act(); showToast(`Reminder sent to ${client}`); }

  const filteredCases = data.cases.filter(c => caseFilter === 'All' || c.type === caseFilter);
  const outstanding = data.invoices.reduce((s, i) => s + i.amount, 0);
  const overdueTotal = data.invoices.filter(i => i.overdueDays > 0).reduce((s, i) => s + i.amount, 0);

  return (
    <div className="idash">
      <DashSidebar title="Law Firm" items={LAW_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Law Firm Dashboard" alerts={3} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Active Cases')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.activeCases} onChange={v => set('activeCases', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Consultations')}</span>
              <span className="idash__stat-value">{data.consultsWeek}</span><span className="idash__stat-note">{d('this week')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Docs')}</span>
              <span className="idash__stat-value">{data.pendingDocs}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Billing')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyBilling} onChange={v => set('monthlyBilling', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+9%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Active Cases')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Case')}</th><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Lawyer')}</th><th>{d('Next Action')}</th><th>{d('Deadline')}</th></tr></thead><tbody>
                {data.cases.filter(c => c.status === 'active').slice(0, 4).map((c, i) => (
                  <tr key={i}><td className="idash__mono">{c.id}</td><td>{c.client}</td><td>{c.type}</td><td>{c.lawyer}</td><td>{c.action}</td><td>{c.deadline}</td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Upcoming Consultations')}</h4>
              <div className="idash__staff-list">
                {data.upcomingConsults.map((c, i) => (
                  <div key={i} className="idash__staff-card">
                    <span className="idash__staff-name">{c.client}</span>
                    <span className="idash__staff-shift">{c.time}</span>
                    <span className="idash__staff-role">{c.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'cases' && <>
          <div className="idash__filter-bar">
            {['All', 'Commercial', 'Family', 'Criminal', 'Labor', 'Inheritance'].map(t => (
              <button key={t} type="button" className={`idash__filter-btn ${caseFilter === t ? 'is-active' : ''}`} onClick={() => { setCaseFilter(t); act(); }}>{d(t)}</button>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Cases')} — {d(caseFilter)}</h4>
            <table className="idash__table"><thead><tr><th>{d('Case')}</th><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Lawyer')}</th><th>{d('Deadline')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {filteredCases.map((c, i) => (
                <tr key={i}><td className="idash__mono">{c.id}</td><td>{c.client}</td><td>{c.type}</td><td>{c.lawyer}</td><td>{c.deadline}</td>
                  <td><span className={`idash__badge ${LAW_CASE_CSS[c.status]}`}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'consultations' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('This Week — Available Slots')}</h4>
            <div className="idash__week-cal">
              {data.weekSlots.map(ws => (
                <div key={ws.day} className="idash__week-day">
                  <span className="idash__barber-name">{d(ws.day)}</span>
                  {ws.slots.map((s, i) => (
                    <div key={i} className={`idash__barber-slot ${s.taken ? 'is-filled' : 'is-empty'}`}>
                      <span className="idash__barber-time">{s.t}</span>
                      <span className={s.taken ? 'idash__barber-client' : 'idash__barber-avail'}>{s.taken ? d('Booked') : d('Available')}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Upcoming Consultations')}</h4>
            <div className="idash__reminder-list">
              {data.upcomingConsults.map((c, i) => (
                <div key={i} className="idash__reminder-row">
                  <span><strong>{c.client}</strong> — {c.type} ({c.time})</span>
                  <button className="idash__action-btn" onClick={() => sendConsultReminder(c.client)}>Send reminder</button>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'documents' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Pending Documents')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Deadline')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.documents.map((doc, i) => (
                <tr key={i}><td>{doc.client}</td><td>{doc.type}</td><td>{doc.deadline}</td>
                  <td><span className={`idash__badge ${LAW_DOC_CSS[doc.status]}`}>{d(LAW_DOC_LABEL[doc.status])}</span></td>
                  <td className="idash__actions">
                    {doc.status !== 'signed' && <button className="idash__action-btn" onClick={() => requestSignature(i)}>{d('Request')}</button>}
                  </td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'billing' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Outstanding')}</span><span className="idash__stat-value">€{fmt(outstanding)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Overdue')}</span><span className="idash__stat-value">€{fmt(overdueTotal)}</span><span className="idash__stat-badge" style={{ background: 'rgba(255,100,100,0.15)', color: 'rgba(255,150,150,0.95)' }}>{d('Overdue')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('This Month Billed')}</span><span className="idash__stat-value">€{fmt(data.monthlyBilling)}</span></div>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Pending Invoices')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Amount')}</th><th>{d('Days Overdue')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.invoices.map((inv, i) => (
                <tr key={i}><td>{inv.client}</td><td>€{fmt(inv.amount)}</td><td>{inv.overdueDays > 0 ? `${inv.overdueDays} days` : '—'}</td>
                  <td><span className={`idash__badge ${inv.overdueDays > 0 ? 'idash__badge--cancel' : 'idash__badge--wait'}`}>{inv.overdueDays > 0 ? 'Overdue' : 'Due'}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        <Callout industry="law firm" d={d} />
        <ResetBtn onReset={() => { setData(clone(LAW_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACCOUNTING STUDIO DASHBOARD
   ═══════════════════════════════════════════════════ */
const ACC_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'clients', label: 'Clients' },
  { id: 'deadlines', label: 'Deadlines' }, { id: 'documents', label: 'Documents' }, { id: 'revenue', label: 'Revenue' },
];
const ACC_DEADLINE_CSS = { 'on-track': 'idash__badge--ok', 'at-risk': 'idash__badge--hot', overdue: 'idash__badge--cancel' };
const ACC_DEADLINE_LABEL = { 'on-track': 'On Track', 'at-risk': 'At Risk', overdue: 'Overdue' };

const ACC_DEFAULTS = {
  activeClients: 34, deadlinesMonth: 8, pendingDocs: 12, monthlyRev: 9200,
  deadlines: [
    { client: 'García SL',  type: 'VAT Q1',        date: 'Apr 20', status: 'on-track' },
    { client: 'Smith Ltd',  type: 'Corporate Tax', date: 'Apr 28', status: 'at-risk' },
    { client: 'López & Co', type: 'Payroll',       date: 'Apr 15', status: 'overdue' },
    { client: 'Fernández SA', type: 'VAT Q1',      date: 'Apr 22', status: 'on-track' },
    { client: 'Moreno Group', type: 'Annual Filing', date: 'Apr 30', status: 'on-track' },
    { client: 'Vega Studios', type: 'Payroll',     date: 'Apr 16', status: 'at-risk' },
  ],
  activity: [
    { action: 'Filed VAT Q1',             client: 'Patel Ltd',    when: '2h ago' },
    { action: 'Requested documents',       client: 'Smith Ltd',    when: '4h ago' },
    { action: 'Completed payroll',         client: 'Martín Group', when: 'Yesterday' },
    { action: 'Sent deadline reminder',    client: 'García SL',    when: 'Yesterday' },
    { action: 'Closed Q4 2023 books',      client: 'López & Co',   when: '2d ago' },
  ],
  clients: [
    { company: 'García SL',    contact: 'M. García',    plan: 'Full Service', nextDeadline: 'Apr 20', pendingDocs: 2 },
    { company: 'Smith Ltd',    contact: 'J. Smith',     plan: 'Premium',      nextDeadline: 'Apr 28', pendingDocs: 5 },
    { company: 'López & Co',   contact: 'R. López',     plan: 'Basic',        nextDeadline: 'Apr 15', pendingDocs: 1 },
    { company: 'Fernández SA', contact: 'A. Fernández', plan: 'Premium',      nextDeadline: 'Apr 22', pendingDocs: 0 },
    { company: 'Moreno Group', contact: 'C. Moreno',    plan: 'Full Service', nextDeadline: 'Apr 30', pendingDocs: 3 },
    { company: 'Vega Studios', contact: 'P. Vega',      plan: 'Basic',        nextDeadline: 'Apr 16', pendingDocs: 1 },
    { company: 'Patel Ltd',    contact: 'N. Patel',     plan: 'Premium',      nextDeadline: 'May 5',  pendingDocs: 0 },
  ],
  pendingReqDocs: [
    { client: 'Smith Ltd',  doc: 'Q1 bank statements',  sent: false },
    { client: 'García SL',  doc: 'Expense receipts',    sent: false },
    { client: 'López & Co', doc: 'Payroll spreadsheet', sent: false },
    { client: 'Moreno Group', doc: 'Invoice register',  sent: false },
  ],
  receivedDocs: [
    { client: 'Patel Ltd',    doc: 'Q1 bank statements', when: '2d ago' },
    { client: 'Martín Group', doc: 'Payroll data',       when: '3d ago' },
    { client: 'Fernández SA', doc: 'Expense receipts',   when: '4d ago' },
  ],
  revenueByService: [
    { svc: 'Tax Filing',   amount: 3400 },
    { svc: 'Payroll',      amount: 2600 },
    { svc: 'Advisory',     amount: 1900 },
    { svc: 'Bookkeeping',  amount: 1300 },
  ],
  topClients: [
    { client: 'García SL',    amount: 1200 },
    { client: 'Smith Ltd',    amount: 980 },
    { client: 'Moreno Group', amount: 820 },
    { client: 'Patel Ltd',    amount: 640 },
    { client: 'Fernández SA', amount: 560 },
  ],
  outstanding: 3200,
};

function AccountingDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(ACC_DEFAULTS));
  const [view, setView] = useState('overview');
  const [planFilter, setPlanFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();
  const set = (f, v) => setData(prev => ({ ...prev, [f]: v }));

  function sendReminder(client) { act(); showToast(`Reminder sent to ${client}`); }
  function requestDocument(i) {
    act();
    setData(prev => { const n = clone(prev); n.pendingReqDocs[i].sent = true; return n; });
    showToast(d('Request sent via email ✓'));
  }

  const filteredClients = data.clients.filter(c => planFilter === 'All' || c.plan === planFilter);
  const totalRev = data.revenueByService.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="idash">
      <DashSidebar title="Accounting" items={ACC_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Accounting Studio" alerts={2} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Active Clients')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.activeClients} onChange={v => set('activeClients', v)} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Deadlines')}</span>
              <span className="idash__stat-value">{data.deadlinesMonth}</span><span className="idash__stat-note">{d('this month')}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Docs')}</span>
              <span className="idash__stat-value">{data.pendingDocs}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => set('monthlyRev', v)} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+7%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Upcoming Deadlines')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Due')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.deadlines.slice(0, 4).map((dl, i) => (
                  <tr key={i}><td>{dl.client}</td><td>{dl.type}</td><td>{dl.date}</td>
                    <td><span className={`idash__badge ${ACC_DEADLINE_CSS[dl.status]}`}>{d(ACC_DEADLINE_LABEL[dl.status])}</span></td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Recent Activity')}</h4>
              <div className="idash__staff-list">
                {data.activity.map((a, i) => (
                  <div key={i} className="idash__staff-card">
                    <span className="idash__staff-name">{a.action}</span>
                    <span className="idash__staff-shift">{a.when}</span>
                    <span className="idash__staff-role">{a.client}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'clients' && <>
          <div className="idash__filter-bar">
            {['All', 'Basic', 'Premium', 'Full Service'].map(p => (
              <button key={p} type="button" className={`idash__filter-btn ${planFilter === p ? 'is-active' : ''}`} onClick={() => { setPlanFilter(p); act(); }}>{d(p)}</button>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Clients')} — {d(planFilter)}</h4>
            <table className="idash__table"><thead><tr><th>{d('Company')}</th><th>{d('Contact')}</th><th>{d('Plan')}</th><th>{d('Next Deadline')}</th><th>{d('Pending Docs')}</th></tr></thead><tbody>
              {filteredClients.map((c, i) => (
                <tr key={i}><td>{c.company}</td><td>{c.contact}</td><td>{c.plan}</td><td>{c.nextDeadline}</td><td>{c.pendingDocs}</td></tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'deadlines' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('All Deadlines — sorted by urgency')}</h4>
            <div className="idash__reminder-list">
              {[...data.deadlines].sort((a, b) => {
                const order = { overdue: 0, 'at-risk': 1, 'on-track': 2 };
                return order[a.status] - order[b.status];
              }).map((dl, i) => (
                <div key={i} className="idash__reminder-row">
                  <span><strong>{dl.client}</strong> — {dl.type} · {d('Due')} {dl.date}</span>
                  <span className="idash__actions">
                    <span className={`idash__badge ${ACC_DEADLINE_CSS[dl.status]}`}>{d(ACC_DEADLINE_LABEL[dl.status])}</span>
                    <button className="idash__action-btn" onClick={() => sendReminder(dl.client)}>{d('Send')}</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'documents' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Documents to Request')}</h4>
            <div className="idash__reminder-list">
              {data.pendingReqDocs.map((doc, i) => (
                <div key={i} className="idash__reminder-row">
                  <span><strong>{doc.client}</strong> — {doc.doc}</span>
                  {doc.sent ? (
                    <span className="idash__badge idash__badge--ok">{d('Request sent via email ✓')}</span>
                  ) : (
                    <button className="idash__action-btn" onClick={() => requestDocument(i)}>{d('Request')}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Received This Week')}</h4>
            <div className="idash__staff-list">
              {data.receivedDocs.map((doc, i) => (
                <div key={i} className="idash__staff-card">
                  <span className="idash__staff-name">{doc.client}</span>
                  <span className="idash__staff-shift">{doc.when}</span>
                  <span className="idash__staff-role">{doc.doc}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Total Monthly')}</span><span className="idash__stat-value">€{fmt(totalRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Outstanding')}</span><span className="idash__stat-value">€{fmt(data.outstanding)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Growth')}</span><span className="idash__stat-value">+7%</span><span className="idash__stat-badge idash__stat-badge--up">{d('vs last month')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Revenue by Service')}</h4>
              <div className="idash__week-stats">
                {data.revenueByService.map(r => {
                  const pct = Math.round((r.amount / totalRev) * 100);
                  return (
                    <div key={r.svc} className="idash__ws-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                      <span>{r.svc} — €{fmt(r.amount)} ({pct}%)</span>
                      <div className="idash__bar"><div className="idash__bar-fill" style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Top 5 Clients by Billing')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Monthly')}</th></tr></thead><tbody>
                {data.topClients.map((c, i) => (
                  <tr key={i}><td>{c.client}</td><td>€{fmt(c.amount)}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </>}

        <Callout industry="accounting studio" d={d} />
        <ResetBtn onReset={() => { setData(clone(ACC_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HARDWARE STORE DASHBOARD
   ═══════════════════════════════════════════════════ */
const HW_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'quotes', label: 'Quotes' },
  { id: 'inventory', label: 'Inventory' }, { id: 'trade', label: 'Trade Accounts' }, { id: 'revenue', label: 'Revenue' },
];
const HW_DEFAULTS = {
  quotesToday: 12, tradeAccounts: 34, lowStock: 8, monthlyRev: 18200,
  quotes: [
    { id: '#Q-089', client: 'Constructora López', items: 14, total: 2340, date: 'Apr 10', status: 'sent' },
    { id: '#Q-090', client: 'García Obras',       items: 6,  total: 890,  date: 'Apr 11', status: 'pending' },
    { id: '#Q-091', client: 'Smith Reforms',       items: 22, total: 4100, date: 'Apr 9',  status: 'accepted' },
    { id: '#Q-092', client: 'Díaz Construcción',   items: 9,  total: 1560, date: 'Apr 11', status: 'pending' },
    { id: '#Q-093', client: 'Torres & Hijos',      items: 18, total: 3200, date: 'Apr 8',  status: 'sent' },
  ],
  categories: [
    { name: 'Tools', items: 124 }, { name: 'Materials', items: 89 },
    { name: 'Electrical', items: 67 }, { name: 'Plumbing', items: 45 },
  ],
  lowStockItems: [
    { name: 'PVC pipe 1"',     stock: 4,  reordered: false },
    { name: 'Wire 2.5mm (m)',  stock: 12, reordered: false },
    { name: 'Cement 50kg bag', stock: 3,  reordered: false },
    { name: 'Screws 6x40 box', stock: 6,  reordered: false },
  ],
  trades: [
    { company: 'Constructora López', contact: 'J. López',  limit: 5000, used: 2100, status: 'active' },
    { company: 'García Obras',       contact: 'M. García', limit: 3000, used: 890,  status: 'active' },
    { company: 'Smith Reforms',      contact: 'T. Smith',  limit: 8000, used: 4100, status: 'active' },
    { company: 'Díaz Construcción',  contact: 'R. Díaz',   limit: 4000, used: 3800, status: 'warning' },
    { company: 'Torres & Hijos',     contact: 'P. Torres', limit: 6000, used: 1200, status: 'active' },
  ],
  revCounter: 8400, revQuotes: 7200, revOnline: 2600,
  topClients: [
    { client: 'Smith Reforms', total: 4100 }, { client: 'Torres & Hijos', total: 3200 },
    { client: 'Constructora López', total: 2340 }, { client: 'Díaz Construcción', total: 1560 },
    { client: 'García Obras', total: 890 },
  ],
};
const HW_Q_CSS = { pending: 'idash__badge--amber', sent: 'idash__badge--blue', accepted: 'idash__badge--green' };
const HW_Q_LABEL = { pending: 'Pending', sent: 'Sent', accepted: 'Accepted' };

function HardwareDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(HW_DEFAULTS));
  const [view, setView] = useState('overview');
  const [qFilter, setQFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function sendQuote(i) { act(); setData(p => { const n = clone(p); n.quotes[i].status = 'sent'; return n; }); showToast(d('✓ Quote sent')); }
  function reorder(i) { act(); setData(p => { const n = clone(p); n.lowStockItems[i].reordered = true; return n; }); showToast(d('✓ Order placed')); }

  const filtQ = data.quotes.filter(q => qFilter === 'All' || q.status === qFilter);
  const totalRev = data.revCounter + data.revQuotes + data.revOnline;

  return (
    <div className="idash">
      <DashSidebar title="Hardware Dashboard" items={HW_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Hardware Store" alerts={data.lowStock} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Quotes Today')}</span><span className="idash__stat-value"><InlineEdit value={data.quotesToday} onChange={v => setData(p => ({...p, quotesToday: v}))} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Trade Accounts')}</span><span className="idash__stat-value">{data.tradeAccounts}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Low Stock')}</span><span className="idash__stat-value" style={{color:'#ef4444'}}>{data.lowStock}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span><span className="idash__stat-badge idash__stat-badge--up">{d('+9%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Recent Quotes')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Quote')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Total')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.quotes.slice(0,3).map((q,i) => <tr key={i}><td>{q.id}</td><td>{q.client}</td><td>{q.items}</td><td>€{fmt(q.total)}</td><td><span className={`idash__badge ${HW_Q_CSS[q.status]}`}>{HW_Q_LABEL[q.status]}</span></td></tr>)}
              </tbody></table></div>
            <div className="idash__panel"><h4 className="idash__panel-title" style={{color:'#ef4444'}}>⚠ Low Stock Alert</h4>
              <table className="idash__table"><thead><tr><th>{d('Product')}</th><th>{d('Stock')}</th><th></th></tr></thead><tbody>
                {data.lowStockItems.slice(0,3).map((it,i) => <tr key={i}><td>{it.name}</td><td style={{color:it.stock<=4?'#ef4444':'#f59e0b',fontWeight:600}}>{it.stock}</td>
                  <td className="idash__actions">{it.reordered ? <span style={{color:'#22c55e',fontSize:'0.75rem'}}>✓ Ordered</span> : <button className="idash__action-btn" onClick={() => reorder(i)}>Reorder</button>}</td></tr>)}
              </tbody></table></div>
          </div>
        </>}

        {view === 'quotes' && <>
          <div className="idash__filter-bar">
            {['All','pending','sent','accepted'].map(f => <button key={f} type="button" className={`idash__filter-btn ${qFilter===f?'is-active':''}`} onClick={() => {setQFilter(f);act();}}>{f==='All'?d('All'):d(HW_Q_LABEL[f])}</button>)}
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Quotes')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Quote')}</th><th>{d('Client')}</th><th>{d('Date')}</th><th>{d('Items')}</th><th>{d('Total')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {filtQ.map((q,i) => { const ri = data.quotes.indexOf(q); return <tr key={i}><td>{q.id}</td><td>{q.client}</td><td>{q.date}</td><td>{q.items}</td><td>€{fmt(q.total)}</td>
                <td><span className={`idash__badge ${HW_Q_CSS[q.status]}`}>{HW_Q_LABEL[q.status]}</span></td>
                <td className="idash__actions">{q.status==='pending' && <button className="idash__action-btn" onClick={() => sendQuote(ri)}>Send</button>}</td></tr>; })}
            </tbody></table></div>
        </>}

        {view === 'inventory' && <>
          <div className="idash__stats">{data.categories.map(c => <div key={c.name} className="idash__stat"><span className="idash__stat-label">{c.name}</span><span className="idash__stat-value">{c.items}</span><span className="idash__stat-sub">products</span></div>)}</div>
          <div className="idash__panel"><h4 className="idash__panel-title" style={{color:'#ef4444'}}>⚠ Low Stock</h4>
            <table className="idash__table"><thead><tr><th>{d('Product')}</th><th>{d('Stock')}</th><th></th></tr></thead><tbody>
              {data.lowStockItems.map((it,i) => <tr key={i}><td>{it.name}</td><td style={{color:it.stock<=4?'#ef4444':'#f59e0b',fontWeight:600}}>{it.stock}</td>
                <td className="idash__actions">{it.reordered ? <span style={{color:'#22c55e',fontSize:'0.75rem'}}>✓ Ordered</span> : <button className="idash__action-btn" onClick={() => reorder(i)}>Reorder</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'trade' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Trade Accounts')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Company')}</th><th>{d('Contact')}</th><th>{d('Limit')}</th><th>{d('Used')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.trades.map((t,i) => <tr key={i}><td>{t.company}</td><td>{t.contact}</td><td>€{fmt(t.limit)}</td><td>€{fmt(t.used)}</td>
                <td><span className={`idash__badge ${t.status==='active'?'idash__badge--green':'idash__badge--amber'}`}>{t.status==='active'?'Active':'Near limit'}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Counter')}</span><span className="idash__stat-value">€{fmt(data.revCounter)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Quotes')}</span><span className="idash__stat-value">€{fmt(data.revQuotes)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Online')}</span><span className="idash__stat-value">€{fmt(data.revOnline)}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Channel Breakdown')}</h4>
              <div className="idash__week-stats">{[{l:'Counter',v:data.revCounter},{l:'Quotes',v:data.revQuotes},{l:'Online',v:data.revOnline}].map(ch => <div key={ch.l} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{ch.l} — €{fmt(ch.v)} ({Math.round(ch.v/totalRev*100)}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${Math.round(ch.v/totalRev*100)}%`}} /></div></div>)}</div></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Top 5 Clients')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Total')}</th></tr></thead><tbody>
                {data.topClients.map((c,i) => <tr key={i}><td>{c.client}</td><td>€{fmt(c.total)}</td></tr>)}
              </tbody></table></div>
          </div>
        </>}

        <Callout industry="hardware store" d={d} />
        <ResetBtn onReset={() => { setData(clone(HW_DEFAULTS)); setView('overview'); setQFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BUILD SUPPLY / CORRALÓN DASHBOARD
   ═══════════════════════════════════════════════════ */
const BS_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'orders', label: 'Orders' },
  { id: 'delivery', label: 'Delivery' }, { id: 'materials', label: 'Materials' }, { id: 'revenue', label: 'Revenue' },
];
const BS_DEFAULTS = {
  ordersToday: 8, deliveries: 5, pendingQuotes: 3, monthlyRev: 42000,
  todayDeliveries: [
    { client: 'García Const.', addr: 'Av. Principal 234', material: 'Arena + cemento', truck: 'Camión 1', time: '09:00', status: 'transit' },
    { client: 'López Obras',   addr: 'Calle Sur 89',     material: 'Ladrillos',       truck: 'Camión 2', time: '11:30', status: 'loading' },
    { client: 'Smith Build',   addr: 'Norte 456',        material: 'Hierro 6mm',      truck: 'Camión 1', time: '15:00', status: 'scheduled' },
  ],
  orders: [
    { id: '#BS-401', client: 'García Const.', materials: 'Arena 2tn + Cemento x40', total: 4800, date: 'Apr 12', status: 'transit' },
    { id: '#BS-402', client: 'López Obras',   materials: 'Ladrillos x5000',          total: 3200, date: 'Apr 12', status: 'confirmed' },
    { id: '#BS-403', client: 'Smith Build',   materials: 'Hierro 6mm x200',          total: 6100, date: 'Apr 12', status: 'pending' },
    { id: '#BS-404', client: 'Torres Ref.',   materials: 'Madera pino x80',          total: 2400, date: 'Apr 13', status: 'confirmed' },
    { id: '#BS-405', client: 'Díaz & Hijos',  materials: 'Cerámica 45x45 x120m²',   total: 5600, date: 'Apr 14', status: 'pending' },
  ],
  trucks: [
    { name: 'Camión 1', status: 'en-route', driver: 'Roberto M.', delivery: 'García Const.' },
    { name: 'Camión 2', status: 'loading',  driver: 'Carlos P.',  delivery: 'López Obras' },
  ],
  matCategories: [
    { name: 'Aggregates', stock: '45 tn', price: '€80/tn' },
    { name: 'Masonry',    stock: '12,000 units', price: '€0.65/u' },
    { name: 'Steel',      stock: '800 bars', price: '€12/bar' },
    { name: 'Wood',       stock: '200 boards', price: '€18/board' },
    { name: 'Finishing',   stock: '340 m²', price: '€22/m²' },
  ],
  topMaterials: [
    { name: 'Cement 50kg', sold: 420, revenue: 8400 }, { name: 'Arena (tn)', sold: 38, revenue: 3040 },
    { name: 'Ladrillos', sold: 12000, revenue: 7800 }, { name: 'Hierro 6mm', sold: 340, revenue: 4080 },
    { name: 'Madera pino', sold: 160, revenue: 2880 },
  ],
  lastMonthRev: 37800,
};
const BS_STATUS_CSS = { pending: 'idash__badge--amber', confirmed: 'idash__badge--blue', transit: 'idash__badge--green', delivered: 'idash__badge--green' };
const BS_STATUS_LABEL = { pending: 'Pending', confirmed: 'Confirmed', transit: 'In Transit', delivered: 'Delivered', loading: 'Loading', scheduled: 'Scheduled', 'en-route': 'En Route' };

function BuildSupplyDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(BS_DEFAULTS));
  const [view, setView] = useState('overview');
  const [oFilter, setOFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function confirmOrder(i) { act(); setData(p => { const n = clone(p); n.orders[i].status = 'confirmed'; return n; }); showToast(d('✓ Order confirmed')); }

  const filtO = data.orders.filter(o => oFilter === 'All' || o.status === oFilter);
  const revChange = data.monthlyRev - data.lastMonthRev;

  return (
    <div className="idash">
      <DashSidebar title="Corralón Dashboard" items={BS_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Building Supply" alerts={data.pendingQuotes} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Orders Today')}</span><span className="idash__stat-value"><InlineEdit value={data.ordersToday} onChange={v => setData(p => ({...p, ordersToday: v}))} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Deliveries')}</span><span className="idash__stat-value">{data.deliveries}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Quotes')}</span><span className="idash__stat-value">{data.pendingQuotes}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span><span className="idash__stat-badge idash__stat-badge--up">{d('+11%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Today\'s Deliveries')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Address')}</th><th>{d('Material')}</th><th>{d('Truck')}</th><th>{d('Time')}</th></tr></thead><tbody>
                {data.todayDeliveries.map((dl,i) => <tr key={i}><td>{dl.client}</td><td>{dl.addr}</td><td>{dl.material}</td><td>{dl.truck}</td><td>{dl.time}</td></tr>)}
              </tbody></table></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Pending Quotes')}</h4>
              <div className="idash__staff-list">{data.orders.filter(o => o.status === 'pending').map((o,i) => <div key={i} className="idash__staff-card"><span className="idash__staff-name">{o.client}</span><span className="idash__staff-shift">€{fmt(o.total)}</span><span className="idash__staff-role">{o.materials}</span></div>)}</div></div>
          </div>
        </>}

        {view === 'orders' && <>
          <div className="idash__filter-bar">
            {['All','pending','confirmed','transit'].map(f => <button key={f} type="button" className={`idash__filter-btn ${oFilter===f?'is-active':''}`} onClick={() => {setOFilter(f);act();}}>{f==='All'?d('All'):d(BS_STATUS_LABEL[f])}</button>)}
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Orders')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Materials')}</th><th>{d('Total')}</th><th>{d('Date')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {filtO.map((o,i) => { const ri = data.orders.indexOf(o); return <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.materials}</td><td>€{fmt(o.total)}</td><td>{o.date}</td>
                <td><span className={`idash__badge ${BS_STATUS_CSS[o.status]}`}>{BS_STATUS_LABEL[o.status]}</span></td>
                <td className="idash__actions">{o.status==='pending' && <button className="idash__action-btn" onClick={() => confirmOrder(ri)}>Confirm</button>}</td></tr>; })}
            </tbody></table></div>
        </>}

        {view === 'delivery' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Fleet Status')}</h4>
            <div className="idash__staff-list">{data.trucks.map(t => <div key={t.name} className="idash__staff-card">
              <span className="idash__staff-name">{t.name} — {t.driver}</span>
              <span className="idash__staff-shift"><span className={`idash__badge ${t.status==='en-route'?'idash__badge--green':'idash__badge--amber'}`}>{BS_STATUS_LABEL[t.status]}</span></span>
              <span className="idash__staff-role">→ {t.delivery}</span>
            </div>)}</div></div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Scheduled Deliveries')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Address')}</th><th>{d('Material')}</th><th>{d('Truck')}</th><th>{d('ETA')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.todayDeliveries.map((dl,i) => <tr key={i}><td>{dl.client}</td><td>{dl.addr}</td><td>{dl.material}</td><td>{dl.truck}</td><td>{dl.time}</td>
                <td><span className={`idash__badge ${dl.status==='transit'?'idash__badge--green':dl.status==='loading'?'idash__badge--amber':'idash__badge--grey'}`}>{d(BS_STATUS_LABEL[dl.status])}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'materials' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Material Categories')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Category')}</th><th>{d('Stock')}</th><th>{d('Unit Price')}</th></tr></thead><tbody>
              {data.matCategories.map((m,i) => <tr key={i}><td>{m.name}</td><td>{m.stock}</td><td>{m.price}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('This Month')}</span><span className="idash__stat-value">€{fmt(data.monthlyRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Last Month')}</span><span className="idash__stat-value">€{fmt(data.lastMonthRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Change')}</span><span className="idash__stat-value" style={{color:'#22c55e'}}>+€{fmt(revChange)}</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Top Materials by Revenue')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Material')}</th><th>{d('Sold')}</th><th>{d('Revenue')}</th></tr></thead><tbody>
              {data.topMaterials.map((m,i) => <tr key={i}><td>{m.name}</td><td>{fmt(m.sold)}</td><td>€{fmt(m.revenue)}</td></tr>)}
            </tbody></table></div>
        </>}

        <Callout industry="building supply" d={d} />
        <ResetBtn onReset={() => { setData(clone(BS_DEFAULTS)); setView('overview'); setOFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHOTOGRAPHY STUDIO DASHBOARD
   ═══════════════════════════════════════════════════ */
const PHOTO_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'bookings', label: 'Bookings' },
  { id: 'galleries', label: 'Gallery Delivery' }, { id: 'clients', label: 'Clients' }, { id: 'revenue', label: 'Revenue' },
];
const PHOTO_DEFAULTS = {
  sessionsMonth: 24, galleriesDelivered: 18, pendingEdits: 6, monthlyRev: 8400,
  upcoming: [
    { client: 'Emma R.',  type: 'Wedding',  date: 'Apr 20', time: '11:00', location: 'Venue TBD', status: 'confirmed', pkg: 'Premium' },
    { client: 'Tom K.',   type: 'Portrait',  date: 'Apr 22', time: '14:00', location: 'Studio',    status: 'confirmed', pkg: 'Standard' },
    { client: 'Lisa M.',  type: 'Newborn',   date: 'Apr 25', time: '10:00', location: 'Studio',    status: 'pending',   pkg: 'Basic' },
    { client: 'Sara P.',  type: 'Commercial',date: 'Apr 28', time: '09:00', location: 'On-site',   status: 'confirmed', pkg: 'Premium' },
    { client: 'David L.', type: 'Events',    date: 'May 2',  time: '18:00', location: 'Venue',     status: 'pending',   pkg: 'Standard' },
  ],
  galleries: [
    { client: 'Anna B.',   session: 'Wedding',   photos: 480, date: 'Apr 8',  sent: false },
    { client: 'Mark T.',   session: 'Portrait',  photos: 45,  date: 'Apr 10', sent: false },
    { client: 'Julia R.',  session: 'Newborn',   photos: 32,  date: 'Apr 11', sent: true },
    { client: 'Carlos M.', session: 'Commercial',photos: 120, date: 'Apr 6',  sent: true },
  ],
  clients: [
    { name: 'Emma R.',   type: 'Wedding',    lastSession: 'Mar 15', next: 'Apr 20', pkg: 'Premium',  spent: 2400 },
    { name: 'Tom K.',    type: 'Portrait',   lastSession: 'Jan 10', next: 'Apr 22', pkg: 'Standard', spent: 600 },
    { name: 'Lisa M.',   type: 'Newborn',    lastSession: '—',      next: 'Apr 25', pkg: 'Basic',    spent: 0 },
    { name: 'Sara P.',   type: 'Commercial', lastSession: 'Feb 20', next: 'Apr 28', pkg: 'Premium',  spent: 3600 },
    { name: 'Anna B.',   type: 'Wedding',    lastSession: 'Apr 5',  next: '—',      pkg: 'Premium',  spent: 1200 },
    { name: 'Mark T.',   type: 'Portrait',   lastSession: 'Apr 8',  next: '—',      pkg: 'Standard', spent: 600 },
  ],
  packages: [
    { name: 'Basic', price: 350, sessions: 8 }, { name: 'Standard', price: 600, sessions: 10 },
    { name: 'Premium', price: 1200, sessions: 6 },
  ],
  outstanding: 1800,
};
const PHOTO_CSS = { confirmed: 'idash__badge--green', pending: 'idash__badge--amber' };

function PhotographyDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(PHOTO_DEFAULTS));
  const [view, setView] = useState('overview');
  const [typeFilter, setTypeFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function sendGallery(i) { act(); setData(p => { const n = clone(p); n.galleries[i].sent = true; return n; }); showToast(d('✓ Gallery link sent to client')); }
  function sendContract(i) { act(); setData(p => { const n = clone(p); n.upcoming[i].status = 'confirmed'; return n; }); showToast(d('✓ Contract sent')); }

  const filtClients = data.clients.filter(c => typeFilter === 'All' || c.type === typeFilter);

  return (
    <div className="idash">
      <DashSidebar title="Photo Dashboard" items={PHOTO_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Photography Studio" alerts={data.pendingEdits} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Sessions This Month')}</span><span className="idash__stat-value">{data.sessionsMonth}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Galleries Delivered')}</span><span className="idash__stat-value">{data.galleriesDelivered}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Edits')}</span><span className="idash__stat-value" style={{color:'#f59e0b'}}>{data.pendingEdits}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span><span className="idash__stat-badge idash__stat-badge--up">{d('+16%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Upcoming Sessions')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Date')}</th><th>{d('Time')}</th><th>{d('Location')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.upcoming.slice(0,3).map((s,i) => <tr key={i}><td>{s.client}</td><td>{s.type}</td><td>{s.date}</td><td>{s.time}</td><td>{s.location}</td>
                  <td><span className={`idash__badge ${PHOTO_CSS[s.status]}`}>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td></tr>)}
              </tbody></table></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Pending Galleries')}</h4>
              <div className="idash__staff-list">{data.galleries.filter(g => !g.sent).map((g,i) => <div key={i} className="idash__staff-card"><span className="idash__staff-name">{g.client}</span><span className="idash__staff-shift">{g.photos} photos</span><span className="idash__staff-role">{g.session} — {g.date}</span></div>)}</div></div>
          </div>
        </>}

        {view === 'bookings' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Upcoming Sessions')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Type')}</th><th>{d('Date')}</th><th>{d('Time')}</th><th>{d('Package')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.upcoming.map((s,i) => <tr key={i}><td>{s.client}</td><td>{s.type}</td><td>{s.date}</td><td>{s.time}</td><td>{s.pkg}</td>
                <td><span className={`idash__badge ${PHOTO_CSS[s.status]}`}>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td>
                <td className="idash__actions">{s.status==='pending' && <button className="idash__action-btn" onClick={() => sendContract(i)}>Send contract</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'galleries' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Gallery Delivery')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Session')}</th><th>{d('Photos')}</th><th>{d('Ready')}</th><th></th></tr></thead><tbody>
              {data.galleries.map((g,i) => <tr key={i}><td>{g.client}</td><td>{g.session}</td><td>{g.photos}</td><td>{g.date}</td>
                <td className="idash__actions">{g.sent ? <span style={{color:'#22c55e',fontSize:'0.75rem'}}>✓ Sent</span> : <button className="idash__action-btn" onClick={() => sendGallery(i)}>Send link</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'clients' && <>
          <div className="idash__filter-bar">
            {['All','Wedding','Portrait','Commercial','Events','Newborn'].map(f => <button key={f} type="button" className={`idash__filter-btn ${typeFilter===f?'is-active':''}`} onClick={() => {setTypeFilter(f);act();}}>{d(f)}</button>)}
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Clients')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Type')}</th><th>{d('Last')}</th><th>{d('Next')}</th><th>{d('Package')}</th><th>{d('Spent')}</th></tr></thead><tbody>
              {filtClients.map((c,i) => <tr key={i}><td>{c.name}</td><td>{c.type}</td><td>{c.lastSession}</td><td>{c.next}</td><td>{c.pkg}</td><td>€{fmt(c.spent)}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            {data.packages.map(p => <div key={p.name} className="idash__stat"><span className="idash__stat-label">{p.name} (€{p.price})</span><span className="idash__stat-value">{p.sessions} sessions</span><span className="idash__stat-sub">€{fmt(p.price * p.sessions)}</span></div>)}
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Revenue by Package')}</h4>
              <div className="idash__week-stats">{data.packages.map(p => { const rev = p.price*p.sessions; const pct = Math.round(rev/data.monthlyRev*100); return <div key={p.name} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{p.name} — €{fmt(rev)} ({pct}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${pct}%`}} /></div></div>; })}</div></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Outstanding')}</h4>
              <div className="idash__stat" style={{padding:'16px 0'}}><span className="idash__stat-label">{d('Pending Payments')}</span><span className="idash__stat-value" style={{color:'#f59e0b'}}>€{fmt(data.outstanding)}</span></div></div>
          </div>
        </>}

        <Callout industry="photography studio" d={d} />
        <ResetBtn onReset={() => { setData(clone(PHOTO_DEFAULTS)); setView('overview'); setTypeFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CAR DEALERSHIP DASHBOARD
   ═══════════════════════════════════════════════════ */
const CAR_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'inventory', label: 'Inventory' },
  { id: 'testdrives', label: 'Test Drives' }, { id: 'leads', label: 'Leads' }, { id: 'revenue', label: 'Revenue' },
];
const CAR_DEFAULTS = {
  carsAvailable: 48, testDrivesWeek: 12, hotLeads: 7, monthlyRev: 124000,
  testDrives: [
    { client: 'García, M.', model: 'BMW 320i',      time: '10:00', seller: 'Carlos R.', status: 'confirmed' },
    { client: 'Smith, J.',  model: 'Audi A4',        time: '12:30', seller: 'Ana M.',    status: 'confirmed' },
    { client: 'López, A.',  model: 'Mercedes C200',  time: '15:00', seller: 'Carlos R.', status: 'pending' },
    { client: 'Torres, P.', model: 'VW Golf',        time: '16:30', seller: 'Ana M.',    status: 'confirmed' },
  ],
  cars: [
    { brand: 'BMW',      model: '320i',   year: 2023, km: '18K', price: 32000, status: 'available' },
    { brand: 'Audi',     model: 'A4',     year: 2022, km: '25K', price: 28000, status: 'available' },
    { brand: 'Mercedes', model: 'C200',   year: 2023, km: '12K', price: 38000, status: 'reserved' },
    { brand: 'VW',       model: 'Golf',   year: 2024, km: '5K',  price: 24000, status: 'available' },
    { brand: 'Toyota',   model: 'Corolla',year: 2023, km: '20K', price: 22000, status: 'sold' },
    { brand: 'Ford',     model: 'Focus',  year: 2022, km: '30K', price: 18000, status: 'available' },
    { brand: 'Peugeot',  model: '308',    year: 2023, km: '15K', price: 21000, status: 'available' },
  ],
  leads: [
    { name: 'García, M.',  model: 'BMW 320i',    budget: '€30-35K', lastContact: 'Apr 10', stage: 'test-drive' },
    { name: 'Pérez, R.',   model: 'Mercedes C',  budget: '€35-40K', lastContact: 'Apr 9',  stage: 'negotiating' },
    { name: 'Torres, P.',  model: 'VW Golf',     budget: '€22-26K', lastContact: 'Apr 11', stage: 'new' },
    { name: 'Díaz, C.',    model: 'Audi A4',     budget: '€25-30K', lastContact: 'Apr 8',  stage: 'contacted' },
    { name: 'Moreno, L.',  model: 'Ford Focus',  budget: '€16-20K', lastContact: 'Apr 7',  stage: 'test-drive' },
  ],
  sellers: [
    { name: 'Carlos R.', sales: 8, revenue: 68000 },
    { name: 'Ana M.',    sales: 6, revenue: 56000 },
  ],
  target: 150000, unitsSold: 5, avgTicket: 24800,
};
const CAR_CSS = { available: 'idash__badge--green', reserved: 'idash__badge--amber', sold: 'idash__badge--grey' };
const CAR_LEAD_CSS = { new: 'idash__badge--grey', contacted: 'idash__badge--blue', 'test-drive': 'idash__badge--amber', negotiating: 'idash__badge--green', closed: 'idash__badge--green' };

function CarDealerDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(CAR_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function reserveCar(i) { act(); setData(p => { const n = clone(p); n.cars[i].status = 'reserved'; return n; }); showToast(d('✓ Car marked as reserved')); }
  function logContact(i) { act(); setData(p => { const n = clone(p); n.leads[i].lastContact = 'Today'; return n; }); showToast(d('✓ Contact logged')); }
  function scheduleTD(i) { act(); setData(p => { const n = clone(p); n.testDrives[i].status = 'confirmed'; return n; }); showToast(d('✓ Test drive confirmed')); }

  const targetPct = Math.min(100, Math.round(data.monthlyRev / data.target * 100));

  return (
    <div className="idash">
      <DashSidebar title="Dealer Dashboard" items={CAR_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Car Dealership" alerts={data.hotLeads} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Cars Available')}</span><span className="idash__stat-value">{data.carsAvailable}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Test Drives (week)')}</span><span className="idash__stat-value">{data.testDrivesWeek}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Hot Leads')}</span><span className="idash__stat-value" style={{color:'#f59e0b'}}>{data.hotLeads}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span><span className="idash__stat-badge idash__stat-badge--up">{d('+8%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Today\'s Test Drives')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Model')}</th><th>{d('Time')}</th><th>{d('Seller')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.testDrives.map((td,i) => <tr key={i}><td>{td.client}</td><td>{td.model}</td><td>{td.time}</td><td>{td.seller}</td>
                  <td><span className={`idash__badge ${td.status==='confirmed'?'idash__badge--green':'idash__badge--amber'}`}>{td.status.charAt(0).toUpperCase()+td.status.slice(1)}</span></td></tr>)}
              </tbody></table></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Hot Leads')}</h4>
              <div className="idash__staff-list">{data.leads.filter(l => l.stage==='negotiating'||l.stage==='test-drive').map((l,i) => <div key={i} className="idash__staff-card"><span className="idash__staff-name">{l.name}</span><span className="idash__staff-shift">{l.model}</span><span className="idash__staff-role">{l.budget}</span></div>)}</div></div>
          </div>
        </>}

        {view === 'inventory' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Vehicle Inventory')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Brand')}</th><th>{d('Model')}</th><th>{d('Year')}</th><th>{d('KM')}</th><th>{d('Price')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.cars.map((c,i) => <tr key={i}><td>{c.brand}</td><td>{c.model}</td><td>{c.year}</td><td>{c.km}</td><td>€{fmt(c.price)}</td>
                <td><span className={`idash__badge ${CAR_CSS[c.status]}`}>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td>
                <td className="idash__actions">{c.status==='available' && <button className="idash__action-btn" onClick={() => reserveCar(i)}>Reserve</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'testdrives' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('This Week\'s Test Drives')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Model')}</th><th>{d('Time')}</th><th>{d('Seller')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.testDrives.map((td,i) => <tr key={i}><td>{td.client}</td><td>{td.model}</td><td>{td.time}</td><td>{td.seller}</td>
                <td><span className={`idash__badge ${td.status==='confirmed'?'idash__badge--green':'idash__badge--amber'}`}>{td.status.charAt(0).toUpperCase()+td.status.slice(1)}</span></td>
                <td className="idash__actions">{td.status==='pending' && <button className="idash__action-btn" onClick={() => scheduleTD(i)}>Confirm</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'leads' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Lead Pipeline')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Model')}</th><th>{d('Budget')}</th><th>{d('Last Contact')}</th><th>{d('Stage')}</th><th></th></tr></thead><tbody>
              {data.leads.map((l,i) => <tr key={i}><td>{l.name}</td><td>{l.model}</td><td>{l.budget}</td><td>{l.lastContact}</td>
                <td><span className={`idash__badge ${CAR_LEAD_CSS[l.stage]}`}>{l.stage.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</span></td>
                <td className="idash__actions"><button className="idash__action-btn" onClick={() => logContact(i)}>Log contact</button></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Units Sold')}</span><span className="idash__stat-value">{data.unitsSold}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Avg. Ticket')}</span><span className="idash__stat-value">€{fmt(data.avgTicket)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Target Progress')}</span><span className="idash__stat-value">{targetPct}%</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${targetPct}%`}} /></div></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Sales by Seller')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Seller')}</th><th>{d('Sales')}</th><th>{d('Revenue')}</th></tr></thead><tbody>
              {data.sellers.map((s,i) => <tr key={i}><td>{s.name}</td><td>{s.sales}</td><td>€{fmt(s.revenue)}</td></tr>)}
            </tbody></table></div>
        </>}

        <Callout industry="car dealership" d={d} />
        <ResetBtn onReset={() => { setData(clone(CAR_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CAFÉ & COFFEE SHOP DASHBOARD
   ═══════════════════════════════════════════════════ */
const CAFE_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'orders', label: 'Orders' },
  { id: 'menu', label: 'Menu' }, { id: 'events', label: 'Events' }, { id: 'revenue', label: 'Revenue' },
];
const CAFE_DEFAULTS = {
  ordersToday: 89, occupancy: 73, loyaltyMembers: 342, monthlyRev: 12400,
  liveOrders: [
    { source: 'Mesa 4',      items: 'Flat white ×2, Croissant',    time: '3 min', status: 'ready' },
    { source: 'Mesa 7',      items: 'Matcha latte, Sandwich',      time: '8 min', status: 'preparing' },
    { source: 'Takeaway #23',items: 'Cold brew, Cookie',           time: '1 min', status: 'done' },
    { source: 'Mesa 2',      items: 'Espresso, Banana bread',      time: '5 min', status: 'preparing' },
    { source: 'Delivery #8', items: 'Latte ×3, Muffin ×2',        time: '12 min',status: 'preparing' },
  ],
  tables: [
    { id: 1, status: 'occupied' }, { id: 2, status: 'occupied' }, { id: 3, status: 'available' },
    { id: 4, status: 'occupied' }, { id: 5, status: 'available' }, { id: 6, status: 'reserved' },
    { id: 7, status: 'occupied' }, { id: 8, status: 'available' }, { id: 9, status: 'occupied' },
    { id: 10, status: 'occupied' },
  ],
  menuItems: [
    { name: 'Flat White',   cat: 'Coffee',   price: 3.80, available: true },
    { name: 'Cold Brew',    cat: 'Coffee',   price: 4.20, available: true },
    { name: 'Matcha Latte', cat: 'Tea',      price: 4.50, available: true },
    { name: 'Croissant',    cat: 'Pastries', price: 2.80, available: true },
    { name: 'Banana Bread', cat: 'Pastries', price: 3.20, available: false },
    { name: 'Club Sandwich',cat: 'Food',     price: 8.50, available: true },
    { name: 'Caesar Salad', cat: 'Food',     price: 9.00, available: true },
  ],
  events: [
    { name: 'Coffee Tasting',    date: 'Apr 18', capacity: 20, enrolled: 14 },
    { name: 'Live Jazz Night',   date: 'Apr 20', capacity: 40, enrolled: 32 },
    { name: 'Barista Workshop',  date: 'Apr 25', capacity: 12, enrolled: 12 },
  ],
  aov: 8.40,
  topItems: [
    { name: 'Flat White', sold: 42 }, { name: 'Cold Brew', sold: 28 },
    { name: 'Croissant', sold: 24 }, { name: 'Club Sandwich', sold: 18 },
    { name: 'Matcha Latte', sold: 15 },
  ],
  revByTime: [ { period: 'Morning (7-12)', pct: 52 }, { period: 'Afternoon (12-17)', pct: 33 }, { period: 'Evening (17-21)', pct: 15 } ],
};
const CAFE_O_CSS = { ready: 'idash__badge--green', preparing: 'idash__badge--amber', done: 'idash__badge--blue' };
const CAFE_T_CSS = { available: '#22c55e', occupied: '#ef4444', reserved: '#f59e0b' };

function CafeDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(CAFE_DEFAULTS));
  const [view, setView] = useState('overview');
  const [ordFilter, setOrdFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function markReady(i) { act(); setData(p => { const n = clone(p); n.liveOrders[i].status = 'ready'; return n; }); showToast(d('✓ Order ready')); }
  function toggleAvail(i) { act(); setData(p => { const n = clone(p); n.menuItems[i].available = !n.menuItems[i].available; return n; }); }

  const filtOrders = data.liveOrders.filter(o => ordFilter === 'All' || (ordFilter === 'dine' && o.source.startsWith('Mesa')) || (ordFilter === 'take' && o.source.startsWith('Take')) || (ordFilter === 'delivery' && o.source.startsWith('Delivery')));

  return (
    <div className="idash">
      <DashSidebar title="Café Dashboard" items={CAFE_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Café & Coffee" alerts={2} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Orders Today')}</span><span className="idash__stat-value"><InlineEdit value={data.ordersToday} onChange={v => setData(p => ({...p, ordersToday: v}))} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Occupancy')}</span><span className="idash__stat-value">{data.occupancy}%</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Loyalty Members')}</span><span className="idash__stat-value">{data.loyaltyMembers}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span><span className="idash__stat-badge idash__stat-badge--up">{d('+7%')}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Live Orders')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Source')}</th><th>{d('Items')}</th><th>{d('Wait')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.liveOrders.slice(0,4).map((o,i) => <tr key={i}><td>{o.source}</td><td>{o.items}</td><td>{o.time}</td>
                  <td><span className={`idash__badge ${CAFE_O_CSS[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td></tr>)}
              </tbody></table></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Table Status')}</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>{data.tables.map(t =>
                <div key={t.id} style={{background:CAFE_T_CSS[t.status],borderRadius:6,padding:'10px 0',textAlign:'center',color:'#fff',fontSize:'0.75rem',fontWeight:600}}>T{t.id}</div>
              )}</div>
              <div style={{display:'flex',gap:16,marginTop:10,fontSize:'0.7rem',color:'rgba(255,255,255,0.4)'}}>
                <span><span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#22c55e',marginRight:4}} />{d('Available')}</span>
                <span><span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#ef4444',marginRight:4}} />{d('Occupied')}</span>
                <span><span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#f59e0b',marginRight:4}} />{d('Booked')}</span>
              </div></div>
          </div>
        </>}

        {view === 'orders' && <>
          <div className="idash__filter-bar">
            {[['All','All'],['dine','Dine-in'],['take','Takeaway'],['delivery','Delivery']].map(([k,l]) => <button key={k} type="button" className={`idash__filter-btn ${ordFilter===k?'is-active':''}`} onClick={() => {setOrdFilter(k);act();}}>{d(l)}</button>)}
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Active Orders')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Source')}</th><th>{d('Items')}</th><th>{d('Wait')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {filtOrders.map((o,i) => { const ri = data.liveOrders.indexOf(o); return <tr key={i}><td>{o.source}</td><td>{o.items}</td><td>{o.time}</td>
                <td><span className={`idash__badge ${CAFE_O_CSS[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td>
                <td className="idash__actions">{o.status==='preparing' && <button className="idash__action-btn" onClick={() => markReady(ri)}>Mark ready</button>}</td></tr>; })}
            </tbody></table></div>
        </>}

        {view === 'menu' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Menu Items')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Item')}</th><th>{d('Category')}</th><th>{d('Price')}</th><th>{d('Available')}</th></tr></thead><tbody>
              {data.menuItems.map((m,i) => <tr key={i}><td>{m.name}</td><td>{m.cat}</td><td>€{m.price.toFixed(2)}</td>
                <td><div className="idash__toggle-wrap" onClick={() => toggleAvail(i)} style={{cursor:'pointer'}}><div className={`idash__toggle ${m.available?'is-on':''}`}><div className="idash__toggle-knob" /></div></div></td></tr>)}
            </tbody></table></div>
          <div className="idash__panel" style={{marginTop:12}}><h4 className="idash__panel-title">{d('86\'d Today')}</h4>
            <div className="idash__staff-list">{data.menuItems.filter(m => !m.available).map((m,i) => <div key={i} className="idash__staff-card"><span className="idash__staff-name" style={{color:'#ef4444'}}>{m.name}</span><span className="idash__staff-role">Unavailable</span></div>)}
              {data.menuItems.every(m => m.available) && <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.8rem'}}>All items available</p>}</div></div>
        </>}

        {view === 'events' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Upcoming Events')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Event')}</th><th>{d('Date')}</th><th>{d('Capacity')}</th><th>{d('Enrolled')}</th><th></th></tr></thead><tbody>
              {data.events.map((e,i) => <tr key={i}><td>{e.name}</td><td>{e.date}</td><td>{e.capacity}</td><td>{e.enrolled}/{e.capacity}</td>
                <td className="idash__actions"><button className="idash__action-btn" onClick={() => {act(); showToast(d('Event management available in your live system'));}}>Manage</button></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value">€{fmt(data.monthlyRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('AOV')}</span><span className="idash__stat-value">€{data.aov.toFixed(2)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Orders Today')}</span><span className="idash__stat-value">{data.ordersToday}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Revenue by Time of Day')}</h4>
              <div className="idash__week-stats">{data.revByTime.map(t => <div key={t.period} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{t.period} ({t.pct}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${t.pct}%`}} /></div></div>)}</div></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Top Items Today')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Item')}</th><th>{d('Sold')}</th></tr></thead><tbody>
                {data.topItems.map((t,i) => <tr key={i}><td>{t.name}</td><td>{t.sold}</td></tr>)}
              </tbody></table></div>
          </div>
        </>}

        <Callout industry="café" d={d} />
        <ResetBtn onReset={() => { setData(clone(CAFE_DEFAULTS)); setView('overview'); setOrdFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCHOOL & ACADEMY DASHBOARD
   ═══════════════════════════════════════════════════ */
const SCHOOL_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'students', label: 'Students' },
  { id: 'schedule', label: 'Schedule' }, { id: 'comms', label: 'Communications' }, { id: 'revenue', label: 'Revenue' },
];
const SCHOOL_DEFAULTS = {
  enrolled: 284, classesToday: 18, pendingEnroll: 12, monthlyRev: 28400,
  todayClasses: [
    { subject: 'Mathematics', teacher: 'Prof. García', room: 'Aula 3', time: '08:00', attendance: '28/30' },
    { subject: 'History',     teacher: 'Prof. Smith',  room: 'Aula 5', time: '09:00', attendance: '25/28' },
    { subject: 'English',     teacher: 'Prof. López',  room: 'Aula 2', time: '10:00', attendance: '30/30' },
    { subject: 'Science',     teacher: 'Prof. Torres', room: 'Lab 1',  time: '11:00', attendance: '22/25' },
    { subject: 'Art',         teacher: 'Prof. Díaz',   room: 'Aula 7', time: '14:00', attendance: '20/20' },
  ],
  students: [
    { name: 'Martín G.',   grade: '10th', payment: 'paid',    attendance: 94, parent: 'García, M.' },
    { name: 'Sofía L.',    grade: '10th', payment: 'paid',    attendance: 98, parent: 'López, A.' },
    { name: 'Lucas T.',    grade: '11th', payment: 'pending', attendance: 87, parent: 'Torres, P.' },
    { name: 'Valentina R.',grade: '9th',  payment: 'paid',    attendance: 92, parent: 'Rodríguez, C.' },
    { name: 'Mateo D.',    grade: '11th', payment: 'overdue', attendance: 78, parent: 'Díaz, F.' },
    { name: 'Isabella M.', grade: '9th',  payment: 'paid',    attendance: 96, parent: 'Moreno, S.' },
    { name: 'Santiago P.',  grade: '12th', payment: 'pending', attendance: 85, parent: 'Pérez, R.' },
  ],
  schedule: [
    { day: 'Mon', slots: ['Math — García', 'History — Smith', 'English — López'] },
    { day: 'Tue', slots: ['Science — Torres', 'Art — Díaz', 'Math — García'] },
    { day: 'Wed', slots: ['English — López', 'History — Smith', 'PE — Morales'] },
    { day: 'Thu', slots: ['Science — Torres', 'Math — García', 'Art — Díaz'] },
    { day: 'Fri', slots: ['English — López', 'Music — Ruiz', 'History — Smith'] },
  ],
  comms: [
    { subject: 'April fee reminder',   date: 'Apr 10', recipients: 'All parents', type: 'reminder' },
    { subject: 'Sports day schedule',   date: 'Apr 8',  recipients: '9th-10th',    type: 'circular' },
    { subject: 'Parent-teacher meeting',date: 'Apr 5',  recipients: 'All parents', type: 'notice' },
    { subject: 'Holiday calendar update',date: 'Apr 2', recipients: 'All',         type: 'circular' },
    { subject: 'New lab hours',          date: 'Mar 28', recipients: '11th-12th',   type: 'notice' },
  ],
  tuitionRev: 22800, enrollmentFees: 3600, extraRev: 2000,
};
const SCHOOL_PAY_CSS = { paid: 'idash__badge--green', pending: 'idash__badge--amber', overdue: 'idash__badge--red' };

function SchoolDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(SCHOOL_DEFAULTS));
  const [view, setView] = useState('overview');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function sendReminder(i) { act(); setData(p => { const n = clone(p); n.students[i].payment = 'paid'; return n; }); showToast(d('✓ Reminder sent')); }
  function sendAnnouncement() { act(); showToast(d('✓ Announcement sent to all parents')); }

  const filtStudents = data.students.filter(s => gradeFilter === 'All' || s.grade === gradeFilter);
  const totalRev = data.tuitionRev + data.enrollmentFees + data.extraRev;

  return (
    <div className="idash">
      <DashSidebar title="School Dashboard" items={SCHOOL_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="School & Academy" alerts={data.pendingEnroll} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Enrolled Students')}</span><span className="idash__stat-value">{data.enrolled}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Classes Today')}</span><span className="idash__stat-value">{data.classesToday}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Enrollments')}</span><span className="idash__stat-value" style={{color:'#f59e0b'}}>{data.pendingEnroll}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value">€{fmt(data.monthlyRev)}</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Today\'s Classes')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Subject')}</th><th>{d('Teacher')}</th><th>{d('Room')}</th><th>{d('Time')}</th><th>{d('Attendance')}</th></tr></thead><tbody>
                {data.todayClasses.map((c,i) => <tr key={i}><td>{c.subject}</td><td>{c.teacher}</td><td>{c.room}</td><td>{c.time}</td><td>{c.attendance}</td></tr>)}
              </tbody></table></div>
            <div className="idash__panel"><h4 className="idash__panel-title">{d('Pending Enrollments')}</h4>
              <div className="idash__stat" style={{padding:'16px 0'}}><span className="idash__stat-label">{d('Awaiting Review')}</span><span className="idash__stat-value" style={{color:'#f59e0b'}}>{data.pendingEnroll}</span></div></div>
          </div>
        </>}

        {view === 'students' && <>
          <div className="idash__filter-bar">
            {['All','9th','10th','11th','12th'].map(g => <button key={g} type="button" className={`idash__filter-btn ${gradeFilter===g?'is-active':''}`} onClick={() => {setGradeFilter(g);act();}}>{g}</button>)}
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Students')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Grade')}</th><th>{d('Payment')}</th><th>{d('Attendance')}</th><th>{d('Parent')}</th><th></th></tr></thead><tbody>
              {filtStudents.map((s,i) => { const ri = data.students.indexOf(s); return <tr key={i}><td>{s.name}</td><td>{s.grade}</td>
                <td><span className={`idash__badge ${SCHOOL_PAY_CSS[s.payment]}`}>{s.payment.charAt(0).toUpperCase()+s.payment.slice(1)}</span></td>
                <td>{s.attendance}%</td><td>{s.parent}</td>
                <td className="idash__actions">{s.payment!=='paid' && <button className="idash__action-btn" onClick={() => sendReminder(ri)}>Remind</button>}</td></tr>; })}
            </tbody></table></div>
        </>}

        {view === 'schedule' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Weekly Schedule')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Day')}</th><th>{d('Period 1')}</th><th>{d('Period 2')}</th><th>{d('Period 3')}</th></tr></thead><tbody>
              {data.schedule.map((row,i) => <tr key={i}><td style={{fontWeight:600}}>{d(row.day)}</td>{row.slots.map((s,j) => <td key={j}>{s}</td>)}</tr>)}
            </tbody></table></div>
        </>}

        {view === 'comms' && <>
          <div style={{marginBottom:12}}><button className="idash__action-btn" onClick={sendAnnouncement}>+ New Announcement</button></div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Recent Communications')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Subject')}</th><th>{d('Date')}</th><th>{d('Recipients')}</th><th>{d('Type')}</th></tr></thead><tbody>
              {data.comms.map((c,i) => <tr key={i}><td>{c.subject}</td><td>{c.date}</td><td>{c.recipients}</td>
                <td><span className={`idash__badge ${c.type==='reminder'?'idash__badge--amber':c.type==='circular'?'idash__badge--blue':'idash__badge--grey'}`}>{c.type.charAt(0).toUpperCase()+c.type.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Tuition')}</span><span className="idash__stat-value">€{fmt(data.tuitionRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Enrollment Fees')}</span><span className="idash__stat-value">€{fmt(data.enrollmentFees)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Extras')}</span><span className="idash__stat-value">€{fmt(data.extraRev)}</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Revenue Breakdown')}</h4>
            <div className="idash__week-stats">{[{l:'Tuition',v:data.tuitionRev},{l:'Enrollment',v:data.enrollmentFees},{l:'Extras',v:data.extraRev}].map(ch => <div key={ch.l} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{ch.l} — €{fmt(ch.v)} ({Math.round(ch.v/totalRev*100)}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${Math.round(ch.v/totalRev*100)}%`}} /></div></div>)}</div></div>
        </>}

        <Callout industry="school" d={d} />
        <ResetBtn onReset={() => { setData(clone(SCHOOL_DEFAULTS)); setView('overview'); setGradeFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RETAIL & COMMERCE DASHBOARD
   ═══════════════════════════════════════════════════ */
const RETAIL_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'catalog', label: 'Catalog' },
  { id: 'orders', label: 'Orders' }, { id: 'promos', label: 'Promotions' }, { id: 'revenue', label: 'Revenue' },
];
const RETAIL_DEFAULTS = {
  productsLive: 186, ordersToday: 34, lowStock: 9, monthlyRev: 24600,
  recentOrders: [
    { id: '#R-301', client: 'García, M.',  items: 3, total: 89.90,  status: 'shipped' },
    { id: '#R-302', client: 'López, A.',   items: 1, total: 45.00,  status: 'processing' },
    { id: '#R-303', client: 'Smith, J.',   items: 5, total: 156.50, status: 'delivered' },
    { id: '#R-304', client: 'Torres, P.',  items: 2, total: 72.00,  status: 'processing' },
    { id: '#R-305', client: 'Díaz, C.',    items: 4, total: 134.80, status: 'shipped' },
  ],
  catalog: [
    { name: 'Classic T-Shirt', cat: 'Clothing', price: 29.90, stock: 45, status: 'active' },
    { name: 'Running Shoes',   cat: 'Footwear', price: 89.90, stock: 12, status: 'active' },
    { name: 'Leather Wallet',  cat: 'Accessories', price: 45.00, stock: 3, status: 'low' },
    { name: 'Denim Jacket',    cat: 'Clothing', price: 120.00, stock: 8, status: 'active' },
    { name: 'Sunglasses',      cat: 'Accessories', price: 65.00, stock: 0, status: 'out' },
    { name: 'Canvas Backpack', cat: 'Accessories', price: 55.00, stock: 22, status: 'active' },
  ],
  promos: [
    { name: 'Spring Sale -30%', end: 'Apr 30', products: 'All clothing', status: 'active' },
    { name: 'Free shipping +€50', end: 'Permanent', products: 'All', status: 'active' },
    { name: '2×1 Accessories', end: 'Apr 20', products: 'Accessories', status: 'active' },
  ],
  revOnline: 16200, revStore: 8400,
  topProducts: [
    { name: 'Running Shoes', sold: 48, revenue: 4315 }, { name: 'Classic T-Shirt', sold: 62, revenue: 1854 },
    { name: 'Denim Jacket', sold: 18, revenue: 2160 }, { name: 'Canvas Backpack', sold: 28, revenue: 1540 },
    { name: 'Leather Wallet', sold: 34, revenue: 1530 },
  ],
};
const RETAIL_O_CSS = { processing: 'idash__badge--amber', shipped: 'idash__badge--blue', delivered: 'idash__badge--green' };
const RETAIL_S_CSS = { active: 'idash__badge--green', low: 'idash__badge--amber', out: 'idash__badge--red' };

function RetailDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(RETAIL_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function shipOrder(i) { act(); setData(p => { const n = clone(p); n.recentOrders[i].status = 'shipped'; return n; }); showToast(d('✓ Order shipped')); }

  const totalRev = data.revOnline + data.revStore;

  return (
    <div className="idash">
      <DashSidebar title="Retail Dashboard" items={RETAIL_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Retail & Commerce" alerts={data.lowStock} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Products Live')}</span><span className="idash__stat-value">{data.productsLive}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Orders Today')}</span><span className="idash__stat-value"><InlineEdit value={data.ordersToday} onChange={v => setData(p => ({...p, ordersToday: v}))} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Low Stock')}</span><span className="idash__stat-value" style={{color:'#ef4444'}}>{data.lowStock}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span><span className="idash__stat-badge idash__stat-badge--up">{d('+12%')}</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Recent Orders')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Total')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.recentOrders.map((o,i) => <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.items}</td><td>€{o.total.toFixed(2)}</td>
                <td><span className={`idash__badge ${RETAIL_O_CSS[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'catalog' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Product Catalog')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Product')}</th><th>{d('Category')}</th><th>{d('Price')}</th><th>{d('Stock')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.catalog.map((p,i) => <tr key={i}><td>{p.name}</td><td>{p.cat}</td><td>€{p.price.toFixed(2)}</td><td style={{color:p.stock<=3?'#ef4444':p.stock<=10?'#f59e0b':'inherit',fontWeight:p.stock<=10?600:400}}>{p.stock}</td>
                <td><span className={`idash__badge ${RETAIL_S_CSS[p.status]}`}>{p.status==='out'?'Out of stock':p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'orders' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Orders')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Total')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.recentOrders.map((o,i) => <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.items}</td><td>€{o.total.toFixed(2)}</td>
                <td><span className={`idash__badge ${RETAIL_O_CSS[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td>
                <td className="idash__actions">{o.status==='processing' && <button className="idash__action-btn" onClick={() => shipOrder(i)}>Ship</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'promos' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Active Promotions')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Promotion')}</th><th>{d('Products')}</th><th>{d('Ends')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.promos.map((p,i) => <tr key={i}><td>{p.name}</td><td>{p.products}</td><td>{p.end}</td><td><span className="idash__badge idash__badge--green">Active</span></td></tr>)}
            </tbody></table></div>
          <div style={{marginTop:12}}><button className="idash__action-btn" onClick={() => {act(); showToast(d('Promotion builder available in your live system'));}}>+ New Promotion</button></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Online')}</span><span className="idash__stat-value">€{fmt(data.revOnline)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('In-Store')}</span><span className="idash__stat-value">€{fmt(data.revStore)}</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Top Products by Revenue')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Product')}</th><th>{d('Sold')}</th><th>{d('Revenue')}</th></tr></thead><tbody>
              {data.topProducts.map((p,i) => <tr key={i}><td>{p.name}</td><td>{p.sold}</td><td>€{fmt(p.revenue)}</td></tr>)}
            </tbody></table></div>
        </>}

        <Callout industry="retail" d={d} />
        <ResetBtn onReset={() => { setData(clone(RETAIL_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BAKERY & PASTRY DASHBOARD
   ═══════════════════════════════════════════════════ */
const BAKERY_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'preorders', label: 'Pre-orders' },
  { id: 'menu', label: 'Daily Menu' }, { id: 'delivery', label: 'Delivery' }, { id: 'revenue', label: 'Revenue' },
];
const BAKERY_DEFAULTS = {
  preordersToday: 18, readyPickup: 6, deliveries: 4, monthlyRev: 9800,
  preorders: [
    { id: '#PO-41', client: 'García, M.',  items: 'Birthday cake + 24 cupcakes', pickup: 'Apr 14 10:00', total: 145, status: 'confirmed' },
    { id: '#PO-42', client: 'Smith, J.',   items: 'Croissants ×20',              pickup: 'Apr 14 07:00', total: 56,  status: 'ready' },
    { id: '#PO-43', client: 'López, A.',   items: 'Sourdough ×5, Baguette ×10',  pickup: 'Apr 15 08:00', total: 68,  status: 'preparing' },
    { id: '#PO-44', client: 'Torres, C.',  items: 'Wedding cake (3 tier)',        pickup: 'Apr 18 09:00', total: 320, status: 'confirmed' },
    { id: '#PO-45', client: 'Díaz, F.',    items: 'Empanadas ×36',               pickup: 'Apr 14 12:00', total: 72,  status: 'ready' },
  ],
  dailyMenu: [
    { name: 'Sourdough Bread',  available: true,  qty: 24 },
    { name: 'Croissants',       available: true,  qty: 48 },
    { name: 'Pain au Chocolat', available: true,  qty: 36 },
    { name: 'Baguette',         available: true,  qty: 30 },
    { name: 'Cinnamon Roll',    available: false, qty: 0 },
    { name: 'Banana Bread',     available: true,  qty: 12 },
  ],
  deliveryZones: [
    { zone: 'Centro', orders: 2, eta: '09:30' },
    { zone: 'Norte',  orders: 1, eta: '10:15' },
    { zone: 'Sur',    orders: 1, eta: '11:00' },
  ],
  revPreorders: 5200, revWalkin: 3400, revDelivery: 1200,
};
const BAKERY_CSS = { confirmed: 'idash__badge--blue', ready: 'idash__badge--green', preparing: 'idash__badge--amber' };

function BakeryDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(BAKERY_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function markReady(i) { act(); setData(p => { const n = clone(p); n.preorders[i].status = 'ready'; return n; }); showToast(d('✓ Order ready for pickup')); }
  function toggleMenu(i) { act(); setData(p => { const n = clone(p); n.dailyMenu[i].available = !n.dailyMenu[i].available; return n; }); }

  const totalRev = data.revPreorders + data.revWalkin + data.revDelivery;

  return (
    <div className="idash">
      <DashSidebar title="Bakery Dashboard" items={BAKERY_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Bakery & Pastry" alerts={data.readyPickup} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Pre-orders Today')}</span><span className="idash__stat-value">{data.preordersToday}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Ready for Pickup')}</span><span className="idash__stat-value" style={{color:'#22c55e'}}>{data.readyPickup}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Deliveries')}</span><span className="idash__stat-value">{data.deliveries}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Today\'s Pre-orders')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Pickup')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.preorders.slice(0,3).map((o,i) => <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.items}</td><td>{o.pickup}</td>
                <td><span className={`idash__badge ${BAKERY_CSS[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'preorders' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('All Pre-orders')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Pickup')}</th><th>{d('Total')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.preorders.map((o,i) => <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.items}</td><td>{o.pickup}</td><td>€{o.total}</td>
                <td><span className={`idash__badge ${BAKERY_CSS[o.status]}`}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td>
                <td className="idash__actions">{o.status!=='ready' && <button className="idash__action-btn" onClick={() => markReady(i)}>Mark ready</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'menu' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Daily Menu')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Item')}</th><th>{d('Qty')}</th><th>{d('Available')}</th></tr></thead><tbody>
              {data.dailyMenu.map((m,i) => <tr key={i}><td>{m.name}</td><td>{m.qty}</td>
                <td><div className="idash__toggle-wrap" onClick={() => toggleMenu(i)} style={{cursor:'pointer'}}><div className={`idash__toggle ${m.available?'is-on':''}`}><div className="idash__toggle-knob" /></div></div></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'delivery' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Delivery Zones')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Zone')}</th><th>{d('Orders')}</th><th>{d('ETA')}</th></tr></thead><tbody>
              {data.deliveryZones.map((z,i) => <tr key={i}><td>{z.zone}</td><td>{z.orders}</td><td>{z.eta}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pre-orders')}</span><span className="idash__stat-value">€{fmt(data.revPreorders)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Walk-in')}</span><span className="idash__stat-value">€{fmt(data.revWalkin)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Delivery')}</span><span className="idash__stat-value">€{fmt(data.revDelivery)}</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Revenue Breakdown')}</h4>
            <div className="idash__week-stats">{[{l:'Pre-orders',v:data.revPreorders},{l:'Walk-in',v:data.revWalkin},{l:'Delivery',v:data.revDelivery}].map(ch => <div key={ch.l} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{ch.l} — €{fmt(ch.v)} ({Math.round(ch.v/totalRev*100)}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${Math.round(ch.v/totalRev*100)}%`}} /></div></div>)}</div></div>
        </>}

        <Callout industry="bakery" d={d} />
        <ResetBtn onReset={() => { setData(clone(BAKERY_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FINANCIAL SERVICES DASHBOARD
   ═══════════════════════════════════════════════════ */
const BANK_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'appointments', label: 'Appointments' },
  { id: 'leads', label: 'Leads' }, { id: 'clients', label: 'Client Portal' }, { id: 'revenue', label: 'Revenue' },
];
const BANK_DEFAULTS = {
  appointmentsWeek: 24, qualifiedLeads: 18, activeClients: 156, monthlyRev: 34000,
  todayAppts: [
    { client: 'García, M.',  service: 'Investment review', time: '09:00', advisor: 'Carlos R.', status: 'confirmed' },
    { client: 'Smith, J.',   service: 'Mortgage consult',  time: '10:30', advisor: 'Ana M.',    status: 'confirmed' },
    { client: 'López, A.',   service: 'Tax planning',      time: '14:00', advisor: 'Carlos R.', status: 'pending' },
    { client: 'Torres, P.',  service: 'Insurance review',  time: '15:30', advisor: 'Ana M.',    status: 'confirmed' },
  ],
  leads: [
    { name: 'Pérez, R.',  service: 'Mortgage',   source: 'Website', lastContact: 'Apr 10', status: 'qualified' },
    { name: 'Díaz, C.',   service: 'Investment',  source: 'Referral', lastContact: 'Apr 9', status: 'new' },
    { name: 'Moreno, L.', service: 'Insurance',   source: 'Website', lastContact: 'Apr 8', status: 'contacted' },
    { name: 'Ruiz, S.',   service: 'Tax',         source: 'Ad',      lastContact: 'Apr 11', status: 'qualified' },
    { name: 'Vargas, T.', service: 'Mortgage',    source: 'Referral', lastContact: 'Apr 7', status: 'meeting' },
  ],
  clients: [
    { name: 'García, M.',  services: 'Investment + Tax', docsPending: 0, lastReview: 'Mar 15' },
    { name: 'Smith, J.',   services: 'Mortgage',         docsPending: 2, lastReview: 'Apr 2' },
    { name: 'Torres, P.',  services: 'Insurance',        docsPending: 0, lastReview: 'Feb 28' },
    { name: 'Martínez, A.',services: 'Investment',        docsPending: 1, lastReview: 'Mar 20' },
  ],
  revAdvisory: 18000, revCommissions: 12000, revFees: 4000,
};
const BANK_L_CSS = { new: 'idash__badge--grey', contacted: 'idash__badge--blue', qualified: 'idash__badge--amber', meeting: 'idash__badge--green' };

function BankDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(BANK_DEFAULTS));
  const [view, setView] = useState('overview');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function confirmAppt(i) { act(); setData(p => { const n = clone(p); n.todayAppts[i].status = 'confirmed'; return n; }); showToast(d('✓ Appointment confirmed')); }
  function requestDocs(i) { act(); setData(p => { const n = clone(p); n.clients[i].docsPending = 0; return n; }); showToast(d('✓ Document request sent')); }

  const totalRev = data.revAdvisory + data.revCommissions + data.revFees;

  return (
    <div className="idash">
      <DashSidebar title="Finance Dashboard" items={BANK_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Financial Services" alerts={3} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Appointments (week)')}</span><span className="idash__stat-value">{data.appointmentsWeek}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Qualified Leads')}</span><span className="idash__stat-value">{data.qualifiedLeads}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Active Clients')}</span><span className="idash__stat-value">{data.activeClients}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Today\'s Appointments')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Service')}</th><th>{d('Time')}</th><th>{d('Advisor')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.todayAppts.map((a,i) => <tr key={i}><td>{a.client}</td><td>{a.service}</td><td>{a.time}</td><td>{a.advisor}</td>
                <td><span className={`idash__badge ${a.status==='confirmed'?'idash__badge--green':'idash__badge--amber'}`}>{a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'appointments' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Appointments')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Service')}</th><th>{d('Time')}</th><th>{d('Advisor')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {data.todayAppts.map((a,i) => <tr key={i}><td>{a.client}</td><td>{a.service}</td><td>{a.time}</td><td>{a.advisor}</td>
                <td><span className={`idash__badge ${a.status==='confirmed'?'idash__badge--green':'idash__badge--amber'}`}>{a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span></td>
                <td className="idash__actions">{a.status==='pending' && <button className="idash__action-btn" onClick={() => confirmAppt(i)}>Confirm</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'leads' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Lead Pipeline')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Name')}</th><th>{d('Service')}</th><th>{d('Source')}</th><th>{d('Last Contact')}</th><th>{d('Stage')}</th></tr></thead><tbody>
              {data.leads.map((l,i) => <tr key={i}><td>{l.name}</td><td>{l.service}</td><td>{l.source}</td><td>{l.lastContact}</td>
                <td><span className={`idash__badge ${BANK_L_CSS[l.status]}`}>{l.status.charAt(0).toUpperCase()+l.status.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'clients' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Client Portal')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Services')}</th><th>{d('Docs Pending')}</th><th>{d('Last Review')}</th><th></th></tr></thead><tbody>
              {data.clients.map((c,i) => <tr key={i}><td>{c.name}</td><td>{c.services}</td>
                <td style={{color:c.docsPending>0?'#f59e0b':'#22c55e'}}>{c.docsPending>0?`${c.docsPending} pending`:'Complete'}</td><td>{c.lastReview}</td>
                <td className="idash__actions">{c.docsPending>0 && <button className="idash__action-btn" onClick={() => requestDocs(i)}>Request</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Advisory')}</span><span className="idash__stat-value">€{fmt(data.revAdvisory)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Commissions')}</span><span className="idash__stat-value">€{fmt(data.revCommissions)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Fees')}</span><span className="idash__stat-value">€{fmt(data.revFees)}</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Revenue Breakdown')}</h4>
            <div className="idash__week-stats">{[{l:'Advisory',v:data.revAdvisory},{l:'Commissions',v:data.revCommissions},{l:'Fees',v:data.revFees}].map(ch => <div key={ch.l} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{ch.l} — €{fmt(ch.v)} ({Math.round(ch.v/totalRev*100)}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${Math.round(ch.v/totalRev*100)}%`}} /></div></div>)}</div></div>
        </>}

        <Callout industry="financial services" d={d} />
        <ResetBtn onReset={() => { setData(clone(BANK_DEFAULTS)); setView('overview'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TATTOO STUDIO DASHBOARD
   ═══════════════════════════════════════════════════ */
const TATTOO_NAV = [
  { id: 'overview', label: 'Overview' }, { id: 'bookings', label: 'Bookings' },
  { id: 'portfolio', label: 'Portfolio' }, { id: 'artists', label: 'Artists' }, { id: 'revenue', label: 'Revenue' },
];
const TATTOO_DEFAULTS = {
  bookingsMonth: 38, depositsCollected: 32, pendingDeposits: 6, monthlyRev: 14200,
  upcoming: [
    { client: 'García, M.',  style: 'Blackwork',    artist: 'Alex R.',  date: 'Apr 14', time: '10:00', deposit: true,  hours: 3, status: 'confirmed' },
    { client: 'Smith, J.',   style: 'Watercolor',   artist: 'Luna M.',  date: 'Apr 14', time: '14:00', deposit: true,  hours: 2, status: 'confirmed' },
    { client: 'López, A.',   style: 'Realism',      artist: 'Alex R.',  date: 'Apr 15', time: '11:00', deposit: false, hours: 4, status: 'pending' },
    { client: 'Torres, P.',  style: 'Traditional',  artist: 'Kai T.',   date: 'Apr 16', time: '10:00', deposit: true,  hours: 2, status: 'confirmed' },
    { client: 'Díaz, C.',    style: 'Geometric',    artist: 'Luna M.',  date: 'Apr 18', time: '15:00', deposit: false, hours: 3, status: 'pending' },
  ],
  portfolio: [
    { title: 'Japanese sleeve',     style: 'Japanese',    artist: 'Alex R.',  likes: 342 },
    { title: 'Floral watercolor',   style: 'Watercolor',  artist: 'Luna M.',  likes: 278 },
    { title: 'Geometric mandala',   style: 'Geometric',   artist: 'Luna M.',  likes: 215 },
    { title: 'Portrait realism',    style: 'Realism',     artist: 'Alex R.',  likes: 189 },
    { title: 'Old school eagle',    style: 'Traditional', artist: 'Kai T.',   likes: 156 },
  ],
  artists: [
    { name: 'Alex R.',  specialty: 'Blackwork, Realism, Japanese', rating: 4.9, bookings: 16, revenue: 6400 },
    { name: 'Luna M.',  specialty: 'Watercolor, Geometric',        rating: 4.8, bookings: 14, revenue: 5200 },
    { name: 'Kai T.',   specialty: 'Traditional, Neo-traditional', rating: 4.7, bookings: 8,  revenue: 2600 },
  ],
  avgSession: 380, hourlyRate: 120,
};

function TattooDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(TATTOO_DEFAULTS));
  const [view, setView] = useState('overview');
  const [styleFilter, setStyleFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function collectDeposit(i) { act(); setData(p => { const n = clone(p); n.upcoming[i].deposit = true; n.upcoming[i].status = 'confirmed'; return n; }); showToast(d('✓ Deposit collected — booking confirmed')); }

  const filtPortfolio = data.portfolio.filter(p => styleFilter === 'All' || p.style === styleFilter);
  const styles = [...new Set(data.portfolio.map(p => p.style))];

  return (
    <div className="idash">
      <DashSidebar title="Tattoo Dashboard" items={TATTOO_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Tattoo Studio" alerts={data.pendingDeposits} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Bookings (month)')}</span><span className="idash__stat-value">{data.bookingsMonth}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Deposits Collected')}</span><span className="idash__stat-value" style={{color:'#22c55e'}}>{data.depositsCollected}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Pending Deposits')}</span><span className="idash__stat-value" style={{color:'#f59e0b'}}>{data.pendingDeposits}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({...p, monthlyRev: v}))} onInteract={act} prefix="€" /></span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Upcoming Sessions')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Style')}</th><th>{d('Artist')}</th><th>{d('Date')}</th><th>{d('Deposit')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.upcoming.slice(0,4).map((b,i) => <tr key={i}><td>{b.client}</td><td>{b.style}</td><td>{b.artist}</td><td>{b.date} {b.time}</td>
                <td>{b.deposit ? <span style={{color:'#22c55e'}}>✓ Paid</span> : <span style={{color:'#f59e0b'}}>Pending</span>}</td>
                <td><span className={`idash__badge ${b.status==='confirmed'?'idash__badge--green':'idash__badge--amber'}`}>{b.status.charAt(0).toUpperCase()+b.status.slice(1)}</span></td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'bookings' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('All Bookings')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Client')}</th><th>{d('Style')}</th><th>{d('Artist')}</th><th>{d('Date')}</th><th>{d('Hours')}</th><th>{d('Deposit')}</th><th></th></tr></thead><tbody>
              {data.upcoming.map((b,i) => <tr key={i}><td>{b.client}</td><td>{b.style}</td><td>{b.artist}</td><td>{b.date} {b.time}</td><td>{b.hours}h</td>
                <td>{b.deposit ? <span style={{color:'#22c55e'}}>✓</span> : <span style={{color:'#f59e0b'}}>—</span>}</td>
                <td className="idash__actions">{!b.deposit && <button className="idash__action-btn" onClick={() => collectDeposit(i)}>Collect deposit</button>}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'portfolio' && <>
          <div className="idash__filter-bar">
            {['All', ...styles].map(s => <button key={s} type="button" className={`idash__filter-btn ${styleFilter===s?'is-active':''}`} onClick={() => {setStyleFilter(s);act();}}>{d(s)}</button>)}
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Portfolio Gallery')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Piece')}</th><th>{d('Style')}</th><th>{d('Artist')}</th><th>{d('Likes')}</th></tr></thead><tbody>
              {filtPortfolio.map((p,i) => <tr key={i}><td>{p.title}</td><td>{p.style}</td><td>{p.artist}</td><td>❤ {p.likes}</td></tr>)}
            </tbody></table></div>
        </>}

        {view === 'artists' && <>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Artists')}</h4>
            <div className="idash__staff-list">{data.artists.map(a => <div key={a.name} className="idash__staff-card">
              <span className="idash__staff-name">{a.name} — ⭐ {a.rating}</span>
              <span className="idash__staff-shift">{a.bookings} bookings · €{fmt(a.revenue)}</span>
              <span className="idash__staff-role">{a.specialty}</span>
            </div>)}</div></div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span><span className="idash__stat-value">€{fmt(data.monthlyRev)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Avg. Session')}</span><span className="idash__stat-value">€{data.avgSession}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Hourly Rate')}</span><span className="idash__stat-value">€{data.hourlyRate}/h</span></div>
          </div>
          <div className="idash__panel"><h4 className="idash__panel-title">{d('Revenue by Artist')}</h4>
            <div className="idash__week-stats">{data.artists.map(a => { const pct = Math.round(a.revenue/data.monthlyRev*100); return <div key={a.name} className="idash__ws-row" style={{flexDirection:'column',alignItems:'stretch',gap:4}}><span>{a.name} — €{fmt(a.revenue)} ({pct}%)</span><div className="idash__bar"><div className="idash__bar-fill" style={{width:`${pct}%`}} /></div></div>; })}</div></div>
        </>}

        <Callout industry="tattoo studio" d={d} />
        <ResetBtn onReset={() => { setData(clone(TATTOO_DEFAULTS)); setView('overview'); setStyleFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPERMARKET DASHBOARD
   ═══════════════════════════════════════════════════ */
const SUPER_NAV = [
  { id: 'overview',   label: 'Overview' },
  { id: 'orders',     label: 'Orders' },
  { id: 'inventory',  label: 'Inventory' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'revenue',    label: 'Revenue' },
];

const SUPER_DEFAULTS = {
  ordersToday: 47, activeDeliveries: 8, lowStock: 12, monthlyRev: 28400,
  orders: [
    { id: '#1042', client: 'García, M.', items: 8,  zone: 'Palermo',  total: 87.50,  status: 'transit' },
    { id: '#1043', client: 'Smith, J.',  items: 3,  zone: 'Centro',   total: 34.20,  status: 'preparing' },
    { id: '#1044', client: 'López, A.',  items: 12, zone: 'Norte',    total: 156.80, status: 'delivered' },
    { id: '#1045', client: 'Pérez, R.',  items: 5,  zone: 'Palermo',  total: 62.10,  status: 'transit' },
    { id: '#1046', client: 'Torres, C.', items: 9,  zone: 'Sur',      total: 110.40, status: 'preparing' },
    { id: '#1047', client: 'Ramírez, L.',items: 2,  zone: 'Centro',   total: 18.90,  status: 'delivered' },
    { id: '#1048', client: 'Díaz, F.',   items: 7,  zone: 'Norte',    total: 94.60,  status: 'pending' },
    { id: '#1049', client: 'Moreno, S.', items: 4,  zone: 'Sur',      total: 45.30,  status: 'transit' },
  ],
  zones: [
    { name: 'Palermo', active: 3, color: '#4f8cff' },
    { name: 'Centro',  active: 2, color: '#22c55e' },
    { name: 'Norte',   active: 2, color: '#f59e0b' },
    { name: 'Sur',     active: 1, color: '#ef4444' },
  ],
  categories: [
    { name: 'Frescos',  items: 23 },
    { name: 'Lácteos',  items: 18 },
    { name: 'Bebidas',  items: 34 },
    { name: 'Limpieza', items: 28 },
  ],
  lowStockItems: [
    { name: 'Leche entera',    stock: 4,  reordered: false },
    { name: 'Pan lactal',      stock: 2,  reordered: false },
    { name: 'Yogur frutilla',  stock: 6,  reordered: false },
    { name: 'Aceite girasol',  stock: 3,  reordered: false },
    { name: 'Papel higiénico', stock: 5,  reordered: false },
  ],
  promos: [
    { name: '2×1 Gaseosas',         end: '30 Apr', discount: '2×1',  status: 'active' },
    { name: '-20% Lácteos',          end: '25 Apr', discount: '-20%', status: 'active' },
    { name: 'Envío gratis +€30',     end: 'Permanent', discount: 'Free delivery', status: 'active' },
  ],
  revenueOnline: 18400, revenueStore: 10000,
  topProducts: [
    { name: 'Coca-Cola 1.5L',   sold: 342, revenue: 684 },
    { name: 'Leche La Serenísima', sold: 280, revenue: 420 },
    { name: 'Pan lactal Bimbo', sold: 210, revenue: 378 },
    { name: 'Agua mineral 2L',  sold: 195, revenue: 293 },
    { name: 'Bananas (kg)',     sold: 168, revenue: 336 },
  ],
  lastWeekRev: 24800,
};

const SUPER_STATUS_CSS = { pending: 'idash__badge--grey', preparing: 'idash__badge--amber', transit: 'idash__badge--blue', delivered: 'idash__badge--green' };
const SUPER_STATUS_LABEL = { pending: 'Pending', preparing: 'Preparing', transit: 'In transit', delivered: 'Delivered' };

function SupermarketDash({ onInteract }) {
  const d = useDashT();
  const [data, setData] = useState(() => clone(SUPER_DEFAULTS));
  const [view, setView] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('All');
  const [toast, showToast] = useToast();
  const act = () => onInteract?.();

  function markDelivered(i) {
    act();
    setData(prev => {
      const n = clone(prev);
      n.orders[i].status = 'delivered';
      return n;
    });
    showToast(d('Order marked as delivered'));
  }

  function reorder(i) {
    act();
    setData(prev => {
      const n = clone(prev);
      n.lowStockItems[i].reordered = true;
      return n;
    });
    showToast(d('✓ Restock order sent'));
  }

  const filteredOrders = data.orders.filter(o => orderFilter === 'All' || o.status === orderFilter);
  const thisWeekRev = data.revenueOnline + data.revenueStore;
  const revChange = thisWeekRev - data.lastWeekRev;
  const revPct = data.lastWeekRev > 0 ? Math.round((revChange / data.lastWeekRev) * 100) : 0;

  return (
    <div className="idash">
      <DashSidebar title="Super Dashboard" items={SUPER_NAV} active={view} onNav={v => { setView(v); act(); }} d={d} />
      <div className="idash__main">
        <DashTopbar title="Supermarket" alerts={data.lowStock} onSettings={() => showToast(d('Settings available in your live system'))} d={d} />
        <Toast message={toast} />

        {view === 'overview' && <>
          <div className="idash__stats">
            <div className="idash__stat"><span className="idash__stat-label">{d('Orders Today')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.ordersToday} onChange={v => setData(p => ({ ...p, ordersToday: v }))} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Active Deliveries')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.activeDeliveries} onChange={v => setData(p => ({ ...p, activeDeliveries: v }))} onInteract={act} /></span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Low Stock Items')}</span>
              <span className="idash__stat-value" style={{ color: '#ef4444' }}>{data.lowStock}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('Monthly Revenue')}</span>
              <span className="idash__stat-value"><InlineEdit value={data.monthlyRev} onChange={v => setData(p => ({ ...p, monthlyRev: v }))} onInteract={act} prefix="€" /></span>
              <span className="idash__stat-badge idash__stat-badge--up">{d('+14%')}</span></div>
          </div>

          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Today\'s Orders')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Zone')}</th><th>{d('Status')}</th></tr></thead><tbody>
                {data.orders.slice(0, 5).map((o, i) => (
                  <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.items} items</td><td>{o.zone}</td>
                    <td><span className={`idash__badge ${SUPER_STATUS_CSS[o.status]}`}>{SUPER_STATUS_LABEL[o.status]}</span></td></tr>
                ))}
              </tbody></table>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Delivery Zones')}</h4>
              <div className="idash__staff-list">
                {data.zones.map(z => (
                  <div key={z.name} className="idash__staff-card">
                    <span className="idash__staff-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, flexShrink: 0 }} />
                      {z.name}
                    </span>
                    <span className="idash__staff-role">{z.active} active orders</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>}

        {view === 'orders' && <>
          <div className="idash__filter-bar">
            {['All', 'pending', 'preparing', 'transit', 'delivered'].map(f => (
              <button key={f} type="button" className={`idash__filter-btn ${orderFilter === f ? 'is-active' : ''}`}
                onClick={() => { setOrderFilter(f); act(); }}>{f === 'All' ? d('All') : d(SUPER_STATUS_LABEL[f])}</button>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Orders')} — {orderFilter === 'All' ? d('All') : d(SUPER_STATUS_LABEL[orderFilter])}</h4>
            <table className="idash__table"><thead><tr><th>{d('Order')}</th><th>{d('Client')}</th><th>{d('Items')}</th><th>{d('Zone')}</th><th>{d('Total')}</th><th>{d('Status')}</th><th></th></tr></thead><tbody>
              {filteredOrders.map((o, i) => {
                const realIdx = data.orders.indexOf(o);
                return (
                  <tr key={i}><td>{o.id}</td><td>{o.client}</td><td>{o.items}</td><td>{o.zone}</td><td>€{o.total.toFixed(2)}</td>
                    <td><span className={`idash__badge ${SUPER_STATUS_CSS[o.status]}`}>{SUPER_STATUS_LABEL[o.status]}</span></td>
                    <td className="idash__actions">
                      {o.status !== 'delivered' && <button className="idash__action-btn" onClick={() => markDelivered(realIdx)}>✓ Delivered</button>}
                    </td></tr>
                );
              })}
            </tbody></table>
          </div>
        </>}

        {view === 'inventory' && <>
          <div className="idash__stats">
            {data.categories.map(c => (
              <div key={c.name} className="idash__stat">
                <span className="idash__stat-label">{c.name}</span>
                <span className="idash__stat-value">{c.items}</span>
                <span className="idash__stat-sub">products</span>
              </div>
            ))}
          </div>
          <div className="idash__panel">
            <h4 className="idash__panel-title" style={{ color: '#ef4444' }}>⚠ Low Stock — Below 10 units</h4>
            <table className="idash__table"><thead><tr><th>{d('Product')}</th><th>{d('Stock')}</th><th></th></tr></thead><tbody>
              {data.lowStockItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td style={{ color: item.stock <= 3 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{item.stock} units</td>
                  <td className="idash__actions">
                    {item.reordered
                      ? <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>✓ Restock sent</span>
                      : <button className="idash__action-btn" onClick={() => reorder(i)}>Reorder</button>}
                  </td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </>}

        {view === 'promotions' && <>
          <div className="idash__panel">
            <h4 className="idash__panel-title">{d('Active Promotions')}</h4>
            <table className="idash__table"><thead><tr><th>{d('Promotion')}</th><th>{d('Discount')}</th><th>{d('Ends')}</th><th>{d('Status')}</th></tr></thead><tbody>
              {data.promos.map((p, i) => (
                <tr key={i}><td>{p.name}</td><td>{p.discount}</td><td>{p.end}</td>
                  <td><span className="idash__badge idash__badge--green">Active</span></td></tr>
              ))}
            </tbody></table>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="idash__action-btn" onClick={() => { act(); showToast(d('Promotion builder available in your live system')); }}>+ New Promotion</button>
          </div>
        </>}

        {view === 'revenue' && <>
          <div className="idash__stats" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="idash__stat"><span className="idash__stat-label">{d('Online Sales')}</span><span className="idash__stat-value">€{fmt(data.revenueOnline)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('In-Store Sales')}</span><span className="idash__stat-value">€{fmt(data.revenueStore)}</span></div>
            <div className="idash__stat"><span className="idash__stat-label">{d('vs Last Week')}</span>
              <span className="idash__stat-value" style={{ color: revChange >= 0 ? '#22c55e' : '#ef4444' }}>{revChange >= 0 ? '+' : ''}€{fmt(Math.abs(revChange))}</span>
              <span className={`idash__stat-badge ${revChange >= 0 ? 'idash__stat-badge--up' : 'idash__stat-badge--down'}`}>{revPct >= 0 ? '+' : ''}{revPct}%</span></div>
          </div>
          <div className="idash__mid">
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Channel Breakdown')}</h4>
              <div className="idash__week-stats">
                {[{ label: 'Online', val: data.revenueOnline, pct: Math.round((data.revenueOnline / thisWeekRev) * 100) },
                  { label: 'In-Store', val: data.revenueStore, pct: Math.round((data.revenueStore / thisWeekRev) * 100) }].map(ch => (
                  <div key={ch.label} className="idash__ws-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                    <span>{ch.label} — €{fmt(ch.val)} ({ch.pct}%)</span>
                    <div className="idash__bar"><div className="idash__bar-fill" style={{ width: `${ch.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="idash__panel">
              <h4 className="idash__panel-title">{d('Top 5 Products')}</h4>
              <table className="idash__table"><thead><tr><th>{d('Product')}</th><th>{d('Sold')}</th><th>{d('Revenue')}</th></tr></thead><tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={i}><td>{p.name}</td><td>{p.sold}</td><td>€{fmt(p.revenue)}</td></tr>
                ))}
              </tbody></table>
            </div>
          </div>
        </>}

        <Callout industry="supermarket" d={d} />
        <ResetBtn onReset={() => { setData(clone(SUPER_DEFAULTS)); setView('overview'); setOrderFilter('All'); act(); }} d={d} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD MAP
   ═══════════════════════════════════════════════════ */
const DASHBOARDS = {
  hospitality: HospitalityDash,
  clinics:     ClinicsDash,
  realestate:  RealEstateDash,
  barbershop:  BarbershopDash,
  veterinary:  VeterinaryDash,
  gym:         GymDash,
  optical:     OpticalDash,
  law:         LawDash,
  accounting:  AccountingDash,
  supermarket: SupermarketDash,
  hardware:    HardwareDash,
  buildsupply: BuildSupplyDash,
  photography: PhotographyDash,
  cardealer:   CarDealerDash,
  cafe:        CafeDash,
  school:      SchoolDash,
  retail:      RetailDash,
  bakery:      BakeryDash,
  bank:        BankDash,
  tattoo:      TattooDash,
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
function FeaturesStrip({ features, T }) {
  if (!features || features.length === 0) return null;
  return (
    <div className="idemo__features">
      <h4 className="idemo__features-title">{T ? T(Trans.industryDemo.whatsIncluded) : "What's included"}</h4>
      <ul className="idemo__features-list">
        {features.map((f, i) => (
          <li key={i} className="idemo__features-chip">
            <span className="idemo__features-check" aria-hidden="true">✓</span>
            <span className="idemo__features-text">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImpactPanel({ industry, industryLabel, T, translatedDesc, translatedFeatures, translatedStats }) {
  return (
    <div className="idemo__impact-panel">
      <div className="idemo__impact-head">
        <span className="idemo__impact-icon" aria-hidden="true">{industry.icon}</span>
        <h3 className="idemo__impact-title">{industryLabel}</h3>
        <p className="idemo__impact-desc">{translatedDesc}</p>
      </div>
      <div className="idemo__impact-stats">
        {translatedStats.map((stat, i) => (
          <div key={i} className="idemo__impact-stat">
            <span className="idemo__impact-value">{stat.value}</span>
            <span className="idemo__impact-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <FeaturesStrip features={translatedFeatures} T={T} />
      <p className="idemo__impact-note">
        {T(Trans.industryDemo.projectedMetrics)}
      </p>
    </div>
  );
}

export default function IndustryDemo() {
  const rootRef = useRef(null);
  const selectorRef = useRef(null);
  const dashRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const [query, setQuery] = useState('');
  const T = useT();

  const labelFor = (id) => {
    const key = INDUSTRY_I18N_KEYS[id];
    const entry = key && Trans.industryDemo.industries[key];
    if (entry?.label) return T(entry.label);
    return INDUSTRIES.find(i => i.id === id)?.label || id;
  };

  const descFor = (id) => {
    const key = INDUSTRY_I18N_KEYS[id];
    const entry = key && Trans.industryDemo.industries[key];
    if (entry?.desc) return T(entry.desc);
    return INDUSTRIES.find(i => i.id === id)?.desc || '';
  };

  const featuresFor = (id) => {
    const key = INDUSTRY_I18N_KEYS[id];
    const entry = key && Trans.industryDemo.industries[key];
    if (entry?.features) return Object.values(entry.features).map(f => T(f));
    return INDUSTRIES.find(i => i.id === id)?.features || [];
  };

  const impactStatsFor = (id) => {
    const key = INDUSTRY_I18N_KEYS[id];
    const entry = key && Trans.industryDemo.industries[key];
    if (entry?.impactStats) {
      return Object.values(entry.impactStats).map(s => ({
        value: s.value,
        label: T(s.label),
      }));
    }
    const ind = INDUSTRIES.find(i => i.id === id);
    return ind?.impactStats ? Object.values(ind.impactStats) : [];
  };

  const ActiveDash = activeId ? DASHBOARDS[activeId] : null;
  const activeIndustry = INDUSTRIES.find(i => i.id === activeId);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;
  const filteredIndustries = hasQuery
    ? INDUSTRIES.filter(i =>
        i.label.toLowerCase().includes(q) ||
        labelFor(i.id).toLowerCase().includes(q) ||
        descFor(i.id).toLowerCase().includes(q)
      )
    : [];

  function handleInteract() { if (showTooltip) setShowTooltip(false); }

  // Scroll-in animation for selector
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-idemo-fade]', { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 75%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  function selectIndustry(id) {
    const sel = selectorRef.current;
    if (reduce || !sel) { setActiveId(id); return; }

    // Brief scale pulse on the clicked card
    const card = sel.querySelector(`[data-card="${id}"]`);
    if (card) {
      gsap.to(card, { scale: 1.02, duration: 0.15, ease: 'power2.out', onComplete: () => {
        gsap.to(card, { scale: 1, duration: 0.1 });
      }});
    }

    // Fade out selector → reveal dashboard
    gsap.to(sel, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in', onComplete: () => {
      setActiveId(id);
    }});
  }

  // Animate dashboard in when activeId switches to non-null
  useLayoutEffect(() => {
    const el = dashRef.current;
    if (!el || !activeId) return;
    if (reduce) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [activeId]);

  function goBack() {
    const el = dashRef.current;
    if (reduce || !el) { setActiveId(null); setShowTooltip(true); return; }
    gsap.to(el, { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in', onComplete: () => {
      setActiveId(null);
      setShowTooltip(true);
    }});
  }

  // Re-animate selector when coming back
  useLayoutEffect(() => {
    const sel = selectorRef.current;
    if (!sel || activeId !== null) return;
    if (reduce) { gsap.set(sel, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(sel, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
  }, [activeId]);

  return (
    <section id="industry-demo" ref={rootRef} className="idemo" aria-label="Industry Demo">
      <span className="section-label" aria-hidden="true">{T(Trans.industryDemo.sectionLabel)}</span>
      <div className="container idemo__inner">

        {/* ── STEP 1: Industry Selector ── */}
        {activeId === null && (
          <div className="idemo__selector" ref={selectorRef}>
            <header className="idemo__sel-head" data-idemo-fade style={{ overflow: 'visible' }}>
              <h2 className="idemo__title" data-no-reveal style={{ clipPath: 'none', WebkitClipPath: 'none', overflow: 'visible' }}>{T(Trans.industryDemo.title)}</h2>
              <p className="idemo__sub">{T(Trans.industryDemo.subtitle)}</p>
            </header>

            <div className="idemo__hints" data-idemo-fade>
              <div className="idemo__hint">
                <span className="idemo__hint-icon">01</span>
                <span className="idemo__hint-text">{T(Trans.industryDemo.hint1)}</span>
              </div>
              <div className="idemo__hint">
                <span className="idemo__hint-icon">02</span>
                <span className="idemo__hint-text">{T(Trans.industryDemo.hint2)}</span>
              </div>
              <div className="idemo__hint">
                <span className="idemo__hint-icon">03</span>
                <span className="idemo__hint-text">{T(Trans.industryDemo.hint3)}</span>
              </div>
            </div>

            <div className="idemo__search-wrap" data-idemo-fade>
              <svg
                className="idemo__search-icon"
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                className="idemo__search"
                placeholder={T(Trans.industryDemo.searchPlaceholder)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={T(Trans.industryDemo.searchAria)}
              />
            </div>

            {!hasQuery && (
              <select
                className="idemo__dropdown"
                data-idemo-fade
                defaultValue=""
                aria-label="Select an industry"
                onChange={(e) => {
                  if (e.target.value) selectIndustry(e.target.value);
                }}
              >
                <option value="" disabled>{T(Trans.industryDemo.dropdownPlaceholder)}</option>
                {[...INDUSTRIES]
                  .sort((a, b) => labelFor(a.id).localeCompare(labelFor(b.id)))
                  .map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {labelFor(industry.id)}
                    </option>
                  ))}
              </select>
            )}

            {hasQuery && filteredIndustries.length > 0 && (
              <div className="idemo__cards" data-idemo-fade>
                {filteredIndustries.map(ind => (
                  <button key={ind.id} type="button" className="idemo__card" data-card={ind.id}
                    onClick={() => selectIndustry(ind.id)}>
                    <span className="idemo__card-icon">{ind.icon}</span>
                    <span className="idemo__card-name">{labelFor(ind.id)}</span>
                    <span className="idemo__card-desc">{descFor(ind.id)}</span>
                  </button>
                ))}
              </div>
            )}

            {hasQuery && filteredIndustries.length === 0 && (
              <div className="idemo__no-results" data-idemo-fade>
                {T(Trans.industryDemo.noResults)}{' '}
                <Link to="/contact" className="idemo__no-results-link">
                  {T(Trans.industryDemo.noResultsLink)}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Dashboard View ── */}
        {activeId !== null && (
          <div className="idemo__dash-stage" ref={dashRef}>
            <div className="idemo__dash-header">
              <button type="button" className="idemo__back-btn" onClick={goBack}>
                {T(Trans.industryDemo.backTo)}
              </button>
              <span className="idemo__breadcrumb">
                <span className="idemo__breadcrumb-root">{T(Trans.industryDemo.breadcrumbRoot)}</span>
                <span className="idemo__breadcrumb-sep">/</span>
                <span className="idemo__breadcrumb-current">{activeIndustry ? labelFor(activeIndustry.id) : ''}</span>
              </span>
            </div>
            {ActiveDash ? (
              <>
                <div className="idemo__dash-wrap">
                  {showTooltip && (
                    <div className="idash__tooltip">
                      <span>{T(Trans.industryDemo.tooltip)}</span>
                      <button className="idash__tooltip-close" onClick={() => setShowTooltip(false)} type="button">✕</button>
                    </div>
                  )}
                  <ActiveDash key={activeId} onInteract={handleInteract} />
                </div>
                <FeaturesStrip features={activeIndustry ? featuresFor(activeIndustry.id) : []} T={T} />
                <p className="idemo__sim-note">{T(Trans.industryDemo.simNote)}</p>
              </>
            ) : (
              activeIndustry && (
                <ImpactPanel
                  industry={activeIndustry}
                  industryLabel={labelFor(activeIndustry.id)}
                  T={T}
                  translatedDesc={descFor(activeIndustry.id)}
                  translatedFeatures={featuresFor(activeIndustry.id)}
                  translatedStats={impactStatsFor(activeIndustry.id)}
                />
              )
            )}
            <div className="idemo__cta">
              <h3 className="idemo__cta-title">{T(Trans.industryDemo.ctaTitle)}</h3>
              <Link to="/contact" className="btn-primary idemo__cta-btn">{T(Trans.industryDemo.talkToUs)}</Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
