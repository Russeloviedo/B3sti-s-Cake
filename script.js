// ===== FUNCIONES GLOBALES =====

// Función global para mostrar notificaciones
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
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
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

// Función global para verificar contraseña
function checkPassword() {
    const passwordInput = document.getElementById('adminPassword');
    const passwordError = document.getElementById('passwordError');
    const password = passwordInput.value.trim();
    
    if (password === '123') {
        // Contraseña correcta
        closePasswordModal();
        openAdminPanel();
        showNotification('Acceso autorizado al panel de administrador', 'success');
    } else {
        // Contraseña incorrecta
        passwordError.style.display = 'flex';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Animar el input
        passwordInput.style.borderColor = '#dc3545';
        setTimeout(() => {
            passwordInput.style.borderColor = '#e1e1e1';
        }, 1000);
    }
}

// Función global para exportar pedidos a PDF
async function exportarPedidos() {
    try {
        console.log('Iniciando exportación de PDF...');
        
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            console.error('jsPDF no está cargado');
            showNotification('Error: jsPDF no está disponible', 'error');
            return;
        }
        
        const pedidos = cargarPedidosDesdeLocalStorage();
        console.log('Pedidos cargados:', pedidos);
        
        if (pedidos.length === 0) {
            showNotification('No hay pedidos para exportar', 'error');
            return;
        }
        
        showNotification('Generando PDF...', 'success');
        
        // Crear el PDF - intentar diferentes formas de acceder a jsPDF
        let jsPDF;
        if (typeof window.jspdf !== 'undefined') {
            jsPDF = window.jspdf.jsPDF;
        } else if (typeof window.jsPDF !== 'undefined') {
            jsPDF = window.jsPDF;
        } else {
            throw new Error('jsPDF no está disponible');
        }
        
        const doc = new jsPDF();
        
        // Configurar fuente y colores
        doc.setFont('helvetica');
        doc.setFontSize(20);
        doc.setTextColor(244, 167, 185); // Color rosa de la marca
        
        // Título del documento
        doc.text('B3stia\'s Cake - Reporte de Pedidos', 20, 30);
        
        // Línea decorativa
        doc.setDrawColor(244, 167, 185);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        // Información del reporte
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`, 20, 45);
        doc.text(`Total de pedidos: ${pedidos.length}`, 20, 55);
        
        let yPosition = 75;
        let pageNumber = 1;
        
        // Procesar cada pedido
        for (let i = 0; i < pedidos.length; i++) {
            const pedido = pedidos[i];
            
            // Verificar si necesitamos una nueva página
            if (yPosition > 250) {
                doc.addPage();
                pageNumber++;
                yPosition = 20;
                
                // Encabezado de página
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                doc.text(`Página ${pageNumber}`, 20, 15);
            }
            
            // Título del pedido
            doc.setFontSize(16);
            doc.setTextColor(244, 167, 185);
            doc.text(`Pedido #${pedido.id}`, 20, yPosition);
            
            yPosition += 10;
            
            // Información del cliente
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.text(`Cliente: ${pedido.nombre}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Email: ${pedido.email}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Teléfono: ${pedido.telefono}`, 20, yPosition);
            yPosition += 10;
            
            // Detalles del pastel
            doc.setFontSize(11);
            doc.text(`Sabor: ${pedido.sabor}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Tamaño: ${pedido.tamaño}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Decoración: ${pedido.decoracion}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Fecha de entrega: ${pedido.fechaEntrega}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Estado: ${pedido.estado}`, 20, yPosition);
            yPosition += 10;
            
            // Mensaje adicional
            if (pedido.mensaje && pedido.mensaje.trim()) {
                doc.text(`Mensaje: ${pedido.mensaje}`, 20, yPosition);
                yPosition += 10;
            }
            
            // Agregar imagen si existe
            if (pedido.imagen) {
                try {
                    // Crear un elemento temporal para cargar la imagen
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = pedido.imagen;
                    });
                    
                    // Convertir imagen a canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Agregar imagen al PDF
                    const imgData = canvas.toDataURL('image/jpeg', 0.8);
                    const imgWidth = 60;
                    const imgHeight = (img.height * imgWidth) / img.width;
                    
                    if (yPosition + imgHeight > 250) {
                        doc.addPage();
                        pageNumber++;
                        yPosition = 20;
                    }
                    
                    doc.addImage(imgData, 'JPEG', 20, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 10;
                    
                } catch (error) {
                    console.error('Error al procesar imagen:', error);
                    doc.text('Imagen no disponible', 20, yPosition);
                    yPosition += 6;
                }
            }
            
            // Línea separadora
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 15;
        }
        
        // Pie de página
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('B3stia\'s Cake - Pastelería Artesanal', 20, 280);
        
        // Guardar el PDF
        const fileName = `pedidos_b3stias_cake_${new Date().toISOString().split('T')[0]}.pdf`;
        console.log('Guardando PDF con nombre:', fileName);
        doc.save(fileName);
        
        console.log('PDF guardado exitosamente');
        showNotification('PDF generado y descargado correctamente', 'success');
        
    } catch (error) {
        console.error('Error al exportar pedidos a PDF:', error);
        showNotification('Error al generar el PDF', 'error');
    }
}

