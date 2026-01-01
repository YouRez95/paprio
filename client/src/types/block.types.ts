export interface BlocksByType {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  defaultConfig: Record<string, any>;
  userConfig?: Record<string, any>;
}

export interface JSONSchemaProperty {
  type: string;
  title: string;
  description?: string;
  default: string;
  enum?: string[];
  ["ui:widget"]: string;
  ["ui:placeholder"]?: string;
}

export interface JSONSchema {
  type: string;
  title: string;
  required?: string[];
  properties?: Record<string, JSONSchemaProperty>;
  "ui:order"?: string[];
}

export interface BlockById {
  id: string;
  description: string | null;
  configSchema: JSONSchema;
}
