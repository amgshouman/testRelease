/**
 * @type {import('semantic-release').GlobalConfig}
 */

module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        parserOpts: {
          headerPattern: "^\\[UI-\\d+\\] (\\w+)(?:\\(([-\\w]+)\\))?: (.+)$",
          headerCorrespondence: ["type", "scope", "subject"],
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "docs", release: false },
          { type: "refactor", release: false },
          { type: "test", release: false },
          { type: "build", release: false },
          { type: "ci", release: false },
          { type: "chore", release: false },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        parserOpts: {
          headerPattern: "^\\[UI-\\d+\\] (\\w+)(?:\\(([-\\w]+)\\))?: (.+)$",
          headerCorrespondence: ["type", "scope", "subject"],
        },
        writerOpts: {
          header: function (context) {
            const date = new Date().toISOString().split("T")[0];
            return `# 🚀 Release v${context.version} - ${date} 🎉\n\n`;
          },
          commitsSort: ["subject", "scope"],
        },
        presetConfig: {
          types: [
            { mess: "feat", section: "💥 Breaking Changes", hidden: false },
            { type: "feat", section: "🚀 Features", hidden: false },
            { type: "fix", section: "🐛 Bug Fixes", hidden: false },
            { type: "revert", section: "⏪ Reverts", hidden: false },
            {
              type: "perf",
              section: "⚡ Performance Improvements",
              hidden: false,
            },
            { type: "docs", section: "📚 Documentation", hidden: false },
            { type: "refactor", section: "🛠 Code Refactoring", hidden: false },
            { type: "test", section: "✅ Tests", hidden: true },
            { type: "build", section: "🏗 Builds", hidden: false },
            { type: "ci", section: "🔧 CI/CD", hidden: true },
            { type: "chore", section: "📦 Chores", hidden: true },
          ],
        },
      },
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: ["CHANGELOG.md"],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message:
          "chore(release): Update changelog & version to v${nextRelease.version}",
      },
    ],
  ],
};
