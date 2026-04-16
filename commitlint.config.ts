import type { UserConfig } from 'cz-git'

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 150],
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
  },
  ignores: [(message: string) => /^chore\(release\): .+$/m.test(message)],
  prompt: {
    useEmoji: false,
    skipQuestions: ['footerPrefix'],
    issuePrefixes: [],
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false,
    messages: {
      footer: 'Jira ticket (optional, e.g. JIRA-123):',
    },
    formatMessageCB: ({ defaultMessage, defaultHeader, footer }) => {
      const ticket = footer?.trim()
      if (!ticket) return defaultMessage
      // Move Jira ticket from footer into the header line
      return defaultMessage
        .replace(defaultHeader, `${defaultHeader} [${ticket}]`)
        .replace(new RegExp(`\\n\\n${footer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '')
    },
  },
} satisfies UserConfig
