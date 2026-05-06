'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OPCOS, CATEGORIES } from '@/lib/utils'
import { X } from 'lucide-react'

interface IdeaFormProps {
  onClose: () => void
}

export function IdeaForm({ onClose }: IdeaFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const fd   = new FormData(e.currentTarget)
    const body = {
      title:       fd.get('title'),
      description: fd.get('description'),
      impact:      fd.get('impact'),
      opco:        fd.get('opco'),
      type:        fd.get('type'),
      category:    fd.get('category'),
      tags:        (fd.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean),
    }

    startTransition(async () => {
      const res = await fetch('/api/spark/ideas', {
        method:  'POST',
        headers: { 'content-type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.formErrors?.[0] || 'Submission failed. Please try again.')
        return
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <div>
            <h2 className="font-semibold text-text-primary">Submit an Idea</h2>
            <p className="text-xs text-text-muted mt-0.5">Spot a problem or opportunity — pitch it to the continent.</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Idea title *</label>
            <input name="title" required maxLength={120} placeholder="Short, punchy title"
              className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Description *</label>
            <textarea name="description" required rows={4} minLength={20} maxLength={2000}
              placeholder="Describe the problem, your solution, and why it matters..."
              className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Expected impact</label>
            <input name="impact" maxLength={200} placeholder="e.g. +20% transaction success rate, −30% fraud losses"
              className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Your OpCo *</label>
              <select name="opco" required
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-blue transition-colors">
                <option value="">Select OpCo</option>
                {OPCOS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Category *</label>
              <select name="category" required
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-blue transition-colors">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Type</label>
              <select name="type"
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-blue transition-colors">
                <option value="OPPORTUNITY">Opportunity</option>
                <option value="PROBLEM">Problem</option>
                <option value="IMPROVEMENT">Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Tags</label>
              <input name="tags" placeholder="AI, Fraud, Voice (comma-separated)"
                className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors" />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? 'Submitting…' : 'Submit Idea'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
