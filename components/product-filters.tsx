"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"

export interface FilterState {
  category: string
  subcategory: string
  type: string
  searchQuery: string
  priceRange: [number, number]
}

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    type: true,
  })

  const categories = [
    { id: "rings", name: "Rings" },
    { id: "necklaces", name: "Necklaces" },
    { id: "bracelets", name: "Bracelets" },
    { id: "earrings", name: "Earrings" },
  ]

  const subcategories: Record<string, string[]> = {
    rings: ["gold", "diamond", "gemstone"],
    necklaces: ["gold", "pearl", "diamond"],
    bracelets: ["gold", "pearl", "tennis"],
    earrings: ["stud", "drop", "hoop"],
  }

  const types = ["wedding", "engagement", "pendant", "tennis", "cocktail", "chain", "statement", "bangle"]

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category,
      subcategory: "",
    })
  }

  const handleSubcategoryChange = (subcategory: string) => {
    onFilterChange({
      ...filters,
      subcategory: filters.subcategory === subcategory ? "" : subcategory,
    })
  }

  const handleTypeChange = (type: string) => {
    onFilterChange({
      ...filters,
      type: filters.type === type ? "" : type,
    })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Search</label>
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              searchQuery: e.target.value,
            })
          }
          className="w-full"
        />
      </div>

      {/* Category Filter */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex justify-between items-center w-full text-sm font-semibold text-foreground hover:text-primary transition mb-3"
        >
          Category
          <ChevronDown size={16} className={`transition ${expandedSections.category ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.id}
                  onChange={() => handleCategoryChange(cat.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Subcategory Filter */}
      {filters.category && (
        <div className="border-t border-border pt-4">
          <label className="block text-sm font-semibold text-foreground mb-3">Material/Type</label>
          <div className="space-y-2">
            {(subcategories[filters.category] || []).map((subcat) => (
              <label key={subcat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.subcategory === subcat}
                  onChange={() => handleSubcategoryChange(subcat)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground capitalize">{subcat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Product Type Filter */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => toggleSection("type")}
          className="flex justify-between items-center w-full text-sm font-semibold text-foreground hover:text-primary transition mb-3"
        >
          Product Type
          <ChevronDown size={16} className={`transition ${expandedSections.type ? "rotate-180" : ""}`} />
        </button>
        {expandedSections.type && (
          <div className="space-y-2">
            {types.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.type === type}
                  onChange={() => handleTypeChange(type)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        onClick={() =>
          onFilterChange({
            category: "",
            subcategory: "",
            type: "",
            searchQuery: "",
            priceRange: [0, 20000],
          })
        }
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  )
}
