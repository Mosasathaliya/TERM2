
'use server';
/**
 * @fileOverview A Genkit flow to authenticate a user via an access code from Supabase
 * and then create or update their record in Firestore.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase-config';

// Define the input schema for the authentication flow
const AuthenticateUserInputSchema = z.object({
  accessCode: z.string().trim().min(1, 'Access code is required.'),
});
export type AuthenticateUserInput = z.infer<typeof AuthenticateUserInputSchema>;

// Define the shape of the user data we expect from Supabase
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

// Define the main Genkit flow
export const authenticateUserFlow = ai.defineFlow(
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
        return { success: false, message: 'Could not save dev user data.', user: null };
      }
    }
    // --- End of Development Backdoor ---

    // Step 1: Query Supabase for the access code
    // This part will only run for non-developer codes.
    const { data: accessData, error: supabaseError } = await supabase
      .from('user_access') // The table name in Supabase
      .select('user_id, is_active, users(id, name, email)')
      .eq('access_code', accessCode)
      .single();

    if (supabaseError || !accessData) {
      console.error('Supabase query error:', supabaseError?.message);
      return { success: false, message: 'Invalid or expired access code.', user: null };
    }

    if (!accessData.is_active) {
      return { success: false, message: 'This access code has expired.', user: null };
    }
    
    // The `users` data is nested because of the foreign key relationship
    const userData = accessData.users;
    if (!userData) {
      return { success: false, message: 'Could not find user associated with this code.', user: null };
    }

    const validatedUser = UserDataSchema.parse(userData);

    // Step 2: Save or update the user data in Firestore
    try {
      const userRef = doc(db, "users", validatedUser.id);
      
      // Optional: Check if user already exists to avoid unnecessary writes
      // const userSnap = await getDoc(userRef);
      
      await setDoc(userRef, {
        name: validatedUser.name,
        email: validatedUser.email,
        last_login: new Date().toISOString(),
      }, { merge: true }); // Use merge to avoid overwriting existing fields

    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      // Decide if this should be a critical failure
      return { success: false, message: 'Could not save user data.', user: null };
    }

    // Step 3: Return a success response with the user data
    return {
      success: true,
      message: 'Authentication successful.',
      user: validatedUser,
    };
  }
);

// Export a wrapper function for client-side use
export async function authenticateUser(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
  return authenticateUserFlow(input);
}
