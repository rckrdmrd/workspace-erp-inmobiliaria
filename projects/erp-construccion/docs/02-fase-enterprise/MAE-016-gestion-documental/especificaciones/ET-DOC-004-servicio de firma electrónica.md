# ET-DOC-004: Servicio de Firma Electrónica

**ID:** ET-DOC-004 | **Módulo:** MAE-016

## Signature Service
```typescript
@Injectable()
export class SignatureService {
  async requestSignature(
    documentId: string,
    signerId: string,
    type: 'simple' | 'advanced'
  ): Promise<SignatureRequest> {
    const document = await this.documentRepo.findOne(documentId);
    const signer = await this.userRepo.findOne(signerId);
    
    if (type === 'simple') {
      const otp = this.generateOTP();
      await this.sendOTPEmail(signer.email, otp);
      
      return { requestId: uuidv4(), otp, expiresAt: this.addMinutes(new Date(), 15) };
    } else {
      // FIEL (SAT) signature
      return this.initializeFIELSignature(documentId, signerId);
    }
  }

  async sign(
    documentId: string,
    signerId: string,
    signatureData: string,
    certificate?: string
  ): Promise<Signature> {
    const signature = await this.signatureRepo.save({
      documentId, signerId,
      type: certificate ? 'advanced' : 'simple',
      signatureData,
      certificate,
      signedAt: new Date()
    });
    
    // Embed signature in PDF
    await this.embedSignatureInPDF(documentId, signature);
    
    return signature;
  }
}
```

---
**Generado:** 2025-11-21
