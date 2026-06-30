import { create } from 'zustand'

interface ShowcaseStore {
  requestedVariantId: string | null
  requestVariant: (id: string) => void
  clearRequest: () => void
}

export const useShowcase = create<ShowcaseStore>()((set) => ({
  requestedVariantId: null,
  requestVariant: (id) => set({ requestedVariantId: id }),
  clearRequest: () => set({ requestedVariantId: null }),
}))
