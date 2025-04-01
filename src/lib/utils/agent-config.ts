import { DefaultEnableHyDE, DefaultChatbotRole, DefaultQueryRewriteLLM, DefaultHyDEPromptTemplate, DefaultChatboxPlaceholder, DefaultEnableFollowUpQuestions, DefaultFollowUpQuestionPrompt, DefaultFollowUpQuestionsLLM, DefaultHideEpsillaLogo, DefaultEnableReranker, DefaultOpenChatMessage, DefaultSampleQuestions, DefaultConversationSummaryType, DefaultAllowShare, DefaultTimeout, DefaultCollectFeedback, DefaultChatLLM, DefaultQueryRewritePromptTemplate, DefaultEnableQueryRewrite, DefaultChatHistoryChatWindowBufferConfig, DefaultPromptTemplate, DefaultRerankerConfig, DefaultHyDELLM, DefaultPrimaryColor, DefaultWebSearchTavilyConfig, DefaultChatUploadFileConfig } from "./app-config/contants";
import { GetAutoAgentConfig } from "./app-config/get-auto-agent-config";
import { v4 as uuidv4 } from 'uuid';
import { RAGAppConfig } from "./app-config/model";

/**
 * Default configuration for creating a new agent
 */
export const getDefaultAgentConfig = (projectId: string, agentId: string = uuidv4()) => ({
    parent_resource_id: projectId,
    name: "Linux Auto Agent",
    description: "Linux Auto Agent by Energent.AI",
    app_meta: GetAutoAgentConfig({
      projectId,
      appDBId: agentId,
      chatbotRole: DefaultChatbotRole,
      knowledgeBases: [],
      chatLLM: DefaultChatLLM,
      collectFeedback: DefaultCollectFeedback,
      promptTemplate: DefaultPromptTemplate,
      chatHistoryConfig: DefaultChatHistoryChatWindowBufferConfig,
      enableQueryRewrite: DefaultEnableQueryRewrite,
      queryRewritePrompt: DefaultQueryRewritePromptTemplate,
      queryRewriteLLM: DefaultQueryRewriteLLM,
      enableHyDE: DefaultEnableHyDE,
      hyDEPrompt: DefaultHyDEPromptTemplate,
      hyDELLM: DefaultHyDELLM,
      retrieverConfigs: [],
      rerankerConfig: DefaultRerankerConfig,
      botOpeningMessage: DefaultOpenChatMessage,
      sampleQuestions: DefaultSampleQuestions,
      appDescription: "Linux Auto Agent by Energent.AI",
      logo: "",
      chatboxPlaceholder: DefaultChatboxPlaceholder,
      enableFollowUpQuestions: DefaultEnableFollowUpQuestions,
      followUpQuestionsPrompt: DefaultFollowUpQuestionPrompt,
      followUpQuestionsLLM: DefaultFollowUpQuestionsLLM,
      hideEpsillaLogo: DefaultHideEpsillaLogo,
      conversationSummaryType: DefaultConversationSummaryType,
      allowShare: DefaultAllowShare,
      enableReranker: DefaultEnableReranker,
      timeout: DefaultTimeout,
      primaryColor: DefaultPrimaryColor,
      webSearchTavilyConfig: DefaultWebSearchTavilyConfig,
      chatUploadFileConfig: DefaultChatUploadFileConfig,
      useCaseTemplate: 'linux_claude_computer_use',
    }),
});

/**
 * Configuration for updating the system prompt of an existing agent
 * @param projectId - The project ID
 * @param agentId - The agent ID to replace the default agent ID
 * @param newPrompt - The new system prompt to set
 * @returns The configuration object for updating the agent's system prompt
 */
export const getUpdateSystemPromptConfig = (chatbotConfig: RAGAppConfig, newPrompt: string) => {
  // Start with the default config
  // Update the chatbotRole with the new prompt
  if (chatbotConfig.chatbotUIConfig) {
    chatbotConfig.chatbotUIConfig.chatbotRole = newPrompt;
  }
  
  return chatbotConfig;
}; 