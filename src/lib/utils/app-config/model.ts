export enum DataSourceType {
  LocalFile = 'file',
  S3 = 's3',
  GoogleCloudStorage = 'googlecloudstorage',
  AzureBlobStorage = 'azureblobstorage',
  GoogleDrive = 'googledrive',
  Notion = 'notion',
  Web = 'web',
  DropBox = 'dropbox',
  Box = 'box',
  Slack = 'slack',
  OneDrive = 'onedrive',
  SharePoint = 'sharepoint',
  Confluence = 'confluence',
  Jira = 'jira',
}

export type SelectOption = {
  id: string;
  label: string;
};

export type DB = {
  configs: {
    max_replica: number;
    min_replica: number;
  };
  created_at: number;
  creator_user_id: string;
  entity_type: string;
  name: string;
  parent_resource_id: string;
  resource_id: string;
  status: string;
  tables: {
    fields: {
      dataType: string;
      name: string;
      primaryKey?: boolean;
    }[];
    indices: {
      field: string;
      model: string;
      name: string;
    }[];
    name: string;
  }[];
};

export enum RAGAppType {
  Chatbot = "chatbot",
  AIAgent = "ai agent",
  EnterpriseSearch = "enterprise search",
  RecommendationSystem = "recommendation system",
}

export type ResourceItem = {
  resource_id: string;
  name: string;
  created_at: number;
  updated_at: number;
  status: string;
  entity_type: string;
  parent_resource_id: string;
  description: string;
};

export type ChatHistoryConfig = {
  chatHistoryType: string;
  bufferWindowSize?: number; // for chat-window-buffer
  retrievalLimit?: number; // for semantic-similarity
  summarization?: {
    // for summarization
    llm: string;
    promptTemplate: string;
    // maxTokens: number;
  };
};

export type RetrieverType = "naive" | "hypothetical-question" | "sentence-window" | "auto-merger";
export type RetrieverSearchFunctionType =
  | "semantic"
  | "sparse-vector"
  | "keyword";

export type RetrieverConfig = {
  knowledgeBaseId: string;
  retrieverType: RetrieverType;
  searchFunctionType: RetrieverSearchFunctionType;
  topK: number;
  windowExpansionPrev: number;
  windowExpansionNext: number;
  autoMergerThreshold: number;
  filter?: string;
  filterFromUserInput?: boolean;
};

export type RerankerType = "dist" | "rrf" | "rsf" | "cohere" | "jina";

export type RerankerConfig = {
  rerankerType: RerankerType;
  model?: string;
  rankConstant?: number;
  weights?: number[];
  topK: number;
};

export type InMessageCitationTemplate = "citationIcon" | "leftThumbnailRightTopTitleRightBottomDescription";
export const InMessageCitationTemplateWithInfoMapping = ["leftThumbnailRightTopTitleRightBottomDescription"];
export type ClickCitationBehavior = "auto" | "renderContent" | "renderURL" | "openURLInNewTab";
export const CitationBehaviorNeedURLConfig = ["renderURL", "openURLInNewTab"];
export const ClickCitationBehaviorOptions = [
  { id: 'auto', label: 'Decide automatically' },
  // { id: 'renderContent', label: 'Show the content of the cited knowledge' },
  { id: 'renderURL', label: 'Render the webpage of the provided URL' },
  { id: 'openURLInNewTab', label: 'Open the webpage of the provided URL in a new tab' },
];
export type InMessageCitationConfig = {
  template: InMessageCitationTemplate;
  infoMapping: {
    thumbnail: string;
    title: string;
    description: string;
  };
  clickBehavior: {
    type: ClickCitationBehavior;
    url: string;
  };
};
export const DefaultInMessageCitationConfig: InMessageCitationConfig = {
  template: "citationIcon",
  infoMapping: {
    thumbnail: "",
    title: "",
    description: "",
  },
  clickBehavior: {
    type: "auto",
    url: "Filename",
  },
};

export type ConversationSummaryType = "summary" | "datetime";

