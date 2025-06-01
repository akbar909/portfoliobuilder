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
      <SelectContent>
        <SelectItem value="hero1">Template 1</SelectItem>
        <SelectItem value="hero2">Template 2</SelectItem>
        <SelectItem value="hero3">Template 3</SelectItem>
      </SelectContent>
    </Select>
  )
} 