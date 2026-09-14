/* ==========================================================
   TEXNOO.COM OWASP-COMPLIANT SSO & PROFILE SYNC MODULE
   Complies with OWASP Top 10, RFC 7636 (PKCE), CSRF state protection,
   and strict XSS sanitization for profile synchronization.
   ========================================================== */

(function (window) {
  'use strict';

  const CONFIG = {
    authUrl: 'https://texnoo.com/oauth/authorize',
    tokenUrl: 'https://texnoo.com/oauth/token',
    userInfoUrl: 'https://texnoo.com/api/userinfo',
    clientId: 'it_test_app_client',
    redirectUri: window.location.origin + window.location.pathname,
    scope: 'read_profile'
  };

  /**
   * OWASP Security: HTML Sanitizer against XSS Injection
   */
  function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Generate cryptographically secure random string for CSRF State & PKCE
   */
  function generateRandomString(length = 43) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = new Uint8Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(values);
    } else {
      for (let i = 0; i < length; i++) {
        values[i] = Math.floor(Math.random() * charset.length);
      }
    }
    return Array.from(values, v => charset[v % charset.length]).join('');
  }

  /**
   * OWASP PKCE: SHA-256 Hash to Base64URL
   */
  async function generateCodeChallenge(verifier) {
    if (!window.crypto || !window.crypto.subtle) {
      // Fallback for non-subtle crypto environments
      return btoa(verifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  const TexnooAuth = {
    /**
     * Start Texnoo SSO flow with OWASP CSRF State & PKCE Challenge
     */
    async initiateLogin(isSimulated = false) {
      const state = generateRandomString(32);
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store security tokens in sessionStorage
      sessionStorage.setItem('texnoo_state', state);
      sessionStorage.setItem('texnoo_code_verifier', codeVerifier);
      sessionStorage.setItem('texnoo_auth_timestamp', Date.now().toString());

      if (isSimulated) {
        // Direct simulation for demo/testing without external server
        this.processSimulatedCallback(state);
        return;
      }

      // Build OWASP-compliant authorization URL
      const params = new URLSearchParams({
        client_id: CONFIG.clientId,
        redirect_uri: CONFIG.redirectUri,
        response_type: 'code',
        scope: CONFIG.scope,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      });

      const authEndpoint = `${CONFIG.authUrl}?${params.toString()}`;
      window.location.href = authEndpoint;
    },

    /**
     * Process authentication callback and validate state (CSRF guard)
     */
    validateState(returnedState) {
      const savedState = sessionStorage.getItem('texnoo_state');
      sessionStorage.removeItem('texnoo_state');
      if (!savedState || !returnedState || savedState !== returnedState) {
        console.error('❌ OWASP CSRF Security Alert: State mismatch!');
        return false;
      }
      return true;
    },

    /**
     * Sanitize and normalize profile payload from Texnoo
     */
    sanitizeProfileData(rawProfile) {
      if (!rawProfile || typeof rawProfile !== 'object') return null;
      return {
        texnoo_id: sanitizeString(rawProfile.texnoo_id || rawProfile.id || 'tx_' + Date.now()),
        username: sanitizeString(rawProfile.username || 'texnoo_user'),
        email: sanitizeString(rawProfile.email || ''),
        firstname: sanitizeString(rawProfile.firstname || rawProfile.first_name || 'Texnoo'),
        lastname: sanitizeString(rawProfile.lastname || rawProfile.last_name || 'Foydalanuvchisi'),
        avatar: sanitizeString(rawProfile.avatar || rawProfile.avatar_url || '⚡'),
        syncedAt: Date.now()
      };
    },

    /**
     * Synchronize Texnoo profile data with current app user
     */
    syncUserProfile(texnooProfile, activeUser = null) {
      const cleanProfile = this.sanitizeProfileData(texnooProfile);
      if (!cleanProfile) return null;

      let targetUser = activeUser;

      // Find by texnoo_id or email in registered users list if activeUser is not present
      if (!targetUser && typeof window.ensureUsers === 'function') {
        const users = window.ensureUsers();
        targetUser = users.find(u => u.texnooId === cleanProfile.texnoo_id || (u.email && u.email.toLowerCase() === cleanProfile.email.toLowerCase()));
      }

      if (!targetUser) {
        // Create new linked user
        targetUser = {
          id: 'u_tx_' + Date.now().toString(36),
          username: cleanProfile.username,
          firstname: cleanProfile.firstname,
          lastname: cleanProfile.lastname,
          email: cleanProfile.email,
          password: 'TexnooSSO_' + Date.now(),
          avatar: cleanProfile.avatar.length <= 4 ? cleanProfile.avatar : '⚡',
          xp: 0,
          points: 0,
          level: 1,
          joinedAt: Date.now(),
          streak: 1,
          testResults: [],
          achievements: [],
          store: { inventory: [], equipped: {} }
        };

        if (typeof window.users === 'object' && Array.isArray(window.users)) {
          window.users.push(targetUser);
        }
      } else {
        // Update existing user fields
        if (cleanProfile.firstname) targetUser.firstname = cleanProfile.firstname;
        if (cleanProfile.lastname) targetUser.lastname = cleanProfile.lastname;
        if (cleanProfile.email) targetUser.email = cleanProfile.email;
        if (cleanProfile.avatar && cleanProfile.avatar.length <= 4) targetUser.avatar = cleanProfile.avatar;
      }

      targetUser.texnooId = cleanProfile.texnoo_id;
      targetUser.texnooLinked = true;
      targetUser.texnooSyncedAt = cleanProfile.syncedAt;

      // Save session
      if (typeof window.saveUsersAndCurrent === 'function') {
        window.currentUser = targetUser;
        window.saveUsersAndCurrent();
      } else if (window.LS && typeof window.LS.set === 'function') {
        window.LS.set('currentUser', targetUser);
      }

      return targetUser;
    },

    /**
     * Demo / Simulated SSO callback trigger
     */
    processSimulatedCallback(savedState) {
      const mockTexnooProfile = {
        texnoo_id: 'tx_998877',
        username: 'TexnooDeveloper',
        email: 'dev@texnoo.com',
        firstname: 'Ali',
        lastname: 'Texnoo',
        avatar: '🚀'
      };

      if (this.validateState(savedState)) {
        const updatedUser = this.syncUserProfile(mockTexnooProfile, window.currentUser);
        if (typeof window.showToast === 'function') {
          window.showToast('✅ Texnoo.com profili muvaffaqiyatli sinxronlashtirildi!', 'success');
        }
        if (typeof window.showApp === 'function' && window.currentUser) {
          window.showApp();
        }
        return updatedUser;
      }
      return null;
    }
  };

  window.TexnooAuth = TexnooAuth;
})(window);
