# RF-BI-003: Analisis Predictivo y Forecasting

**Epica:** MAI-006 - Reportes y Business Intelligence
**Modulo:** Analisis Predictivo y Machine Learning
**Responsable:** Product Owner
**Fecha:** 2025-11-17
**Version:** 1.0

---

## 1. Objetivo

Proporcionar capacidades avanzadas de analisis predictivo y forecasting mediante algoritmos de machine learning e inteligencia artificial para predecir costos finales, fechas de termino, identificar riesgos potenciales y simular escenarios what-if que apoyen la toma de decisiones estrategicas.

---

## 2. Casos de Uso

### CU-BI-010: Prediccion de Costos Finales

**Actor:** CFO, Gerente de Proyecto, Director de Costos
**Precondiciones:**
- Proyecto tiene al menos 20% de avance fisico
- Existe historial de costos registrados (minimo 3 meses)

**Flujo Principal:**

1. Usuario accede a modulo de prediccion de costos
2. Usuario selecciona proyecto "Fraccionamiento Del Valle"
3. Sistema analiza datos historicos:
   - Presupuesto original: $120M
   - Costo acumulado: $35M (29%)
   - Avance fisico: 25%
   - Tendencia de costos ultimos 3 meses
4. Sistema aplica algoritmo de regresion lineal y analisis de curva S
5. Sistema muestra prediccion:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Prediccion de Costo Final                           │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │ Presupuesto Original:     $120.0M                   │
   │ Costo Actual (25%):       $35.0M                    │
   │                                                      │
   │ ┌─ Prediccion ─────────────────────────────────┐    │
   │ │                                               │    │
   │ │ Costo Final Estimado:    $125.5M             │    │
   │ │ Sobrecosto Proyectado:   +$5.5M (+4.6%)      │    │
   │ │ Nivel de Confianza:      87%                 │    │
   │ │                                               │    │
   │ │ Rango de Estimacion:                          │    │
   │ │ • Escenario Optimista:   $122.0M (+1.7%)     │    │
   │ │ • Escenario Esperado:    $125.5M (+4.6%)     │    │
   │ │ • Escenario Pesimista:   $130.2M (+8.5%)     │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Grafica de Proyeccion ──────────────────────┐    │
   │ │                                               │    │
   │ │ $150M│                          ╱─── Pesim.  │    │
   │ │ $130M│                      ╱──●             │    │
   │ │ $120M│ ────────────────────●   Esperado      │    │
   │ │ $100M│                  ╱─●    Optimista     │    │
   │ │  $80M│             ╱──●                       │    │
   │ │  $60M│        ╱──●                            │    │
   │ │  $40M│   ╱──●  ← Costo Real                  │    │
   │ │  $20M│●                                       │    │
   │ │   $0M└────────────────────────────────→      │    │
   │ │      0% 10% 20% 30%... 80% 90% 100%          │    │
   │ │              Avance Fisico                    │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ Factores Identificados:                             │
   │ 🔴 CPI actual: 0.88 (12% sobre presupuesto)         │
   │ 🟡 Tendencia alcista en costos de materiales        │
   │ 🟢 Productividad dentro de rangos normales          │
   │                                                      │
   │ Recomendaciones:                                    │
   │ • Revisar partidas de estructura (mayor varianza)   │
   │ • Negociar contratos marco para materiales          │
   │ • Considerar value engineering en acabados          │
   │                                                      │
   │            [Exportar] [Simular Escenarios]          │
   └─────────────────────────────────────────────────────┘
   ```
6. Usuario puede ajustar parametros de prediccion
7. Usuario puede explorar factores que afectan la prediccion
8. Sistema guarda prediccion con timestamp para seguimiento

**Postcondiciones:**
- Prediccion registrada en historial
- CFO notificado si sobrecosto proyectado > umbral (ej: 5%)

**Algoritmo de Prediccion:**

```python
# Metodo 1: Estimate at Completion (EAC) basado en CPI
EAC_CPI = BAC / CPI
# Donde BAC = Budget at Completion, CPI = Cost Performance Index

# Metodo 2: Regresion Lineal sobre curva de costos
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X=[[avance_fisico]], y=[[costo_acumulado]])
costo_final_pred = model.predict([[100]])[0]

# Metodo 3: Curva S con parametros ajustados
def curva_s(x, L, k, x0):
    return L / (1 + np.exp(-k * (x - x0)))

params, _ = curve_fit(curva_s, avances_historicos, costos_historicos)
costo_final_curva_s = params[0]  # L = asintota = costo final

# Prediccion Combinada (Ensemble)
prediccion_final = (
    0.4 * EAC_CPI +
    0.3 * costo_final_pred +
    0.3 * costo_final_curva_s
)

# Calculo de Intervalo de Confianza
std_error = calcular_error_estandar(modelo)
intervalo_confianza = 1.96 * std_error  # 95% confianza
```

---

### CU-BI-011: Proyeccion de Fechas de Termino

**Actor:** Gerente de Proyecto, Director de Operaciones
**Precondiciones:**
- Proyecto tiene cronograma registrado
- Existen mediciones de avance fisico historicas

**Flujo Principal:**

1. Usuario solicita proyeccion de fecha de termino
2. Sistema analiza datos:
   - Fecha de inicio: 01/01/2025
   - Fecha planificada de termino: 30/06/2026 (18 meses)
   - Avance fisico actual: 25% (15/05/2025)
   - SPI historico: 0.92 (8% de retraso)
3. Sistema calcula velocidad de ejecucion:
   ```
   Velocidad promedio = 25% / 4.5 meses = 5.56% por mes
   Tiempo restante = 75% / 5.56% = 13.5 meses
   Fecha estimada = 15/05/2025 + 13.5 meses = 30/06/2026
   ```
4. Sistema muestra proyeccion:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Proyeccion de Fecha de Termino                      │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │ Fecha Inicio:           01/01/2025                  │
   │ Fecha Plan Termino:     30/06/2026 (18 meses)       │
   │ Avance Actual:          25% (15/05/2025)            │
   │                                                      │
   │ ┌─ Proyeccion ─────────────────────────────────┐    │
   │ │                                               │    │
   │ │ Fecha Estimada Termino:  15/08/2026          │    │
   │ │ Retraso Proyectado:      45 dias              │    │
   │ │ Nivel de Confianza:      82%                 │    │
   │ │                                               │    │
   │ │ Escenarios:                                   │    │
   │ │ • Optimista (SPI=1.1):   15/05/2026 ✅       │    │
   │ │ • Esperado (SPI=0.92):   15/08/2026 🟡       │    │
   │ │ • Pesimista (SPI=0.80):  30/10/2026 🔴       │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Timeline Proyectado ────────────────────────┐    │
   │ │                                               │    │
   │ │ Ene ──────────────────────────────────── Dic  │    │
   │ │ 2025  │████████░░░░░░░░░░░░░░░░░░░░  2026    │    │
   │ │       ↑        ↑                 ↑    ↑       │    │
   │ │     Inicio   Hoy              Plan  Est.      │    │
   │ │                                               │    │
   │ │ Hitos Criticos:                               │    │
   │ │ ✅ Cimentacion     (Completado)               │    │
   │ │ 🔄 Estructura      (En Progreso - 60%)        │    │
   │ │ ⏱ Instalaciones   (Inicio: 01/09/2025)       │    │
   │ │ ⏱ Acabados        (Inicio: 01/12/2025)       │    │
   │ │ ⏱ Entrega         (Proyectado: 15/08/2026)   │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ Factores de Riesgo:                                 │
   │ 🔴 Actividades criticas con retraso promedio 12%    │
   │ 🟡 Temporada de lluvias puede retrasar +2 semanas  │
   │ 🟢 Recursos asignados adecuadamente                 │
   │                                                      │
   │ Acciones para Recuperar Cronograma:                 │
   │ • Aumentar cuadrillas en estructura (+15%)          │
   │ • Fast-track en instalaciones (traslape 20%)        │
   │ • Trabajo en sabados durante 2 meses                │
   │ • Impacto estimado: Recuperar 30 dias               │
   │                                                      │
   │         [Exportar] [Simular Acciones Correctivas]   │
   └─────────────────────────────────────────────────────┘
   ```
