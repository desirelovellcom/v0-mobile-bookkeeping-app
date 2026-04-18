'use client'

import { useRef, useState } from 'react'
import { Camera, FileText, X, Loader2, Check } from 'lucide-react'
import { createWorker, PSM } from 'tesseract.js'
import { useBookkeepingStore, Transaction } from '@/lib/store'

interface ScanButtonProps {
  onScanComplete?: (text: string) => void
}

export function ScanButton({ onScanComplete }: ScanButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const addTransaction = useBookkeepingStore((state) => state.addTransaction)

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setIsOpen(false)

    try {
      const worker = await createWorker('eng', 1, {
        logger: () => {},
      })

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
      })

      const imageUrl = URL.createObjectURL(file)
      const { data } = await worker.recognize(imageUrl)
      
      await worker.terminate()
      URL.revokeObjectURL(imageUrl)

      const extractedText = data.text.trim()
      setScanResult(extractedText)

      // Parse the extracted text to find amounts
      const amountMatch = extractedText.match(/\$?\d+[,.]?\d*\.?\d{0,2}/g)
      const amount = amountMatch 
        ? parseFloat(amountMatch[amountMatch.length - 1].replace(/[$,]/g, ''))
        : 0

      // Create a transaction from the scanned data
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'expense',
        amount: amount || 0,
        category: 'Other',
        description: extractedText.substring(0, 100) || 'Scanned receipt',
        date: new Date().toISOString(),
        extractedText,
      }

      addTransaction(transaction)
      
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setScanResult(null)
      }, 3000)

      onScanComplete?.(extractedText)
    } catch (error) {
      console.error('OCR Error:', error)
      setScanResult('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main scan button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isProcessing}
          className="relative group focus:outline-none"
          aria-label="Scan document"
        >
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-50 blur-lg group-hover:opacity-75 transition-opacity pulse-ring" />
          
          {/* Button */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center shadow-2xl shadow-purple-500/30 transition-transform group-hover:scale-110 group-active:scale-95">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            ) : showSuccess ? (
              <Check className="w-8 h-8 text-black" />
            ) : isOpen ? (
              <X className="w-8 h-8 text-black" />
            ) : (
              <Camera className="w-8 h-8 text-black" />
            )}
          </div>
        </button>

        {/* Action menu */}
        {isOpen && !isProcessing && (
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 flex gap-4">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110 active:scale-95"
              aria-label="Take photo"
            >
              <Camera className="w-6 h-6 text-black" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 transition-transform hover:scale-110 active:scale-95"
              aria-label="Upload file"
            >
              <FileText className="w-6 h-6 text-black" />
            </button>
          </div>
        )}
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-12 h-12 text-black animate-spin" />
            </div>
            <p className="text-white text-lg font-medium">Processing document...</p>
            <p className="text-muted-foreground text-sm mt-2">Extracting data with OCR</p>
          </div>
        </div>
      )}

      {/* Success notification */}
      {showSuccess && scanResult && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-card border border-border rounded-2xl p-4 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium">Document scanned!</p>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {scanResult.substring(0, 100)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
