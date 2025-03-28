// Types for the AutoAgentResponse JSON structure
export interface AutoAgentUser {
  role: 'user';
  content: AutoAgentContent[];
}

export interface AutoAgentAssistant {
  role: 'assistant';
  content: AutoAgentContent[];
}

export interface AutoAgentContentText {
  type: 'text';
  text: string;
}

export interface AutoAgentContentImage {
  type: 'image';
  source: string;
}

export interface AutoAgentContentToolUse {
  type: 'tool_use';
  id?: string;
  name: string;
  input: Record<string, any>;
}

export interface AutoAgentContentToolResult {
  type: 'tool_result';
  tool_use_id: string;
  content: AutoAgentContent[];
  is_error: boolean;
}

export type AutoAgentContent = 
  | AutoAgentContentText 
  | AutoAgentContentImage 
  | AutoAgentContentToolUse 
  | AutoAgentContentToolResult;

export type AutoAgentMessage = AutoAgentUser | AutoAgentAssistant;

export interface ParsedMessageContent {
  type: 'text' | 'image' | 'tool_use' | 'tool_result';
  content: any;
  isError?: boolean;
  tool_use_id?: string;
  is_error?: boolean;
}

/**
 * Extracts and parses the AutoAgentResponse from the assistant's message
 * @param message - The raw message content from the API
 * @returns Array of parsed message contents or null if no valid AutoAgentResponse
 */
export function parseAutoAgentResponse(message: string): ParsedMessageContent[] | null {
  // Check if the message contains an AutoAgentResponse
  if (!message.includes('<AutoAgentResponse>') || !message.includes('</AutoAgentResponse>')) {
    return null;
  }

  try {
    // Extract the JSON between the tags
    const jsonStr = message.substring(
      message.indexOf('<AutoAgentResponse>') + '<AutoAgentResponse>'.length,
      message.lastIndexOf('</AutoAgentResponse>')
    );
    
    // Parse the JSON
    const messages: AutoAgentMessage[] = JSON.parse(jsonStr);
    
    // Collect all content from all messages
    const contents: ParsedMessageContent[] = [];
    
    // Skip the first message if it's from the user
    const startIndex = messages.length > 0 && messages[0].role === 'user' ? 1 : 0;
    
    for (let i = startIndex; i < messages.length; i++) {
      const message = messages[i];
      // Process each message content
      for (const content of message.content) {
        switch (content.type) {
          case 'text':
            contents.push({
              type: 'text',
              content: content.text
            });
            break;
            
          case 'image':
            contents.push({
              type: 'image',
              content: content.source
            });
            break;
            
          case 'tool_use':
            contents.push({
              type: 'tool_use',
              content: {
                name: content.name,
                input: content.input
              }
            });
            break;
            
          case 'tool_result':
            // Create a proper tool_result entry
            contents.push({
              type: 'tool_result',
              content: content.content.map(item => {
                if (item.type === 'text') {
                  return {
                    type: 'text',
                    content: item.text
                  };
                } else if (item.type === 'image') {
                  return {
                    type: 'image',
                    content: item.source
                  };
                }
                return item;
              }),
              tool_use_id: content.tool_use_id,
              is_error: content.is_error
            });
            break;
        }
      }
    }
    return contents;
  } catch (error) {
    console.error('Error parsing AutoAgentResponse:', error);
    return null;
  }
} 