5. Usuario puede simular acciones correctivas
6. Sistema recalcula proyeccion con acciones propuestas
7. Usuario aprueba plan de accion

**Postcondiciones:**
- Proyeccion guardada en historial
- Plan de accion registrado para seguimiento

---

### CU-BI-012: Analisis de Tendencias Historicas

**Actor:** Director de Operaciones, Analista de BI
**Precondiciones:**
- Existen al menos 5 proyectos completados
- Datos historicos disponibles

**Flujo Principal:**

1. Usuario accede a modulo de analisis de tendencias
2. Usuario selecciona metrica: "Varianza de Costo"
3. Sistema analiza proyectos historicos (ultimos 3 anos):
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Analisis de Tendencias: Varianza de Costo           │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │ ┌─ Tendencia General ──────────────────────────┐    │
   │ │                                               │    │
   │ │ +15%│                                         │    │
   │ │ +10%│     ●                                   │    │
   │ │  +5%│ ●       ●   ●       ●                   │    │
   │ │   0%├─────────────────●───────●───●───●──     │    │
   │ │  -5%│                                         │    │
   │ │     └─────────────────────────────────→       │    │
   │ │     Q1  Q2  Q3  Q4  Q1  Q2  Q3  Q4  Q1  Q2    │    │
   │ │    2023 2023 2023 2023 2024 2024 2024 2024 25 │    │
   │ │                                               │    │
   │ │ Tendencia: MEJORANDO ↓                        │    │
   │ │ Varianza promedio 2023: +4.2%                 │    │
   │ │ Varianza promedio 2024: +1.8%                 │    │
   │ │ Varianza YTD 2025:      -0.5%                 │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Analisis por Tipo de Proyecto ─────────────┐    │
   │ │                                               │    │
   │ │ Fraccionamientos (15 proyectos):              │    │
   │ │ ████████░░░░ Promedio: +3.2%                  │    │
   │ │                                               │    │
   │ │ Edificios Verticales (8 proyectos):           │    │
   │ │ ██████░░░░░░ Promedio: +1.8%                  │    │
   │ │                                               │    │
   │ │ Proyectos Mixtos (3 proyectos):               │    │
   │ │ ███████████░ Promedio: +5.1%                  │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Correlaciones Identificadas ───────────────┐    │
   │ │                                               │    │
   │ │ • Presupuesto > $100M → +2.5% varianza       │    │
   │ │   Correlacion: 0.68 (moderada-fuerte)        │    │
   │ │                                               │    │
   │ │ • Duracion > 18 meses → +3.8% varianza       │    │
   │ │   Correlacion: 0.72 (fuerte)                 │    │
   │ │                                               │    │
   │ │ • Temporada lluvias → +1.2% varianza         │    │
   │ │   Correlacion: 0.45 (moderada)               │    │
   │ │                                               │    │
   │ │ • Gerente con exp. >5a → -1.8% varianza      │    │
   │ │   Correlacion: -0.61 (moderada-fuerte)       │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ Patrones Detectados:                                │
   │ • Proyectos Q1-Q2 tienen mejor desempeno (menor    │
   │   impacto climatico)                                │
   │ • Fast-tracking aumenta riesgo de sobrecosto +4%    │
   │ • Proyectos con BIM tienen -2.5% varianza           │
   │                                                      │
   │ Prediccion para Nuevos Proyectos:                   │
   │ Fracc. >$120M, 20 meses, sin BIM:                   │
   │ → Varianza esperada: +5.2% ± 2.1%                   │
   │                                                      │
   │           [Exportar Analisis] [Ver Detalles]        │
   └─────────────────────────────────────────────────────┘
   ```
4. Usuario explora correlaciones interesantes
5. Usuario identifica mejores practicas de proyectos exitosos
6. Usuario exporta insights para presentacion ejecutiva

**Postcondiciones:**
- Insights guardados en base de conocimiento
- Recomendaciones aplicables a proyectos futuros

---

### CU-BI-013: Identificacion de Riesgos con IA

**Actor:** Gerente de Proyecto, Director de Riesgos
**Precondiciones:**
- Proyecto activo con datos actualizados
- Modelo de IA entrenado con proyectos historicos

**Flujo Principal:**

1. Usuario solicita analisis de riesgos con IA
2. Sistema recopila datos del proyecto:
   - Metricas de desempeno (SPI, CPI, SV, CV)
   - Historial de incidencias
   - Condiciones externas (clima, mercado)
   - Comparacion con proyectos similares
3. Sistema aplica modelo de Machine Learning (Random Forest + Neural Network)
4. Sistema identifica riesgos potenciales:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Analisis de Riesgos con IA                          │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │ Proyecto: Fraccionamiento Del Valle                 │
   │ Analisis ejecutado: 17/11/2025 14:32                │
   │                                                      │
   │ ┌─ Score de Riesgo General ────────────────────┐    │
   │ │                                               │    │
   │ │       ┌─────────────────────────┐             │    │
   │ │       │         MEDIO           │             │    │
   │ │       │          62%            │             │    │
   │ │       └─────────────────────────┘             │    │
   │ │                                               │    │
   │ │  Bajo  ├────●───────────┤  Alto               │    │
   │ │  0-30% │   30-70%    70-100%                  │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Riesgos Identificados (Ordenados por Impacto) ─┐ │
   │ │                                                  │ │
   │ │ 🔴 CRITICO - Probabilidad: 78%                   │ │
   │ │ Sobrecosto en Estructura                         │ │
   │ │ Impacto: +$8M (+6.7%)                            │ │
   │ │                                                  │ │
   │ │ Factores:                                        │ │
   │ │ • CPI actual en estructura: 0.82                 │ │
   │ │ • Precio acero subio 12% vs presupuesto          │ │
   │ │ • Patron similar en 4 proyectos historicos       │ │
   │ │                                                  │ │
   │ │ Acciones Recomendadas:                           │ │
   │ │ 1. Renegociar contrato de acero (ahorro est: $2M)│ │
   │ │ 2. Value engineering en elementos secundarios    │ │
   │ │ 3. Acelerar compras para fijar precios           │ │
   │ │                                                  │ │
   │ ├──────────────────────────────────────────────────┤ │
   │ │                                                  │ │
   │ │ 🟡 ALTO - Probabilidad: 65%                      │ │
   │ │ Retraso en Fase de Acabados                      │ │
   │ │ Impacto: +45 dias                                │ │
   │ │                                                  │ │
   │ │ Factores:                                        │ │
   │ │ • Inicio de acabados coincide con temporada alta │ │
   │ │ • Escasez de mano de obra especializada          │ │
   │ │ • Ruta critica tiene holgura de solo 10 dias     │ │
   │ │                                                  │ │
   │ │ Acciones Recomendadas:                           │ │
   │ │ 1. Pre-contratar cuadrillas de acabados YA       │ │
   │ │ 2. Considerar fast-track con instalaciones       │ │
   │ │ 3. Buffer adicional de 15 dias en cronograma     │ │
   │ │                                                  │ │
   │ ├──────────────────────────────────────────────────┤ │
   │ │                                                  │ │
   │ │ 🟡 MEDIO - Probabilidad: 55%                     │ │
   │ │ Problemas de Liquidez en Q3-2025                 │ │
   │ │ Impacto: Necesidad de $12M credito puente        │ │
   │ │                                                  │ │
   │ │ Factores:                                        │ │
   │ │ • Desfase entre egresos y cobro de estimaciones  │ │
   │ │ • Cliente historicamente tarda 45 dias en pagar  │ │
   │ │ • Pico de egresos en Jul-Ago (acabados)          │ │
   │ │                                                  │ │
   │ │ Acciones Recomendadas:                           │ │
   │ │ 1. Negociar anticipos adicionales con cliente    │ │
   │ │ 2. Preparar linea de credito con banco           │ │
   │ │ 3. Escalonar pagos a proveedores                 │ │
   │ │                                                  │ │
   │ ├──────────────────────────────────────────────────┤ │
   │ │                                                  │ │
   │ │ 🟢 BAJO - Probabilidad: 28%                      │ │
   │ │ Incumplimiento en Calidad de Concreto            │ │
   │ │ Impacto: Demolicion parcial (-$2M, +20 dias)     │ │
   │ │                                                  │ │
   │ │ Factores:                                        │ │
   │ │ • Nuevo proveedor sin track record               │ │
   │ │ • Pero: ensayos de laboratorio son satisfactorios│ │
   │ │                                                  │ │
   │ │ Acciones Recomendadas:                           │ │
   │ │ 1. Incrementar frecuencia de muestreo (20% mas)  │ │
   │ │ 2. Supervision estricta en primeras fundiciones  │ │
   │ └──────────────────────────────────────────────────┘ │
   │                                                      │
   │ ┌─ Comparacion con Proyectos Similares ────────┐    │
   │ │                                               │    │
   │ │ Proyectos analizados: 12 (mismo tipo/tamano)  │    │
   │ │                                               │    │
   │ │ Distribucion de Riesgos:                      │    │
   │ │ • 25% tuvieron riesgo critico similar         │    │
   │ │ • 58% evitaron sobrecosto con acciones early  │    │
   │ │ • 17% no detectaron riesgo a tiempo           │    │
   │ │                                               │    │
   │ │ Tu proyecto esta en percentil: 68             │    │
   │ │ (Mayor riesgo que 68% de proyectos similares) │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ Confianza del Modelo: 84%                           │
   │ Ultima actualizacion del modelo: 01/11/2025         │
   │                                                      │
   │    [Exportar Informe] [Crear Plan de Mitigacion]    │
   │           [Configurar Alertas Automaticas]          │
   └─────────────────────────────────────────────────────┘
   ```
