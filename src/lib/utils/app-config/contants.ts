import { ChatHistoryConfig, ChatUploadFileConfig, RerankerConfig, RetrieverConfig, SelectOption, WebSearchTavilyConfig } from "./model";

export const DynamicKnowledgeBaseID = "-1";
export const DefaultChatHistoryChatWindowBufferConfig: ChatHistoryConfig = {
  chatHistoryType: "chat-window-buffer",
  bufferWindowSize: 5,
};
export const DefaultChatHistorySemanticSimilarityConfig: ChatHistoryConfig = {
  chatHistoryType: 'semantic-similarity',
  retrievalLimit: 5,
};
export const DefaultSummarizationLLM = 'openai/gpt-4o-mini';
export const FallbackSummarizationLLM = 'epsilla/gpt-4o-mini';

export const DefaultSummarizationPromptTemplate =
`Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary.

<EXAMPLE>
Current summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good.

New lines of conversation:
Human: Why do you think artificial intelligence is a force for good?
AI: Because artificial intelligence will help humans reach their full potential.

New summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good because it will help humans reach their full potential.
</EXAMPLE>

Now let's do the summarization for the conversation below. YOU WILL BE PUNISHED FOR INCLUDING ANYTHING OTHER THAN THE NEW SUMMARY IN YOUR RESPONSE.

<CURRENT_SUMMARY>
{{ summary }}
</CURRENT_SUMMARY>

<NEW_LINES_OF_CONVERSATION>
{{ user_message }}
{{ ai_message }}
</NEW_LINES_OF_CONVERSATION>

New summary:
`;
export const ChatHistoryOptions = [
  {
    label: 'Keep the most recent rounds of messages from the conversation.',
    id: 'chat-window-buffer',
  },
  {
    label: 'Get the most semantically relevant rounds of messages from the conversation. (Coming Soon)',
    id: 'semantic-similarity',
    disabled: true,
  },
  {
    label: 'Do a summarization of the conversation. (Coming Soon)',
    id: 'summarization',
    disabled: true,
  },
];
export const DefaultChatHistorySummarizationConfig: ChatHistoryConfig = {
  chatHistoryType: 'summarization',
  summarization: {
    llm: DefaultSummarizationLLM,
    promptTemplate: DefaultSummarizationPromptTemplate,
    // maxTokens: 512,
  },
};


export const CoordScale = 450;

export const DefaultChatbotRole =
  "You are a helpful assistant, utilizing provided knowledge to effectively support and guide users in their inquiries.";
export const DefaultChatLLM = "openai/gpt-4o";
export const FallbackChatLLM = "epsilla/gpt-4o";
export const DefaultCollectFeedback = true;
export const DefaultPromptTemplate = `Respond to the user's question using the provided chat history and related knowledge. Do not make up responses; if the answer is unknown, state that you do not know. If additional information is required to accurately answer, request further details from the user. Try to ground your answer based on the related knowledge provided. Include the IDs of the knowledge (always in UUID format) you refer to in your response in the format [UUID].

<CHAT_HISTORY>
{{ chat_history }}
</CHAT_HISTORY>

<RELATED_KNOWLEDGE>
{{ retrieved_knowledge }}
</RELATED_KNOWLEDGE>

<USER_QUESTION>
{{ the_question }}
</USER_QUESTION>

Your answer:
`;

export const DefaultPromptWithWebSearchTemplate = `Respond to the user's question using the provided chat history, related knowledge, and web search result.
Do not make up responses; if the answer is unknown, state that you do not know.
If additional information is required to accurately answer, request further details from the user.
Try to ground your answer based on the related knowledge and web search result provided.
Include the IDs of the knowledge records (always in UUID format) you refer to in your response in the format [UUID].
Includes the web search results you refer to using Markdown link format. Ensure each link is accurately formatted as [(Read More)](URL)

<CHAT_HISTORY>
{{ chat_history }}
</CHAT_HISTORY>

<RELATED_KNOWLEDGE>
{{ retrieved_knowledge }}
</RELATED_KNOWLEDGE>

<WEB_SEARCH_RESULT>
{{ web_search_result }}
</WEB_SEARCH_RESULT>

<USER_QUESTION>
{{ the_question }}
</USER_QUESTION>

Your answer:
`;
export const DefaultEnableQueryRewrite = false;
export const DefaultQueryRewritePromptTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<CHAT_HISTORY>
{{ chat_history }}
</CHAT_HISTORY>

