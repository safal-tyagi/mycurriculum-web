export const extractJSON = (text) => {
    const jsonRegex = /{[^]*}/;
    const match = text.match(jsonRegex);
    if (match) {
      const jsonString = match[0];
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        console.error('Invalid JSON content:', jsonString);
        return null;
      }
    } else {
      console.error('No JSON content found in response');
      return null;
    }
  };