5. Usuario revisa riesgos identificados
6. Usuario crea plan de mitigacion para riesgos criticos
7. Sistema programa alertas automaticas para monitorear indicadores

**Postcondiciones:**
- Riesgos registrados en matriz de riesgos
- Alertas configuradas para early warning
- Plan de mitigacion activo

**Algoritmo de ML para Identificacion de Riesgos:**

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
import numpy as np

class RiskPredictionModel:
    def __init__(self):
        # Random Forest para clasificacion de nivel de riesgo
        self.rf_model = RandomForestClassifier(n_estimators=100)

        # Neural Network para prediccion de impacto
        self.nn_model = MLPClassifier(hidden_layers=(64, 32, 16))

    def prepare_features(self, project):
        """Extrae features del proyecto para el modelo"""
        features = [
            project.spi,
            project.cpi,
            project.physical_progress,
            project.financial_progress,
            project.budget_size / 1_000_000,  # Normalizado
            project.duration_months,
            project.team_experience_years,
            project.weather_risk_score,
            project.market_conditions_index,
            project.client_payment_history_score,
            project.contractor_reliability_score,
            # ... mas features
        ]
        return np.array(features).reshape(1, -1)

    def predict_cost_overrun_risk(self, project):
        """Predice probabilidad y magnitud de sobrecosto"""
        features = self.prepare_features(project)

        # Clasificacion: Bajo/Medio/Alto
        risk_level = self.rf_model.predict(features)[0]
        risk_prob = self.rf_model.predict_proba(features)[0]

        # Regresion: Magnitud del sobrecosto
        overrun_amount = self.nn_model.predict(features)[0]

        return {
            'risk_level': risk_level,
            'probability': risk_prob[risk_level],
            'estimated_overrun': overrun_amount,
            'confidence': self.calculate_confidence(features)
        }

    def identify_risk_factors(self, project):
        """Identifica factores que contribuyen al riesgo"""
        features = self.prepare_features(project)

        # Feature importance de Random Forest
        importances = self.rf_model.feature_importances_

        risk_factors = []
        feature_names = ['SPI', 'CPI', 'Avance', ...]

        for idx, importance in enumerate(importances):
            if importance > 0.1:  # Umbral de relevancia
                risk_factors.append({
                    'factor': feature_names[idx],
                    'importance': importance,
                    'current_value': features[0][idx]
                })

        return sorted(risk_factors, key=lambda x: x['importance'], reverse=True)

    def recommend_actions(self, risk_factors, historical_projects):
        """Genera recomendaciones basadas en proyectos historicos"""
        recommendations = []

        # Buscar proyectos similares que mitigaron exitosamente
        similar_successful = self.find_similar_successful_projects(
            risk_factors, historical_projects
        )

        for project in similar_successful:
            actions_taken = project.mitigation_actions
            effectiveness = project.risk_reduction_achieved

            recommendations.append({
                'action': actions_taken,
                'effectiveness': effectiveness,
                'based_on_project': project.name
            })

        return recommendations