export type BaseComponentConfig = {
  id: string;
  agent_id?: string;
  db_id?: string;
  type: string;
  description?: string;
  inputs: ComponentInputConfig[];
  outputs: ComponentOutputConfig[];
  input_sources: {
    [key: string]: ComponentInputSource | ComponentInputSource[];
  };
};

export type AppShareLevel =
  | "project" /* | 'organization'*/
  | "epsilla-cloud"
  | "anyone";

export type RAGAppConfig = {
  appDBId: string;
  appDescription: string;
  components: BaseComponentConfig[];
  streamingComponent?: string;
  retrieverComponent?: string;
  positions: { [key: string]: { x: number; y: number } };
  advancedMode: boolean; // Whether to have modified with Epsilla RAG Studio.
  accessControl: AppShareLevel;
  publishToAppStore?: boolean;
  timeout: number;
  version?: string;
  collectLeads?: boolean;
  isAutoAgent?: boolean;
  // Configs for the chatbot configuration UI.
  chatbotUIConfig: {
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
    botOpeningMessage?: string;
    sampleQuestions: string[];
    logo?: string;
    chatboxPlaceholder?: string;
    enableFollowUpQuestions?: boolean;
    followUpQuestionsPrompt?: string;
    followUpQuestionsLLM?: string;
    hideEpsillaLogo?: boolean;
    conversationSummaryType: ConversationSummaryType;
    allowShare?: boolean;
    enableReranker: boolean;
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
  };
  // Configs for the enterprise search configuration UI.
  enterpriseSearchUIConfig?: {
    introduction?: string; // Keep introduction as optional for backward compatibility.
    knowledgeBases: string[];
    enableSummary: boolean;
    summaryPrompt: string;
    summaryLLM: string;
    collectFeedback: boolean;
    enableSelectKnowledgeBase: boolean;
    enableQueryRewrite: boolean;
    queryRewritePrompt: string;
    queryRewriteLLM: string;
    enableHyDE: boolean;
    hyDEPrompt: string;
    hyDELLM: string;
    retrieverConfigs: RetrieverConfig[];
    rerankerConfig: RerankerConfig;
    sampleQuestions: string[];
    logo?: string;
    searchboxPlaceholder: string;
    enableFollowUpQuestions: boolean;
    followUpQuestionsPrompt: string;
    followUpQuestionsLLM: string;
    hideEpsillaLogo: boolean;
    enableReranker: boolean;
    financialRAG?: boolean;
    financialReportSelectorPrompt?: string;
    financialReportSelectorLLM?: string;
    primaryColor: string;
  };
};

export type ComponentOutputConfig = {
  name: string;
  data_type: string;
};

export enum DataType {
  REAL = "real",
  INTEGER = "integer",
  BOOLEAN = "boolean",
  STRING = "string",
  INDEX = "index",
  DENSE_VECTOR_INDEX = "dense_vector_index",
  SPARSE_VECTOR_INDEX = "sparse_vector_index",
  KEYWORD_SEARCH_INDEX = "keyword_search_index",
  NEIGHBOR_DOCUMENTS_INDEX = "neighbor_documents_index",
  HIERARCHICAL_DOCUMENTS_INDEX = "hierarchical_documents_index",
  DOCUMENT = "document",
  MESSAGE = "message",
  LLM = "LLM",
  TOOL = "tool",
  FILE = "file",
  IMAGE = "image",
}

export type ComponentInputSource = {
  source_component_id: string;
  source_component_output_name: string;
};

export type ComponentInputConfig = {
  name: string;
  data_type: string;
  default?: any;
  required: boolean;
};

export type KnowledgeBaseComponentConfig = BaseComponentConfig & {
  project_id: string;
  db_id: string;
  // Below will be rendered by server side during runtime.
  // auth_api_key?: string;
  // api_key?: string;
  // jwt_token?: string;
};

