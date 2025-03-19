module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: false,
        parserOpts: {
          headerPattern: "^\\[UI-\\d+\\] (\\w+)(?:\\(([^)]+)\\))?(!)?: (.*)$",
          headerCorrespondence: ["type", "scope", "breaking", "subject"]
        },
        releaseRules: [
          { type: "feat", breaking: true, release: "major" },
          { type: "fix", breaking: true, release: "major" },
          { breaking: true, release: "major" },
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" }
        ],
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        parserOpts: {
          headerPattern: "^\\[UI-\\d+\\] (\\w+)(?:\\(([^)]+)\\))?(!)?: (.*)$",
          headerCorrespondence: ["type", "scope", "breaking", "subject"]
        },
        releaseRules: [
          { type: "feat", breaking: true, release: "major" },
          { type: "fix", breaking: true, release: "major" },
          { breaking: true, release: "major" },
          { type: "breaking", release: "major" },
          { type: "fix", release: "patch" }
        ]
      }
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false
      }
    ],
    [
      "@semantic-release/github",
      {
        assets: ["CHANGELOG.md"]
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message:
          "[UI-1] chore(release): update package.json version to v${nextRelease.version} and CHANGELOG.md"
      }
    ]
  ]
};