```

---

### CU-BI-014: Simulacion de Escenarios What-If

**Actor:** Gerente de Proyecto, Director de Operaciones, CFO
**Precondiciones:**
- Proyecto activo con datos base
- Parametros de simulacion definidos

**Flujo Principal:**

1. Usuario accede a simulador de escenarios
2. Usuario define escenario base (situacion actual del proyecto)
3. Usuario configura variables a modificar:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Simulador de Escenarios What-If                     │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │ Escenario Base: Fraccionamiento Del Valle (Actual)  │
   │                                                      │
   │ ┌─ Variables a Modificar ──────────────────────┐    │
   │ │                                               │    │
   │ │ ☑ Productividad de Cuadrillas                │    │
   │ │   Actual: 100%                                │    │
   │ │   Modificar a: [120%      ] (+20%)            │    │
   │ │   Costo: +$800K (horas extra)                 │    │
   │ │                                               │    │
   │ │ ☑ Precio de Materiales                        │    │
   │ │   Actual: $45M presupuestado                  │    │
   │ │   Modificar a: [110%      ] (+10%)            │    │
   │ │   Costo: +$4.5M                               │    │
   │ │                                               │    │
   │ │ ☑ Duracion de Fase Critica                    │    │
   │ │   Actual: 6 meses                             │    │
   │ │   Modificar a: [5 meses   ] (-17%)            │    │
   │ │   (Fast-tracking)                             │    │
   │ │                                               │    │
   │ │ ☐ Condiciones Climaticas                      │    │
   │ │   Actual: Normal                              │    │
   │ │   Modificar a: [▼ Normal  ]                   │    │
   │ │                                               │    │
   │ │ ☑ Financiamiento                              │    │
   │ │   Actual: Tasa 12% anual                      │    │
   │ │   Modificar a: [9%        ] (-3pp)            │    │
   │ │   Ahorro: -$1.2M en intereses                 │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │              [Simular] [Limpiar] [Guardar]          │
   └─────────────────────────────────────────────────────┘
   ```
4. Usuario hace clic en "Simular"
5. Sistema ejecuta simulacion Monte Carlo (1000 iteraciones)
6. Sistema muestra resultados comparativos:
   ```
   ┌─────────────────────────────────────────────────────┐
   │ Resultados de Simulacion                            │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │ ┌─ Comparacion Base vs Escenario ──────────────┐    │
   │ │                                               │    │
   │ │               │  Base    │ Escenario │ Delta  │    │
   │ │ ──────────────┼──────────┼───────────┼────── │    │
   │ │ Costo Final   │ $125.5M  │ $128.6M   │ +2.5% │    │
   │ │ Fecha Termino │ 15/08/26 │ 01/07/26  │ -45d  │    │
   │ │ Margen Neto   │  18.2%   │  17.1%    │ -1.1pp│    │
   │ │ ROI           │  24.5%   │  23.2%    │ -1.3pp│    │
   │ │ Riesgo Retraso│  65%     │  35%      │ -30pp │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Analisis de Sensibilidad ───────────────────┐    │
   │ │                                               │    │
   │ │ Impacto en Costo Final:                       │    │
   │ │ Precio Materiales (+10%):    +$4.5M (3.6%)   │    │
   │ │ Productividad (+20%):        +$0.8M (0.6%)   │    │
   │ │ Financiamiento (-3pp):       -$1.2M (-1.0%)  │    │
   │ │ Fast-tracking:               +$2.5M (2.0%)   │    │
   │ │                               ──────────────  │    │
   │ │ TOTAL NETO:                  +$6.6M (+5.3%)  │    │
   │ │                                               │    │
   │ │ Impacto en Plazo:                             │    │
   │ │ Productividad (+20%):        -25 dias         │    │
   │ │ Fast-tracking:               -30 dias         │    │
   │ │ Riesgo climatico:            +10 dias         │    │
   │ │                               ──────────────  │    │
   │ │ TOTAL NETO:                  -45 dias         │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Distribucion de Probabilidades ─────────────┐    │
   │ │                                               │    │
   │ │ Costo Final:                                  │    │
   │ │                                               │    │
   │ │  30│        ╱─╲                               │    │
   │ │  25│       ╱   ╲                              │    │
   │ │  20│      ╱     ╲                             │    │
   │ │  15│     ╱       ╲                            │    │
   │ │  10│  ╱─╱         ╲─╲                         │    │
   │ │   5│─╱               ╲──                      │    │
   │ │   0└──────────────────────────→               │    │
   │ │   $120M  $125M  $130M  $135M                  │    │
   │ │                                               │    │
   │ │ P10: $122.5M  |  P50: $128.6M  |  P90: $135.2M│    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │ ┌─ Recomendacion ──────────────────────────────┐    │
   │ │                                               │    │
   │ │ ✅ IMPLEMENTAR ESCENARIO                      │    │
   │ │                                               │    │
   │ │ Justificacion:                                │    │
   │ │ • Reduce riesgo de retraso de 65% a 35%      │    │
   │ │ • Entrega 45 dias antes (critico para        │    │
   │ │   cumplir compromiso con cliente)             │    │
   │ │ • Costo adicional de $6.6M es aceptable       │    │
   │ │   considerando penalizaciones por retraso     │    │
   │ │   ($15M si no entrega 30/06/26)               │    │
   │ │                                               │    │
   │ │ ROI del Escenario:                            │    │
   │ │ Inversion: $6.6M                              │    │
   │ │ Evita penalizacion: $15M                      │    │
   │ │ Retorno Neto: $8.4M (127% ROI)                │    │
   │ └───────────────────────────────────────────────┘    │
   │                                                      │
   │   [Exportar] [Crear Plan de Accion] [Comparar Mas]  │
   └─────────────────────────────────────────────────────┘
   ```
7. Usuario puede crear escenarios adicionales para comparar
8. Usuario puede guardar escenarios favoritos
9. Usuario exporta analisis comparativo para presentar a direccion

**Postcondiciones:**
- Escenarios guardados para referencia futura
- Decision documentada con justificacion cuantitativa

---

## 3. Requerimientos Funcionales

