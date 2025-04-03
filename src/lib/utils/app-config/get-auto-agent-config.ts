import { CoordScale } from "./contants";
import {
  ChatHistoryConfig,
  ChatUploadFileConfig,
  ComponentInputSource,
  ConversationSummaryType,
  DataType,
  InMessageCitationConfig,
  RAGAppConfig,
  RerankerConfig,
  RetrieverConfig,
  WebSearchTavilyConfig,
} from "./model";
import { CreateUserInputComponentConfig } from "./pipeline/user-input";
import { createAutoAgentComponentConfig } from "./auto-agent";
import { CreatePipelineOutputComponentConfig } from "./pipeline/pipeline-output";
import { AddNewComponentToRAGAppConfig, UpsertComponentInputSource } from "./shared";
import { CreateWindowBufferChatHistoryComponentConfig } from "./window-buffer-chat-history";

export function GetAutoAgentConfig({
  projectId,
  appDBId,
  chatbotRole,
  knowledgeBases,
  chatLLM,
  collectFeedback,
  promptTemplate,
  chatHistoryConfig,
  enableQueryRewrite,
  queryRewritePrompt,
  queryRewriteLLM,
  enableHyDE,
  hyDEPrompt,
  hyDELLM,
  retrieverConfigs,
  rerankerConfig,
  botOpeningMessage,
  sampleQuestions,
  appDescription,
  logo,
  chatboxPlaceholder,
  enableFollowUpQuestions,
  followUpQuestionsPrompt,
  followUpQuestionsLLM,
  hideEpsillaLogo,
  conversationSummaryType,
  allowShare,
  collectLeads,
  enableReranker,
  timeout,
  primaryColor,
  bgColor,
  inputBoxColor,
  inputBoxBorderRadius,
  hideUserAvatar,
  defineUserMsgMaxWidth,
  userMsgMaxWidth,
  hideBotBackground,
  useDefaultBotButtonColor,
  inMessageCitationConfig,
  webSearchTavilyConfig,
  chatUploadFileConfig,
  useCaseTemplate,
  systemPrompt,
}: {
  projectId: string;
  appDBId: string;
  chatbotRole: string;
  knowledgeBases: string[];
  chatLLM: string;
  collectFeedback: boolean;
  promptTemplate: string;
  chatHistoryConfig: ChatHistoryConfig;
  enableQueryRewrite: boolean;
  queryRewritePrompt: string;
  queryRewriteLLM: string;
  enableHyDE: boolean;
  hyDEPrompt: string;
  hyDELLM: string;
  retrieverConfigs: RetrieverConfig[];
  rerankerConfig: RerankerConfig;
  botOpeningMessage: string;
  sampleQuestions: string[];
  appDescription: string;
  logo: string;
  chatboxPlaceholder: string;
  enableFollowUpQuestions: boolean;
  followUpQuestionsPrompt: string;
  followUpQuestionsLLM: string;
  hideEpsillaLogo: boolean;
  conversationSummaryType: ConversationSummaryType;
  allowShare: boolean;
  collectLeads?: boolean;
  enableReranker: boolean;
  timeout: number;
  primaryColor: string;
  bgColor?: string;
  inputBoxColor?: string;
  inputBoxBorderRadius?: number;
  hideUserAvatar?: boolean;
  defineUserMsgMaxWidth?: boolean;
  userMsgMaxWidth?: number;
  hideBotBackground?: boolean;
  useDefaultBotButtonColor?: boolean;
  inMessageCitationConfig?: InMessageCitationConfig;
  webSearchTavilyConfig: WebSearchTavilyConfig;
  chatUploadFileConfig: ChatUploadFileConfig;
  useCaseTemplate: string;
  systemPrompt: string;
}): RAGAppConfig {
  let config: RAGAppConfig = {
    appDBId: appDBId,
    appDescription: appDescription,
    components: [],
    streamingComponent: undefined,
    retrieverComponent: undefined,
    positions: {},
    advancedMode: true,
    accessControl: "project",
    timeout: timeout,
    version: '2.0',
    collectLeads: collectLeads,
    isAutoAgent: true,
    // Configs for the chatbot configuration UI.
    chatbotUIConfig: {
      chatbotRole,
      knowledgeBases,
      chatLLM,
      collectFeedback,
      promptTemplate,
      chatHistoryConfig,
      enableQueryRewrite,
      queryRewritePrompt,
      queryRewriteLLM,
      enableHyDE,
      hyDEPrompt,
      hyDELLM,
      retrieverConfigs,
      rerankerConfig,
      botOpeningMessage,
      sampleQuestions,
      logo,
      chatboxPlaceholder,
      enableFollowUpQuestions,
      followUpQuestionsPrompt,
      followUpQuestionsLLM,
      hideEpsillaLogo,
      conversationSummaryType,
      allowShare,
      enableReranker,
      primaryColor,
      hideUserAvatar,
      defineUserMsgMaxWidth,
      hideBotBackground,
      useDefaultBotButtonColor,
      inMessageCitationConfig,
      webSearchTavilyConfig,
      chatUploadFileConfig,
    },
  };
  if (bgColor) {
    config.chatbotUIConfig.bgColor = bgColor;
  }
  if (inputBoxColor) {
    config.chatbotUIConfig.inputBoxColor = inputBoxColor;
  }
  if (inputBoxBorderRadius) {
    config.chatbotUIConfig.inputBoxBorderRadius = inputBoxBorderRadius;
  }
  if (defineUserMsgMaxWidth && userMsgMaxWidth) {
    config.chatbotUIConfig.userMsgMaxWidth = userMsgMaxWidth;
  }

  // Step 1. Add the user input and pipeline output
  const userInput = CreateUserInputComponentConfig([
    {
      name: "user_message",
      data_type: DataType.STRING,
    },
  ]);
  
  config = AddNewComponentToRAGAppConfig(
    config,
    userInput,
    0 * CoordScale,
    0 * CoordScale
  );
  const userQuery: ComponentInputSource = {
    source_component_id: userInput.id,
    source_component_output_name: "user_message",
  };

  // Step 2. Chat History
  // TODO: support other chat history types later
  const chatHistoryComp = CreateWindowBufferChatHistoryComponentConfig(
    projectId,
    appDBId,
    chatHistoryConfig.bufferWindowSize ?? 5
  );
  // Change the chat history buffer size
  config = AddNewComponentToRAGAppConfig(
    config,
    chatHistoryComp,
    1.5 * CoordScale,
    -0.5 * CoordScale
  );

  config = UpsertComponentInputSource(
    config,
    chatHistoryComp.id,
    "User Message",
    userQuery
  );

  // Step 3. Auto Agent component
  const autoAgentComp = createAutoAgentComponentConfig(projectId, appDBId, useCaseTemplate, systemPrompt);
  config = AddNewComponentToRAGAppConfig(
    config,
    autoAgentComp,
    1.5 * CoordScale,
    0.5 * CoordScale
  );

  config = UpsertComponentInputSource(
    config,
    autoAgentComp.id,
    "User Message",
    userQuery
  );
  config.streamingComponent = autoAgentComp.id;

  // Step 4. Pipeline output component
  const pipelineOutput = CreatePipelineOutputComponentConfig(
    [
      {
        name: "final_output",
        data_type: DataType.STRING,
      },
      {
        name: "knowledge",
        data_type: `list<${DataType.DOCUMENT}>`,
      },
    ]
  );
  // The knowledge input will be optional as there might be no knowledge bases.
  pipelineOutput.inputs[1].required = false;
  pipelineOutput.inputs[1].default = [];

  config = AddNewComponentToRAGAppConfig(
    config,
    pipelineOutput,
    3 * CoordScale,
    0 * CoordScale
  );
  config = UpsertComponentInputSource(
    config,
    pipelineOutput.id,
    "final_output",
    {
      source_component_id: autoAgentComp.id,
      source_component_output_name: "Generated Result",
    }
  );

  // The generated response and references will be stored back to chat history as AI message.
  config = UpsertComponentInputSource(
    config,
    chatHistoryComp.id,
    "AI Response Message",
    {
      source_component_id: pipelineOutput.id,
      source_component_output_name: "final_output",
    }
  );

  // window['jsonString'] = JSON.stringify(getWorkflowView(config), null, 2);
  return config;
}
