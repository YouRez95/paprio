import fs from "fs";

// Compile LaTeX to PDF using a LaTeX compiler
// function unescapeDocument(text: string) {
//   return text.replace(/\\\\/g, "\\").replace(/\\n/g, "\n");
// }

// Fix \normalsize issue
function unescapeDocument(text: string) {
  return text.replace(/\\\\/g, "\\").replace(/\\n(?![a-zA-Z])/g, "\n");
}

export async function compileLatexToPdf(latexSource: string): Promise<Buffer> {
  const { exec } = require("child_process");
  const { promisify } = require("util");
  const execAsync = promisify(exec);

  // Create temp directory
  const tempDir = `${__dirname}/../../tmp/latex-${crypto.randomUUID()}`;
  await fs.promises.mkdir(tempDir, { recursive: true });

  const texFile = `${tempDir}/document.tex`;
  const pdfFile = `${tempDir}/document.pdf`;

  try {
    // Write LaTeX source
    // const cleanLatex = latexSource.replace(/\r/g, "").trim();
    console.log("latexSource inside compileLatexToPdf", latexSource);
    const cleanLatex = unescapeDocument(latexSource.replace(/\r/g, "").trim());
    console.log("cleanLatex inside compileLatexToPdf", cleanLatex);
    await fs.promises.writeFile(texFile, cleanLatex);

    // Compile with pdflatex (run twice for references)
    await execAsync(
      `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFile}`,
      { timeout: 30000 }
    );
    await execAsync(
      `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFile}`,
      { timeout: 30000 }
    );

    // Read PDF
    const pdfBuffer = await fs.promises.readFile(pdfFile);

    // Cleanup
    await fs.promises.rm(tempDir, { recursive: true, force: true });

    return pdfBuffer;
  } catch (error: any) {
    // const logFile = `${tempDir}/document.log`;
    // if (fs.existsSync(logFile)) {
    //   const log = await fs.promises.readFile(logFile, "utf8");
    //   console.error("LaTeX LOG:\n", log);
    // }
    // Cleanup on error
    await fs.promises
      .rm(tempDir, { recursive: true, force: true })
      .catch(() => {});

    throw new Error(`LaTeX compilation failed: ${error.message}`);
  }
}
