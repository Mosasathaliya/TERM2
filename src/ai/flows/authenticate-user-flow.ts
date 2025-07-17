
'use server';
/**
 * @fileOverview A Genkit flow to authenticate a user via an access code.
 * NOTE: This is a simplified version for development. It will always log in the dev user.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase-config';

// Define the input schema for the authentication flow
const AuthenticateUserInputSchema = z.object({
  accessCode: z.string().trim().optional(), // Code is optional now
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
    // This flow now ALWAYS succeeds for development purposes.
    // It logs in a mock user regardless of the input code.
    const devUser = {
      id: 'dev-user-01',
      name: 'Dev User',
      email: 'dev@example.com',
    };

    try {
      // We still save to Firestore to simulate a real user session.
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
      // Even if firestore fails, we can still proceed in the UI for dev.
      return { 
        success: true, 
        message: 'Dev user authenticated, but Firestore save failed.', 
        user: devUser 
      };
    }
  }
);