<FOLLOW_UP_QUESTION>
{{ the_question }}
</FOLLOW_UP_QUESTION>

Standalone question:
`;
export const DefaultQueryRewriteLLM = "openai/gpt-4o-mini";
export const FallbackQueryRewriteLLM = "epsilla/gpt-4o-mini";

export const DefaultEnableHyDE = false;
export const DefaultHyDEPromptTemplate = `Please write a passage to answer the question.

<QUESTION>
{{ the_question }}
</QUESTION>

Passage:
`;
export const DefaultHyDELLM = "openai/gpt-4o-mini";
export const FallbackHyDELLM = "epsilla/gpt-4o-mini";
export const DefaultOpenChatMessage =
  "Hello, I am your AI assistant. How can I help you today?";
export const DefaultSampleQuestions = [];
export const DefaultChatboxPlaceholder = "Ask your question here...";
export const DefaultEnableFollowUpQuestions = false;
export const DefaultFollowUpQuestionPrompt = `Considering the AI's character settings, the user's previous chat history with the AI assistant, think about the user's scenario, intention, background in their last inquiry, and generate the questions that the user is most likely to ask the AI assistant (you) next.

<CHAT_HISTORY>
{{ chat_history }}
User: {{ the_question }}
AI: {{ the_answer }}
</CHAT_HISTORY>

<REQUIREMENTS>
Basic requirements:
1. Generate 3 follow up questions.
2. Do not generate questions that the user may already know the answer to or that are unrelated to the current topics.
3. Always generate very brief and clear questions (less than 15 words) that the user may ask the AI assistant (you), NOT questions that the AI assistant (you) asks the user.
4. DO NOT generate the same or similar questions.

Additional requirements:
1. If the AI assistant did not or refused to answer the user's question, generate suggestions based on what the assistant can answer to guide the topic in a more productive direction, unrelated to the current topic.
2. Ensure the questions are different from the chat history.
3. Respond with one question per line. Don't include a number. YOU WILL BE PUNISHED for responding with anything before or after the questions.
</REQUIREMENTS>

Follow up questions:
`;
export const DefaultFollowUpQuestionsLLM = "openai/gpt-4o-mini";
export const FallbackFollowUpQuestionsLLM = "epsilla/gpt-4o-mini";

export const DefaultHideEpsillaLogo = false;
export const DefaultConversationSummaryType = "summary";
export const DefaultAllowShare = true;
export const DefaultFinancialRAG = false;
export const DefaultReportSelectorLLM = 'openai/gpt-4o';
export const FallbackReportSelectorLLM = 'epsilla/gpt-4o';

export const DefaultReportSelectorPrompt =
`You have access to the following financial reports:
2023 10-K
2023 Q3 10-Q
2023 Q2 10-Q
2023 Q1 10-Q
2022 10-K
2022 Q3 10-Q
2022 Q2 10-Q
2022 Q1 10-Q
2021 10-K
2021 Q3 10-Q
2021 Q2 10-Q
2021 Q1 10-Q

Given the user's financial question, return which reports shall we read to answer the question in a SQL filter condition.
For example, if you need report 2022 10-K, then return ReportType = '2022 10-K'
If you need report 2023 Q2 10-Q and 2022 10-K, then return ReportType = '2023 Q2 10-Q' or ReportType = '2022 10-K'
Don't return anything else in your response.

### USER QUESTION ###
{{ user_question }}

### YOUR ANSWER ###
`;
export const DefaultFinancialTableLimit = 6;
export const DefaultEnableReranker = false;
export const DefaultTimeout = 600;
export const DefaultPrimaryColor = "#8564D7";
export const DefaultBgColor = "#FFFFFF";
export const DefaultRerankerConfig: RerankerConfig = {
  rerankerType: 'dist',
  rankConstant: 0,
  weights: [],
  topK: 15,
};
export const UserWillChooseWhichKnowledgeBase = (type: "search" | "chat"): SelectOption => ({
  id: DynamicKnowledgeBaseID,
  label: `User will choose which knowledge base to use during ${type}.`,
});
export const DefaultRetrieverConfig: RetrieverConfig = {
  retrieverType: "naive",
  searchFunctionType: "semantic",
  topK: 10,
  windowExpansionPrev: 1,
  windowExpansionNext: 3,
  autoMergerThreshold: 0.8,
  knowledgeBaseId: "",
}
export const DefaultSearchIntroduction = 'Find reliable and accurate answers to your questions, with linked sources to support the search results.';
export const DefaultEnableSummary = true;
export const DefaultSearchPrompt =
`Respond to the user's question using the search result. Do not make up answers; if the answer is unknown, state that you do not know. Try to ground your answer based on the search result provided. Include the IDs of the search result (always in UUID format) you refer to in your response in the format [UUID].

