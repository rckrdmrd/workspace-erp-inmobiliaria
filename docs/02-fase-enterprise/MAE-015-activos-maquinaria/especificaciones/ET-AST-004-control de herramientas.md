# ET-AST-004: Control de Herramientas

**ID:** ET-AST-004 | **Módulo:** MAE-015

## Tool Checkout Service
```typescript
@Injectable()
export class ToolService {
  async checkout(toolId: string, employeeId: string): Promise<ToolCheckout> {
    const tool = await this.assetRepo.findOne({ id: toolId, type: 'tool' });
    if (tool.status !== 'available') {
      throw new BadRequestException('Tool not available');
    }
    
    const checkout = await this.checkoutRepo.save({
      toolId,
      employeeId,
      checkedOutAt: new Date(),
      expectedReturnAt: this.addDays(new Date(), 7)
    });
    
    tool.status = 'in_use';
    await this.assetRepo.save(tool);
    
    return checkout;
  }

  async checkin(checkoutId: string, condition: string): Promise<void> {
    const checkout = await this.checkoutRepo.findOne(checkoutId);
    checkout.checkedInAt = new Date();
    checkout.returnCondition = condition;
    await this.checkoutRepo.save(checkout);
    
    const tool = await this.assetRepo.findOne(checkout.toolId);
    tool.status = condition === 'good' ? 'available' : 'maintenance';
    await this.assetRepo.save(tool);
  }
}
```

---
**Generado:** 2025-11-21
