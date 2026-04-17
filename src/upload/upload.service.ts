import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

@Injectable()
export class UploadService {

  async uploadVideo(file: Express.Multer.File, courseId: string) {
    const fileName = `${courseId}/${Date.now()}-${file.originalname}`;

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

  async uploadPdf(file: Express.Multer.File, courseId: string) {
    const fileName = `pdfs/${courseId}/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('videos')
      .upload(fileName, file.buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl };
  }

  async uploadImage(file: Express.Multer.File, folder: string) {
    const fileName = `images/${folder}/${Date.now()}-${file.originalname}`;

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