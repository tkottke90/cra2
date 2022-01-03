export function GenerateDecoratorError(message: string, outputLines: string[]) {  
  if (process.env.NODE_ENV === 'development') {
    console.warn(` === Setup Error === \n\n${message}\n\n${outputLines.join('\n')}\n`);
  } else {
    console.warn(message, { stdoutLines: outputLines });
  } 
}