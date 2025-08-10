# 🐛 Reporte de Bug - Ejemplo para Demo

**Título del Issue:** App se bloquea al agregar más de 10 tareas

## **Descripción del Problema**

La aplicación TaskFlow Manager se vuelve lenta y eventualmente se bloquea cuando intento agregar más de 10 tareas. El problema parece empeorar con cada tarea adicional que agrego.

## **Pasos para Reproducir**

1. Abrir TaskFlow Manager en el navegador
2. Agregar exactamente 10 tareas usando el formulario
3. Intentar agregar una tarea número 11
4. Observar que la aplicación se vuelve lenta
5. Continuar agregando más tareas hasta que se bloquee

## **Comportamiento Esperado**

- La aplicación debería manejar cientos de tareas sin problemas de rendimiento
- El formulario de agregar tareas debería seguir funcionando normalmente
- No debería haber bloqueos o ralentizaciones notables

## **Comportamiento Actual**

- **10 tareas**: Funciona normal
- **11-15 tareas**: Comienza a ralentizarse notablemente
- **16+ tareas**: La aplicación se congela por 2-3 segundos al agregar cada tarea
- **20+ tareas**: El navegador se vuelve casi inutilizable

## **Información del Entorno**

- **Navegador**: Chrome 118.0.5993.88
- **Sistema Operativo**: Windows 11 Pro
- **Memoria RAM**: 16GB
- **Resolución de Pantalla**: 1920x1080
- **Conexión**: Fibra óptica 500 Mbps

## **Información Adicional**

### **Consola del Navegador**
```
[Error] Possible memory leak detected in task rendering
[Warning] DOM manipulation taking longer than expected
[Error] Maximum call stack size exceeded at TaskManager.renderTasks
```

### **Performance Profile**
- Heap Size aumenta exponencialmente después de 10 tareas
- CPU usage al 90%+ durante operaciones de renderizado
- Múltiples reflows del DOM detectados

## **Posibles Causas**

1. **Renderizado ineficiente**: Probablemente re-renderizando todas las tareas en lugar de solo la nueva
2. **Memory leaks**: Event listeners no están siendo removidos correctamente
3. **Falta de virtualización**: No hay paginación o scroll virtual para listas largas
4. **Algoritmos O(n²)**: Posibles loops anidados en la lógica de filtrado

## **Soluciones Sugeridas**

1. **Implementar lazy loading** para cargar tareas bajo demanda
2. **Agregar virtualización** para listas largas
3. **Optimizar algoritmos de renderizado** para actualizar solo elementos necesarios
4. **Implementar debouncing** en operaciones de búsqueda/filtrado
5. **Añadir Web Workers** para operaciones pesadas

## **Prioridad**

**Alta** - Este bug afecta significativamente la experiencia del usuario y hace la aplicación inutilizable para usuarios con muchas tareas.

## **Labels Sugeridos**

- `bug`
- `performance`
- `high-priority`
- `frontend`
- `ux-impact`

---

**Nota para la demo**: Este es un issue diseñado específicamente para demostrar las capacidades de clasificación automática de Gemini CLI. Contiene información detallada que permitirá a la IA hacer un análisis completo y preciso.
