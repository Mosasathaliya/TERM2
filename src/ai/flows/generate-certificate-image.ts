
'use server';
/**
 * @fileOverview A flow for generating a branded certificate background image.
 */
import { z } from 'zod';

const CertificateImageInputSchema = z.object({
  userName: z.string().describe('The name of the user receiving the certificate.'),
});
export type CertificateImageInput = z.infer<typeof CertificateImageInputSchema>;

const CertificateImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type CertificateImageOutput = z.infer<typeof CertificateImageOutputSchema>;

export async function generateCertificateImage(
  input: CertificateImageInput
): Promise<CertificateImageOutput> {
  const prompt = `A professional and prestigious certificate background for 'Speed of Mastery'. Use a color palette of deep navy blue and light sky blue. The design must be clean, elegant, and modern. Include a subtle, elegant watermark of a geometric brain icon in the center. On the bottom right, include a circular seal element that looks like a modern, official stamp. The seal should be light blue and contain abstract, clean lines, but no text.`;
    
  const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo",
		{
			headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}` },
			method: "POST",
			body: JSON.stringify({ inputs: prompt }),
		}
	);
	const imageBlob = await response.blob();
  const reader = new FileReader();
  const dataUrlPromise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
  });
  reader.readAsDataURL(imageBlob);
  const imageUrl = await dataUrlPromise;

  return { imageUrl };
}
