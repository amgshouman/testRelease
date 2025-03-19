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
          headerPattern: "^\\[UI-\\d+\\] (\\w+)(?:\\(([^)]+)\\))?(!)?: (.*)$",
          headerCorrespondence: ["type", "scope", "breaking", "subject"],
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
        },
        releaseRules: [
          { type: "feat", breaking: true, release: "major" },
          { type: "fix", breaking: true, release: "major" },
          { breaking: true, release: "major" },
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
        ]
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        parserOpts: {
          headerPattern: "^\\[UI-\\d+\\] (\\w+)(?:\\(([^)]+)\\))?(!)?: (.*)$",
          headerCorrespondence: ["type", "scope", "breaking", "subject"],
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
        },
        writerOpts: {
          headerPartial: `# 🚀 Release {{version}} - {{date}} 🎉\n\n`,
          transform: (commit, context) => {
            if (!commit.type) return false;
          
            const typeMap = {
              feat: "🚀 Features",
              fix: "🐛 Bug Fixes",
              revert: "⏪ Reverts",
              perf: "⚡ Performance Improvements",
              docs: "📚 Documentation",
              refactor: "🛠 Code Refactoring",
              test: "✅ Tests",
              build: "🏗 Builds",
              ci: "🔧 CI/CD",
              chore: "📦 Chores",
            };
          
            const repoUrl = context.repositoryUrl
              ? context.repositoryUrl.replace(/\.git$/, "")
              : "";
            const commitHash = commit.commit?.short || commit.hash;
            const commitLink = repoUrl
              ? `([${commitHash}](${repoUrl}/commit/${commit.hash}))`
              : `([${commitHash}])`;
          
            const notes = commit.notes
              ? commit.notes.map(note => ({
                  ...note,
                  title: note.title.toLowerCase().includes("breaking change")
                    ? `💥 ${note.title}`
                    : note.title,
                }))
              : [];
                    
            return {
              ...commit,
              // type: typeMap[commit.type] || commit.type,
              // scope: commit.scope ? `(${commit.scope})` : "",
              // subject: `${commit.subject} | `,
              // notes,
            };
          },
          
                        
          commitGroupsSort: "title",
          commitsSort: ["scope", "subject"]
        }
      }
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
