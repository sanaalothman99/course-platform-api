import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

@Injectable()
export class UploadService {

  async uploadVideo(file: Express.Multer.File, courseId: string) {
    const fileName = ${courseId}/${Date.now()}-${file.originalname};

    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const publicUrl = ${process.env.R2_PUBLIC_URL}/${fileName};
    return { url: publicUrl };
  }

  async uploadPdf(file: Express.Multer.File, courseId: string) {
    const fileName = pdfs/${courseId}/${Date.now()}-${file.originalname};

    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: 'application/pdf',
    }));

    const publicUrl = ${process.env.R2_PUBLIC_URL}/${fileName};
    return { url: publicUrl };
  }

  async uploadImage(file: Express.Multer.File, folder: string) {
    const fileName = images/${folder}/${Date.now()}-${file.originalname};

    const { error } = await supabase.storage
      .from('videos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl };
  }
}