import {v4 as uuidv4} from 'uuid';
import { BaseComponentConfig, ComponentOutputConfig } from '../../model';
export type PipelineOutputComponentConfig = BaseComponentConfig;

export function CreatePipelineOutputComponentConfig(
  outputs: ComponentOutputConfig[],
): PipelineOutputComponentConfig {
  return {
    id: uuidv4(),
    type: 'pipeline_output',
    inputs: outputs.map(output => ({
      name: output.name,
      data_type: output.data_type,
      required: true,
    })), 
    outputs: outputs,
    input_sources: {},
  };
}
