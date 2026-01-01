import { BlockDefinition } from "@prisma/client";
import crypto from "crypto";
import { LatexPageConfigSchemaType } from "../../schemas/document.schema";
// Generate packages from all blocks + color definitions
export function generatePackages(
  blocks: Array<{ packages: any }>,
  colorDefinitions: Map<string, string>
): string {
  // Collect unique packages
  const packagesMap = new Map<string, Set<string>>();

  blocks.forEach((block) => {
    if (Array.isArray(block.packages)) {
      block.packages.forEach((pkg: any) => {
        if (!packagesMap.has(pkg.name)) {
          packagesMap.set(pkg.name, new Set());
        }
        if (Array.isArray(pkg.options)) {
          pkg.options.forEach((opt: string) => {
            packagesMap.get(pkg.name)!.add(opt);
          });
        }
      });
    }
  });

  // Generate package lines
  const packageLines: string[] = [];

  packagesMap.forEach((options, name) => {
    if (options.size > 0) {
      packageLines.push(
        `\\usepackage[${Array.from(options).join(",")}]{${name}}`
      );
    } else {
      packageLines.push(`\\usepackage{${name}}`);
    }
  });

  // Add color definitions
  const colorDefLines: string[] = [];
  colorDefinitions.forEach((colorName, hex) => {
    const { definition } = convertHexToLatexColor(hex);
    colorDefLines.push(definition);
  });

  return `
% Required Packages
${packageLines.join("\n")}

% Color Definitions
${colorDefLines.join("\n")}
`.trim();
}

// Generate page configuration
export function generatePageConfig(
  latexConfig?: LatexPageConfigSchemaType
): string {
  // Use defaults if no config provided
  if (!latexConfig) {
    return `\\documentclass[12pt,a4paper]{article}\n\\usepackage[margin=1in]{geometry}`;
  }

  const { documentClass, orientation, margins, lineSpacing } = latexConfig;

  // Build document class options
  const classOptions: string[] = [
    documentClass.fontSize,
    documentClass.paperSize,
  ];

  if (documentClass.twoSide) {
    classOptions.push("twoside");
  }

  // Add orientation if landscape
  if (orientation === "landscape") {
    classOptions.push("landscape");
  }

  const documentClassLine = `\\documentclass[${classOptions.join(",")}]{${
    documentClass.type
  }}`;

  // Build geometry package for margins
  const geometryOptions: string[] = [
    `top=${margins.top}cm`,
    `bottom=${margins.bottom}cm`,
    `left=${margins.left}cm`,
    `right=${margins.right}cm`,
  ];

  const geometryLine = `\\usepackage[${geometryOptions.join(",")}]{geometry}`;

  // Build line spacing package
  let lineSpacingPackage = "";
  if (lineSpacing === "oneHalf") {
    lineSpacingPackage = "\\usepackage{setspace}\n\\onehalfspacing";
  } else if (lineSpacing === "double") {
    lineSpacingPackage = "\\usepackage{setspace}\n\\doublespacing";
  }

  // Combine all configuration lines
  const configLines = [
    documentClassLine,
    geometryLine,
    lineSpacingPackage,
  ].filter(Boolean);

  return configLines.join("\n");
}

// Convert hex color to LaTeX color definition
export function convertHexToLatexColor(hex: string): {
  definition: string;
  name: string;
} {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // ✅ Deterministic name based on hash of the hex code
  const hash = crypto.createHash("md5").update(hex).digest("hex").slice(0, 8);
  const name = `color${hash}`;

  const definition = `\\definecolor{${name}}{rgb}{${r.toFixed(2)}, ${g.toFixed(
    2
  )}, ${b.toFixed(2)}}`;

  return { definition, name };
}

// Compile block LaTeX source from template and config
function unescapeLatex(text: string): string {
  return text
    .replace(/\\\\\\\\/g, "\\\\") // \\\\ -> \\
    .replace(/\\\\n/g, "\n") // \\n -> newline (but not \n in commands)
    .replace(/\\\\t/g, "\t") // \\t -> tab (but not \t in commands)
    .replace(/\s+$/gm, ""); // trim trailing whitespace per line
}

function escapeForRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function compileBlockLatex(
  definition: Pick<
    BlockDefinition,
    | "latexTemplate"
    | "variableRules"
    | "id"
    | "requiredPackages"
    | "configSchema"
  >,
  config: Record<string, any>
): string {
  let template = definition.latexTemplate ?? "";
  if (
    definition.variableRules &&
    typeof definition.variableRules === "object"
  ) {
    for (const [varName, ruleAny] of Object.entries(definition.variableRules)) {
      const rule: any = ruleAny || {};
      const fields: any[] = Array.isArray(rule.fields) ? rule.fields : [];
      const combine: string = rule.combine ?? ""; // allow empty string

      const parts: string[] = [];

      for (const field of fields) {
        // If the field is a plain literal (no key), push its value if present
        if (field && field.key === undefined && field.value !== undefined) {
          parts.push(String(field.value));
          continue;
        }

        // If the field references a config key
        if (field && field.key !== undefined) {
          const key = field.key;
          const cfgVal = config?.[key];

          // skipIf handling
          if (
            field.skipIf &&
            Array.isArray(field.skipIf) &&
            field.skipIf.includes(cfgVal)
          ) {
            continue;
          }

          // NEW: dependsOn handling - skip if dependency field is empty/falsy
          if (field.dependsOn !== undefined) {
            const depKey = field.dependsOn;
            const depVal = config?.[depKey];
            if (
              !depVal ||
              depVal === "" ||
              depVal === null ||
              depVal === undefined
            ) {
              continue;
            }
          }

          // condition: truthy (insert field.value as literal when config[key] is truthy)
          if (field.condition === "truthy") {
            if (cfgVal) {
              if (field.value !== undefined) {
                parts.push(String(field.value));
              } else {
                // fallback: include the config value with prefix/suffix if provided
                const seg =
                  (field.prefix ?? "") + String(cfgVal) + (field.suffix ?? "");
                parts.push(seg);
              }
            }
            continue;
          }

          // Normal path: build segment using prefix + config value + suffix
          // If config value is undefined/null/empty, check for default or skip
          if (cfgVal === undefined || cfgVal === null || cfgVal === "") {
            // Check if field has a default value
            if (field.default !== undefined) {
              const seg =
                (field.prefix ?? "") +
                String(field.default) +
                (field.suffix ?? "");
              parts.push(seg);
            } else if (field.value !== undefined) {
              // If the field also has a literal value (rare), use that
              parts.push(String(field.value));
            } else {
              // skip adding anything (avoids 'undefined' in output)
              continue;
            }
          } else {
            const seg =
              (field.prefix ?? "") + String(cfgVal) + (field.suffix ?? "");
            parts.push(seg);
          }

          continue;
        }

        // If none of the above, but field has a value, push it
        if (field && field.value !== undefined) {
          parts.push(String(field.value));
        }
      } // end fields loop

      const finalValue = parts.join(combine);
      // Replace all occurrences of ${varName}
      const placeholderRe = new RegExp(
        "\\$\\{" + escapeForRegex(varName) + "\\}",
        "g"
      );
      template = template.replace(placeholderRe, finalValue);
    }
  }

  // Replace simple config placeholders ${key}
  for (const [key, value] of Object.entries(config || {})) {
    const placeholderRe = new RegExp(
      "\\$\\{" + escapeForRegex(key) + "\\}",
      "g"
    );
    template = template.replace(placeholderRe, String(value ?? ""));
  }

  // Remove any leftover placeholders to avoid invalid LaTeX like ${something}
  template = template.replace(/\$\{[^}]+\}/g, "");

  // Final: unescape latex sequences (so \\normalsize -> \normalsize)
  return unescapeLatex(template);
}

// Generate empty LaTeX document
export function generateEmptyDocumentLatex(): string {
  return `
    \\documentclass[12pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{setspace}

\\begin{document}
\\thispagestyle{empty}

\\vspace*{\\fill}
\\begin{center}
  {\\Large \\textbf{This document is empty}} \\\\\\[12pt]
  Add at least one block to generate a preview.
\\end{center}
\\vspace*{\\fill}

\\end{document}
  `;
}

// Generate full LaTeX document
export function generateLatexDocument(
  content: string,
  pageConfig: string,
  packages?: string
): string {
  return `
${pageConfig}
${packages}
\\begin{document}
${content}
\\end{document}
  `;
}

export const extractColorsFromConfig = (
  config: unknown,
  colorDefinitions: Map<string, string>
) => {
  if (!config || typeof config !== "object" || Array.isArray(config)) return;
  Object.entries(config as Record<string, unknown>).forEach(([_, value]) => {
    if (typeof value === "string" && value.match(/^#[0-9A-Fa-f]{6}$/)) {
      if (!colorDefinitions.has(value)) {
        const { name } = convertHexToLatexColor(value);
        colorDefinitions.set(value, name);
      }
    }
  });
};