// Función global de prueba para verificar PDF
function testPDF() {
    try {
        console.log('Iniciando prueba de PDF...');
        
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            console.error('jsPDF no está cargado');
            showNotification('Error: jsPDF no está disponible', 'error');
            return;
        }
        
        // Intentar diferentes formas de acceder a jsPDF
        let jsPDF;
        if (typeof window.jspdf !== 'undefined') {
            jsPDF = window.jspdf.jsPDF;
        } else if (typeof window.jsPDF !== 'undefined') {
            jsPDF = window.jsPDF;
        } else {
            throw new Error('jsPDF no está disponible');
        }
        
        console.log('jsPDF disponible, creando documento de prueba...');
        
        // Crear un PDF simple de prueba
        const doc = new jsPDF();
        doc.setFont('helvetica');
        doc.setFontSize(20);
        doc.text('Prueba de PDF - B3stia\'s Cake', 20, 30);
        doc.setFontSize(12);
        doc.text('Este es un documento de prueba', 20, 50);
        doc.text(`Fecha: ${new Date().toLocaleString('es-ES')}`, 20, 70);
        
        const fileName = `test_pdf_${new Date().toISOString().split('T')[0]}.pdf`;
        console.log('Guardando PDF de prueba:', fileName);
        doc.save(fileName);
        
        console.log('PDF de prueba guardado exitosamente');
        showNotification('PDF de prueba generado correctamente', 'success');
        
    } catch (error) {
        console.error('Error en prueba de PDF:', error);
        showNotification('Error en prueba de PDF: ' + error.message, 'error');
    }
}

// Función global para verificar el estado de las librerías PDF
function verificarLibreriasPDF() {
    console.log('=== Verificación de Librerías PDF ===');
    console.log('window.jspdf:', typeof window.jspdf);
    console.log('window.jsPDF:', typeof window.jsPDF);
    
    if (typeof window.jspdf !== 'undefined') {
        console.log('window.jspdf.jsPDF:', typeof window.jspdf.jsPDF);
    }
    
    if (typeof window.jsPDF !== 'undefined') {
        console.log('window.jsPDF disponible');
    }
    
    console.log('html2canvas:', typeof window.html2canvas);
    console.log('===============================');
    
    let mensaje = 'Estado de librerías:\n';
    mensaje += `jsPDF: ${typeof window.jspdf !== 'undefined' ? 'Cargado' : 'No cargado'}\n`;
    mensaje += `html2canvas: ${typeof window.html2canvas !== 'undefined' ? 'Cargado' : 'No cargado'}`;
    
    showNotification(mensaje, 'info');
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar que las librerías PDF se carguen correctamente
    setTimeout(() => {
        console.log('=== Verificación inicial de librerías ===');
        console.log('jsPDF disponible:', typeof window.jspdf !== 'undefined' || typeof window.jsPDF !== 'undefined');
        console.log('html2canvas disponible:', typeof window.html2canvas !== 'undefined');
    }, 1000);
    
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
                // Recopilar datos del formulario
                const formData = new FormData(customForm);
                
                // Capturar la imagen si existe
                const imagenInput = customForm.querySelector('#foto-referencia');
                let imagenUrl = '';
                
                if (imagenInput && imagenInput.files && imagenInput.files[0]) {
                    const file = imagenInput.files[0];
                    imagenUrl = URL.createObjectURL(file);
                }
                
                // Recopilar datos detallados del formulario
                const saboresSeleccionados = Array.from(document.querySelectorAll('.custom-form input[name="sabores"]:checked'))
                    .map(checkbox => checkbox.parentElement.textContent.trim());
                
                const rellenosSeleccionados = Array.from(document.querySelectorAll('.custom-form input[name="rellenos"]:checked'))
                    .map(checkbox => checkbox.parentElement.textContent.trim());
                
                const decoracionesSeleccionadas = Array.from(document.querySelectorAll('.custom-form input[name="decoraciones"]:checked'))
                    .map(checkbox => checkbox.parentElement.textContent.trim());
                
                const cantidad = formData.get('cantidad') || '1';
                const decoracionEspecial = formData.get('decoracion-especial') || '';
                const precioTotal = document.getElementById('precio-total-personalizado')?.textContent || '0';
                
                const pedidoData = {
                    id: Date.now(), // ID único basado en timestamp
                    fecha: new Date().toLocaleString(),
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    tamaño: formData.get('tamaño'),
                    sabores: saboresSeleccionados,
                    rellenos: rellenosSeleccionados,
                    decoraciones: decoracionesSeleccionadas,
                    cantidad: cantidad,
                    decoracionEspecial: decoracionEspecial,
                    precioTotal: precioTotal,
                    fechaEntrega: formData.get('fecha'),
                    mensaje: formData.get('mensaje'),
                    imagen: imagenUrl,
                    estado: 'Pendiente'
                };
                
                // Agregar el pedido al panel de administrador
                agregarPedidoAlPanel(pedidoData);
                
                // Mostrar notificación de éxito
                showNotification('¡Pedido enviado con éxito! Te contactaremos pronto.', 'success');
                
                // Limpiar solo los campos de error visual
                requiredFields.forEach(field => {
                    field.style.borderColor = '#e1e1e1';
                });
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
    

    
    // ===== CALCULADORA DE PRECIOS EN PEDIDOS PERSONALIZADOS =====
    initCalculadoraPersonalizados();
    
    // ===== SUBIDA DE ARCHIVOS =====
    initFileUpload();
});



