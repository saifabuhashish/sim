'use client'

import { useState, useEffect, useMemo } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import Fuse from 'fuse.js'
import { Plus } from 'lucide-react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command'
import { getBlocksByCategory } from '@/blocks'
import type { BlockCategory } from '@/blocks/types'
import { useDebounce } from '@/hooks/use-debounce'

export function AddStepPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<BlockCategory>('blocks')
  const debounced = useDebounce(search, 120)

  const items = useMemo(
    () =>
      getBlocksByCategory(category).filter(
        (b) => b.type !== 'starter' && !b.hideFromToolbar
      ),
    [category]
  )

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'description', weight: 0.3 },
        ],
        threshold: 0.4,
      }),
    [items]
  )

  const results = useMemo(() => {
    if (!debounced.trim()) return items
    return fuse.search(debounced).map((r) => r.item)
  }, [debounced, fuse, items])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active?.hasAttribute('contenteditable')

      if (e.key === '/' && !isInput) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSelect = (type: string) => {
    window.dispatchEvent(
      new CustomEvent('add-block-from-toolbar', { detail: { type } })
    )
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute left-6 top-6 z-10 rounded-md border border-dashed bg-background px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
      >
        <Plus className="mr-2 h-4 w-4" /> Add step…
      </button>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/10" />
          <DialogPrimitive.Content asChild>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed left-6 top-6 z-50 w-[420px] max-h-[85vh] overflow-hidden rounded-lg border bg-background shadow-lg"
            >
              <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12">
                <CommandInput
                  placeholder="Add a step …"
                  value={search}
                  onValueChange={setSearch}
                />
                <div className="border-b px-3 pt-2">
                  <div className="flex gap-6">
                    <button
                      onClick={() => setCategory('blocks')}
                      className={`pb-1 text-sm font-medium ${category === 'blocks' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}
                    >
                      Blocks
                    </button>
                    <button
                      onClick={() => setCategory('tools')}
                      className={`pb-1 text-sm font-medium ${category === 'tools' ? 'border-b-2 border-foreground' : 'text-muted-foreground'}`}
                    >
                      Tools
                    </button>
                  </div>
                </div>
                <CommandList className="max-h-[calc(85vh-96px)] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {results.map((item) => (
                      <CommandItem
                        key={item.type}
                        onSelect={() => handleSelect(item.type)}
                        className="h-11 cursor-pointer rounded-md hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-md"
                            style={{ backgroundColor: item.bgColor }}
                          >
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </CommandList>
              </Command>
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
