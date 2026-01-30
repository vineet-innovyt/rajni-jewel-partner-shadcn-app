"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { CodeItemEntity, ProductEntity } from "@/services/entities";
import { flatMap, sortBy, uniqBy } from "lodash-es";

export interface FilterState {
  categoryIds: string[];
  subcategory: string;
  typeIds: string[];
  searchQuery: string;
  priceRange: [number, number];
}

interface ProductFiltersProps {
  products: ProductEntity[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilters({
  products,
  filters,
  onFilterChange,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    type: true,
  });

  const types = sortBy(
    uniqBy(
      products.filter((o) => o.type).map((o) => o.type as CodeItemEntity),
      (o) => o.code || "",
    ),
    (o) => o.value as string,
  );

  const handleCategoryChange = (categoryId: string) => {
    let categoryIds = [...filters.categoryIds];
    if (filters.categoryIds.includes(categoryId)) {
      categoryIds = categoryIds.filter((c) => c !== categoryId);
    } else {
      categoryIds.push(categoryId);
    }

    onFilterChange({
      ...filters,
      categoryIds,
      subcategory: "",
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    onFilterChange({
      ...filters,
      subcategory: filters.subcategory === subcategory ? "" : subcategory,
    });
  };

  const handleTypeChange = (typeId: string) => {
    let typeIds = [...filters.typeIds];
    if (filters.typeIds.includes(typeId)) {
      typeIds = typeIds.filter((c) => c !== typeId);
    } else {
      typeIds.push(typeId);
    }

    onFilterChange({
      ...filters,
      typeIds,
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = sortBy(
    uniqBy(
      flatMap(products.map((o) => o.categories || [])),
      (o) => o.code || "",
    ),
    (o) => o.value as string,
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Search
        </label>
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
      <div className=" max-h-150 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Category Filter */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => toggleSection("category")}
            className="flex justify-between items-center w-full text-sm font-semibold text-foreground hover:text-primary transition mb-3"
          >
            Category
            <ChevronDown
              size={16}
              className={`transition ${
                expandedSections.category ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.category && (
            <div className="space-y-2 ">
              {categories.map((cat) => (
                <label
                  key={cat.code}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="category"
                    checked={filters.categoryIds.includes(cat.code as string)}
                    onChange={() => handleCategoryChange(cat.code as string)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground uppercase">
                    {cat.value}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Subcategory Filter */}
        {/* {filters.categoryIds && (
        <div className="border-t border-border pt-4">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Material/Type
          </label>
          <div className="space-y-2">
            {(subcategories[filters.categoryIds] || []).map((subcat) => (
              <label
                key={subcat}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.subcategory === subcat}
                  onChange={() => handleSubcategoryChange(subcat)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {subcat}
                </span>
              </label>
            ))}
          </div>
        </div>
      )} */}

        {/* Product Type Filter */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => toggleSection("type")}
            className="flex justify-between items-center w-full text-sm font-semibold text-foreground hover:text-primary transition mb-3"
          >
            Product Type
            <ChevronDown
              size={16}
              className={`transition ${
                expandedSections.type ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.type && (
            <div className="space-y-2 ">
              {types.map((type) => (
                <label
                  key={type.code}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.typeIds.includes(type.code as string)}
                    onChange={() => handleTypeChange(type.code as string)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-muted-foreground capitalize">
                    {type.value}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Reset Filters */}
      <Button
        variant="outline"
        onClick={() =>
          onFilterChange({
            categoryIds: [],
            subcategory: "",
            typeIds: [],
            searchQuery: "",
            priceRange: [0, 20000],
          })
        }
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
}
