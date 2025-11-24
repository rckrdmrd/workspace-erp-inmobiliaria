# ET-DOC-002: Servicio de Almacenamiento S3

**ID:** ET-DOC-002 | **Módulo:** MAE-016

## Storage Service
```typescript
@Injectable()
export class StorageService {
  private s3: S3;

  async upload(file: Express.Multer.File, metadata: FileMetadata): Promise<string> {
    const key = this.generateKey(metadata);
    
    await this.s3.upload({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256',
      Metadata: {
        projectId: metadata.projectId,
        uploadedBy: metadata.uploadedBy,
        type: metadata.type
      }
    }).promise();
    
    return key;
  }

  async download(key: string): Promise<Buffer> {
    const result = await this.s3.getObject({
      Bucket: process.env.S3_BUCKET,
      Key: key
    }).promise();
    
    return result.Body as Buffer;
  }

  private generateKey(metadata: FileMetadata): string {
    const { constructoraId, projectId, type } = metadata;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${constructoraId}/${projectId}/${type}/${year}/${month}/${uuidv4()}`;
  }
}
```

---
**Generado:** 2025-11-21