<SEARCH_RESULT>
{{ retrieved_knowledge }}
</SEARCH_RESULT>

<USER_QUESTION>
{{ the_question }}
</USER_QUESTION>

Your answer:
`;
export const DefaultSearchLLM = "openai/gpt-4o";
export const FallbackSearchLLM = "epsilla/gpt-4o";

export const DefaultEnableSelectKnowledgeBase = false;
export const DefaultSearchQueryRewritePrompt =
`You are tasked with refining and improving the given user question for a search system. Your goal is to enhance the question's precision and effectiveness, ensuring that it is tailored to produce the most relevant results from a corporate database filled with reports, documents, emails, and other professional communications. Consider the specificity of terms, the context of the enterprise environment, and how information is typically categorized within such databases. Aim to modify the question by incorporating more precise keywords, relevant dates, specific department names, project titles, or any other detail that could narrow down the search results. Your refined question should maintain the original intent of the user's question while optimizing it for the best possible outcome in a search context.

<USER_QUESTION>
{{ the_question }}
</USER_QUESTION>

The improved question:
`;
export const DefaultSearchPlaceholder = 'Enter your search text here...';
export const DefaultSearchEnableFollowUpQuestions = true;
export const DefaultSearchFollowUpQuestionPrompt =
`Considering the user's previous question, the answer AI reponsed, and the retrieved knowledge. Think about the user's scenario, intention, background, and generate the questions that the user is most likely to ask next.
If the AI assistant did not or refused to answer the user's question, generate suggestions based on the retrieved knowledge to guide the topic in a more productive direction, unrelated to the current topic.

<USER_QUESTION>
{{ the_question }}
</USER_QUESTION>

<AI_ANSWER>
{{ the_answer }}
</AI_ANSWER>

<RETRIEVED_KNOWLEDGE>
{{ retrieved_knowledge }}
</RETRIEVED_KNOWLEDGE>

<REQUIREMENTS>
Basic requirements:
1. Generate 3 follow up questions.
2. Do not generate questions that the user may already know the answer to or that are unrelated to the current topics.
3. Always generate very brief and clear questions (less than 15 words) that the user may ask next.
4. DO NOT generate the same or similar questions.

Additional requirements:
1. If the AI assistant did not or refused to answer the user's question, generate suggestions based on what the assistant can answer to guide the topic in a more productive direction, unrelated to the current topic.
2. Ensure the questions are different from the user's question.
3. Respond with one question per line. Don't include a number. YOU WILL BE PUNISHED for responding with anything before or after the questions.
</REQUIREMENTS>