// ===== FUNCIONALIDAD DE CALCULADORA EN PEDIDOS PERSONALIZADOS =====
function initCalculadoraPersonalizados() {
    function calcularPrecioPersonalizados() {
        const tamanoSelect = document.getElementById('tamaño');
        const cantidadInput = document.getElementById('cantidad');
        const precioTotalElement = document.getElementById('precio-total-personalizado');
        const desgloseElement = document.getElementById('desglose-lista-personalizado');
        
        if (!tamanoSelect || !cantidadInput || !precioTotalElement || !desgloseElement) {
            return; // Elementos no encontrados
        }
        
        let precioBase = 0;
        let precioAdicional = 0;
        const desglose = [];
        
        // Calcular precio base por tamaño
        if (tamanoSelect.value) {
            const tamanoOption = tamanoSelect.options[tamanoSelect.selectedIndex];
            precioBase = parseInt(tamanoOption.getAttribute('data-precio')) || 0;
            desglose.push({
                item: tamanoOption.text,
                precio: precioBase
            });
        }
        
        // Calcular precio por sabores seleccionados
        const saboresSeleccionados = document.querySelectorAll('.custom-form input[name="sabores"]:checked');
        saboresSeleccionados.forEach(checkbox => {
            const precio = parseInt(checkbox.getAttribute('data-precio')) || 0;
            precioAdicional += precio;
            if (precio > 0) {
                desglose.push({
                    item: checkbox.parentElement.textContent.trim(),
                    precio: precio
                });
            }
        });
        
        // Calcular precio por rellenos seleccionados
        const rellenosSeleccionados = document.querySelectorAll('.custom-form input[name="rellenos"]:checked');
        rellenosSeleccionados.forEach(checkbox => {
            const precio = parseInt(checkbox.getAttribute('data-precio')) || 0;
            precioAdicional += precio;
            desglose.push({
                item: checkbox.parentElement.textContent.trim(),
                precio: precio
            });
        });
        
        // Calcular precio por decoraciones seleccionadas
        const decoracionesSeleccionadas = document.querySelectorAll('.custom-form input[name="decoraciones"]:checked');
        decoracionesSeleccionadas.forEach(checkbox => {
            const precio = parseInt(checkbox.getAttribute('data-precio')) || 0;
            precioAdicional += precio;
            desglose.push({
                item: checkbox.parentElement.textContent.trim(),
                precio: precio
            });
        });
        
        // Calcular precio total
        const cantidad = parseInt(cantidadInput.value) || 1;
        const precioTotal = (precioBase + precioAdicional) * cantidad;
        
        // Actualizar precio total
        precioTotalElement.textContent = precioTotal;
        
        // Actualizar desglose
        if (desglose.length > 0) {
            let desgloseHTML = '';
            desglose.forEach(item => {
                desgloseHTML += `
                    <div class="desglose-item">
                        <span>${item.item}</span>
                        <span>$${item.precio}</span>
                    </div>
                `;
            });
            desgloseHTML += `
                <div class="desglose-item" style="border-top: 1px solid #ddd; padding-top: 5px; font-weight: bold;">
                    <span>Total por unidad</span>
                    <span>$${precioBase + precioAdicional}</span>
                </div>
            `;
            if (cantidad > 1) {
                desgloseHTML += `
                    <div class="desglose-item" style="font-weight: bold; color: var(--color-primary);">
                        <span>Cantidad: ${cantidad}</span>
                        <span>$${precioTotal}</span>
                    </div>
                `;
            }
            desgloseElement.innerHTML = desgloseHTML;
        } else {
            desgloseElement.innerHTML = '<p class="no-seleccion">Selecciona opciones para ver el desglose</p>';
        }
    }
    
    // Event listeners para la calculadora de pedidos personalizados
    const tamanoSelect = document.getElementById('tamaño');
    const cantidadInput = document.getElementById('cantidad');
    
    if (tamanoSelect) {
        tamanoSelect.addEventListener('change', calcularPrecioPersonalizados);
    }
    
    if (cantidadInput) {
        cantidadInput.addEventListener('change', calcularPrecioPersonalizados);
    }
    
    // Event listeners para checkboxes en pedidos personalizados
    const checkboxesPersonalizados = document.querySelectorAll('.custom-form input[type="checkbox"]');
    checkboxesPersonalizados.forEach(checkbox => {
        checkbox.addEventListener('change', calcularPrecioPersonalizados);
    });
    
    // Calcular precio inicial
    calcularPrecioPersonalizados();
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

// ===== FUNCIONALIDAD DEL TRIPLE CLIC PARA ADMINISTRADOR =====

// Variables para el sistema de triple clic
let clickCount = 0;
let clickTimer = null;
const TRIPLE_CLICK_DELAY = 500; // 500ms para considerar triple clic

// Función para manejar el clic en el logo
function handleLogoClick() {
    clickCount++;
    
    // Limpiar timer anterior si existe
    if (clickTimer) {
        clearTimeout(clickTimer);
    }
    
    // Si es el primer clic, iniciar timer
    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            // Si no se completó el triple clic, resetear contador
            if (clickCount < 3) {
                clickCount = 0;
            }
        }, TRIPLE_CLICK_DELAY);
    }
    
    // Si se completó el triple clic
    if (clickCount === 3) {
        clickCount = 0; // Resetear contador
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        
        // Mostrar modal de contraseña
        showPasswordModal();
    } else if (clickCount === 2) {
        // Mostrar indicador sutil para el segundo clic
        showTripleClickIndicator();
    }
}

