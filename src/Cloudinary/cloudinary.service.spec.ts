import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CloudinaryService(
      new ConfigService({
        CLOUDINARY_CLOUD_NAME: 'test-cloud',
        CLOUDINARY_API_KEY: 'test-key',
        CLOUDINARY_API_SECRET: 'test-secret',
      }),
    );
  });

  it('uploads a file and returns the secure URL', async () => {
    (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
      (_options: unknown, callback: (error: Error | undefined, result?: { secure_url: string }) => void) => {
        callback(undefined, { secure_url: 'https://example.com/image.jpg' });
        return {};
      },
    );

    const file = {
      createReadStream: jest.fn(() => ({
        pipe: jest.fn(),
        on: jest.fn(),
      })),
    } as any;

    await expect(service.uploadImage(file)).resolves.toBe('https://example.com/image.jpg');
  });
});
