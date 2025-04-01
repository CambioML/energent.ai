import { BaseComponentConfig, ComponentInputSource, RAGAppConfig } from "./model";

export function AddNewComponentToRAGAppConfig(
  ragAppConfig: RAGAppConfig,
  componentConfig: BaseComponentConfig,
  x: number,
  y: number
): RAGAppConfig {
  // TODO: check id conflict
  return {
    ...ragAppConfig,
    positions: {
      ...ragAppConfig.positions,
      [componentConfig.id]: {
        x,
        y,
      },
    },
    components: [...ragAppConfig.components, componentConfig],
  };
}

export function UpsertComponentInputSource(
  ragAppConfig: RAGAppConfig,
  componentId: string,
  inputName: string,
  inputSource: ComponentInputSource | ComponentInputSource[]
): RAGAppConfig {
  // Check if the input name is defined in the component's input list.
  const component = ragAppConfig.components.find((c) => c.id === componentId);
  if (!component) {
    throw `Component ${componentId} not found.`;
  }
  const inputConfig = component.inputs.find((i) => i.name === inputName);
  if (!inputConfig) {
    throw `Input ${inputName} not found in component ${componentId}.`;
  }
  // Check if the input source is referring to a valid output of another component.
  if (Array.isArray(inputSource)) {
    inputSource.forEach((s) => {
      const sourceComponent = ragAppConfig.components.find(
        (c) => c.id === s.source_component_id
      );
      if (!sourceComponent) {
        throw `Component ${s.source_component_id} not found.`;
      }
      const sourceOutput = sourceComponent.outputs.find(
        (o) => o.name === s.source_component_output_name
      );
      if (!sourceOutput) {
        throw `Output ${s.source_component_output_name} not found in component ${s.source_component_id}.`;
      }
      // TODO: implement a type system to check type compatibility.
      // if (sourceOutput.data_type !== inputConfig.data_type) {
      //   throw `Output ${s.source_component_output_name} of component ${s.source_component_id} has data type ${sourceOutput.data_type}, but input ${inputName} of component ${componentId} has data type ${inputConfig.data_type}.`;
      // }
    });
  } else {
    const sourceComponent = ragAppConfig.components.find(
      (c) => c.id === inputSource.source_component_id
    );
    if (!sourceComponent) {
      throw `Component ${inputSource.source_component_id} not found.`;
    }
    const sourceOutput = sourceComponent.outputs.find(
      (o) => o.name === inputSource.source_component_output_name
    );
    if (!sourceOutput) {
      throw `Output ${inputSource.source_component_output_name} not found in component ${inputSource.source_component_id}.`;
    }
    // TODO: implement a type system to check type compatibility.
    // if (sourceOutput.data_type !== inputConfig.data_type) {
    //   throw `Output ${inputSource.source_component_output_name} of component ${inputSource.source_component_id} has data type ${sourceOutput.data_type}, but input ${inputName} of component ${componentId} has data type ${inputConfig.data_type}.`;
    // }
  }

  const newComponents = ragAppConfig.components.map((c) => {
    if (c.id === componentId) {
      return {
        ...c,
        input_sources: {
          ...c.input_sources,
          [inputName]: inputSource,
        },
      };
    } else {
      return c;
    }
  });
  return {
    ...ragAppConfig,
    components: newComponents,
  };
}
