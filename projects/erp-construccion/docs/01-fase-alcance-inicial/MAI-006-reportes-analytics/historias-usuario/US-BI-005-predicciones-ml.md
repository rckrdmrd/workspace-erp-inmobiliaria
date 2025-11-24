# US-BI-005: Prediccion de Costos y Cronogramas con ML

**Epica:** MAI-006 - Reportes y Business Intelligence
**Sprint:** 21
**Story Points:** 8
**Prioridad:** Media-Alta
**Asignado a:** Backend (Data Science) + Frontend

---

## Historia de Usuario

**Como** Director de Proyecto
**Quiero** ver predicciones de costos finales y fechas de termino basadas en tendencias actuales
**Para** tomar acciones correctivas tempranas y evitar sobrecostos o retrasos

---

## Criterios de Aceptacion

### 1. Prediccion de Costo Final
- [ ] Veo una prediccion del costo final del proyecto basada en:
  - Tendencia historica de costos
  - % de avance actual
  - Velocidad de gasto (burn rate)
  - Costos comprometidos pendientes
  - Estacionalidad (si aplica)
- [ ] La prediccion se muestra con:
  - Costo final estimado ($)
  - Variacion vs presupuesto (%, $)
  - Rango de confianza (min - max)
  - % de confianza de la prediccion
- [ ] La prediccion se actualiza semanalmente automaticamente

### 2. Prediccion de Fecha de Termino
- [ ] Veo una prediccion de la fecha de terminacion basada en:
  - Tendencia de avance fisico
  - Velocidad actual de ejecucion
  - Dias habiles vs no habiles
  - Hitos criticos pendientes
  - Historial de reprogramaciones
- [ ] La prediccion muestra:
  - Fecha estimada de termino
  - Dias de adelanto/atraso vs planeado
  - Rango de fechas (earliest - latest)
  - % de confianza de la prediccion
- [ ] Se considera calendario de dias festivos y clima

### 3. Tres Escenarios de Prediccion
- [ ] Veo predicciones para 3 escenarios:
  - **Optimista:** Mejor caso posible (90% confianza)
  - **Esperado:** Escenario mas probable (50% confianza)
  - **Pesimista:** Peor caso razonable (10% confianza)
- [ ] Cada escenario muestra:
  - Costo final estimado
  - Fecha de termino estimada
  - Factores que lo influencian
  - Probabilidad de ocurrencia
- [ ] Los escenarios se presentan visualmente con graficas

### 4. Factores de Riesgo Identificados
- [ ] Veo una lista de factores de riesgo detectados automaticamente:
  - **Riesgo Alto:** Partidas con sobrecosto >15%
  - **Riesgo Medio:** Actividades en ruta critica atrasadas
  - **Riesgo Bajo:** Desviaciones menores detectadas
- [ ] Cada factor muestra:
  - Nombre del riesgo
  - Nivel de severidad (Alto/Medio/Bajo)
  - Impacto estimado en costo ($)
  - Impacto estimado en tiempo (dias)
  - Probabilidad de ocurrencia (%)
  - Accion recomendada
- [ ] Puedo marcar riesgos como "En atencion" o "Mitigado"

### 5. Analisis de Tendencias
- [ ] Veo graficas de tendencias mostrando:
  - **Burn Rate Chart:** Velocidad de gasto vs planeado
  - **Progress Trend:** Velocidad de avance vs planeado
  - **Cost Performance Index (CPI):** Eficiencia de costos en el tiempo
  - **Schedule Performance Index (SPI):** Eficiencia de tiempo
- [ ] Las tendencias muestran ultimos 3, 6, 12 meses
- [ ] Puedo comparar tendencia actual vs proyectos similares

### 6. Proyeccion de Flujo de Efectivo
- [ ] Veo una proyeccion del flujo de efectivo futuro:
  - Egresos estimados por mes
  - Ingresos estimados por facturacion
  - Saldo mensual proyectado
  - Momento de maxima necesidad de efectivo
- [ ] La proyeccion considera:
  - Programacion de obra pendiente
  - Estimaciones por aprobar
  - Pagos a proveedores comprometidos
  - Calendario de facturacion al cliente
- [ ] Puedo exportar proyeccion a Excel para analisis financiero

