# ET-DOC-003: Servicio de Versionamiento

**ID:** ET-DOC-003 | **Módulo:** MAE-016

## Version Service
```typescript
@Injectable()
export class VersionService {
  async createVersion(
    documentId: string,
    file: Express.Multer.File,
    changeNotes: string,
    userId: string
  ): Promise<DocumentVersion> {
    const document = await this.documentRepo.findOne(documentId);
    const newVersion = document.currentVersion + 1;
    
    const s3Path = await this.storageService.upload(file, {
      projectId: document.projectId,
      type: document.type,
      uploadedBy: userId
    });
    
    const version = await this.versionRepo.save({
      documentId,
      version: newVersion,
      s3Path,
      fileSize: file.size,
      changeNotes,
      createdBy: userId
    });
    
    document.currentVersion = newVersion;
    document.s3Path = s3Path;
    await this.documentRepo.save(document);
    
    return version;
  }

  async compareVersions(v1Id: string, v2Id: string): Promise<VersionComparison> {
    const v1 = await this.versionRepo.findOne(v1Id);
    const v2 = await this.versionRepo.findOne(v2Id);
    
    // For PDFs, generate visual diff
    const diff = await this.pdfDiffService.compare(v1.s3Path, v2.s3Path);
    
    return { v1, v2, diff };
  }
}
```

---
**Generado:** 2025-11-21