// ===== FUNCIONALIDAD DEL MODAL DE CONTRASEÑA =====

// Función para mostrar el modal de contraseña
function showPasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    passwordModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Enfocar el input de contraseña
    const passwordInput = document.getElementById('adminPassword');
    passwordInput.focus();
    
    // Limpiar campos anteriores
    passwordInput.value = '';
    document.getElementById('passwordError').style.display = 'none';
}

// Función para cerrar el modal de contraseña
function closePasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    passwordModal.classList.remove('active');
    document.body.style.overflow = '';
}



// Event listeners para el modal de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('adminPassword');
    
    // Cerrar modal al hacer clic fuera de él
    passwordModal.addEventListener('click', function(e) {
        if (e.target === passwordModal) {
            closePasswordModal();
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && passwordModal.classList.contains('active')) {
            closePasswordModal();
        }
    });
    
    // Ingresar con Enter
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});

// ===== FUNCIONALIDAD DEL PANEL DE ADMINISTRADOR =====

// Función para abrir el panel de administrador
function openAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    // Cargar datos de pedidos (simulado)
    cargarPedidos();
}

// Función para cerrar el panel de administrador
function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll del body
}

// Función para cambiar entre tabs
function showTab(tabName) {
    // Ocultar todos los tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Desactivar todos los botones de tab
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Mostrar el tab seleccionado
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activar el botón correspondiente
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Función para cargar pedidos (simulado)
function cargarPedidos() {
    const pedidos = cargarPedidosDesdeLocalStorage();
    const pedidosLista = document.querySelector('.pedidos-lista');
    
    if (!pedidosLista) {
        console.error('No se encontró la lista de pedidos en el panel de administrador');
        return;
    }
    
    // Limpiar la lista actual
    pedidosLista.innerHTML = '';
    
    if (pedidos.length === 0) {
        pedidosLista.innerHTML = `
            <div class="pedido-item vacio">
                <div class="pedido-info">
                    <p>No hay pedidos registrados</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Agregar cada pedido a la lista
    pedidos.forEach(pedido => {
        const pedidoHTML = `
            <div class="pedido-item" data-pedido-id="${pedido.id}">
                <div class="pedido-info">
                    <div class="pedido-header">
                        <h4>Pedido #${pedido.id}</h4>
                        <span class="pedido-fecha">${pedido.fecha}</span>
                    </div>
                    <div class="pedido-detalles">
                        <p><strong>Cliente:</strong> ${pedido.nombre}</p>
                        <p><strong>Contacto:</strong> ${pedido.email} | ${pedido.telefono}</p>
                        <p><strong>Pastel:</strong> ${pedido.sabor} - ${pedido.tamaño}</p>
                        <p><strong>Decoración:</strong> ${pedido.decoracion}</p>
                        <p><strong>Entrega:</strong> ${pedido.fechaEntrega}</p>
                        ${pedido.mensaje ? `<p><strong>Mensaje:</strong> ${pedido.mensaje}</p>` : ''}
                    </div>
                </div>
                <div class="pedido-estado ${pedido.estado.toLowerCase().replace(' ', '-')}">${pedido.estado}</div>
                <div class="pedido-acciones">
                    <button class="btn-accion btn-ver" onclick="verPedido('${pedido.id}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-accion btn-estado" onclick="cambiarEstado('${pedido.id}')">
                        ${pedido.estado === 'Pendiente' ? '<i class="fas fa-play"></i> Iniciar' : 
                          pedido.estado === 'En proceso' ? '<i class="fas fa-check"></i> Completar' : 
                          '<i class="fas fa-check"></i> Completado'}
                    </button>
                </div>
            </div>
        `;
        
        pedidosLista.insertAdjacentHTML('beforeend', pedidoHTML);
    });
    
    console.log('Pedidos cargados desde localStorage:', pedidos.length);
}

// Función para ver detalles de un pedido
function verPedido(pedidoId) {
    // Buscar el pedido completo en localStorage
    const pedidos = cargarPedidosDesdeLocalStorage();
    const pedido = pedidos.find(p => p.id == pedidoId);
    
    if (!pedido) {
        showNotification('Pedido no encontrado', 'error');
        return;
    }
    
    // Crear el modal de detalles del pedido
    const modalHTML = `
        <div id="pedidoModal" class="pedido-modal">
            <div class="pedido-modal-content">
                <div class="pedido-modal-header">
                    <h2>Pedido #${pedidoId}</h2>
                    <button class="close-pedido-btn" onclick="closePedidoModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="pedido-modal-body">
                    <div class="pedido-section">
                        <h3>Información del Cliente</h3>
                        <div class="pedido-info-grid">
                            <div class="pedido-info-item">
                                <strong>Nombre:</strong>
                                <span>${pedido.nombre}</span>
                            </div>
                            <div class="pedido-info-item">
                                <strong>Email:</strong>
                                <span>${pedido.email}</span>
                            </div>
                            <div class="pedido-info-item">
                                <strong>Teléfono:</strong>
                                <span>${pedido.telefono}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pedido-section">
                        <h3>Detalles del Pastel</h3>
                        <div class="pedido-info-grid">
                            <div class="pedido-info-item">
                                <strong>Tamaño:</strong>
                                <span>${pedido.tamaño}</span>
                            </div>
                            <div class="pedido-info-item">
                                <strong>Cantidad:</strong>
                                <span>${pedido.cantidad || '1'}</span>
                            </div>
                            <div class="pedido-info-item">
                                <strong>Precio Total:</strong>
                                <span>$${pedido.precioTotal || '0'}</span>
                            </div>
                            <div class="pedido-info-item">
                                <strong>Fecha de Entrega:</strong>
                                <span>${pedido.fechaEntrega}</span>
                            </div>
                        </div>
                        
                        ${pedido.sabores && pedido.sabores.length > 0 ? `
                        <div class="pedido-info-item full-width">
                            <strong>Sabores Seleccionados:</strong>
                            <span>${pedido.sabores.join(', ')}</span>
                        </div>
                        ` : ''}
                        
                        ${pedido.rellenos && pedido.rellenos.length > 0 ? `
                        <div class="pedido-info-item full-width">
                            <strong>Rellenos Seleccionados:</strong>
                            <span>${pedido.rellenos.join(', ')}</span>
                        </div>
                        ` : ''}
                        
                        ${pedido.decoraciones && pedido.decoraciones.length > 0 ? `
                        <div class="pedido-info-item full-width">
                            <strong>Decoraciones Seleccionadas:</strong>
                            <span>${pedido.decoraciones.join(', ')}</span>
                        </div>
                        ` : ''}
                        
                        ${pedido.decoracionEspecial ? `
                        <div class="pedido-info-item full-width">
                            <strong>Decoración Especial:</strong>
                            <span>${pedido.decoracionEspecial}</span>
                        </div>
                        ` : ''}
                        
                        ${pedido.mensaje ? `
                        <div class="pedido-info-item full-width">
                            <strong>Mensaje Especial:</strong>
                            <span>${pedido.mensaje}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="pedido-section">
                        <h3>Imagen de Referencia</h3>
                        <div class="pedido-image-section">
                            ${pedido.imagen ? `
                            <div class="pedido-image-container">
                                <img src="${pedido.imagen}" alt="Imagen de referencia del pastel" />
                            </div>
                            ` : `
                            <div class="pedido-no-image">
                                <img src="Public/logo.jpg" alt="B3stia's Cake Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px;" />
                                <p>No se proporcionó imagen de referencia</p>
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar el modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar el modal
    const modal = document.getElementById('pedidoModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Event listener para cerrar al hacer clic fuera del modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePedidoModal();
        }
    });
    
    // Event listener para cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closePedidoModal();
        }
    });
}

