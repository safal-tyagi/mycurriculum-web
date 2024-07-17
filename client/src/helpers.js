export const preprocessMarkdown = (content) => {
    if (!content) { return ""; }
    
    // Regular expression to identify inline LaTeX equations within \( ... \)
    const inlineLatexRegex = /\\\(([^()]+)\\\)/g;
  
    // Regular expression to identify block LaTeX equations within \[ ... \]
    const blockLatexRegex = /\\\[((?:.|\n)+?)\\\]/g;
  
    // Wrap identified inline LaTeX equations with $
    const processedContent = content.replace(inlineLatexRegex, (match, p1) => {
      return `$${p1}$`;
    });
  
    // Wrap identified block LaTeX equations with $$
    const fullyProcessedContent = processedContent.replace(blockLatexRegex, (match, p1) => {
      return `$$${p1}$$`;
    });
  
    return fullyProcessedContent;
  };
  
  