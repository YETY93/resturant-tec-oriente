document.addEventListener('DOMContentLoaded', () => {
  console.log('Restaurante Tec Oriente - Sistema cargado');
  
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && !form.classList.contains('form-delete')) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Guardando...';
      }
    });
  });
});