// Función para cerrar el modal de detalles del pedido
function closePedidoModal() {
    const modal = document.getElementById('pedidoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remover el modal del DOM después de la animación
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
}

// Función para editar un pedido
function editarPedido(pedidoId) {
    showNotification(`Editando pedido #${pedidoId}`, 'success');
    // Aquí se podría abrir un formulario de edición
}

// Función para cambiar el estado de un pedido
function cambiarEstado(pedidoId) {
    const pedidoItem = document.querySelector(`[onclick="verPedido('${pedidoId}')"]`).closest('.pedido-item');
    const estadoElement = pedidoItem.querySelector('.pedido-estado');
    const btnEstado = pedidoItem.querySelector('.btn-estado');
    
    let nuevoEstado = '';
    
    // Simular cambio de estado
    if (estadoElement.classList.contains('pendiente')) {
        estadoElement.textContent = 'En proceso';
        estadoElement.className = 'pedido-estado en-proceso';
        btnEstado.innerHTML = '<i class="fas fa-check"></i> Completar';
        btnEstado.onclick = () => cambiarEstado(pedidoId);
        nuevoEstado = 'En proceso';
    } else if (estadoElement.classList.contains('en-proceso')) {
        estadoElement.textContent = 'Completado';
        estadoElement.className = 'pedido-estado completado';
        btnEstado.innerHTML = '<i class="fas fa-truck"></i> Entregar';
        btnEstado.onclick = () => cambiarEstado(pedidoId);
        nuevoEstado = 'Completado';
    } else if (estadoElement.classList.contains('completado')) {
        estadoElement.textContent = 'Entregado';
        estadoElement.className = 'pedido-estado entregado';
        btnEstado.innerHTML = '<i class="fas fa-check-double"></i> Entregado';
        btnEstado.style.background = '#6c757d';
        btnEstado.disabled = true;
        nuevoEstado = 'Entregado';
    }
    
    // Actualizar el estado en localStorage
    if (nuevoEstado) {
        actualizarEstadoPedidoEnLocalStorage(pedidoId, nuevoEstado);
    }
    
    showNotification(`Estado del pedido #${pedidoId} actualizado`, 'success');
}

// Cerrar panel al hacer clic fuera de él
document.addEventListener('DOMContentLoaded', function() {
    const adminPanel = document.getElementById('adminPanel');
    
    adminPanel.addEventListener('click', function(e) {
        if (e.target === adminPanel) {
            closeAdminPanel();
        }
    });
    
    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && adminPanel.classList.contains('active')) {
            closeAdminPanel();
        }
    });
});