export type SwitchableKnowledgeBaseComponentConfig = BaseComponentConfig & {
  project_id: string;
  db_id: "-1";
  // Below will be rendered by server side during runtime.
  // auth_api_key?: string;
  // api_key?: string;
  // jwt_token?: string;
  inputs: [
    { name: "Knowledge Base ID"; data_type: DataType.STRING; required: true }
  ];
};

export type QueryRewriteConfig = {
  LLM: string;
  prompt: string;
}

export type KnowledgeRetrieverConfig = {
  enableHyDE: boolean;
  hyDELLM: string;
  hyDEPrompt: string;
  retrieverConfigs: RetrieverConfig[];
  rerankerConfig: RerankerConfig;
  enableReranker: boolean;
};

export type HyDEConfig = {
  llm: string;
  prompt: string;
}

export type FollowUpQuestionsConfig = {
  llm: string;
  prompt: string;
}

export type GenerateAnswerConfig = {
  llm: string;
  prompt: string;
}

export type Conversation = {
  ConversationId: string;
  CreatedAt: number;
  Summary: string;
  UserId: string;
}

export type Reference = {
  dbId: string;
  recordId: string;
  record: {
    [key: string]: any;
  }
};

export type MessageItem = {
  id: string;
  message: string;
  progress?: string[];
  isBot?: boolean;
  timestamp?: number;
  references?: Reference[];
};

export type HumanInTheLoop = {
  type: string;
  [key: string]: any;
};

// Used for analytics show all user conversations.
export interface ConversationMessageItem extends MessageItem {
  conversationId: string;
}
export interface ConversationItem {
  userId: string;
  conversationId: string;
  summary: string;
  timestamp: number;
  userName?: string;
}

export interface ChatFeedbackItem {
  UserId: string;
  ConversationId: string;
  MessageId?: string;
  SearchId?: string;
  Feedback: 'good' | 'bad';
  AdditionalFeedback: string;
}

export interface LeadItem {
  lead_id: string;
  user_id: string;
  name: string;
  email: string;
  agent_id: string;
  created_at: number;
}

export type SearchItem = {
  SearchId: string;
  Question: string;
  Answer?: string;
  References?: ReferenceItem[];
  Timestamp: number;
  FollowUpQuestions: string[];
}

export type ReferenceItem = KnowledgeRecord & {
  __dbId__: string;
};

export type KnowledgeRecord = {
  ID: string;
  Filename: string;
  Content: string;
  Timestamp: number;
  Metadata: {
    DataSourceType: DataSourceType;
    FileType: FileType;
    [key: string]: any;
  }
}

export type FileType = 'pdf' | 'txt' | 'csv' | 'jsonl' | 'png' | 'jpg' | 'jpeg' | 'gif' | 'html' | 'htm'; // | 'docx' | 'xlsx' | 'pptx' | 'mp4' | 'mp3' | 'wav' | 'ogg' | 'zip' | 'tar' | 'gz' | 'tgz' | 'bz2' | 'xz' | '7z' | 'rar' | 'doc' | 'xls' | 'ppt' | 'rtf' | 'odt' | 'ods' | 'odp' | 'epub' | 'txt' | 'html' | 'htm' | 'xml' | 'json' | 'yaml' | 'yml' | 'toml' | 'csv' | 'tsv' | 'md' | 'log' | 'ini' | 'cfg' | 'conf' | 'env' | 'sh' | 'bash' | 'bat' | 'ps1' | 'py' | 'ipynb' | 'r' | 'java' | 'js' | 'ts' | 'go' | 'c' | 'cpp' | 'h' | 'hpp' | 'cs' | 'php' | 'rb' | 'pl' | 'sql' | 'swift' | 'vb' | 'scala' | 'm' | 'f' | 'for' | 'f9';

export type SearchHistoryItem = {
  SearchId: string;
  Question: string;
  Timestamp: number;
};

export type WebSearchTavilyConfig = {
  enabled: boolean;
  max_results: number;
  advanced_search: boolean;
  focus: string[];
};

export type ChatUploadFileConfig = {
  enabled: boolean;
  max_number_of_files: number;
  allowed_file_types: string[];
};
