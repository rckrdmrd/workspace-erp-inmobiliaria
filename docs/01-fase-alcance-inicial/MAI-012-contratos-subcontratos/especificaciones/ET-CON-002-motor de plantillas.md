# ET-CON-002: Motor de Plantillas

**ID:** ET-CON-002 | **Módulo:** MAI-012

## Template Engine Service
```typescript
@Injectable()
export class TemplateEngineService {
  async renderTemplate(
    templateId: string,
    data: ContractData
  ): Promise<string> {
    const template = await this.getTemplate(templateId);
    const mergeFields = this.extractMergeFields(data);
    return this.compile(template.content, mergeFields);
  }

  private extractMergeFields(data: ContractData): Record<string, any> {
    return {
      'proyecto.nombre': data.project.nombre,
      'cliente.razonSocial': data.client.razonSocial,
      'contrato.monto': this.formatCurrency(data.monto),
      'contrato.fechaInicio': this.formatDate(data.fechaInicio),
      'contrato.fechaFin': this.formatDate(data.fechaFin)
    };
  }
}
```

---
**Generado:** 2025-11-20
