// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGACIÓN MÓVIL =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle del menú móvil
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // ===== NAVEGACIÓN ACTIVA =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ===== ANIMACIONES DE SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animateElements = document.querySelectorAll('.feature, .pastel-card, .info-card, .stat');
    animateElements.forEach(el => observer.observe(el));

    // ===== MANEJO DE FORMULARIOS =====
    
    // Formulario de pedidos personalizados
    const customForm = document.querySelector('.custom-form');
    if (customForm) {
        customForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const requiredFields = customForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b6b';
                } else {
                    field.style.borderColor = '#e1e1e1';
                }
            });

            if (isValid) {
                showNotification('¡Pedido enviado con éxito! Te contactaremos pronto.', 'success');
                customForm.reset();
            } else {
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
            }
        });
    }

    // Formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b6b';
                } else {
                    field.style.borderColor = '#e1e1e1';
                }
            });

            if (isValid) {
                showNotification('¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
                contactForm.reset();
            } else {
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
            }
        });
    }

    // Formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput.value.trim() && isValidEmail(emailInput.value)) {
                showNotification('¡Gracias por suscribirte a nuestro newsletter!', 'success');
                newsletterForm.reset();
            } else {
                showNotification('Por favor, ingresa un email válido.', 'error');
            }
        });
    }

    // ===== FUNCIÓN DE NOTIFICACIONES =====
    function showNotification(message, type) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        // Agregar al DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Cerrar notificación
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });

        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // ===== VALIDACIÓN DE EMAIL =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== BOTONES DE ORDENAR =====
    const orderButtons = document.querySelectorAll('.pastel-card .btn-primary');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pastelName = this.closest('.pastel-card').querySelector('h3').textContent;
            showNotification(`¡Gracias por tu interés en ${pastelName}! Te contactaremos pronto para confirmar tu pedido.`, 'success');
        });
    });

    // ===== SCROLL SUAVE PARA ENLACES INTERNOS =====
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== EFECTO PARALLAX EN HERO =====
    const heroImage = document.querySelector('.cake-showcase');
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }

    // ===== CONTADOR ANIMADO =====
    const stats = document.querySelectorAll('.stat .number');
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (target > 100 ? '+' : '');
        }, 20);
    }

    // Observar estadísticas para animación
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target;
                const target = parseInt(numberElement.textContent.replace('+', ''));
                animateCounter(numberElement, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // ===== EFECTO HOVER EN TARJETAS =====
    const cards = document.querySelectorAll('.pastel-card, .feature, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== LAZY LOADING PARA IMÁGENES =====
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // ===== PREVENIR ENVÍO DE FORMULARIOS VACÍOS =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredInputs = form.querySelectorAll('[required]');
            let hasEmptyFields = false;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    hasEmptyFields = true;
                    input.style.borderColor = '#ff6b6b';
                }
            });
            
            if (hasEmptyFields) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
            }
        });
    });

    // ===== EFECTO DE CARGA INICIAL =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animar elementos del hero
        const heroElements = document.querySelectorAll('.hero-text h1, .hero-text p, .hero-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 200);
        });
    });

    // ===== MENÚ HAMBURGUESA ANIMADO =====
    hamburger.addEventListener('click', function() {
        const spans = this.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (this.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    console.log('Brenda B3stia\'s Cake - Sitio web cargado exitosamente! 🎂');
    
    // ===== CALCULADORA DE PRECIOS =====
    initCalculadora();
    
    // ===== SUBIDA DE ARCHIVOS =====
    initFileUpload();
});

// ===== FUNCIONALIDAD DE LA CALCULADORA =====
function initCalculadora() {
    const tamanoSelect = document.getElementById('tamano');
    const cantidadInput = document.getElementById('cantidad');
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const precioTotalElement = document.getElementById('precio-total');
    const desgloseLista = document.getElementById('desglose-lista');
    const limpiarBtn = document.getElementById('limpiar-calculadora');
    
    let precioBase = 0;
    let precioSabores = 0;
    let precioRellenos = 0;
    let precioDecoraciones = 0;
    let cantidad = 1;
    
    // Función para calcular el precio total
    function calcularPrecio() {
        const precioTotal = (precioBase + precioSabores + precioRellenos + precioDecoraciones) * cantidad;
        precioTotalElement.textContent = precioTotal.toFixed(2);
        actualizarDesglose();
    }
    
    // Función para actualizar el desglose
    function actualizarDesglose() {
        const desgloseItems = [];
        
        if (precioBase > 0) {
            desgloseItems.push({
                nombre: 'Precio base',
                precio: precioBase
            });
        }
        
        // Obtener sabores seleccionados
        const saboresSeleccionados = document.querySelectorAll('input[name="sabores"]:checked');
        saboresSeleccionados.forEach(sabor => {
            const precio = parseFloat(sabor.dataset.precio);
            if (precio > 0) {
                desgloseItems.push({
                    nombre: sabor.parentElement.textContent.trim(),
                    precio: precio
                });
            }
        });
        
        // Obtener rellenos seleccionados
        const rellenosSeleccionados = document.querySelectorAll('input[name="rellenos"]:checked');
        rellenosSeleccionados.forEach(relleno => {
            const precio = parseFloat(relleno.dataset.precio);
            desgloseItems.push({
                nombre: relleno.parentElement.textContent.trim(),
                precio: precio
            });
        });
        
        // Obtener decoraciones seleccionadas
        const decoracionesSeleccionadas = document.querySelectorAll('input[name="decoraciones"]:checked');
        decoracionesSeleccionadas.forEach(decoracion => {
            const precio = parseFloat(decoracion.dataset.precio);
            desgloseItems.push({
                nombre: decoracion.parentElement.textContent.trim(),
                precio: precio
            });
        });
        
        // Mostrar desglose
        if (desgloseItems.length === 0) {
            desgloseLista.innerHTML = '<p class="no-seleccion">Selecciona opciones para ver el desglose</p>';
        } else {
            let desgloseHTML = '';
            let subtotal = 0;
            
            desgloseItems.forEach(item => {
                subtotal += item.precio;
                desgloseHTML += `
                    <div class="desglose-item">
                        <span>${item.nombre}</span>
                        <span>$${item.precio.toFixed(2)}</span>
                    </div>
                `;
            });
            
            desgloseHTML += `
                <div class="desglose-item">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="desglose-item">
                    <span>Cantidad</span>
                    <span>×${cantidad}</span>
                </div>
            `;
            
            desgloseLista.innerHTML = desgloseHTML;
        }
    }
    
    // Event listeners
    tamanoSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        precioBase = selectedOption.dataset.precio ? parseFloat(selectedOption.dataset.precio) : 0;
        calcularPrecio();
    });
    
    cantidadInput.addEventListener('change', function() {
        cantidad = parseInt(this.value) || 1;
        calcularPrecio();
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const precio = parseFloat(this.dataset.precio) || 0;
            const categoria = this.name;
            
            if (this.checked) {
                if (categoria === 'sabores') {
                    precioSabores += precio;
                } else if (categoria === 'rellenos') {
                    precioRellenos += precio;
                } else if (categoria === 'decoraciones') {
                    precioDecoraciones += precio;
                }
            } else {
                if (categoria === 'sabores') {
                    precioSabores -= precio;
                } else if (categoria === 'rellenos') {
                    precioRellenos -= precio;
                } else if (categoria === 'decoraciones') {
                    precioDecoraciones -= precio;
                }
            }
            
                    calcularPrecio();
        });
    });
    
    // Botón limpiar
    limpiarBtn.addEventListener('click', function() {
        tamanoSelect.value = '';
        cantidadInput.value = 1;
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        precioBase = 0;
        precioSabores = 0;
        precioRellenos = 0;
        precioDecoraciones = 0;
        cantidad = 1;
        
        calcularPrecio();
    });
}

