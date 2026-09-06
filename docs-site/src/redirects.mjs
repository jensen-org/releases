const base = '/releases'

const moved = {
  '/start/download-and-install/': '/start/install/',
  '/start/verify-a-download/': '/start/install/#verify-what-you-downloaded',
  '/start/first-run/': '/start/turn-jensen-on/',
  '/ai/how-it-works/': '/assistant/how-it-works/',
  '/ai/context-server/': '/assistant/how-it-works/#what-your-assistant-gets-on-connect',
  '/ai/choosing-an-assistant/': '/assistant/choosing-an-assistant/',
  '/ai/models-and-providers/': '/assistant/models-and-providers/',
  '/ai/what-your-assistant-can-do/': '/reference/assistant-tools/',
  '/ai/plans-and-objectives/': '/automation/plans-and-objectives/',
  '/ai/profiles-and-workflows/': '/automation/workflows/',
  '/ai/agent-hooks/': '/automation/agent-hooks/',
  '/ai/missions-and-schedules/': '/automation/profiles-and-missions/',
  '/ai/trust-approvals-and-permissions/': '/safety/trust-and-permissions/',
  '/safety/findings-and-screening/': '/knowledge/findings/',
}

export const redirects = Object.fromEntries(
  Object.entries(moved).map(([from, to]) => [from, base + to]),
)
