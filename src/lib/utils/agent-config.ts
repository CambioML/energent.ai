/**
 * Default configuration for creating a new agent
 */
export const getDefaultAgentConfig = (projectId: string) => ({
  "parent_resource_id": projectId,
  "name": "Linux Computer use agent",
  "description": "chatbot",
  "app_meta": {
    "appDBId": "7f3090f7-fe3e-4428-a740-4f1c05643e8c",
    "appDescription": "",
    "components": [
      {
        "id": "d8b28d40-920b-4ec3-bf38-c939140d74cb",
        "type": "user_input",
        "user_input_values": {},
        "inputs": [],
        "outputs": [
          {
            "name": "user_message",
            "data_type": "string"
          }
        ],
        "input_sources": {}
      },
      {
        "id": "4890d967-f93b-4bf0-9c77-b414e4201da9",
        "type": "window_buffer_chat_history",
        "description": "Keep the most recent rounds of messages from the conversation.",
        "project_id": projectId,
        "db_id": "7f3090f7-fe3e-4428-a740-4f1c05643e8c",
        "user_role_str": "User",
        "ai_role_str": "AI",
        "inputs": [
          {
            "name": "User Message",
            "data_type": "string",
            "required": true
          },
          {
            "name": "AI Response Message",
            "data_type": "string",
            "required": true
          },
          {
            "name": "Buffer Size",
            "data_type": "integer",
            "default": 5,
            "required": false
          },
          {
            "name": "References",
            "data_type": "list<document>",
            "default": [],
            "required": false
          }
        ],
        "outputs": [
          {
            "name": "Chat History",
            "data_type": "list<message>"
          }
        ],
        "input_sources": {
          "User Message": {
            "source_component_id": "d8b28d40-920b-4ec3-bf38-c939140d74cb",
            "source_component_output_name": "user_message"
          },
          "AI Response Message": {
            "source_component_id": "30bd6c19-ab08-44a8-8257-4e25495b2c24",
            "source_component_output_name": "final_output"
          }
        }
      },
      {
        "id": "fff5e629-b179-4059-9aa4-e8eb946ba771",
        "project_id": projectId,
        "agent_id": "7f3090f7-fe3e-4428-a740-4f1c05643e8c",
        "description": "The AutoAgent solves user problems autonomously.",
        "display_in_progress": false,
        "type": "auto_agent",
        "inputs": [
          {
            "name": "Template",
            "data_type": "string",
            "default": "linux_claude_computer_use",
            "required": true
          },
          {
            "name": "System Message",
            "data_type": "string",
            "required": false
          },
          {
            "name": "User Message",
            "data_type": "string",
            "required": true
          }
        ],
        "outputs": [
          {
            "name": "Generated Result",
            "data_type": "string"
          }
        ],
        "input_sources": {
          "User Message": {
            "source_component_id": "d8b28d40-920b-4ec3-bf38-c939140d74cb",
            "source_component_output_name": "user_message"
          }
        }
      },
      {
        "id": "30bd6c19-ab08-44a8-8257-4e25495b2c24",
        "type": "pipeline_output",
        "inputs": [
          {
            "name": "final_output",
            "data_type": "string",
            "required": true
          },
          {
            "name": "knowledge",
            "data_type": "list<document>",
            "required": false,
            "default": []
          }
        ],
        "outputs": [
          {
            "name": "final_output",
            "data_type": "string"
          },
          {
            "name": "knowledge",
            "data_type": "list<document>"
          }
        ],
        "input_sources": {
          "final_output": {
            "source_component_id": "fff5e629-b179-4059-9aa4-e8eb946ba771",
            "source_component_output_name": "Generated Result"
          }
        }
      }
    ],
    "streamingComponent": "fff5e629-b179-4059-9aa4-e8eb946ba771",
    "positions": {
      "d8b28d40-920b-4ec3-bf38-c939140d74cb": {
        "x": 0,
        "y": 0
      },
      "4890d967-f93b-4bf0-9c77-b414e4201da9": {
        "x": 675,
        "y": -225
      },
      "fff5e629-b179-4059-9aa4-e8eb946ba771": {
        "x": 675,
        "y": 225
      },
      "30bd6c19-ab08-44a8-8257-4e25495b2c24": {
        "x": 1350,
        "y": 0
      }
    },
    "advancedMode": true,
    "accessControl": "project",
    "timeout": 600,
    "version": "2.0",
    "isAutoAgent": true,
    "chatbotUIConfig": {
      "chatbotRole": "You are a helpful assistant, utilizing provided knowledge to effectively support and guide users in their inquiries.",
      "knowledgeBases": [],
      "chatLLM": "openai/gpt-4o",
      "collectFeedback": true,
      "promptTemplate": "Respond to the user's question using the provided chat history and related knowledge. Do not make up responses; if the answer is unknown, state that you do not know. If additional information is required to accurately answer, request further details from the user. Try to ground your answer based on the related knowledge provided. Include the IDs of the knowledge (always in UUID format) you refer to in your response in the format [UUID].\n\n<CHAT_HISTORY>\n{{ chat_history }}\n</CHAT_HISTORY>\n\n<RELATED_KNOWLEDGE>\n{{ retrieved_knowledge }}\n</RELATED_KNOWLEDGE>\n\n<USER_QUESTION>\n{{ the_question }}\n</USER_QUESTION>\n\nYour answer:\n",
      "chatHistoryConfig": {
        "chatHistoryType": "chat-window-buffer",
        "bufferWindowSize": 5
      },
      "enableQueryRewrite": false,
      "queryRewritePrompt": "Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.\n\n<CHAT_HISTORY>\n{{ chat_history }}\n</CHAT_HISTORY>\n\n<FOLLOW_UP_QUESTION>\n{{ the_question }}\n</FOLLOW_UP_QUESTION>\n\nStandalone question:\n",
      "queryRewriteLLM": "openai/gpt-4o-mini",
      "enableHyDE": false,
      "hyDEPrompt": "Please write a passage to answer the question.\n\n<QUESTION>\n{{ the_question }}\n</QUESTION>\n\nPassage:\n",
      "hyDELLM": "openai/gpt-4o-mini",
      "retrieverConfigs": [],
      "rerankerConfig": {
        "rerankerType": "dist",
        "rankConstant": 0,
        "weights": [],
        "topK": 15
      },
      "botOpeningMessage": "Hello, I am your AI assistant. How can I help you today?",
      "sampleQuestions": [],
      "logo": "",
      "chatboxPlaceholder": "Ask your question here...",
      "enableFollowUpQuestions": false,
      "followUpQuestionsPrompt": "Considering the AI's character settings, the user's previous chat history with the AI assistant, think about the user's scenario, intention, background in their last inquiry, and generate the questions that the user is most likely to ask the AI assistant (you) next.\n\n<CHAT_HISTORY>\n{{ chat_history }}\nUser: {{ the_question }}\nAI: {{ the_answer }}\n</CHAT_HISTORY>\n\n<REQUIREMENTS>\nBasic requirements:\n1. Generate 3 follow up questions.\n2. Do not generate questions that the user may already know the answer to or that are unrelated to the current topics.\n3. Always generate very brief and clear questions (less than 15 words) that the user may ask the AI assistant (you), NOT questions that the AI assistant (you) asks the user.\n4. DO NOT generate the same or similar questions.\n\nAdditional requirements:\n1. If the AI assistant did not or refused to answer the user's question, generate suggestions based on what the assistant can answer to guide the topic in a more productive direction, unrelated to the current topic.\n2. Ensure the questions are different from the chat history.\n3. Respond with one question per line. Don't include a number. YOU WILL BE PUNISHED for responding with anything before or after the questions.\n</REQUIREMENTS>\n\nFollow up questions:\n",
      "followUpQuestionsLLM": "openai/gpt-4o-mini",
      "hideEpsillaLogo": false,
      "conversationSummaryType": "summary",
      "allowShare": true,
      "enableReranker": false,
      "primaryColor": "#8564D7",
      "webSearchTavilyConfig": {
        "enabled": false,
        "max_results": 5,
        "advanced_search": false,
        "focus": []
      },
      "chatUploadFileConfig": {
        "enabled": false,
        "max_number_of_files": 1,
        "allowed_file_types": [
          ".pdf"
        ]
      }
    }
  }
}); 