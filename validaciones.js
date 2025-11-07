// ===========================================
// SCRIPT DE VALIDACIONES - FORMULARIO IPPT
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. VALIDACIÓN: Solo texto en nombres (sin números)
    // ========================================
    const nombreInputs = document.querySelectorAll('input[type="text"].text-input');
    
    nombreInputs.forEach(input => {
        // Solo aplicar a los campos de nombres en la tabla de "Datos del instruido/instructor"
        const parentTable = input.closest('table');
        if (parentTable && parentTable.innerHTML.includes('Datos del instruido')) {
            input.addEventListener('input', function(e) {
                // Remover cualquier número del input
                this.value = this.value.replace(/[0-9]/g, '');
            });
        }
    });

    
    // ========================================
    // 2. VALIDACIÓN: Horas militares (solo números, máximo 4 dígitos)
    // ========================================
    const militaryTimeInputs = document.querySelectorAll('.military-time-input');
    
    militaryTimeInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limitar a 4 dígitos
            if (this.value.length > 4) {
                this.value = this.value.slice(0, 4);
            }
        });
        
        input.addEventListener('blur', function(e) {
            // Validar formato al perder el foco
            if (this.value.length === 4) {
                const hours = parseInt(this.value.substring(0, 2));
                const minutes = parseInt(this.value.substring(2, 4));
                
                // Validar rango válido (00:00 - 23:59)
                if (hours > 23 || minutes > 59) {
                    alert('Hora inválida. Use formato 24h (0000-2359)');
                    this.value = '';
                }
            } else if (this.value.length > 0 && this.value.length < 4) {
                alert('La hora debe tener 4 dígitos (ej: 1700, 2300)');
                this.value = '';
            }
        });
    });

    
    // ========================================
    // 4. VALIDACIÓN: Checkboxes mutuamente excluyentes
    // ========================================
    
    // Función para manejar checkboxes como radio buttons por fila en tablas de desempeño
    function setupExclusiveCheckboxes() {
        // Buscar TODAS las tablas de desempeño (hay en página 1 y 2)
        const performanceTables = document.querySelectorAll('.performance-table');
        
        performanceTables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                // Solo procesar filas que tienen indicadores (no las de encabezados)
                const indicatorCell = row.querySelector('.indicator-text');
                if (!indicatorCell) return;
                
                const checkboxes = row.querySelectorAll('.checkbox-center input[type="checkbox"]');
                
                if (checkboxes.length > 0) {
                    checkboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', function() {
                            if (this.checked) {
                                // Desmarcar todos los otros checkboxes en la misma fila
                                checkboxes.forEach(otherCheckbox => {
                                    if (otherCheckbox !== this) {
                                        otherCheckbox.checked = false;
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    }
    
    // Función para manejar checkboxes de Condiciones Meteorológicas, Complejidad y Carga de Trabajo
    function setupMeteorologicalConditions() {
        // ============================================
        // CONDICIONES METEOROLÓGICAS: VMC o IMC
        // ============================================
        const allLabels = document.querySelectorAll('label');
        let vmcCheckbox = null;
        let imcCheckbox = null;
        
        allLabels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                if (label.textContent.trim() === 'VMC') {
                    vmcCheckbox = checkbox;
                }
                if (label.textContent.trim() === 'IMC') {
                    imcCheckbox = checkbox;
                }
            }
        });
        
        if (vmcCheckbox && imcCheckbox) {
            vmcCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    imcCheckbox.checked = false;
                }
            });
            
            imcCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    vmcCheckbox.checked = false;
                }
            });
        }
        
        // ============================================
        // CARGA DE TRABAJO: Ligera, Moderada o Intensa
        // ============================================
        const cargaCheckboxes = [];
        
        allLabels.forEach(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const text = label.textContent.trim();
                if (text === 'Ligera' || text === 'Moderada' || text === 'Intensa') {
                    cargaCheckboxes.push(checkbox);
                }
            }
        });
        
        cargaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    cargaCheckboxes.forEach(other => {
                        if (other !== this) {
                            other.checked = false;
                        }
                    });
                }
            });
        });
        
        // ============================================
        // COMPLEJIDAD: No Difícil, Ocasional, Difícil, Muy Difícil
        // ============================================
        const complejidadCheckboxes = [];
        const optionCells = document.querySelectorAll('.option-cell');
        
        optionCells.forEach(cell => {
            const text = cell.textContent.trim();
            if (text === 'No Difícil' || text === 'Ocasional' || text === 'Difícil' || text === 'Muy Difícil') {
                // El checkbox está en la siguiente celda
                const nextCell = cell.nextElementSibling;
                if (nextCell) {
                    const checkbox = nextCell.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        complejidadCheckboxes.push(checkbox);
                    }
                }
            }
        });
        
        complejidadCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    complejidadCheckboxes.forEach(other => {
                        if (other !== this) {
                            other.checked = false;
                        }
                    });
                }
            });
        });
    }
    
    // Inicializar todas las validaciones
    setupExclusiveCheckboxes();
    setupMeteorologicalConditions();
    
    console.log('✅ Sistema de validaciones cargado correctamente');
});