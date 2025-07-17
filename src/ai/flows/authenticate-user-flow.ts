
'use server';
/**
 * @fileOverview A Genkit flow to authenticate a user via an access code.
 * NOTE: This is a simplified version for development. It only supports the DEV12345 code.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase-config';

// Define the input schema for the authentication flow
const AuthenticateUserInputSchema = z.object({
  accessCode: z.string().trim().min(1, 'Access code is required.'),
});
export type AuthenticateUserInput = z.infer<typeof AuthenticateUserInputSchema>;

// Define the shape of the user data
const UserDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable(),
});

// Define the output schema for the flow
const AuthenticateUserOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: UserDataSchema.nullable(),
});
export type AuthenticateUserOutput = z.infer<typeof AuthenticateUserOutputSchema>;


// This is the exported server action that the client will call.
export const authenticateUser = ai.defineFlow(
  {
    name: 'authenticateUserFlow',
    inputSchema: AuthenticateUserInputSchema,
    outputSchema: AuthenticateUserOutputSchema,
  },
  async ({ accessCode }) => {
    // --- Development Backdoor ---
    // This allows testing without a live Supabase connection.
    // Use the code 'DEV12345' to log in as a mock user.
    if (accessCode === 'DEV12345') {
      const devUser = {
        id: 'dev-user-01',
        name: 'Dev User',
        email: 'dev@example.com',
      };

      try {
        const userRef = doc(db, "users", devUser.id);
        await setDoc(userRef, {
          name: devUser.name,
          email: devUser.email,
          last_login: new Date().toISOString(),
        }, { merge: true });

        return {
          success: true,
          message: 'Dev user authenticated successfully.',
          user: devUser,
        };
      } catch (firestoreError) {
        console.error('Firestore error for dev user:', firestoreError);
        return { success: false, message: 'Could not save dev user data to Firestore.', user: null };
      }
    }
    
    // --- Fallback for any other code ---
    return { success: false, message: 'Invalid access code. Please use the developer code to proceed.', user: null };
  }
);
