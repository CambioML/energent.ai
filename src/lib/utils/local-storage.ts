import { v4 as uuidv4 } from 'uuid';

export interface Member {
  member_id: string;
}

export interface User extends Member {
  user_name?: string;
  user_email?: string;
}

export enum LocalStorageKey {
  LoggedIn = 'loggedIn',
  Token = 'token',
  AnonymousToken = 'anonymousToken',
  OrgName = 'orgName',
  OrgID = 'orgId',
  OrgsMap = 'orgsMap',
  RootResourceID = 'rootResourceID',
  UserID = 'userID',
  UserInfo = 'userInfo',
  ProjectView = 'projectView',
  EnableApps = 'enableApps',
  Resources = 'resources',
  RedirectUrl = 'redirectUrl',
  NudgeUserToSignUp = 'nudgeUserToSignUp',
  OrgTier = 'orgTier',
  DebugWorkflow = 'debugWorkflow',
  CurProjectId = 'projectID',
  UserAvatar = 'userAvatar',
  LeadPassedMap = 'leadPassedMap',
}

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
}

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
}

export const getIdToken = () => {
  return getLocalStorage(LocalStorageKey.Token);
}

export const getAnonymousToken = () => {
  let token = localStorage.getItem(LocalStorageKey.AnonymousToken);
  if (!token) {
    token = 'anonymous_' + uuidv4();
    setLocalStorage(LocalStorageKey.AnonymousToken, token);
  }
  return token;
}

export const getUserInfo = () => {
  return JSON.parse(getLocalStorage(LocalStorageKey.UserInfo) as string) as User;
}