// Función para filtrar pedidos
function filtrarPedidos() {
    const filtroEstado = document.getElementById('filtroEstado').value;
    const filtroFecha = document.getElementById('filtroFecha').value;
    
    // Aquí se implementaría la lógica de filtrado
    console.log('Filtrando pedidos:', { estado: filtroEstado, fecha: filtroFecha });
    showNotification('Filtros aplicados', 'success');
}

// Event listeners para filtros
document.addEventListener('DOMContentLoaded', function() {
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroFecha = document.getElementById('filtroFecha');
    
    if (filtroEstado) {
        filtroEstado.addEventListener('change', filtrarPedidos);
    }
    
    if (filtroFecha) {
        filtroFecha.addEventListener('change', filtrarPedidos);
    }
});

// ===== FUNCIÓN PARA AGREGAR PEDIDOS AL PANEL DE ADMINISTRADOR =====

// Función para agregar un nuevo pedido al panel de administrador
function agregarPedidoAlPanel(pedidoData) {
    // Guardar el pedido en localStorage
    agregarPedidoALocalStorage(pedidoData);
    
    const pedidosLista = document.querySelector('.pedidos-lista');
    
    if (!pedidosLista) {
        console.error('No se encontró la lista de pedidos en el panel de administrador');
        return;
    }
    
    // Crear el elemento HTML del pedido
    const pedidoHTML = `
        <div class="pedido-item" data-pedido-id="${pedidoData.id}">
            <div class="pedido-info">
                <div class="pedido-header">
                    <h4>Pedido #${pedidoData.id}</h4>
                    <span class="pedido-fecha">${pedidoData.fecha}</span>
                </div>
                <div class="pedido-detalles">
                    <p><strong>Cliente:</strong> ${pedidoData.nombre}</p>
                    <p><strong>Contacto:</strong> ${pedidoData.email} | ${pedidoData.telefono}</p>
                    <p><strong>Pastel:</strong> ${pedidoData.sabor} - ${pedidoData.tamaño}</p>
                    <p><strong>Decoración:</strong> ${pedidoData.decoracion}</p>
                    <p><strong>Entrega:</strong> ${pedidoData.fechaEntrega}</p>
                    ${pedidoData.mensaje ? `<p><strong>Mensaje:</strong> ${pedidoData.mensaje}</p>` : ''}
                </div>
            </div>
            <div class="pedido-estado pendiente">${pedidoData.estado}</div>
            <div class="pedido-acciones">
                                    <button class="btn-accion btn-ver" onclick="verPedido('${pedidoData.id}')">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn-accion btn-estado" onclick="cambiarEstado('${pedidoData.id}')">
                    <i class="fas fa-play"></i> Iniciar
                </button>
            </div>
        </div>
    `;
    
    // Agregar el pedido al inicio de la lista
    pedidosLista.insertAdjacentHTML('afterbegin', pedidoHTML);
    
    // Animar la aparición del nuevo pedido
    const nuevoPedido = pedidosLista.querySelector(`[data-pedido-id="${pedidoData.id}"]`);
    if (nuevoPedido) {
        nuevoPedido.style.opacity = '0';
        nuevoPedido.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            nuevoPedido.style.transition = 'all 0.3s ease';
            nuevoPedido.style.opacity = '1';
            nuevoPedido.style.transform = 'translateY(0)';
        }, 10);
    }
    
    console.log('Nuevo pedido agregado al panel y localStorage:', pedidoData);
}

