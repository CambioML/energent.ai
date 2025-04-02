import { v4 as uuidv4 } from 'uuid';
import { BaseComponentConfig, DataTypes } from './base';

export interface AutoAgentComponentConfig extends BaseComponentConfig {
  project_id: string,
  agent_id: string,
  inputs: [
    { name: 'Template', data_type: DataTypes.STRING, default: string, required: boolean },
    { name: 'System Message', data_type: DataTypes.STRING, required: boolean },
    { name: 'User Message', data_type: DataTypes.STRING, required: boolean },
  ],
  outputs: [
    { name: 'Generated Result', data_type: DataTypes.STRING }
  ]
};

export function createAutoAgentComponentConfig(
  projectId: string,
  agentId: string,
  template: string,
): AutoAgentComponentConfig {
  return {
    id: uuidv4(),
    project_id: projectId,
    agent_id: agentId,
    description: 'The AutoAgent solves user problems autonomously.',
    display_in_progress: false,
    type: 'auto_agent',
    inputs: [
      { name: 'Template', data_type: DataTypes.STRING, default: template, required: true },
      { name: 'System Message', data_type: DataTypes.STRING, required: false },
      { name: 'User Message', data_type: DataTypes.STRING, required: true },
    ],
    outputs: [
      { name: 'Generated Result', data_type: DataTypes.STRING }
    ],
    input_sources: {},
  };
}
