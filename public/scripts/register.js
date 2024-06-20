// User Role Selector
function selectUserRole(event, role) {
    console.log('Selected role:', role);
    document.getElementById('role').value = role;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card !== event.currentTarget) {
            card.style.opacity = '0.5';
            card.style.border = '1px solid var(--secondary-color-light)';
            card.removeEventListener('click', selectUserRole);
        } else {
            card.style.opacity = '1';
            card.style.border = '3px solid var(--primary-color)';
            card.classList.add('selected');
        }
    });
}