// Función para mostrar indicador de triple clic
function showTripleClickIndicator() {
    // Crear indicador sutil
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    indicator.textContent = 'Un clic más para acceso administrativo';
    
    document.body.appendChild(indicator);
    
    // Animar entrada
    setTimeout(() => {
        indicator.style.opacity = '1';
    }, 10);
    
    // Remover después de 1.5 segundos
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 300);
    }, 1500);
}

// ===== FUNCIONES DE ALMACENAMIENTO LOCAL =====

// Función para guardar pedidos en localStorage
function guardarPedidosEnLocalStorage(pedidos) {
    try {
        localStorage.setItem('pasteleria_pedidos', JSON.stringify(pedidos));
        console.log('Pedidos guardados en localStorage:', pedidos.length);
    } catch (error) {
        console.error('Error al guardar pedidos en localStorage:', error);
    }
}

// Función para cargar pedidos desde localStorage
function cargarPedidosDesdeLocalStorage() {
    try {
        const pedidosGuardados = localStorage.getItem('pasteleria_pedidos');
        if (pedidosGuardados) {
            const pedidos = JSON.parse(pedidosGuardados);
            console.log('Pedidos cargados desde localStorage:', pedidos.length);
            return pedidos;
        }
    } catch (error) {
        console.error('Error al cargar pedidos desde localStorage:', error);
    }
    return [];
}

