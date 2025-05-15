import { useCallback, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllBlocks, getBlocksByCategory } from '@/blocks'
import { BlockCategory } from '@/blocks/types'
import { ToolbarBlock } from '../toolbar/components/toolbar-block/toolbar-block'
import { quickAddClasses } from './styles'

interface QuickAddPanelProps {
  searchQuery: string
  activeTab: BlockCategory
  onClose: () => void
  customClasses?: string
}

export function QuickAddPanel({
  searchQuery,
  activeTab,
  onClose,
  customClasses,
}: QuickAddPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks with improved detection for canvas
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // If click isn't on the panel or search bar, close the panel
      if (!target.closest('#quick-add') && !target.closest('#quick-panel')) {
        onClose()
      }

      // Also check specifically for canvas elements
      const isCanvas =
        target.tagName === 'CANVAS' ||
        target.classList.contains('canvas') ||
        target.closest('.canvas') ||
        target.closest('[data-testid="workflow-canvas"]') ||
        target.closest('[role="application"]') ||
        target.closest('[role="presentation"]')

      if (isCanvas) {
        onClose()
      }
    }

    // Use both capture and bubbling phase to ensure we catch all clicks
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [onClose])

  // Get filtered blocks based on search query and active tab
  const blocks = useCallback(() => {
    const filteredBlocks = !searchQuery.trim() ? getBlocksByCategory(activeTab) : getAllBlocks()

    return filteredBlocks.filter((block) => {
      if (block.type === 'starter' || block.hideFromToolbar) return false

      return (
        !searchQuery.trim() ||
        block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery, activeTab])

  const visibleBlocks = blocks()

  // Handle block selection
  const handleBlockSelection = useCallback(() => {
    // The block selection is handled by the ToolbarBlock component's onClick
    // We just need to close the panel after selection
    onClose()
  }, [onClose])

  return (
    <div
      id="quick-panel"
      ref={panelRef}
      className={customClasses || quickAddClasses.panel}
      role="listbox"
      aria-labelledby="quick-add"
    >
      <ScrollArea ref={scrollAreaRef} className="h-full max-h-[480px] px-4 py-4 overflow-auto">
        {visibleBlocks.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">No blocks found</div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleBlocks.map((block) => (
              <div
                key={block.type}
                className="hover:bg-slate-50 rounded-md"
                role="option"
                onClick={handleBlockSelection}
              >
                <ToolbarBlock config={block} />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
