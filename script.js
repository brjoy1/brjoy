// Interatividade básica para CTAs

document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-btn');

    ctaButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            eve  .p e entDtfault();;
            alert('Demonstração gratuita solicitada! Entraremos em contato em breve.');
        });
    });
});
