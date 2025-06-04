import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HeroTemplateSelectorProps {
  current: "hero1" | "hero2" | "hero3"
  onChange: (template: "hero1" | "hero2" | "hero3") => void
}

export default function HeroTemplateSelector({ current, onChange }: HeroTemplateSelectorProps) {
  return (
    <Select
      value={current}
      onValueChange={(value) => onChange(value as "hero1" | "hero2" | "hero3")}
    >
      <SelectTrigger id="heroTemplate">
        <SelectValue placeholder="Select hero template" />
      </SelectTrigger>
      <SelectContent className="bg-background dark:bg-background-dark">
        <SelectItem className="cursor-pointer"  value="hero1">Template 1</SelectItem>
        <SelectItem className="cursor-pointer" value="hero2">Template 2</SelectItem>
        <SelectItem className="cursor-pointer" value="hero3">Template 3</SelectItem>
      </SelectContent>
    </Select>
  )
} 