### 7. Comparacion con Proyectos Similares
- [ ] Veo como se compara mi proyecto con proyectos similares historicos:
  - Proyectos del mismo tipo (vertical/horizontal)
  - Rango de presupuesto similar
  - Misma region geografica
- [ ] La comparacion muestra:
  - Desviacion promedio de costos en proyectos similares
  - Tiempo promedio de ejecucion
  - Factores de exito comunes
  - Lecciones aprendidas
- [ ] Uso de Machine Learning para encontrar proyectos mas similares

### 8. Alertas Predictivas
- [ ] Recibo alertas automaticas cuando:
  - La prediccion de costo final excede +10% del presupuesto
  - La fecha estimada de termino se retrasa >15 dias
  - Un nuevo riesgo alto es detectado
  - La tendencia cambia significativamente (>5% en una semana)
- [ ] Las alertas se envian por:
  - Notificacion en sistema
  - Email al Director de Proyecto
  - Dashboard de alertas
- [ ] Puedo configurar umbrales de alertas personalizados

### 9. Explicabilidad del Modelo
- [ ] Puedo ver que factores influyen mas en la prediccion:
  - Peso de cada variable (% de influencia)
  - Graficas de importancia de caracteristicas
  - Explicacion en lenguaje natural
- [ ] Ejemplo:
  ```
  La prediccion de costo final esta influenciada principalmente por:
  1. Tendencia de sobrecosto en Estructura (40% de peso)
  2. Velocidad de gasto actual (30% de peso)
  3. Estacionalidad de precios (20% de peso)
  4. Otros factores (10% de peso)
  ```
- [ ] Puedo ajustar manualmente supuestos del modelo

### 10. Historial de Predicciones
- [ ] Veo el historial de predicciones pasadas:
  - Prediccion hecha hace 1, 2, 3 meses
  - Como ha evolucionado la prediccion
  - Precision de predicciones anteriores
- [ ] Puedo comparar:
  - Prediccion inicial vs prediccion actual
  - Prediccion vs realidad (cuando el proyecto termina)
- [ ] El modelo aprende de errores para mejorar predicciones futuras

---

