// assets/js/utils.js
window.showAlert = function(message) {
  const msgEl = document.getElementById('alertMessage');
  if (msgEl) msgEl.textContent = message;

  const alertModalEl = document.getElementById('alertModal');
  if (!alertModalEl) return;

  // Si hay modales abiertos, ciérralos y cuando terminen, abre el de alerta
  const openModals = document.querySelectorAll('.modal.show');
  if (openModals.length) {
    let remaining = openModals.length;

    const openAlert = () => {
      // Pequeño "tick" para asegurar que Bootstrap removió el backdrop
      setTimeout(() => bootstrap.Modal.getOrCreateInstance(alertModalEl).show(), 50);
    };

    openModals.forEach((modalEl) => {
      modalEl.addEventListener('hidden.bs.modal', () => {
        remaining--;
        if (remaining === 0) openAlert();
      }, { once: true });

      bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
  } else {
    bootstrap.Modal.getOrCreateInstance(alertModalEl).show();
  }
};