// ===== FUNCIONALIDAD DE SUBIDA DE ARCHIVOS =====
function initFileUpload() {
    const fileInput = document.getElementById('foto-referencia');
    const filePreview = document.getElementById('file-preview');
    const previewImage = document.getElementById('preview-image');
    const removeFileBtn = document.getElementById('remove-file');
    
    if (!fileInput) return;
    
    // Manejar selección de archivo
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                showNotification('Por favor, selecciona solo archivos de imagen.', 'error');
                return;
            }
            
            // Validar tamaño (5MB máximo)
            const maxSize = 5 * 1024 * 1024; // 5MB en bytes
            if (file.size > maxSize) {
                showNotification('El archivo es demasiado grande. Máximo 5MB.', 'error');
                return;
            }
            
            // Crear URL para vista previa
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                filePreview.style.display = 'block';
                
                // Animar la aparición
                filePreview.style.opacity = '0';
                filePreview.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    filePreview.style.transition = 'all 0.3s ease';
                    filePreview.style.opacity = '1';
                    filePreview.style.transform = 'translateY(0)';
                }, 10);
            };
            reader.readAsDataURL(file);
            
            showNotification('Imagen cargada exitosamente. Puedes ver la vista previa.', 'success');
        }
    });
    
    // Manejar eliminación de archivo
    removeFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        filePreview.style.display = 'none';
        previewImage.src = '';
        
        showNotification('Imagen eliminada.', 'success');
    });
    
    // Drag and drop functionality
    const uploadLabel = document.querySelector('.file-upload-label');
    
    uploadLabel.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#F4A7B9';
        this.style.background = 'rgba(244, 167, 185, 0.1)';
    });
    
    uploadLabel.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.background = '';
    });
    
    uploadLabel.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });
    
    // Botón limpiar
    limpiarBtn.addEventListener('click', function() {
        tamanoSelect.value = '';
        cantidadInput.value = 1;
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        precioBase = 0;
        precioSabores = 0;
        precioRellenos = 0;
        precioDecoraciones = 0;
        cantidad = 1;
        
        calcularPrecio();
    });
}

