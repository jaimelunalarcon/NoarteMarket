// assets/js/login.js
(() => {
  const AUTH_KEY = 'noartemarket:user';

  // Valida dominios permitidos
  const isAllowedEmail = (email) => /^[^\s@]+@(gmail\.com|duocuc\.cl)$/i.test(email);

  // Cierra cualquier modal abierto y luego muestra el alertModal con el mensaje
  function showAlert(message) {
    const msgEl = document.getElementById('alertMessage');
    if (msgEl) msgEl.textContent = message;

    const alertModalEl = document.getElementById('alertModal');
    if (!alertModalEl) { alert(message); return; }

    const openAlert = () => {
      // pequeño tick para asegurar que Bootstrap removió el backdrop anterior
      setTimeout(() => bootstrap.Modal.getOrCreateInstance(alertModalEl).show(), 50);
    };

    const openModals = document.querySelectorAll('.modal.show');
    if (openModals.length) {
      let remaining = openModals.length;
      openModals.forEach((modalEl) => {
        modalEl.addEventListener('hidden.bs.modal', () => {
          remaining--;
          if (remaining === 0) openAlert();
        }, { once: true });
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      });
    } else {
      openAlert();
    }
  }

  // Guarda un "inicio de sesión" simple en localStorage
  function signIn(email) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, at: Date.now() }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault(); // manejamos validación manual

      const emailInput = document.getElementById('loginEmail');
      const passInput  = document.getElementById('loginPassword');

      const emailVal = (emailInput?.value || '').trim();
      const passVal  = passInput?.value || '';

      // Limpia posibles mensajes previos (si usas estilos de Bootstrap)
      emailInput?.setCustomValidity('');
      passInput?.setCustomValidity('');

      // 1) Campos faltantes
      if (!emailVal && !passVal) return showAlert('Ingresa el correo y la contraseña.');
      if (!emailVal) return showAlert('Ingresa el correo.');
      if (!passVal)  return showAlert('Ingresa la contraseña.');

      // 2) Dominio permitido
      if (!isAllowedEmail(emailVal)) return showAlert('El correo debe ser @gmail.com o @duocuc.cl.');

      // 3) Password exacta
      if (passVal !== '123456') return showAlert('Contraseña incorrecta. intenta nuevamente.');

      // 4) Éxito: guardar sesión, cerrar modal y redirigir
      signIn(emailVal);
      const loginModalEl = document.getElementById('loginModal');
      if (loginModalEl) bootstrap.Modal.getOrCreateInstance(loginModalEl).hide();

      window.location.href = 'admin.html';
    });
  });
})();
