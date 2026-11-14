import { FirebaseError } from 'firebase/app'

// Errors thrown on purpose; their message is safe to show to the user
export class AppError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AppError'
  }
}

export class UsernameTakenError extends AppError {
  constructor() {
    super('Ese nombre de usuario ya está en uso.')
    this.name = 'UsernameTakenError'
  }
}

const firebaseMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Ese correo electrónico ya está registrado.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/user-not-found': 'Usuario o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Ya hay una ventana de Google abierta.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes.',
  'auth/operation-not-allowed': 'Ese método de acceso no está activado en Firebase.',
  'auth/network-request-failed': 'No hay conexión con Firebase. Revisa tu internet.',
  'permission-denied': 'No tienes permiso para esta acción (revisa las reglas de Firestore).',
  'storage/unauthorized': 'No tienes permiso para subir ese archivo (revisa las reglas de Storage).',
  'storage/quota-exceeded': 'Se agotó la cuota de almacenamiento del proyecto.',
  'storage/retry-limit-exceeded': 'La subida tardó demasiado. Revisa tu conexión e inténtalo de nuevo.',
  'storage/canceled': 'La subida del archivo fue cancelada.',
  'storage/bucket-not-found': 'No se encontró el bucket de Storage. Revisa VITE_FIREBASE_STORAGE_BUCKET.',
}

export const toMessage = (error: unknown): string => {
  if (error instanceof AppError) return error.message
  if (error instanceof FirebaseError) {
    return firebaseMessages[error.code] ?? 'Ocurrió un error con Firebase. Inténtalo de nuevo.'
  }
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.'
}
