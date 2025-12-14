import { supabase, supabaseAdmin } from '../supabase'
import { getRepositoryFactory } from '../repositories'

export interface SignUpData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResponse {
  user: any
  session: any
  error?: string
}

export interface PasswordResetData {
  email: string
}

export interface UpdatePasswordData {
  password: string
}

export interface TwoFactorData {
  code: string
}

export class AuthService {
  // Get fresh repository instance per operation using the static supabase client
  private getRepositories() {
    return getRepositoryFactory(supabase)
  }

  /**
   * Sign up a new user with Supabase Auth
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone
          }
        }
      })

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      // If signup successful and user created, also create user profile in our users table
      if (authData.user && !authData.user.email_confirmed_at) {
        // User needs email confirmation, but we can still create the profile
        await this.createUserProfile(authData.user, data)
      }

      return {
        user: authData.user,
        session: authData.session,
        error: undefined
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      // Update last login - don't fail auth if this fails
      if (authData.user) {
        try {
          const userRepo = this.getRepositories().getUserRepository()
          await userRepo.updateLastLogin(authData.user.id)
        } catch (loginUpdateError) {
          console.warn('Failed to update last login:', loginUpdateError);
          // Don't fail the login just because we couldn't update last_login
        }
      }

      return {
        user: authData.user,
        session: authData.session,
        error: undefined
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { error: error.message }
      }
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get current user session
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        throw error
      }
      return session
    } catch (error) {
      throw error
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        throw error
      }
      return user
    } catch (error) {
      throw error
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(data: PasswordResetData): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Update password for authenticated user
   */
  async updatePassword(data: UpdatePasswordData): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Enable 2FA (TOTP) for user
   * Note: This is a simplified implementation. In production, you'd want to
   * generate the TOTP secret server-side and return the QR code URI
   */
  async enable2FA(): Promise<{ secret?: string; uri?: string; error?: string }> {
    try {
      // For now, we'll handle 2FA through our custom user table
      // In a full implementation, you'd use Supabase's MFA API
      const user = await this.getCurrentUser()
      if (!user) {
        return { error: 'No authenticated user' }
      }

      const userRepo = this.getRepositories().getUserRepository()
      const secret = this.generateTOTPSecret()

      await userRepo.enableTwoFactor(user.id, secret)

      return {
        secret,
        uri: `otpauth://totp/RoyalGems:${user.email}?secret=${secret}&issuer=RoyalGems`
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Verify and enable 2FA
   */
  async verify2FA(data: TwoFactorData): Promise<{ error?: string }> {
    try {
      // Simplified verification - in production, use a proper TOTP library
      const user = await this.getCurrentUser()
      if (!user) {
        return { error: 'No authenticated user' }
      }

      const userRepo = this.getRepositories().getUserRepository()
      const userProfile = await userRepo.findById(user.id)

      if (!userProfile || !userProfile.two_factor_secret) {
        return { error: '2FA not enabled' }
      }

      // For now, just mark as verified if code is provided
      // In production, validate the TOTP code properly
      if (data.code.length === 6) {
        return {}
      }

      return { error: 'Invalid 2FA code' }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Disable 2FA for user
   */
  async disable2FA(): Promise<{ error?: string }> {
    try {
      const user = await this.getCurrentUser()
      if (!user) {
        return { error: 'No authenticated user' }
      }

      const userRepo = this.getRepositories().getUserRepository()
      await userRepo.disableTwoFactor(user.id)

      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Generate a random TOTP secret
   */
  private generateTOTPSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let secret = ''
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return secret
  }

  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        return { user: null, session: null, error: error.message }
      }

      return {
        user: data.user,
        session: data.session,
        error: undefined
      }
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Create user profile in our custom users table
   * This is called after successful Supabase Auth signup
   */
  private async createUserProfile(authUser: any, signupData: SignUpData) {
    try {
      const userRepo = this.getRepositories().getUserRepository()

      await userRepo.create({
        id: authUser.id,
        email: authUser.email,
        password_hash: '', // Not stored here, handled by Supabase Auth
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        phone: signupData.phone,
        role: 'user',
        is_active: true,
        is_verified: false,
        two_factor_enabled: false
      })
    } catch (error) {
      console.error('Failed to create user profile:', error)
      // Don't throw here as auth signup was successful
    }
  }
}

// Export singleton instance
export const authService = new AuthService()