"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { CodeItemEntity } from "@/services/entities/code-item.entity";

interface ISelectOrEnterInputProps {
  options?: CodeItemEntity[];
  initialValue?: string;
  onChange: (e: string) => void;
  placeholder?: string;
}
export function SelectOrEnterInput({
  initialValue,
  options,
  onChange,
  placeholder,
}: ISelectOrEnterInputProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(initialValue || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between w-full"
        >
          {value ? value : placeholder || "Enter or select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            value={value}
            placeholder={placeholder || "Enter or select..."}
            onValueChange={(val) => {
              setValue(val);
              onChange(val);
            }} // allow typing custom value
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(option.value || "");
                    onChange(option.value || "");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
