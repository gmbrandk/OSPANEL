// utils/ensureAuth.js

export async function ensureAuth() {
  // 1) Verificar si ya hay sesión válida
  const meRes = await fetch('http://localhost:5000/api/auth/me', {
    credentials: 'include',
  });

  if (meRes.ok) {
    console.info('[AUTH] Sesión ya activa');
    return true;
  }

  console.warn('[AUTH] No hay sesión, intentando login automático...');

  // 2) Hacer login automático (solo para desarrollo)
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'superadmin@example.com',
      password: 'admin123',
    }),
  });

  if (!loginRes.ok) {
    console.error('[AUTH] Error al iniciar sesión automáticamente');
    return false;
  }

  console.info('[AUTH] Sesión iniciada automáticamente');
  return true;
}
