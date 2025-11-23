# ET-PRE-005: Gestión de Proveedores

**ID:** ET-PRE-005 | **Módulo:** MAI-018

## Vendor Service
```typescript
@Injectable()
export class VendorService {
  async register(dto: CreateVendorDto): Promise<Vendor> {
    await this.validateRFC(dto.rfc);
    const vendor = await this.vendorRepo.save(dto);
    await this.requestDocumentation(vendor.id);
    return vendor;
  }

  async updateDocumentation(vendorId: string, docs: VendorDocuments): Promise<void> {
    const allValid = this.validateDocuments(docs);
    await this.vendorRepo.update(vendorId, { documentacionVigente: allValid });
  }

  async updateRating(vendorId: string, contractId: string, rating: number): Promise<void> {
    const vendor = await this.findOne(vendorId);
    const history = await this.getContractHistory(vendorId);
    const newRating = this.calculateWeightedRating(history, rating);
    await this.vendorRepo.update(vendorId, { rating: newRating });
  }

  @Cron('0 8 * * 1') // Every Monday
  async checkDocumentExpiration(): Promise<void> {
    const vendors = await this.vendorRepo.findExpiringDocs(30);
    for (const vendor of vendors) {
      await this.notificationService.send(vendor.contactEmail, 'document_expiring');
    }
  }
}
```

---
**Generado:** 2025-11-20
