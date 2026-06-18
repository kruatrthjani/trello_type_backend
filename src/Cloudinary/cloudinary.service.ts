import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  private configureCloudinary(): void {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    const missing: string[] = [];
    if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
    if (!apiKey) missing.push('CLOUDINARY_API_KEY');
    if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

    if (missing.length > 0) {
      throw new BadRequestException(`Cloudinary environment variables missing: ${missing.join(', ')}`);
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  async uploadImage(file: FileUpload): Promise<string> {
    this.configureCloudinary();
    const { createReadStream } = file;

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cards',
          resource_type: 'auto',
        },
        (error: Error | undefined, result?: UploadApiResponse) => {
          if (error) {
            reject(new BadRequestException(`Cloudinary upload failed: ${error.message}`));
            return;
          }

          if (!result?.secure_url) {
            reject(new BadRequestException('Cloudinary upload did not return a secure URL.'));
            return;
          }

          resolve(result.secure_url);
        },
      );

      const stream = createReadStream() as Readable;
      stream.on('error', (error: Error) => {
        reject(new BadRequestException(`Failed to read upload stream: ${error.message}`));
      });
      stream.pipe(uploadStream);
    });
  }
}