### RF-BI-003.1: Prediccion de Costos Finales
- El sistema DEBE predecir costo final usando minimo 3 metodos (EAC, regresion, curva S)
- El sistema DEBE calcular nivel de confianza de prediccion (minimo 70% para alertar)
- El sistema DEBE mostrar rango de estimacion (optimista, esperado, pesimista)
- El sistema DEBE identificar partidas con mayor varianza
- El sistema DEBE generar recomendaciones de mitigacion
- El sistema DEBE alertar automaticamente si sobrecosto proyectado > umbral

### RF-BI-003.2: Proyeccion de Fechas de Termino
- El sistema DEBE calcular fecha estimada basada en velocidad historica
- El sistema DEBE proyectar 3 escenarios (optimista, esperado, pesimista)
- El sistema DEBE identificar hitos criticos en riesgo
- El sistema DEBE sugerir acciones correctivas para recuperar cronograma
- El sistema DEBE calcular impacto de acciones correctivas en plazo y costo
- El sistema DEBE considerar factores externos (clima, disponibilidad recursos)

### RF-BI-003.3: Analisis de Tendencias Historicas
- El sistema DEBE analizar minimo 5 proyectos historicos completados
- El sistema DEBE calcular tendencias por periodo (trimestral, anual)
- El sistema DEBE identificar correlaciones entre variables (r > 0.6)
- El sistema DEBE segmentar analisis por tipo de proyecto
- El sistema DEBE detectar patrones estadisticamente significativos (p < 0.05)
- El sistema DEBE generar insights accionables

### RF-BI-003.4: Identificacion de Riesgos con IA
- El sistema DEBE aplicar modelos de ML entrenados con proyectos historicos
- El sistema DEBE clasificar riesgos en 4 niveles (critico, alto, medio, bajo)
- El sistema DEBE calcular probabilidad e impacto de cada riesgo
- El sistema DEBE identificar factores contribuyentes a cada riesgo
- El sistema DEBE generar recomendaciones de mitigacion basadas en casos exitosos
- El sistema DEBE mostrar confianza del modelo (minimo 75%)
- El sistema DEBE permitir configurar alertas automaticas por riesgo

### RF-BI-003.5: Simulacion de Escenarios What-If
- El sistema DEBE permitir modificar minimo 5 variables simultaneamente
- El sistema DEBE ejecutar simulacion Monte Carlo con minimo 1000 iteraciones
- El sistema DEBE calcular distribucion de probabilidades de resultados
- El sistema DEBE mostrar analisis de sensibilidad de variables
- El sistema DEBE permitir comparar hasta 5 escenarios simultaneamente
- El sistema DEBE calcular ROI de cada escenario
- El sistema DEBE guardar escenarios para analisis futuro

### RF-BI-003.6: Reentrenamiento de Modelos
- El sistema DEBE reentrenar modelos de ML mensualmente con nuevos datos
- El sistema DEBE validar precision de modelos (minimo 80% accuracy)
- El sistema DEBE notificar cuando precision de modelo cae <75%
- El sistema DEBE mantener version history de modelos

---

## 4. Modelo de Datos

```typescript
// Prediccion de Costos
interface CostPrediction {
  id: string;
  projectId: string;
  predictionDate: Date;

  currentState: {
    budgetOriginal: number;
    costToDate: number;
    physicalProgress: number;
    financialProgress: number;
    cpi: number;
    spi: number;
  };

  predictions: {
    method: 'EAC_CPI' | 'LINEAR_REGRESSION' | 'S_CURVE' | 'ENSEMBLE';
    finalCost: number;
    variance: number;
    variancePercent: number;
    confidence: number; // 0-100%
  }[];

  ensemble: {
    finalCost: number;
    variance: number;
    variancePercent: number;
    confidence: number;

    scenarios: {
      optimistic: { cost: number; probability: number };
      expected: { cost: number; probability: number };
      pessimistic: { cost: number; probability: number };
    };
  };

  contributingFactors: {
    factor: string;
    impact: number; // en pesos
    importance: number; // 0-1
  }[];

  recommendations: {
    action: string;
    estimatedSavings: number;
    effort: 'low' | 'medium' | 'high';
    priority: number;
  }[];

  alertTriggered: boolean;
  createdAt: Date;
}

// Proyeccion de Fechas
interface SchedulePrediction {
  id: string;
  projectId: string;
  predictionDate: Date;

  currentState: {
    startDate: Date;
    plannedEndDate: Date;
    currentProgress: number;
    currentDate: Date;
    spi: number;
  };

  velocityAnalysis: {
    avgMonthlyProgress: number;
    last3MonthsVelocity: number[];
    trend: 'accelerating' | 'stable' | 'decelerating';
  };

  predictions: {
    estimatedEndDate: Date;
    delayDays: number;
    confidence: number;

    scenarios: {
      optimistic: { endDate: Date; spi: number };
      expected: { endDate: Date; spi: number };
      pessimistic: { endDate: Date; spi: number };
    };
  };

  criticalMilestones: {
    milestoneId: string;
    name: string;
    plannedDate: Date;
    estimatedDate: Date;
    atRisk: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }[];

  correctiveActions: {
    action: string;
    scheduleImpact: number; // dias recuperados
    costImpact: number;
    feasibility: 'low' | 'medium' | 'high';
    priority: number;
  }[];

  externalFactors: {
    factor: string; // 'weather', 'resource_availability', etc.
    impact: number; // dias
    probability: number;
  }[];

  createdAt: Date;
}

// Analisis de Tendencias
interface TrendAnalysis {
  id: string;
  metric: 'cost_variance' | 'schedule_variance' | 'margin' | 'roi';
  analysisDate: Date;

  timeRange: {
    from: Date;
    to: Date;
  };

  projectsAnalyzed: {
    total: number;
    projectIds: string[];
  };

  overallTrend: {
    direction: 'improving' | 'stable' | 'worsening';
    averageValue: number;
    changePercent: number;
    periodComparison: {
      period: string; // "Q1-2024", "2023", etc.
      value: number;
    }[];
  };

  segmentation: {
    dimension: string; // 'project_type', 'budget_range', etc.
    segments: {
      name: string;
      projectCount: number;
      averageValue: number;
      trend: 'improving' | 'stable' | 'worsening';
    }[];
  }[];

  correlations: {
    variable1: string;
    variable2: string;
    coefficient: number; // Pearson correlation -1 to 1
    strength: 'weak' | 'moderate' | 'strong';
    pValue: number;
    significant: boolean; // p < 0.05
  }[];

  patterns: {
    description: string;
    confidence: number; // 0-100%
    sampleSize: number;
    examples: string[]; // project IDs
  }[];

  insights: {
    insight: string;
    actionable: boolean;
    relatedProjects: string[];
  }[];

  createdBy: string;
  createdAt: Date;
}

// Identificacion de Riesgos con IA
interface AIRiskAnalysis {
  id: string;
  projectId: string;
  analysisDate: Date;

  overallRiskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  modelInfo: {
    modelVersion: string;
    confidence: number; // 0-100%
    lastTrainedDate: Date;
    accuracy: number; // 0-100%
  };

  risks: {
    id: string;
    type: 'cost_overrun' | 'schedule_delay' | 'quality_issue' | 'liquidity_crisis' | 'safety_incident';
    name: string;
    description: string;

    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    probability: number; // 0-100%
    impact: {
      cost?: number;
      schedule?: number; // dias
      quality?: string;
      safety?: string;
    };

    contributingFactors: {
      factor: string;
      currentValue: any;
      threshold: any;
      importance: number; // 0-1 (from model feature importance)
    }[];

    recommendedActions: {
      action: string;
      effectiveness: number; // 0-100% based on historical data
      basedOnProjects: string[]; // IDs de proyectos donde funciono
      cost: number;
      effort: 'low' | 'medium' | 'high';
      priority: number;
    }[];

    historicalComparison: {
      similarProjectsCount: number;
      percentileRank: number; // 0-100
      successfulMitigationRate: number; // 0-100%
    };
  }[];

  alerts: {
    riskId: string;
    threshold: number;
    currentValue: number;
    alertType: 'email' | 'sms' | 'dashboard';
    recipients: string[];
    enabled: boolean;
  }[];

  createdAt: Date;
}

// Simulacion de Escenarios
interface ScenarioSimulation {
  id: string;
  projectId: string;
  name: string;
  description: string;

  baseScenario: {
    cost: number;
    duration: number;
    endDate: Date;
    margin: number;
    roi: number;
  };

  variables: {
    name: string;
    type: 'productivity' | 'material_price' | 'duration' | 'interest_rate' | 'weather' | 'resource_availability';
    baseValue: any;
    modifiedValue: any;
    changePercent: number;
    cost: number; // costo de implementar el cambio
  }[];

  simulationConfig: {
    iterations: number; // Monte Carlo iterations
    method: 'monte_carlo' | 'discrete_event' | 'system_dynamics';
    randomSeed?: number;
  };

  results: {
    cost: {
      expected: number;
      p10: number; // 10th percentile
      p50: number; // median
      p90: number; // 90th percentile
      variance: number;
      variancePercent: number;
    };

    schedule: {
      expectedEndDate: Date;
      p10EndDate: Date;
      p50EndDate: Date;
      p90EndDate: Date;
      delayDays: number;
    };

    margin: {
      expected: number;
      p10: number;
      p50: number;
      p90: number;
    };

    roi: {
      expected: number;
      p10: number;
      p50: number;
      p90: number;
    };
  };

  sensitivityAnalysis: {
    variable: string;
    impactOnCost: number;
    impactOnSchedule: number;
    impactOnMargin: number;
    elasticity: number; // % change in outcome / % change in variable
  }[];

  recommendation: {
    implement: boolean;
    justification: string;
    netBenefit: number;
    roiOfScenario: number;
  };

  comparisonWithBase: {
    costDelta: number;
    scheduleDelta: number;
    marginDelta: number;
    roiDelta: number;
  };

  createdBy: string;
  createdAt: Date;
}

// ML Model Metadata
interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering';
  purpose: 'cost_prediction' | 'risk_identification' | 'schedule_forecasting';

  version: string;
  trainedDate: Date;
  trainingDataset: {
    projectCount: number;
    features: string[];
    timeRange: { from: Date; to: Date };
  };

  performance: {
    accuracy: number; // 0-100%
    precision: number;
    recall: number;
    f1Score: number;
    mse?: number; // Mean Squared Error for regression
    r2?: number; // R-squared for regression
  };

  hyperparameters: Record<string, any>;

  status: 'active' | 'deprecated' | 'testing';
  filePath: string; // path to saved model file

  createdBy: string;
  createdAt: Date;
}
```

