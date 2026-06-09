export function turnoComprobanteTemplate(data: {
  paciente: string;
  doctor: string;
  especialidad?: string;
  fecha: string;
  hora: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; background:#f5f7fb; padding:20px;">
    
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:#1a6fc9; color:white; padding:20px; text-align:center;">
        <h2 style="margin:0;">🏥 Sistema de Turnos Médicos</h2>
        <p style="margin:5px 0 0; font-size:14px;">Comprobante de turno confirmado</p>
      </div>

      <!-- BODY -->
      <div style="padding:25px; color:#333;">
        
        <p style="font-size:15px; margin-bottom:20px;">
          Hola <b>${data.paciente}</b>, tu turno ha sido registrado correctamente.
        </p>

        <div style="background:#f0f6ff; padding:15px; border-radius:10px; margin-bottom:20px;">
          
          <p style="margin:6px 0;"><b>👨‍⚕️ Doctor:</b> ${data.doctor}</p>
          ${
            data.especialidad
              ? `<p style="margin:6px 0;"><b>📚 Especialidad:</b> ${data.especialidad}</p>`
              : ""
          }
          <p style="margin:6px 0;"><b>📅 Fecha:</b> ${data.fecha}</p>
          <p style="margin:6px 0;"><b>⏰ Hora:</b> ${data.hora}</p>

        </div>

        <p style="font-size:13px; color:#666;">
          🔔 Te recomendamos llegar 10 minutos antes de tu cita.
        </p>

        <p style="font-size:13px; color:#666;">
          Este correo es automático, por favor no responder.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#f5f7fb; padding:15px; text-align:center; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} Sistema de Turnos Médicos
      </div>

    </div>
  </div>
  `;
}