## Mockup / Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔮 Predicciones y Analisis Predictivo - Proyecto: Los Pinos                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌─ Resumen de Predicciones ────────────────────────────────────────────┐    │
│ │                                                                       │    │
│ │ Avance Actual: 78%  |  Presupuesto Original: $45.2M  |  Plazo: 350d │    │
│ │ Ultima actualizacion: 18/11/2025 06:00 AM (proxima en 7 dias)       │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─ Tres Escenarios de Prediccion ──────────────────────────────────────────┐│
│ │                                                                           ││
│ │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          ││
│ │  │ 😊 OPTIMISTA    │  │ 😐 ESPERADO     │  │ 😟 PESIMISTA    │          ││
│ │  │ Confianza: 90%  │  │ Confianza: 50%  │  │ Confianza: 10%  │          ││
│ │  │                 │  │                 │  │                 │          ││
│ │  │ Costo Final:    │  │ Costo Final:    │  │ Costo Final:    │          ││
│ │  │  $46.8M         │  │  $48.3M         │  │  $50.1M         │          ││
│ │  │  🟢 +3.5%       │  │  🟡 +6.9%       │  │  🔴 +10.8%      │          ││
│ │  │                 │  │                 │  │                 │          ││
│ │  │ Fecha Termino:  │  │ Fecha Termino:  │  │ Fecha Termino:  │          ││
│ │  │  20/11/2025     │  │  05/12/2025     │  │  22/12/2025     │          ││
│ │  │  🟢 -11 dias    │  │  🟡 +4 dias     │  │  🔴 +21 dias    │          ││
│ │  │                 │  │                 │  │                 │          ││
│ │  │ Factores:       │  │ Factores:       │  │ Factores:       │          ││
│ │  │ • Eficiencia MO │  │ • Tendencia     │  │ • Lluvias       │          ││
│ │  │ • Negociacion   │  │   actual        │  │ • Retrabajos    │          ││
│ │  │                 │  │ • Estacionalidad│  │ • Sobrecostos   │          ││
│ │  └─────────────────┘  └─────────────────┘  └─────────────────┘          ││
│ └───────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│ ┌─ Proyeccion de Costos ────────────┬─ Proyeccion de Cronograma ──────────┐ │
│ │                                    │                                      │ │
│ │  $M                                │  %                                   │ │
│ │  50│                        ┌──┐   │ 100│                         ┌────   │ │
│ │  45│                   ┌────┘  │   │  80│                    ┌───╯        │ │
│ │  40│              ┌───╯        │   │  60│               ┌──╯              │ │
│ │  35│         ┌───╯   Rango de │   │  40│          ┌──╯                   │ │
│ │  30│    ┌───╯      Confianza  │   │  20│     ┌──╯                        │ │
│ │  25│───╯                       │   │   0└────────────────────────         │ │
│ │   0└────────────────────────   │   │     E F M A M J J A S O N D          │ │
│ │    E F M A M J J A S O N D     │   │                                      │ │
│ │                                │   │  ─── Planeado                        │ │
│ │  ─── Real                      │   │  ─── Real                            │ │
│ │  ─── Presupuesto               │   │  ─── Proyeccion                      │ │
│ │  ─── Proyeccion Esperada       │   │  ▓▓▓ Rango confianza                │ │
│ │  ▓▓▓ Rango confianza 80%       │   │                                      │ │
│ └────────────────────────────────┴──────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Factores de Riesgo Detectados ──────────────────────────────────────────┐ │
│ │                                                                           │ │
│ │ ┌─────────────────────────────────────────────────────────────────────┐  │ │
│ │ │Riesgo               │Sev.│Impacto $│Impacto T│Prob.│Accion    │Est.│  │ │
│ │ ├─────────────────────────────────────────────────────────────────────┤  │ │
│ │ │Sobrecosto Acabados  │🔴 A│ +$850K  │  +12d   │ 75% │[Mitigar] │⚠️ │  │ │
│ │ │Retraso Instalaciones│🟡 M│ +$320K  │  +8d    │ 45% │[Revisar] │⏳ │  │ │
│ │ │Clima epoca lluvias  │🟡 M│ +$180K  │  +5d    │ 60% │[Monitor] │👁️ │  │ │
│ │ │Escasez de MO        │🟢 B│ +$95K   │  +2d    │ 25% │[Prevenir]│✅ │  │ │
│ │ └─────────────────────────────────────────────────────────────────────┘  │ │
│ │                                                                           │ │
│ │ Impacto Total Estimado: +$1.45M (+3.2%)  |  +27 dias                     │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌─ Indicadores de Desempeno ────────────────────────────────────────────┐    │
│ │                                                                        │    │
│ │  CPI (Cost Performance Index):    0.96  🟡 Ligeramente sobre presup.  │    │
│ │  SPI (Schedule Performance Index): 1.03  🟢 Adelante del programa     │    │
│ │  Burn Rate:                       $2.1M/mes  🟡 +5% vs planeado       │    │
│ │  Velocidad de Avance:             8.7% /mes  🟢 Normal                │    │
│ └────────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─ Explicacion del Modelo ──────────────────────────────────────────────┐    │
│ │                                                                        │    │
│ │  La prediccion de costo final esta basada en:                         │    │
│ │                                                                        │    │
│ │  1. Tendencia de sobrecosto en Acabados       ████████████  40%       │    │
│ │  2. Velocidad de gasto actual (burn rate)     ████████      30%       │    │
│ │  3. Estacionalidad de precios (Q4)            ████          20%       │    │
│ │  4. Riesgos climaticos identificados          ██            10%       │    │
│ │                                                                        │    │
│ │  Precision historica del modelo: 87% (error promedio: ±2.3%)          │    │
│ └────────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  [📊 Ver Detalles Tecnicos] [📈 Comparar con Similares] [⚙️ Ajustar Modelo] │
│  [📥 Exportar Proyecciones] [🔔 Configurar Alertas] [📚 Historial]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Trabajo

