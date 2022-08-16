export type LoginProps = {
  isAdminLogin?: boolean;
};

export type FormClientProps = {
  username: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};
export type FormAgentProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};
export type FormValuesProps = FormClientProps | FormAgentProps;
