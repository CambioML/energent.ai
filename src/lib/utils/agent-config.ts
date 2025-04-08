import { v4 as uuidv4 } from 'uuid';
import { GetAutoAgentConfig } from "./app-config/get-auto-agent-config";
import { DefaultEnableHyDE, DefaultChatbotRole, DefaultQueryRewriteLLM, DefaultHyDEPromptTemplate, DefaultChatboxPlaceholder, DefaultEnableFollowUpQuestions, DefaultFollowUpQuestionPrompt, DefaultFollowUpQuestionsLLM, DefaultHideEpsillaLogo, DefaultEnableReranker, DefaultOpenChatMessage, DefaultSampleQuestions, DefaultConversationSummaryType, DefaultAllowShare, DefaultTimeout, DefaultCollectFeedback, DefaultChatLLM, DefaultQueryRewritePromptTemplate, DefaultEnableQueryRewrite, DefaultChatHistoryChatWindowBufferConfig, DefaultPromptTemplate, DefaultRerankerConfig, DefaultHyDELLM, DefaultPrimaryColor, DefaultWebSearchTavilyConfig, DefaultChatUploadFileConfig } from "./app-config/contants";

/**
 * Default configuration for creating a new agent
 */
export const getDefaultAgentConfig = (projectId: string, agentId: string = uuidv4(), systemPrompt: string = "") => ({
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
      logo: "https://app.energent.ai/favicon/web-app-manifest-512x512.png",
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
      useCaseTemplate: 'linux_claude_all_tools_computer_use',
      systemPrompt,
    }),
});

/**
 * Configuration for updating the system prompt of an existing agent
 * @param projectId - The project ID
 * @param agentId - The agent ID to replace the default agent ID
 * @param newPrompt - The new system prompt to set
 * @returns The configuration object for updating the agent's system prompt
 */
export const getUpdateSystemPromptConfig = (projectId: string, agentId: string, newPrompt: string) => {
  return getDefaultAgentConfig(projectId, agentId, newPrompt);
}; 
