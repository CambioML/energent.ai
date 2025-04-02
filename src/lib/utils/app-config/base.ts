export interface ComponentInputConfig {
  name: string;
  data_type: string;
  default?: any;
  required: boolean;
}

export interface ComponentOutputConfig {
  name: string;
  data_type: string;
}

export interface ComponentInputSource {
  source_component_id: string;
  source_component_output_name: string;
}

export interface BaseComponentConfig {
  id: string;
  type: string;
  description?: string;
  display_in_progress?: boolean;
  inputs: ComponentInputConfig[];
  outputs: ComponentOutputConfig[];
  input_sources: { [key: string]: ComponentInputSource | ComponentInputSource[] };
}

export enum DataTypes {
  REAL = 'real',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  STRING = 'string',
  INDEX = 'index',
  DENSE_VECTOR_INDEX = 'dense_vector_index',
  SPARSE_VECTOR_INDEX = 'sparse_vector_index',
  KEYWORD_SEARCH_INDEX = 'keyword_search_index',
  NEIGHBOR_DOCUMENTS_INDEX = 'neighbor_documents_index',
  HIERARCHICAL_DOCUMENTS_INDEX = 'hierarchical_documents_index',
  DOCUMENT = 'document',
  MESSAGE = 'message',
  LLM = 'LLM',
  TOOL = 'tool',
  FILE = 'file',
  IMAGE = 'image',
};