// ===== FUNCIONALIDAD DE SUBIDA DE ARCHIVOS =====
function initFileUpload() {
    const fileInput = document.getElementById('foto-referencia');
    const filePreview = document.getElementById('file-preview');
    const previewImage = document.getElementById('preview-image');
    const removeFileBtn = document.getElementById('remove-file');
    
    if (!fileInput) return;
    
    // Manejar selección de archivo
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                showNotification('Por favor, selecciona solo archivos de imagen.', 'error');
                return;
            }
            
            // Validar tamaño (5MB máximo)
            const maxSize = 5 * 1024 * 1024; // 5MB en bytes
            if (file.size > maxSize) {
                showNotification('El archivo es demasiado grande. Máximo 5MB.', 'error');
                return;
            }
            
            // Crear URL para vista previa
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                filePreview.style.display = 'block';
                
                // Animar la aparición
                filePreview.style.opacity = '0';
                filePreview.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    filePreview.style.transition = 'all 0.3s ease';
                    filePreview.style.opacity = '1';
                    filePreview.style.transform = 'translateY(0)';
                }, 10);
            };
            reader.readAsDataURL(file);
            
            showNotification('Imagen cargada exitosamente. Puedes ver la vista previa.', 'success');
        }
    });
    
    // Manejar eliminación de archivo
    removeFileBtn.addEventListener('click', function() {
        fileInput.value = '';
        filePreview.style.display = 'none';
        previewImage.src = '';
        
        showNotification('Imagen eliminada.', 'success');
    });
    
    // Drag and drop functionality
    const uploadLabel = document.querySelector('.file-upload-label');
    
    if (uploadLabel) {
        uploadLabel.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#F4A7B9';
            this.style.background = 'rgba(244, 167, 185, 0.1)';
        });
        
        uploadLabel.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
        });
        
        uploadLabel.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
}

 