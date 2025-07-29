export const contentFilter = {
  // Common patterns for phone numbers
  phonePatterns: [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // US format
    /\b\d{10}\b/g, // 10 digit numbers
    /\+\d{1,3}[-.\s]?\d{3,14}/g, // International format
  ],

  // URL/Link patterns
  urlPatterns: [
    /https?:\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /[a-zA-Z0-9-]+\.(com|org|net|edu|gov|co|io|ly|me|tv)[^\s]*/gi,
  ],

  // Suicidal content keywords
  suicidalKeywords: [
    'kill myself', 'suicide', 'end my life', 'want to die', 'kill me',
    'self harm', 'cutting myself', 'overdose', 'hanging myself',
  ],

  // Abusive content keywords
  abusiveKeywords: [
    'fuck', 'shit', 'bitch', 'asshole', 'damn', 'hell',
    'stupid', 'idiot', 'moron', 'loser', 'pathetic',
  ],

  isContentValid(content: string): { valid: boolean; reason?: string } {
    const lowerContent = content.toLowerCase();

    // Check for phone numbers
    for (const pattern of this.phonePatterns) {
      if (pattern.test(content)) {
        return { valid: false, reason: 'Phone numbers are not allowed' };
      }
    }

    // Check for URLs/links
    for (const pattern of this.urlPatterns) {
      if (pattern.test(content)) {
        return { valid: false, reason: 'Links and URLs are not allowed' };
      }
    }

    // Check for suicidal content
    for (const keyword of this.suicidalKeywords) {
      if (lowerContent.includes(keyword)) {
        return { valid: false, reason: 'Content suggesting self-harm is not allowed. Please seek help from a mental health professional.' };
      }
    }

    // Check for abusive content
    for (const keyword of this.abusiveKeywords) {
      if (lowerContent.includes(keyword)) {
        return { valid: false, reason: 'Abusive or inappropriate language is not allowed' };
      }
    }

    // Check character limit
    if (content.length > 500) {
      return { valid: false, reason: 'Post must be 500 characters or less' };
    }

    if (content.trim().length === 0) {
      return { valid: false, reason: 'Post cannot be empty' };
    }

    return { valid: true };
  }
};