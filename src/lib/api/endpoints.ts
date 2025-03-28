export const orgsDomain = 'https://orgs.epsilla.com/api'
export const resourcesDomain = 'https://resources.epsilla.com/api'
export const usersDomain = 'https://users.epsilla.com'
export const appsDomain = 'https://apps.epsilla.com'
export const runnerDomain = 'https://runner.epsilla.com'
export const dispatchDomain = 'https://dispatch.epsilla.com'
export const etlDomain = 'https://etl.epsilla.com'
export const payDomain = 'https://pay.epsilla.com'

export enum Endpoint {
  login = usersDomain + '/api/v2/login',
  refresh = usersDomain + '/api/refresh-token',
  orgs = orgsDomain + '/orgs',
  memberOrgs = orgsDomain + '/orgs/by-member',
  projects = resourcesDomain + '/projects',
  projectsV2 = resourcesDomain + '/v2/projects',
  project = resourcesDomain + '/v2/project/',
  vectordbs = resourcesDomain + '/v2/vectordbs',
  apps = resourcesDomain + '/apps',
  ragapps = resourcesDomain + '/ragapps',
  agents = resourcesDomain + '/agent',
  usedRagApps = resourcesDomain + '/used-ragapps',
  useRagApp = resourcesDomain + '/use-ragapp',
  file = resourcesDomain + '/files',
  appDeploy = runnerDomain + '/api/deploy',
  removeDeploy = runnerDomain + '/api/remove',
  loadApp = runnerDomain + '/api/load',
  chatbotRunner = runnerDomain + '/qa-chatbot',
  billing = dispatchDomain + '/api/v2/billing/org',
  billingV2 = dispatchDomain + '/api/v2/billing',
  billingPay = payDomain,
  distributed = dispatchDomain + '/api/v3/project/',
  chatbotApp = 'https://rag.epsilla.com',
  dataSources = etlDomain + '/api/v1/datasources/',
  auth = etlDomain + '/api/v1/auth',
  leads = usersDomain + '/api/leads',
  fileUpload = 'https://agentforge.epsilla.com/api/v1/computer_use/agent',
}
