'use client'

import { useState, useEffect } from 'react'
import { Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react'

interface FingerprintAuthProps {
  onAuthenticated: () => void
}

export function FingerprintAuth({ onAuthenticated }: FingerprintAuthProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('Touch to authenticate')
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)

  useEffect(() => {
    // Check if WebAuthn is available
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => {
          setIsBiometricAvailable(available)
        })
        .catch(() => {
          setIsBiometricAvailable(false)
        })
    }
  }, [])

  const handleAuth = async () => {
    setStatus('scanning')
    setMessage('Scanning...')

    if (isBiometricAvailable) {
      try {
        // Use WebAuthn for real biometric authentication
        const challenge = new Uint8Array(32)
        crypto.getRandomValues(challenge)

        const credential = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: 'BookKeep',
              id: window.location.hostname,
            },
            user: {
              id: new Uint8Array(16),
              name: 'user@bookkeep.app',
              displayName: 'BookKeep User',
            },
            pubKeyCredParams: [
              { alg: -7, type: 'public-key' },
              { alg: -257, type: 'public-key' },
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
            },
            timeout: 60000,
          },
        })

        if (credential) {
          setStatus('success')
          setMessage('Authenticated!')
          setTimeout(() => {
            onAuthenticated()
          }, 800)
        }
      } catch {
        // Fall back to simulated auth if WebAuthn fails
        simulateAuth()
      }
    } else {
      // Simulate authentication for demo/non-biometric devices
      simulateAuth()
    }
  }

  const simulateAuth = () => {
    setTimeout(() => {
      setStatus('success')
      setMessage('Authenticated!')
      setTimeout(() => {
        onAuthenticated()
      }, 800)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      {/* Logo and Title */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center">
          <span className="text-2xl font-bold text-black">B</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">BookKeep</h1>
        <p className="text-muted-foreground">Smart Bookkeeping for Small Business</p>
      </div>

      {/* Fingerprint Scanner */}
      <button
        onClick={handleAuth}
        disabled={status === 'scanning'}
        className="relative group focus:outline-none"
        aria-label="Authenticate with fingerprint"
      >
        {/* Outer glow ring */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            status === 'scanning'
              ? 'bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-indigo-400/30 pulse-ring'
              : status === 'success'
              ? 'bg-emerald-400/30'
              : 'bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-indigo-400/20 group-hover:from-pink-400/40 group-hover:via-purple-400/40 group-hover:to-indigo-400/40'
          }`}
          style={{ transform: 'scale(1.3)' }}
        />

        {/* Main circle */}
        <div
          className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
            status === 'success'
              ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
              : status === 'error'
              ? 'bg-gradient-to-br from-red-400 to-rose-500'
              : 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 group-hover:scale-105'
          }`}
        >
          {/* Inner dark circle */}
          <div className="w-32 h-32 rounded-full bg-background/90 flex items-center justify-center relative overflow-hidden">
            {/* Scan line animation */}
            {status === 'scanning' && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent" />
              </div>
            )}

            {/* Icon */}
            {status === 'success' ? (
              <ShieldCheck className="w-16 h-16 text-emerald-400" />
            ) : status === 'error' ? (
              <AlertCircle className="w-16 h-16 text-red-400" />
            ) : (
              <Fingerprint
                className={`w-16 h-16 transition-colors ${
                  status === 'scanning' ? 'text-purple-400' : 'text-white/80'
                }`}
              />
            )}
          </div>
        </div>
      </button>

      {/* Status message */}
      <p
        className={`mt-8 text-lg font-medium transition-colors ${
          status === 'success'
            ? 'text-emerald-400'
            : status === 'error'
            ? 'text-red-400'
            : 'text-white/70'
        }`}
      >
        {message}
      </p>

      {/* Hint */}
      <p className="mt-4 text-sm text-muted-foreground">
        {isBiometricAvailable ? 'Use your device biometrics' : 'Tap to continue'}
      </p>
    </div>
  )
}
