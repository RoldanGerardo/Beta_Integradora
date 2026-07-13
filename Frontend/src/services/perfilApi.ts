export type ActualizarPerfilPayload = {
  nombre?: string;
  email?: string;
  avatar?: File;
};

export type ActualizarPasswordPayload = {
  passwordActual: string;
  passwordNueva: string;
};

/**
 * Simulación de API para actualizar el perfil del usuario.
 * Reemplazar el interior con un fetch o axios hacia el backend real.
 */
export async function actualizarPerfilUsuario(
  token: string,
  data: ActualizarPerfilPayload
): Promise<{ mensaje: string; usuario: any }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mensaje: "Perfil actualizado correctamente",
        usuario: { nombre: data.nombre, email: data.email },
      });
    }, 1200);
  });
}

/**
 * Simulación de API para actualizar la contraseña.
 */
export async function actualizarPasswordUsuario(
  token: string,
  data: ActualizarPasswordPayload
): Promise<{ mensaje: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulación de validación (puedes cambiar esta lógica en tu backend)
      if (data.passwordNueva.length < 6) {
        reject(new Error("La nueva contraseña debe tener al menos 6 caracteres."));
      } else {
        resolve({ mensaje: "Contraseña actualizada con éxito" });
      }
    }, 1500);
  });
}