```
1. SISTEMA EJECUTA PREDICCION AUTOMATICA (CADA SEMANA)
   ↓
   Scheduler ejecuta job: "Actualizar Predicciones"
   ↓
   Para cada proyecto activo:
   - Extrae datos historicos (ultimos 6 meses)
   - Calcula tendencias de costo y tiempo
   - Identifica factores de riesgo
   - Ejecuta modelo de ML
   ↓
   Predicciones se almacenan en BD
   ↓
   Si hay cambios significativos → Genera alertas

2. DIRECTOR ACCEDE A PREDICCIONES
   ↓
   Dashboard de Proyecto → Tab "Predicciones"
   ↓
   Sistema muestra ultima prediccion (7 dias antiguedad)
   ↓
   Usuario ve 3 escenarios y factores de riesgo

3. ANALIZAR ESCENARIO PESIMISTA
   ↓
   Usuario hace clic en "Pesimista"
   ↓
   Sistema despliega detalles:
   - Costo final: $50.1M (+10.8%)
   - Fecha termino: 22/12/2025 (+21 dias)
   ↓
   Muestra factores que llevan a este escenario:
   - Lluvias en Nov-Dic: +8 dias
   - Retrabajos en Acabados: +$1.2M
   - Incremento precios materiales: +$0.5M

4. REVISAR FACTORES DE RIESGO
   ↓
   Usuario revisa tabla de riesgos
   ↓
   Identifica riesgo critico: "Sobrecosto Acabados"
   - Probabilidad: 75%
   - Impacto: +$850K
   ↓
   Usuario hace clic en [Mitigar]
   ↓
   Sistema abre panel de acciones sugeridas:
   - Renegociar contrato con subcontratista
   - Revisar especificaciones
   - Buscar proveedores alternativos

5. COMPARAR CON PROYECTOS SIMILARES
   ↓
   Usuario hace clic en [Comparar con Similares]
   ↓
   Sistema usa ML para encontrar 5 proyectos mas similares
   ↓
   Muestra comparacion:
   - Los Pinos: +6.9% desviacion proyectada
   - Promedio similar: +4.2% desviacion real
   - Insight: "Proyecto esta 2.7% por encima del promedio"

6. AJUSTAR MODELO MANUALMENTE
   ↓
   Usuario hace clic en [Ajustar Modelo]
   ↓
   Panel de supuestos editables:
   - Velocidad de avance futura: [8.5% /mes]
   - Incremento de precios esperado: [2.5%]
   - Probabilidad de lluvias: [60%]
   ↓
   Usuario ajusta velocidad a 9.0% (mas optimista)
   ↓
   Sistema recalcula prediccion en tiempo real
   ↓
   Nueva prediccion esperada: $47.8M (+5.8%)

7. EXPORTAR PARA JUNTA
   ↓
   Usuario hace clic en [Exportar Proyecciones]
   ↓
   Sistema genera PDF/Excel con:
   - Resumen ejecutivo de 3 escenarios
   - Graficas de proyeccion
   - Tabla de riesgos
   - Explicacion del modelo
   - Recomendaciones de acciones
   ↓
   Archivo listo para presentacion a cliente/direccion
```

---

## Notas Tecnicas

### Modelo de Machine Learning

```python
# Modelo de prediccion basado en Gradient Boosting
import xgboost as xgb
from sklearn.model_selection import train_test_split

# Caracteristicas (features)
features = [
    'progress_percentage',           # % avance actual
    'spent_to_date',                 # Gasto acumulado
    'days_elapsed',                  # Dias transcurridos
    'burn_rate',                     # Velocidad de gasto
    'progress_rate',                 # Velocidad de avance
    'cost_variance_trend',           # Tendencia de desviacion
    'schedule_variance_trend',       # Tendencia de tiempo
    'num_change_orders',             # Numero de cambios
    'weather_risk_score',            # Riesgo climatico
    'labor_availability_score',      # Disponibilidad MO
    'material_price_index',          # Indice precios materiales
    'historical_cpi',                # CPI historico
    'historical_spi',                # SPI historico
    'project_type_encoded',          # Tipo de proyecto
    'region_encoded'                 # Region
]

# Target (objetivo a predecir)
target_cost = 'final_cost'
target_date = 'completion_date'

# Entrenamiento del modelo
def train_prediction_model(historical_data):
    X = historical_data[features]
    y_cost = historical_data[target_cost]
    y_date = historical_data[target_date]

    X_train, X_test, y_train, y_test = train_test_split(X, y_cost, test_size=0.2)

    model = xgb.XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=6,
        random_state=42
    )

    model.fit(X_train, y_train)

    # Evaluar precision
    score = model.score(X_test, y_test)
    print(f"Model R² score: {score:.3f}")

    return model

# Prediccion con intervalos de confianza
def predict_with_confidence(model, current_project_data):
    # Prediccion puntual
    prediction = model.predict([current_project_data])[0]

    # Calcular intervalos usando quantile regression
    optimistic = prediction * 0.95   # 5% mejor
    expected = prediction
    pessimistic = prediction * 1.10  # 10% peor

    return {
        'optimistic': optimistic,
        'expected': expected,
        'pessimistic': pessimistic,
        'confidence': 0.80  # 80% confidence interval
    }

# Explicabilidad con SHAP
import shap

def explain_prediction(model, project_data):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(project_data)

    # Obtener importancia de features
    feature_importance = sorted(
        zip(features, shap_values[0]),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    return feature_importance
```