// Función para agregar un nuevo pedido al localStorage
function agregarPedidoALocalStorage(pedidoData) {
    const pedidos = cargarPedidosDesdeLocalStorage();
    pedidos.unshift(pedidoData); // Agregar al inicio
    guardarPedidosEnLocalStorage(pedidos);
}

// Función para actualizar el estado de un pedido en localStorage
function actualizarEstadoPedidoEnLocalStorage(pedidoId, nuevoEstado) {
    const pedidos = cargarPedidosDesdeLocalStorage();
    const pedidoIndex = pedidos.findIndex(pedido => pedido.id == pedidoId);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].estado = nuevoEstado;
        guardarPedidosEnLocalStorage(pedidos);
        return true;
    }
    return false;
}

// Función para limpiar todos los pedidos del localStorage (útil para pruebas)
function limpiarPedidosLocalStorage() {
    try {
        localStorage.removeItem('pasteleria_pedidos');
        console.log('Pedidos eliminados del localStorage');
        showNotification('Todos los pedidos han sido eliminados', 'success');
        
        // Recargar la lista si el panel está abierto
        if (document.getElementById('adminPanel').classList.contains('active')) {
            cargarPedidos();
        }
    } catch (error) {
        console.error('Error al limpiar pedidos del localStorage:', error);
        showNotification('Error al limpiar los pedidos', 'error');
    }
}

// Función de prueba para verificar PDF
function testPDF() {
    try {
        console.log('Iniciando prueba de PDF...');
        
        // Verificar que jsPDF esté disponible
        if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
            console.error('jsPDF no está cargado');
            showNotification('Error: jsPDF no está disponible', 'error');
            return;
        }
        
        // Intentar diferentes formas de acceder a jsPDF
        let jsPDF;
        if (typeof window.jspdf !== 'undefined') {
            jsPDF = window.jspdf.jsPDF;
        } else if (typeof window.jsPDF !== 'undefined') {
            jsPDF = window.jsPDF;
        } else {
            throw new Error('jsPDF no está disponible');
        }
        
        console.log('jsPDF disponible, creando documento de prueba...');
        
        // Crear un PDF simple de prueba
        const doc = new jsPDF();
        doc.setFont('helvetica');
        doc.setFontSize(20);
        doc.text('Prueba de PDF - B3stia\'s Cake', 20, 30);
        doc.setFontSize(12);
        doc.text('Este es un documento de prueba', 20, 50);
        doc.text(`Fecha: ${new Date().toLocaleString('es-ES')}`, 20, 70);
        
        const fileName = `test_pdf_${new Date().toISOString().split('T')[0]}.pdf`;
        console.log('Guardando PDF de prueba:', fileName);
        doc.save(fileName);
        
        console.log('PDF de prueba guardado exitosamente');
        showNotification('PDF de prueba generado correctamente', 'success');
        
    } catch (error) {
        console.error('Error en prueba de PDF:', error);
        showNotification('Error en prueba de PDF: ' + error.message, 'error');
    }
}

// Función para obtener estadísticas de pedidos
function obtenerEstadisticasPedidos() {
    const pedidos = cargarPedidosDesdeLocalStorage();
    
    const estadisticas = {
        total: pedidos.length,
        pendientes: pedidos.filter(p => p.estado === 'Pendiente').length,
        enProceso: pedidos.filter(p => p.estado === 'En proceso').length,
        completados: pedidos.filter(p => p.estado === 'Completado').length,
        entregados: pedidos.filter(p => p.estado === 'Entregado').length
    };
    
    return estadisticas;
}

// Función para verificar el estado de las librerías PDF
function verificarLibreriasPDF() {
    console.log('=== Verificación de Librerías PDF ===');
    console.log('window.jspdf:', typeof window.jspdf);
    console.log('window.jsPDF:', typeof window.jsPDF);
    
    if (typeof window.jspdf !== 'undefined') {
        console.log('window.jspdf.jsPDF:', typeof window.jspdf.jsPDF);
    }
    
    if (typeof window.jsPDF !== 'undefined') {
        console.log('window.jsPDF disponible');
    }
    
    console.log('html2canvas:', typeof window.html2canvas);
    console.log('===============================');
    
    let mensaje = 'Estado de librerías:\n';
    mensaje += `jsPDF: ${typeof window.jspdf !== 'undefined' ? 'Cargado' : 'No cargado'}\n`;
    mensaje += `html2canvas: ${typeof window.html2canvas !== 'undefined' ? 'Cargado' : 'No cargado'}`;
    
    showNotification(mensaje, 'info');
}