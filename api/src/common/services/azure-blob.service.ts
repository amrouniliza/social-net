import { Injectable } from '@nestjs/common';
import { BlobSASPermissions, BlobServiceClient, ContainerClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

@Injectable()
export class AzureBlobService {
  private readonly containerName = 'upload-images';
  private readonly blobServiceClient: BlobServiceClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      'UseDevelopmentStorage=true' // Connexion à Azurite
    );
  }

  /**
   * Upload a file to a blob in the container.
   * If the container does not exist, it will be created.
   * @param filePath The path of the file to upload.
   * @param blobName The name of the blob to create.
   * @returns The URL of the uploaded blob.
   */
  async uploadFile(filePath: string, blobName: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

    // Vérifier si le container existe, sinon le créer
    await containerClient.createIfNotExists({ access : 'container' });

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const fileContent = await readFile(filePath);

    await blockBlobClient.upload(fileContent, fileContent.length);

    return blockBlobClient.url;

    // // Générer une URL SAS pour le blob
    // const sasUrl = this.generateSasUrl(containerClient, blobName);
    // return sasUrl;
  }

  private generateSasUrl(containerClient: ContainerClient, blobName: string): string {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT_NAME, 
      process.env.AZURE_STORAGE_ACCOUNT_KEY
    );

    const blobSas = generateBlobSASQueryParameters({
      containerName: this.containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'), // Permissions de lecture
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expiration dans 1 heure
    }, sharedKeyCredential).toString();

    const sasUrl = `${containerClient.getBlockBlobClient(blobName).url}?${blobSas}`;
    return sasUrl;
  }
}
