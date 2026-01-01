import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, FileText, Ruler, AlignLeft, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import z from "zod";
import { useLatexConfigStore } from "@/store/latexPageConfigStore";

const LatexPageConfigSchema = z.object({
  documentClass: z.object({
    type: z.enum(["article", "report", "book"]),
    fontSize: z.enum(["10pt", "11pt", "12pt"]),
    paperSize: z.enum(["a4paper", "a5paper", "letter"]),
    twoSide: z.boolean(),
  }),
  orientation: z.enum(["portrait", "landscape"]),
  margins: z.object({
    top: z.number().min(0).max(10),
    bottom: z.number().min(0).max(10),
    left: z.number().min(0).max(10),
    right: z.number().min(0).max(10),
  }),
  lineSpacing: z.enum(["single", "oneHalf", "double"]),
});

type LatexPageConfig = z.infer<typeof LatexPageConfigSchema>;

type ConfigSectionProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  children: React.ReactNode;
};

const ConfigSection = ({ icon: Icon, title, children }: ConfigSectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h4 className="text-sm font-semibold">{title}</h4>
    </div>
    {children}
  </div>
);

type CustomRadioCardProps = {
  value: string;
  currentValue: string;
  label: string;
  description?: string;
  onChange: (value: string) => void;
};

const CustomRadioCard = ({
  value,
  currentValue,
  label,
  description,
  onChange,
}: CustomRadioCardProps) => {
  const isSelected = value === currentValue;
  return (
    <label
      className={`
        relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer
        transition-all duration-200
        ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          w-4 h-4 rounded-full border-2 flex items-center justify-center
          transition-all duration-200
          ${
            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
          }
        `}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      <input
        type="radio"
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="sr-only"
      />
    </label>
  );
};

export default function LatexPageConfig() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateConfig, config } = useLatexConfigStore();

  const form = useForm<LatexPageConfig>({
    resolver: zodResolver(LatexPageConfigSchema),
    defaultValues: config,
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const values = form.getValues();

    setIsSubmitting(true);
    updateConfig(values);
    setIsSubmitting(false);
    setOpen(false);
    form.reset(values);
  };

  const handleReset = () => {
    form.reset();
  };

  useEffect(() => {
    form.reset(config);
  }, [config, form]);

  const hasUnsavedChanges = form.formState.isDirty;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Page configuration settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[440px] max-h-[600px] overflow-y-auto"
        align="end"
      >
        <Form {...form}>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-lg font-semibold">Page Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customize your LaTeX document settings
              </p>
            </div>

            <Separator />

            {/* Document Class Section */}
            <ConfigSection icon={FileText} title="Document Class">
              <FormField
                control={form.control}
                name="documentClass.type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                      Type
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <CustomRadioCard
                          value="article"
                          currentValue={field.value}
                          label="Article"
                          description="Short documents, papers"
                          onChange={field.onChange}
                        />
                        <CustomRadioCard
                          value="report"
                          currentValue={field.value}
                          label="Report"
                          description="Technical reports, thesis"
                          onChange={field.onChange}
                        />
                        <CustomRadioCard
                          value="book"
                          currentValue={field.value}
                          label="Book"
                          description="Long documents, chapters"
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentClass.fontSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                        Font Size
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-2"
                        >
                          {["10pt", "11pt", "12pt"].map((size) => (
                            <label
                              key={size}
                              className={`
                                flex-1 flex items-center justify-center p-2.5 rounded-md border-2 cursor-pointer
                                transition-all duration-200 text-sm font-medium
                                ${
                                  field.value === size
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/50 hover:bg-accent"
                                }
                              `}
                            >
                              <RadioGroupItem
                                value={size}
                                className="sr-only"
                              />
                              {size}
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentClass.paperSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                        Paper Size
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-2"
                        >
                          {[
                            { value: "a4paper", label: "A4" },
                            { value: "a5paper", label: "A5" },
                            { value: "letter", label: "Letter" },
                          ].map(({ value, label }) => (
                            <label
                              key={value}
                              className={`
                                flex-1 flex items-center justify-center p-2.5 rounded-md border-2 cursor-pointer
                                transition-all duration-200 text-sm font-medium
                                ${
                                  field.value === value
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/50 hover:bg-accent"
                                }
                              `}
                            >
                              <RadioGroupItem
                                value={value}
                                className="sr-only"
                              />
                              {label}
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="orientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                      Orientation
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-2"
                      >
                        {[
                          { value: "portrait", label: "Portrait" },
                          { value: "landscape", label: "Landscape" },
                        ].map(({ value, label }) => (
                          <label
                            key={value}
                            className={`
                              flex items-center justify-center p-3 rounded-md border-2 cursor-pointer
                              transition-all duration-200 text-sm font-medium
                              ${
                                field.value === value
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:border-primary/50 hover:bg-accent"
                              }
                            `}
                          >
                            <RadioGroupItem value={value} className="sr-only" />
                            {label}
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </ConfigSection>

            <Separator />

            {/* Margins Section */}
            <ConfigSection icon={Ruler} title="Margins">
              <FormDescription className="text-xs">
                Set custom margins in centimeters
              </FormDescription>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "margins.top", label: "Top" },
                  { name: "margins.bottom", label: "Bottom" },
                  { name: "margins.left", label: "Left" },
                  { name: "margins.right", label: "Right" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              className="pr-8"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              cm
                            </span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ConfigSection>

            <Separator />

            {/* Typography Section */}
            <ConfigSection icon={AlignLeft} title="Typography">
              <FormField
                control={form.control}
                name="lineSpacing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                      Line Spacing
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-3 gap-2"
                      >
                        {[
                          { value: "single", label: "Single" },
                          { value: "oneHalf", label: "1.5x" },
                          { value: "double", label: "Double" },
                        ].map(({ value, label }) => (
                          <label
                            key={value}
                            className={`
                              flex items-center justify-center p-3 rounded-md border-2 cursor-pointer
                              transition-all duration-200 text-sm font-medium
                              ${
                                field.value === value
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border hover:border-primary/50 hover:bg-accent"
                              }
                            `}
                          >
                            <RadioGroupItem value={value} className="sr-only" />
                            {label}
                          </label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentClass.twoSide"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">
                        Two-sided Document
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Alternate margins for binding
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </ConfigSection>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!hasUnsavedChanges || isSubmitting}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Applying...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Apply Settings
                  </>
                )}
              </Button>
            </div>

            {hasUnsavedChanges && (
              <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                You have unsaved changes
              </p>
            )}
          </div>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
