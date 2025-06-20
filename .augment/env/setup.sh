#!/bin/bash

# Update system packages
sudo apt-get update

# Install Node.js and npm if not present
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verify Node.js and npm installation
node --version
npm --version

# Navigate to workspace
cd /mnt/persist/workspace

# Install project dependencies
npm install

# Install testing dependencies
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Create vitest configuration
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

# Create test setup file
mkdir -p src/test
cat > src/test/setup.ts << 'EOF'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})
EOF

# Create test for utils.ts
mkdir -p src/lib/__tests__
cat > src/lib/__tests__/utils.test.ts << 'EOF'
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })
})
EOF

# Create fixed test for LoanCalculator
mkdir -p src/components/__tests__
cat > src/components/__tests__/LoanCalculator.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoanCalculator from '../LoanCalculator'

describe('LoanCalculator', () => {
  it('should render loan calculator form', () => {
    render(<LoanCalculator />)
    expect(screen.getByText(/loan repayment calculator/i)).toBeInTheDocument()
  })

  it('should display EMI calculation', () => {
    render(<LoanCalculator />)
    // Test that EMI is displayed (the component shows "EMI: ₹" text)
    const emiElement = screen.getByText(/emi:/i)
    expect(emiElement).toBeInTheDocument()
  })

  it('should display loan amount input', () => {
    render(<LoanCalculator />)
    const loanAmountInput = screen.getByLabelText(/select loan amount/i)
    expect(loanAmountInput).toBeInTheDocument()
  })

  it('should display years input', () => {
    render(<LoanCalculator />)
    const yearsInput = screen.getByLabelText(/select loan duration/i)
    expect(yearsInput).toBeInTheDocument()
  })
})
EOF

# Create test for crop allocation utils
mkdir -p src/components/crop-allocation/__tests__
cat > src/components/crop-allocation/__tests__/cropAllocationUtils.test.ts << 'EOF'
import { describe, it, expect } from 'vitest'
import { getRiskColor, getDemandColor, optimizeAllocation } from '../cropAllocationUtils'

describe('cropAllocationUtils', () => {
  describe('getRiskColor', () => {
    it('should return correct color for low risk', () => {
      expect(getRiskColor('low')).toBe('bg-green-100 text-green-800')
    })

    it('should return correct color for medium risk', () => {
      expect(getRiskColor('medium')).toBe('bg-yellow-100 text-yellow-800')
    })

    it('should return correct color for high risk', () => {
      expect(getRiskColor('high')).toBe('bg-red-100 text-red-800')
    })

    it('should return default color for unknown risk', () => {
      expect(getRiskColor('unknown')).toBe('bg-gray-100 text-gray-800')
    })
  })

  describe('getDemandColor', () => {
    it('should return correct color for high demand', () => {
      expect(getDemandColor('high')).toBe('text-green-600')
    })

    it('should return correct color for medium demand', () => {
      expect(getDemandColor('medium')).toBe('text-yellow-600')
    })

    it('should return correct color for low demand', () => {
      expect(getDemandColor('low')).toBe('text-red-600')
    })
  })

  describe('optimizeAllocation', () => {
    it('should optimize crop allocation correctly', () => {
      const mockRecommendations = [
        {
          id: 'wheat',
          name: 'Wheat',
          suitability: 85,
          profitability: 75,
          expectedYield: 3.5,
          risk: 'low' as const,
          marketDemand: 'high' as const,
          waterRequirement: 'medium' as const,
          season: 'winter' as const
        }
      ]
      
      const result = optimizeAllocation(mockRecommendations, 10)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('wheat')
      expect(result[0].area).toBeGreaterThan(0)
      expect(result[0].area).toBeLessThanOrEqual(10)
    })

    it('should handle empty recommendations', () => {
      const result = optimizeAllocation([], 10)
      expect(result).toHaveLength(0)
    })
  })
})
EOF

# Create test for crops database
mkdir -p src/data/__tests__
cat > src/data/__tests__/cropsDatabase.test.ts << 'EOF'
import { describe, it, expect } from 'vitest'
import { getCropById, getCropsByCategory, getCompatibleCrops, CROPS_DATABASE } from '../cropsDatabase'

