// CSS Variables for the QuickAdd components
export const quickAddStyles = {
  width: '420px',
  height: '40px',
  gap: '8px',
  panelWidth: '480px',
  panelMaxHeight: '560px',
  borderColor: '#E0E0E0',
  accentColor: '#4F46E5',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  iconColor: '#9E9E9E',
}

// CSS classes that can be reused
export const quickAddClasses = {
  bar: 'fixed top-24 left-6 z-[45] w-[420px] h-10 bg-white rounded-lg border border-[#E0E0E0] shadow-sm',
  panel:
    'fixed top-36 left-6 z-[45] w-[480px] max-h-[560px] bg-white rounded-lg border border-[#E0E0E0] shadow-lg',
  activeTabIndicator: 'border-b-2 border-[#4F46E5]',
}
