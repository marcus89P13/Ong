function initMobileMenu() {
    const btnMobile = document.getElementById('btn-mobile');
    const nav = document.getElementById('main-nav');

    if (btnMobile && nav) {
        btnMobile.addEventListener('click', () => {
            btnMobile.classList.toggle('active');
            nav.classList.toggle('active');

            const isActive = nav.classList.contains('active');
            btnMobile.setAttribute('aria-expanded', isActive);
            if (isActive) {
                btnMobile.setAttribute('aria-label', 'Fechar Menu');
            } else {
                btnMobile.setAttribute('aria-label', 'Abrir Menu');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initMobileMenu);

function initDonationTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const paymentPanels = document.querySelectorAll('.payment-panel');

    // Verifica se os elementos existem na página atual
    if (tabLinks.length === 0 || paymentPanels.length === 0) {
        return; // Não executa se não estiver na página de doação
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            
            // 1. Remove 'active' de todos os links e painéis
            tabLinks.forEach(btn => btn.classList.remove('active'));
            paymentPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.classList.add('hidden');
            });

            // 2. Adiciona 'active' apenas no link clicado
            link.classList.add('active');

            // 3. Mostra o painel correspondente
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.classList.remove('hidden');
            }
        });
    });
}

// Atualize o listener do DOMContentLoaded para chamar ambas as funções
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDonationTabs();
});

function initFilters(navSelector, itemSelector) {
    const filterNav = document.querySelector(navSelector);
    const filterItems = document.querySelectorAll(itemSelector);

    // Guarda: Se os elementos não existirem nesta página, não faz nada.
    if (!filterNav || filterItems.length === 0) {
        return;
    }

    const filterButtons = filterNav.querySelectorAll('.btn-filter');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const filterValue = button.getAttribute('data-filter');

            // 1. Atualiza o estado ativo dos botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Mostra ou esconde os itens
            filterItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category');
                
                // A mágica está aqui:
                // Se o filtro for 'todos' OU 
                // se as categorias do item INCLUÍREM o valor do filtro
                if (filterValue === 'todos' || filterValue === 'todas' || itemCategories.includes(filterValue)) {
                    item.classList.remove('hidden-filter');
                } else {
                    item.classList.add('hidden-filter');
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDonationTabs();
    
    // Chama a função de filtro para a página de Projetos
    initFilters('.project-filters .filter-nav', '.project-list-item');
    
    // Chama a MESMA função de filtro para a página de Voluntariado
    initFilters('.project-filters .filter-nav', '.opportunity-card');
});


// --- Funções Auxiliares de Validação ---

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.form-error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    const errorMessage = formGroup.querySelector('.form-error-message');
    if (errorMessage) {
        errorMessage.textContent = ''; // Limpa a mensagem
    }
}

function isValidEmail(email) {
    // Expressão regular simples para validação de e-mail
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getFieldName(input) {
    // Pega o nome do <label> ou o ID do input
    const label = input.parentElement.querySelector('label');
    return label ? label.textContent : input.id;
}


// --- Função Principal de Validação ---

function initFormValidation(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) {
        return; // Não executa se o formulário não estiver na página
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio real
        
        let isFormValid = true;
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            const value = input.value.trim();
            
            if (value === '') {
                // Erro: Campo vazio
                isFormValid = false;
                showError(input, `O campo "${getFieldName(input)}" é obrigatório.`);
            } else if (input.type === 'email' && !isValidEmail(value)) {
                // Erro: E-mail inválido
                isFormValid = false;
                showError(input, 'Por favor, insira um e-mail válido.');
            } else {
                // Sucesso: Campo válido
                showSuccess(input);
            }
        });

        if (isFormValid) {
            // SIMULAÇÃO DE ENVIO
            console.log(`Formulário ${formSelector} enviado com sucesso!`);
            alert('Mensagem enviada com sucesso! (Simulação)');
            form.reset(); // Limpa o formulário
            // Remove classes de sucesso
            form.querySelectorAll('.form-group.success').forEach(fg => fg.classList.remove('success'));
        }
    });
}

// --- Atualize o listener do DOMContentLoaded ---

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDonationTabs();
    
    initFilters('.project-filters .filter-nav', '.project-list-item');
    initFilters('.project-filters .filter-nav', '.opportunity-card');
    
    // Chama a validação para cada formulário
    initFormValidation('#contact-form');
    initFormValidation('#donation-form');
    initFormValidation('#volunteer-form');
});