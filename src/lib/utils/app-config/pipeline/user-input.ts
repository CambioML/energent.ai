import { v4 as uuidv4 } from "uuid";
import { BaseComponentConfig, ComponentOutputConfig } from "../model";

export type UserInputComponentConfig = {
  user_input_values: { [key: string]: any };
} & BaseComponentConfig;

export function CreateUserInputComponentConfig(
  userInputs: ComponentOutputConfig[]
): UserInputComponentConfig {
  return {
    id: uuidv4(),
    type: "user_input",
    user_input_values: {},
    inputs: [],
    outputs: userInputs,
    input_sources: {},
  };
}