describe('cropsDatabase', () => {
  describe('getCropById', () => {
    it('should return crop by id', () => {
      const wheat = getCropById('wheat')
      expect(wheat).toBeDefined()
      expect(wheat?.name).toBe('Wheat')
    })

    it('should return undefined for non-existent crop', () => {
      const nonExistent = getCropById('non-existent')
      expect(nonExistent).toBeUndefined()
    })
  })

  describe('getCropsByCategory', () => {
    it('should return crops by category', () => {
      const grainCrops = getCropsByCategory('Grain')
      expect(grainCrops.length).toBeGreaterThan(0)
      expect(grainCrops.every(crop => crop.category === 'Grain')).toBe(true)
    })

    it('should return empty array for non-existent category', () => {
      const nonExistent = getCropsByCategory('NonExistent')
      expect(nonExistent).toHaveLength(0)
    })
  })

  describe('getCompatibleCrops', () => {
    it('should return compatible crops for soil and climate', () => {
      const compatible = getCompatibleCrops('Loam', 'Temperate')
      expect(compatible.length).toBeGreaterThan(0)
      expect(compatible.every(crop => 
        crop.soilCompatibility.includes('Loam') && 
        crop.climateCompatibility.includes('Temperate')
      )).toBe(true)
    })

    it('should return empty array for incompatible conditions', () => {
      const incompatible = getCompatibleCrops('NonExistentSoil', 'NonExistentClimate')
      expect(incompatible).toHaveLength(0)
    })
  })

  describe('CROPS_DATABASE', () => {
    it('should have valid crop data structure', () => {
      expect(CROPS_DATABASE.length).toBeGreaterThan(0)
      
      CROPS_DATABASE.forEach(crop => {
        expect(crop.id).toBeDefined()
        expect(crop.name).toBeDefined()
        expect(crop.category).toBeDefined()
        expect(Array.isArray(crop.soilCompatibility)).toBe(true)
        expect(Array.isArray(crop.climateCompatibility)).toBe(true)
        expect(typeof crop.yieldPerAcre).toBe('number')
        expect(typeof crop.marketPrice).toBe('number')
      })
    })

    it('should have unique crop ids', () => {
      const ids = CROPS_DATABASE.map(crop => crop.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })
})
EOF

# Create fixed test for theme context
mkdir -p src/contexts/__tests__
cat > src/contexts/__tests__/ThemeContext.test.tsx << 'EOF'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Test component that uses the theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle">Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('should provide default light theme', () => {
    // Mock localStorage to return null (no saved theme)
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('should toggle theme correctly', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue(null)
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const toggleButton = screen.getByTestId('toggle')
    const themeDisplay = screen.getByTestId('theme')

    expect(themeDisplay).toHaveTextContent('light')
    
    fireEvent.click(toggleButton)
    expect(themeDisplay).toHaveTextContent('dark')
    
    fireEvent.click(toggleButton)
    expect(themeDisplay).toHaveTextContent('light')
  })

  it('should load saved theme from localStorage', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue('dark')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })
})
EOF

# Create fixed test for mobile hook
mkdir -p src/hooks/__tests__
cat > src/hooks/__tests__/use-mobile.test.tsx << 'EOF'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return true for mobile screen size', () => {
    const mockMql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    
    vi.mocked(window.matchMedia).mockReturnValue(mockMql as any)
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('should return false for desktop screen size', () => {
    const mockMql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    
    vi.mocked(window.matchMedia).mockReturnValue(mockMql as any)
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('should handle media query changes', () => {
    const mockMql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    
    vi.mocked(window.matchMedia).mockReturnValue(mockMql as any)
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result, unmount } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    
    unmount()
    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
EOF

# Add test script to package.json
npm pkg set scripts.test="vitest"
npm pkg set scripts.test:ui="vitest --ui"
npm pkg set scripts.test:coverage="vitest --coverage"

# Add vi to global types for vitest
cat >> src/vite-env.d.ts << 'EOF'

/// <reference types="vitest/globals" />
EOF

# Update tsconfig to include test files
cat > tsconfig.test.json << 'EOF'
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.spec.ts", 
    "src/**/*.spec.tsx",
    "src/test/setup.ts"
  ]
}
EOF

# Update main tsconfig.json to reference test config
cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.test.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "noImplicitAny": false,
    "noUnusedParameters": false,
    "skipLibCheck": true,
    "allowJs": true,
    "noUnusedLocals": false,
    "strictNullChecks": false
  }
}
EOF

echo "Setup completed successfully!"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Project dependencies installed"
echo "Vitest testing framework configured"
echo "Test files created and fixed for utility functions"