### SQL Schema

```sql
-- Cost Predictions
CREATE TABLE cost_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  prediction_date TIMESTAMP NOT NULL,

  current_state JSONB NOT NULL,
  predictions JSONB NOT NULL,
  ensemble JSONB NOT NULL,
  contributing_factors JSONB,
  recommendations JSONB,

  alert_triggered BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_cost_pred_project (project_id),
  INDEX idx_cost_pred_date (prediction_date),
  INDEX idx_cost_pred_alert (alert_triggered) WHERE alert_triggered = true
);

-- Schedule Predictions
CREATE TABLE schedule_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  prediction_date TIMESTAMP NOT NULL,

  current_state JSONB NOT NULL,
  velocity_analysis JSONB NOT NULL,
  predictions JSONB NOT NULL,
  critical_milestones JSONB,
  corrective_actions JSONB,
  external_factors JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_schedule_pred_project (project_id),
  INDEX idx_schedule_pred_date (prediction_date)
);

-- Trend Analysis
CREATE TABLE trend_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric VARCHAR(50) NOT NULL,
  analysis_date TIMESTAMP NOT NULL,

  time_range JSONB NOT NULL,
  projects_analyzed JSONB NOT NULL,
  overall_trend JSONB NOT NULL,
  segmentation JSONB,
  correlations JSONB,
  patterns JSONB,
  insights JSONB,

  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_trend_metric (metric),
  INDEX idx_trend_date (analysis_date)
);

-- AI Risk Analysis
CREATE TABLE ai_risk_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  analysis_date TIMESTAMP NOT NULL,

  overall_risk_score NUMERIC(5,2) NOT NULL CHECK (overall_risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) NOT NULL,

  model_info JSONB NOT NULL,
  risks JSONB NOT NULL,
  alerts JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_ai_risk_project (project_id),
  INDEX idx_ai_risk_score (overall_risk_score),
  INDEX idx_ai_risk_level (risk_level)
);

-- Scenario Simulations
CREATE TABLE scenario_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  base_scenario JSONB NOT NULL,
  variables JSONB NOT NULL,
  simulation_config JSONB NOT NULL,
  results JSONB NOT NULL,
  sensitivity_analysis JSONB,
  recommendation JSONB,
  comparison_with_base JSONB,

  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_scenario_project (project_id),
  INDEX idx_scenario_creator (created_by)
);

-- ML Models
CREATE TABLE ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  purpose VARCHAR(100) NOT NULL,

  version VARCHAR(20) NOT NULL,
  trained_date TIMESTAMP NOT NULL,
  training_dataset JSONB NOT NULL,
  performance JSONB NOT NULL,
  hyperparameters JSONB,

  status VARCHAR(20) DEFAULT 'active',
  file_path VARCHAR(500) NOT NULL,

  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(name, version),
  INDEX idx_ml_model_purpose (purpose),
  INDEX idx_ml_model_status (status)
);

-- Prediction History (para tracking de accuracy)
CREATE TABLE prediction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL,
  prediction_type VARCHAR(50) NOT NULL, -- 'cost', 'schedule', 'risk'

  predicted_value NUMERIC,
  predicted_date TIMESTAMP NOT NULL,

  actual_value NUMERIC,
  actual_date TIMESTAMP,

  error NUMERIC,
  error_percent NUMERIC,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_pred_history_type (prediction_type),
  INDEX idx_pred_history_date (predicted_date)
);
```

