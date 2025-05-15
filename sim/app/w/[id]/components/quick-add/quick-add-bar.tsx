import { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSidebarStore } from '@/stores/sidebar/store'
import { BlockCategory } from '@/blocks/types'
import { QuickAddPanel } from './quick-add-panel'
import { quickAddClasses, quickAddStyles } from './styles'

export function QuickAddBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { isCollapsed: isSidebarCollapsed } = useSidebarStore()
  const [activeTab, setActiveTab] = useState<BlockCategory>(() => {
    // Try to get the last active tab from localStorage
    const savedTab =
      typeof window !== 'undefined' ? localStorage.getItem('quickAddActiveTab') : null
    return (savedTab as BlockCategory) || 'blocks'
  })

  // Save active tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickAddActiveTab', activeTab)
    }
  }, [activeTab])

  const handleFocus = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as BlockCategory)
  }, [])

  // Calculate position based on sidebar state
  const barClasses = `fixed top-24 ${isSidebarCollapsed ? 'left-20' : 'left-64'} z-[45] w-[420px] h-10 bg-white rounded-lg border border-[#E0E0E0] shadow-sm`
  const panelClasses = `fixed top-36 ${isSidebarCollapsed ? 'left-20' : 'left-64'} z-[45] w-[480px] max-h-[560px] bg-white rounded-lg border border-[#E0E0E0] shadow-lg`

  return (
    <>
      <div id="quick-add" className={barClasses}>
        <div className="relative flex items-center h-full">
          <div className="flex-1 flex items-center">
            <Search className={`absolute left-3 h-4 w-4 text-[${quickAddStyles.iconColor}]`} />
            <input
              type="search"
              placeholder="Add a step..."
              className="h-full w-full bg-transparent border-none pl-9 pr-3 outline-none"
              role="search"
              onFocus={handleFocus}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
            <TabsList className="h-full w-36 grid grid-cols-2">
              <TabsTrigger
                value="blocks"
                className={`h-full w-full border-transparent transition-colors data-[state=active]:bg-white`}
              >
                Blocks
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className={`h-full w-full border-transparent transition-colors data-[state=active]:bg-white`}
              >
                Tools
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isOpen && (
        <QuickAddPanel
          searchQuery={searchValue}
          activeTab={activeTab}
          onClose={() => setIsOpen(false)}
          customClasses={panelClasses}
        />
      )}
    </>
  )
}