Follow up questions:
`;
export const FinancialRAGWhitelist = ['d8771493-8d81-482b-a2a4-5581f9f185d0', '697a953d-f15c-4c50-aeb3-6ee8bec53a58', 'cf5f7a67-0a78-47ee-9abc-da3caf51a5d9'];
export const ConversationSummaryOptions = [
  {id: 'summary', label: 'Summarize the chat.'},
  {id: 'datetime', label: 'Use the time when the chat begins.'},
];
export const SubFormStyles = {
  paddingLeft: "1rem",
  borderLeft: "3px solid",
  borderColor: "divider",
};
export const FullLLMOptions = [
  'epsilla/gpt-4o',
  'epsilla/gpt-4o-mini',
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'openai/o1-preview',
  'openai/o1-mini',
  'openai/gpt-4-turbo',
  'openai/gpt-4',
  'openai/gpt-4-32k',
  'anthropic/claude-3-5-sonnet-latest',
  'anthropic/claude-3-5-sonnet-20240620',
  'anthropic/claude-3-opus-20240229',
  'anthropic/claude-3-sonnet-20240229',
  'anthropic/claude-2.1',
  'anthropic/claude-instant-1.2',
  'deepseek/deepseek-chat',
  'deepseek/deepseek-reasoner',
  'mistralai/mistral-large-latest',
  'mistralai/mistral-medium-latest',
  'mistralai/mistral-small-latest',
  'groq/llama3-70b-8192',
  'groq/llama3-8b-8192',
  'groq/mixtral-8x7b-32768',
  'groq/gemma-7b-it',
  'gemini/gemini-1.5-pro',
  'gemini/gemini-1.5-flash',
];
export const RetrieverSearchFunctionOptions = [
  {
    label: 'Semantic similarity (dense vector embeddings)',
    id: 'semantic',
  },
  {
    label: 'Keyword match (BM25) (Coming Soon)',
    id: 'keyword',
    disabled: true,
  },
  {
    label: 'Sparse vector embeddings (Coming Soon)',
    id: 'sparse-vector',
    disabled: true,
  },
];

export const FullRerankerModels = [
  'jinaai/jina-reranker-v1-base-en',
  'jinaai/jina-reranker-v1-turbo-en',
  'jinaai/jina-reranker-v1-tiny-en',
  'jinaai/jina-colbert-v1-en',
];
export const RerankerOptions = [
  {
    label: 'Semantic Distance',
    id: 'dist',
  },
  {
    label: 'Reciprocal Rank Fusion (RRF)',
    id: 'rrf',
  },
  {
    label: 'Relative Score Fusion (RSF)',
    id: 'rsf',
  },
  {
    label: 'Jina AI Reranker',
    id: 'jina',
  },
  // {
  //   label: 'Cohere Reranker',
  //   id: 'cohere',
  // },
];
export const CodeLanguageOptions = [
  {
    label: 'Python',
    id: 'Python',
  },
  // {
  //   label: 'JavaScript',
  //   id: 'JavaScript',
  //   disabled: true,
  // },
];
export const JinaRerankerModelOptions = FullRerankerModels.filter(model => model.startsWith('jinaai/')).map(model => (
  {
    label: model,
    id: model,
  }
));
export const DefaultNewChatText = "New Task";
export const NumberOperationNudgeUserToSignUp = 2;

export const DefaultWebSearchTavilyConfig: WebSearchTavilyConfig = {
  enabled: false,
  max_results: 5,
  advanced_search: false,
  focus: [],
};

export const DefaultChatUploadFileConfig: ChatUploadFileConfig = {
  enabled: false,
  max_number_of_files: 1,
  allowed_file_types: ['.pdf'],
};
export const MaxNumberOfFilesOptions = [
  {
    label: '1',
    id: '1',
  },
  {
    label: '2 (Coming Soon)',
    id: '2',
    disabled: true,
  },
  {
    label: '3 (Coming Soon)',
    id: '3',
    disabled: true,
  },
  {
    label: '4 (Coming Soon)',
    id: '4',
    disabled: true,
  },
  {
    label: '5 (Coming Soon)',
    id: '5',
    disabled: true,
  },
  {
    label: '6 (Coming Soon)',
    id: '6',
    disabled: true,
  },
  {
    label: '7 (Coming Soon)',
    id: '7',
    disabled: true,
  },
  {
    label: '8 (Coming Soon)',
    id: '8',
    disabled: true,
  },
  {
    label: '9 (Coming Soon)',
    id: '9',
    disabled: true,
  },
  {
    label: '10 (Coming Soon)',
    id: '10',
    disabled: true,
  },
];

export const AllowedFileOptions = [
  {
    label: 'PDF',
    id: '.pdf',
  },
  {
    label: 'TXT (Coming Soon)',
    id: '.txt',
    disabled: true,
  },
  {
    label: 'CSV (Coming Soon)',
    id: '.csv',
    disabled: true,
  },
  {
    label: 'HTML (Coming Soon)',
    id: '.html',
    disabled: true,
  },
  {
    label: 'DOC (Coming Soon)',
    id: '.doc',
    disabled: true,
  },
  {
    label: 'DOCX (Coming Soon)',
    id: '.docx',
    disabled: true,
  },
  {
    label: 'JSON (Coming Soon)',
    id: '.json',
    disabled: true,
  },
  {
    label: 'JSONL (Coming Soon)',
    id: '.jsonl',
    disabled: true,
  },
  {
    label: 'PNG',
    id: '.png',
    // disabled: true,
  },
  {
    label: 'JPG',
    id: '.jpg',
    // disabled: true,
  },
];