---

## 5. Criterios de Aceptacion

### Prediccion de Costos
- [ ] Prediccion usa minimo 3 metodos diferentes (EAC, regresion, curva S)
- [ ] Ensemble combina predicciones con pesos configurables
- [ ] Nivel de confianza se calcula correctamente (basado en desviacion estandar)
- [ ] Rango de escenarios cubre P10-P90 de distribucion
- [ ] Factores contribuyentes se ordenan por importancia
- [ ] Recomendaciones son especificas y accionables
- [ ] Alerta se dispara automaticamente si sobrecosto > umbral configurado
- [ ] Prediccion tiene precision ±10% vs costo final real

### Proyeccion de Fechas
- [ ] Calculo de velocidad considera ultimos 3 meses minimo
- [ ] Escenarios optimista/pesimista consideran ±20% variabilidad
- [ ] Hitos criticos se identifican correctamente (ruta critica)
- [ ] Acciones correctivas muestran impacto cuantitativo en plazo y costo
- [ ] Factores externos (clima) se incorporan en prediccion
- [ ] Proyeccion tiene precision ±15 dias vs fecha real de termino

### Analisis de Tendencias
- [ ] Analisis incluye minimo 5 proyectos completados
- [ ] Tendencias se calculan por periodo (trimestral, anual)
- [ ] Correlaciones con |r| > 0.6 se destacan como significativas
- [ ] Prueba de significancia estadistica (p-value < 0.05)
- [ ] Patrones tienen confianza > 70%
- [ ] Insights son accionables y especificos

### Identificacion de Riesgos IA
- [ ] Modelo tiene accuracy > 80% en dataset de validacion
- [ ] Riesgos se clasifican en 4 niveles correctamente
- [ ] Probabilidad e impacto se calculan consistentemente
- [ ] Factores contribuyentes ordenados por feature importance
- [ ] Recomendaciones basadas en proyectos historicos similares
- [ ] Confianza del modelo > 75% para mostrar prediccion
- [ ] Alertas configurables por tipo de riesgo y umbral
- [ ] Precision del modelo se valida mensualmente vs resultados reales

### Simulacion de Escenarios
- [ ] Simulacion Monte Carlo ejecuta minimo 1000 iteraciones
- [ ] Se pueden modificar hasta 10 variables simultaneamente
- [ ] Distribucion de probabilidades se visualiza correctamente (histograma)
- [ ] Analisis de sensibilidad identifica variables con mayor impacto
- [ ] Comparacion de escenarios muestra deltas claramente
- [ ] ROI de escenario se calcula correctamente
- [ ] Escenarios guardados se pueden recargar fielmente
- [ ] Simulacion completa en <10 segundos para proyecto tipico

### Reentrenamiento de Modelos
- [ ] Modelos se reentrenan automaticamente cada mes
- [ ] Nuevos datos de proyectos completados se incorporan
- [ ] Accuracy se valida antes de promover modelo a produccion
- [ ] Notificacion se envia si accuracy cae <75%
- [ ] Version history de modelos se mantiene (minimo 6 meses)
- [ ] Rollback a version anterior funciona correctamente

---

## 6. Notas Tecnicas

### Implementacion de Prediccion con Ensemble

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from scipy.optimize import curve_fit

class CostPredictor:
    def __init__(self, project):
        self.project = project
        self.budget = project.budget_original
        self.cost_to_date = project.cost_accumulated
        self.physical_progress = project.physical_progress / 100
        self.cpi = project.cpi

    def predict_eac_cpi(self):
        """Estimate at Completion basado en CPI"""
        if self.cpi == 0:
            return None

        eac = self.budget / self.cpi
        confidence = self._calculate_confidence_cpi()

        return {
            'method': 'EAC_CPI',
            'final_cost': eac,
            'variance': eac - self.budget,
            'variance_percent': ((eac - self.budget) / self.budget) * 100,
            'confidence': confidence
        }

    def predict_linear_regression(self):
        """Regresion lineal sobre puntos historicos"""
        historical_data = self.project.get_historical_cost_data()

        if len(historical_data) < 3:
            return None

        X = np.array([[d['progress']] for d in historical_data])
        y = np.array([[d['cost']] for d in historical_data])

        model = LinearRegression()
        model.fit(X, y)

        final_cost = model.predict([[1.0]])[0][0]  # 100% progress
        confidence = model.score(X, y) * 100  # R²

        return {
            'method': 'LINEAR_REGRESSION',
            'final_cost': final_cost,
            'variance': final_cost - self.budget,
            'variance_percent': ((final_cost - self.budget) / self.budget) * 100,
            'confidence': confidence
        }

    def predict_s_curve(self):
        """Ajuste de curva S (sigmoid)"""
        historical_data = self.project.get_historical_cost_data()

        if len(historical_data) < 5:
            return None

        progress = np.array([d['progress'] for d in historical_data])
        costs = np.array([d['cost'] for d in historical_data])

        # Curva S: f(x) = L / (1 + exp(-k*(x - x0)))
        def s_curve(x, L, k, x0):
            return L / (1 + np.exp(-k * (x - x0)))

        try:
            # Initial guess
            p0 = [self.budget * 1.1, 10, 0.5]
            params, covariance = curve_fit(s_curve, progress, costs, p0=p0, maxfev=10000)

            final_cost = params[0]  # L parameter = asymptote

            # Calculate R² for confidence
            y_pred = s_curve(progress, *params)
            ss_res = np.sum((costs - y_pred) ** 2)
            ss_tot = np.sum((costs - np.mean(costs)) ** 2)
            r_squared = 1 - (ss_res / ss_tot)
            confidence = r_squared * 100

            return {
                'method': 'S_CURVE',
                'final_cost': final_cost,
                'variance': final_cost - self.budget,
                'variance_percent': ((final_cost - self.budget) / self.budget) * 100,
                'confidence': confidence
            }
        except:
            return None

    def predict_ensemble(self):
        """Combina multiples metodos con pesos"""
        predictions = []

        eac = self.predict_eac_cpi()
        if eac: predictions.append(eac)

        regression = self.predict_linear_regression()
        if regression: predictions.append(regression)

        s_curve = self.predict_s_curve()
        if s_curve: predictions.append(s_curve)

        if len(predictions) == 0:
            return None

        # Pesos basados en confianza
        weights = np.array([p['confidence'] for p in predictions])
        weights = weights / np.sum(weights)  # Normalizar

        # Prediccion ponderada
        final_cost = np.sum([p['final_cost'] * w for p, w in zip(predictions, weights)])
        confidence = np.mean([p['confidence'] for p in predictions])

        # Calcular escenarios
        std_error = np.std([p['final_cost'] for p in predictions])

        scenarios = {
            'optimistic': {
                'cost': final_cost - 1.28 * std_error,  # P10
                'probability': 10
            },
            'expected': {
                'cost': final_cost,
                'probability': 50
            },
            'pessimistic': {
                'cost': final_cost + 1.28 * std_error,  # P90
                'probability': 90
            }
        }

        return {
            'final_cost': final_cost,
            'variance': final_cost - self.budget,
            'variance_percent': ((final_cost - self.budget) / self.budget) * 100,
            'confidence': confidence,
            'scenarios': scenarios,
            'methods_used': [p['method'] for p in predictions],
            'individual_predictions': predictions
        }

    def _calculate_confidence_cpi(self):
        """Calcula confianza basada en estabilidad de CPI"""
        historical_cpi = self.project.get_historical_cpi()

        if len(historical_cpi) < 3:
            return 50.0

        # Menos variabilidad = mayor confianza
        std_cpi = np.std(historical_cpi)
        mean_cpi = np.mean(historical_cpi)

        coefficient_of_variation = std_cpi / mean_cpi if mean_cpi != 0 else 1

        # Convertir CV a confianza (0-100%)
        confidence = max(0, min(100, (1 - coefficient_of_variation) * 100))

        return confidence

