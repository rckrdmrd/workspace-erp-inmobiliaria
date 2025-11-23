# ET-CON-003: Servicio de Contratos

**ID:** ET-CON-003 | **Módulo:** MAI-012

## Contract Service
```typescript
@Injectable()
export class ContractService {
  async createContract(dto: CreateContractDto): Promise<Contract> {
    await this.validateBudget(dto.projectId, dto.montoContratado);
    const numero = await this.generateContractNumber(dto.type);
    const contract = await this.contractRepo.save({ ...dto, numero });
    await this.workflowService.initiate(contract.id);
    return contract;
  }

  async trackProgress(contractId: string): Promise<ProgressReport> {
    const contract = await this.findOne(contractId);
    const estimations = await this.estimationService.findByContract(contractId);
    const totalEjecutado = estimations.reduce((sum, e) => sum + e.montoNeto, 0);
    const porcentajeAvance = (totalEjecutado / contract.montoContratado) * 100;
    return { totalEjecutado, montoContratado: contract.montoContratado, porcentajeAvance };
  }
}
```

---
**Generado:** 2025-11-20
