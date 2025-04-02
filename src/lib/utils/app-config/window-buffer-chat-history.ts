import { v4 as uuidv4 } from 'uuid';
import { BaseComponentConfig, DataType } from './model';

export type WindowBufferChatHistoryComponentConfig = BaseComponentConfig & {
  project_id: string,
  db_id: string,
  // Below will be rendered by server side during runtime.
  // conversation_id: string,
  // auth_api_key: Optional[str] = None
  // api_key: Optional[str] = None
  // jwt_token: Optional[str] = None
  // user_message_time: int = None

  user_role_str?: string,
  ai_role_str?: string,

  inputs: [
    { name: 'User Message', data_type: DataType.STRING, required: true },
    { name: 'AI Response Message', data_type: DataType.STRING, required: true },
    { name: 'Buffer Size', data_type: DataType.INTEGER, default: number, required: false },
    { name: 'References', data_type: `list<${DataType.DOCUMENT}>`, default: [], required: false },
  ],
  outputs: [
    { name: 'Chat History', data_type: `list<${DataType.MESSAGE}>` }
  ]
};

export function CreateWindowBufferChatHistoryComponentConfig(
  projectId: string,
  dbId: string,
  bufferSize: number,
  userRole: string = 'User',
  aiRole: string = 'AI',
): WindowBufferChatHistoryComponentConfig {
  return {
    id: uuidv4(),
    type: 'window_buffer_chat_history',
    description: 'Keep the most recent rounds of messages from the conversation.',
    project_id: projectId,
    db_id: dbId,
    agent_id: dbId,
    user_role_str: userRole,
    ai_role_str: aiRole,
    inputs: [
      { name: 'User Message', data_type: DataType.STRING, required: true },
      { name: 'AI Response Message', data_type: DataType.STRING, required: true },
      { name: 'Buffer Size', data_type: DataType.INTEGER, default: bufferSize, required: false },
      { name: 'References', data_type: `list<${DataType.DOCUMENT}>`, default: [], required: false },
    ],
    outputs: [
      { name: 'Chat History', data_type: `list<${DataType.MESSAGE}>` }
    ],
    input_sources: {},
  };
}