# Usage
predictor = CostPredictor(project)
prediction = predictor.predict_ensemble()

if prediction and prediction['variance_percent'] > THRESHOLD:
    send_alert(project, prediction)
```

### Simulacion Monte Carlo para Escenarios

```python
import numpy as np
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class Variable:
    name: str
    base_value: float
    distribution: str  # 'normal', 'triangular', 'uniform'
    params: Dict  # distribution parameters

class MonteCarloSimulator:
    def __init__(self, project, variables: List[Variable], iterations=10000):
        self.project = project
        self.variables = variables
        self.iterations = iterations
        self.results = None

    def run(self):
        """Ejecuta simulacion Monte Carlo"""
        cost_results = []
        duration_results = []
        margin_results = []

        for i in range(self.iterations):
            # Generar valores aleatorios para cada variable
            scenario_values = {}
            for var in self.variables:
                scenario_values[var.name] = self._sample_variable(var)

            # Calcular metricas para este escenario
            cost = self._calculate_cost(scenario_values)
            duration = self._calculate_duration(scenario_values)
            margin = self._calculate_margin(scenario_values)

            cost_results.append(cost)
            duration_results.append(duration)
            margin_results.append(margin)

        # Calcular estadisticas
        self.results = {
            'cost': {
                'expected': np.mean(cost_results),
                'p10': np.percentile(cost_results, 10),
                'p50': np.percentile(cost_results, 50),
                'p90': np.percentile(cost_results, 90),
                'std': np.std(cost_results),
                'distribution': cost_results
            },
            'duration': {
                'expected': np.mean(duration_results),
                'p10': np.percentile(duration_results, 10),
                'p50': np.percentile(duration_results, 50),
                'p90': np.percentile(duration_results, 90),
                'std': np.std(duration_results),
                'distribution': duration_results
            },
            'margin': {
                'expected': np.mean(margin_results),
                'p10': np.percentile(margin_results, 10),
                'p50': np.percentile(margin_results, 50),
                'p90': np.percentile(margin_results, 90),
                'std': np.std(margin_results),
                'distribution': margin_results
            }
        }

        return self.results

    def _sample_variable(self, var: Variable):
        """Genera valor aleatorio segun distribucion"""
        if var.distribution == 'normal':
            return np.random.normal(var.params['mean'], var.params['std'])

        elif var.distribution == 'triangular':
            return np.random.triangular(
                var.params['left'],
                var.params['mode'],
                var.params['right']
            )

        elif var.distribution == 'uniform':
            return np.random.uniform(var.params['low'], var.params['high'])

        else:
            return var.base_value

    def _calculate_cost(self, scenario_values):
        """Calcula costo total para escenario"""
        base_cost = self.project.budget_original

        # Ajustar por precio de materiales
        material_factor = scenario_values.get('material_price', 1.0)
        material_cost = self.project.material_budget * material_factor

        # Ajustar por productividad
        productivity_factor = scenario_values.get('productivity', 1.0)
        labor_cost = self.project.labor_budget / productivity_factor

        # Ajustar por duracion (gastos indirectos)
        duration_factor = scenario_values.get('duration_months', self.project.planned_duration) / self.project.planned_duration
        indirect_cost = self.project.indirect_costs * duration_factor

        total_cost = material_cost + labor_cost + indirect_cost + self.project.other_costs

        return total_cost

    def _calculate_duration(self, scenario_values):
        """Calcula duracion para escenario"""
        base_duration = self.project.planned_duration

        productivity_factor = scenario_values.get('productivity', 1.0)
        weather_delay = scenario_values.get('weather_delay_days', 0)

        duration = (base_duration / productivity_factor) + (weather_delay / 30)  # convert days to months

        return duration

    def _calculate_margin(self, scenario_values):
        """Calcula margen para escenario"""
        revenue = self.project.contract_value
        cost = self._calculate_cost(scenario_values)

        margin = ((revenue - cost) / revenue) * 100

        return margin

    def sensitivity_analysis(self):
        """Analiza sensibilidad de cada variable"""
        sensitivities = []

        base_results = self.run()
        base_cost = base_results['cost']['expected']

        for var in self.variables:
            # Incrementar variable en 10%
            original_value = var.base_value
            var.params['mean'] = original_value * 1.1

            new_results = self.run()
            new_cost = new_results['cost']['expected']

            # Calcular elasticidad
            cost_change_percent = ((new_cost - base_cost) / base_cost) * 100
            var_change_percent = 10
            elasticity = cost_change_percent / var_change_percent

            sensitivities.append({
                'variable': var.name,
                'impact_on_cost': new_cost - base_cost,
                'elasticity': elasticity
            })

            # Restaurar valor original
            var.params['mean'] = original_value

        return sorted(sensitivities, key=lambda x: abs(x['elasticity']), reverse=True)

# Example usage
variables = [
    Variable('material_price', 1.0, 'triangular', {'left': 0.95, 'mode': 1.0, 'right': 1.15}),
    Variable('productivity', 1.0, 'normal', {'mean': 1.0, 'std': 0.1}),
    Variable('weather_delay_days', 0, 'triangular', {'left': 0, 'mode': 10, 'right': 30})
]

simulator = MonteCarloSimulator(project, variables, iterations=10000)
results = simulator.run()
sensitivity = simulator.sensitivity_analysis()
```

---

**Fecha:** 2025-11-17
**Preparado por:** Equipo de Producto
**Version:** 1.0
**Estado:** Listo para Revision