### Calculo de Indicadores

```typescript
// Cost Performance Index (CPI)
const CPI = earnedValue / actualCost;
// CPI > 1.0: Por debajo del presupuesto
// CPI < 1.0: Por encima del presupuesto

// Schedule Performance Index (SPI)
const SPI = earnedValue / plannedValue;
// SPI > 1.0: Adelantado
// SPI < 1.0: Atrasado

// Estimate at Completion (EAC) - Costo final estimado
const EAC = budgetAtCompletion / CPI;

// Estimate to Complete (ETC) - Costo restante estimado
const ETC = EAC - actualCost;

// Variance at Completion (VAC) - Variacion esperada
const VAC = budgetAtCompletion - EAC;

// Time to Complete - Tiempo restante
const totalDuration = plannedDuration / SPI;
const timeRemaining = totalDuration - daysElapsed;
```

### Endpoints Necesarios

```typescript
// Predicciones
GET    /api/predictions/:projectId                    // Obtener predicciones
POST   /api/predictions/:projectId/calculate          // Calcular nuevas predicciones
PUT    /api/predictions/:projectId/adjust             // Ajustar supuestos
GET    /api/predictions/:projectId/history            // Historial de predicciones

// Riesgos
GET    /api/predictions/:projectId/risks              // Factores de riesgo
PUT    /api/predictions/:projectId/risks/:id/status   // Actualizar estado de riesgo

// Comparaciones
GET    /api/predictions/:projectId/similar-projects   // Proyectos similares
GET    /api/predictions/:projectId/benchmarks         // Benchmarks

// Exportacion
POST   /api/predictions/:projectId/export             // Exportar predicciones
```

### Job Programado

```typescript
// Actualizar predicciones semanalmente
import cron from 'node-cron';

// Cada lunes a las 6:00 AM
cron.schedule('0 6 * * 1', async () => {
  console.log('Ejecutando actualizacion de predicciones...');

  const activeProjects = await getActiveProjects();

  for (const project of activeProjects) {
    try {
      // Extraer datos del proyecto
      const data = await extractProjectData(project.id);

      // Ejecutar modelo de prediccion
      const predictions = await runPredictionModel(data);

      // Guardar predicciones
      await savePredictions(project.id, predictions);

      // Detectar riesgos
      const risks = await detectRisks(project.id, predictions);
      await saveRisks(project.id, risks);

      // Generar alertas si es necesario
      if (predictions.expected.variance > 0.10) {
        await createAlert(project.id, 'HIGH_COST_VARIANCE');
      }

    } catch (error) {
      console.error(`Error en proyecto ${project.id}:`, error);
    }
  }

  console.log('Predicciones actualizadas correctamente');
});
```

---

## Definicion de "Done"

- [ ] Modelo de ML entrenado con datos historicos
- [ ] Prediccion de costo final funcional
- [ ] Prediccion de fecha de termino funcional
- [ ] Tres escenarios (optimista, esperado, pesimista) calculados
- [ ] Deteccion automatica de factores de riesgo
- [ ] Graficas de proyeccion de costos y cronograma
- [ ] Calculo de CPI, SPI, Burn Rate
- [ ] Proyeccion de flujo de efectivo
- [ ] Comparacion con proyectos similares usando ML
- [ ] Alertas predictivas configurables
- [ ] Explicabilidad del modelo con importancia de features
- [ ] Historial de predicciones almacenado
- [ ] Job programado ejecutando semanalmente
- [ ] Precision del modelo >= 85%
- [ ] Exportacion de predicciones a PDF/Excel
- [ ] Tests del modelo de ML
- [ ] Documentacion del modelo y endpoints
- [ ] Validado con Directores de Proyecto

---

**Estimacion:** 8 Story Points
**Dependencias:** Requiere datos historicos de multiples proyectos
**Fecha:** 2025-11-18
