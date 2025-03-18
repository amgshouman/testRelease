module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: false,
        parserOpts: {
          headerPattern: /^\[UI-\d+\] (\w+)(?:\(([^)]+)\))?(!)?: (.*)$/,
          headerCorrespondence: ["type", "scope", "breaking", "subject"]
        },
        releaseRules: [
          { type: "feat", breaking: true, release: "major" },
          { type: "fix", breaking: true, release: "major" },
          { breaking: true, release: "major" },
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" }
        ],
        transform: (commit) => {
          // Debug logging to verify the commit state
          console.log("Before transform:", commit);
          if (commit.breaking === "!") {
            commit.breaking = true;
            // Adding a BREAKING CHANGE note ensures detection by semantic-release
            commit.notes = commit.notes || [];
            commit.notes.push({
              title: "BREAKING CHANGE",
              text: commit.subject
            });
          }
          console.log("After transform:", commit);
          return commit;
        }
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        parserOpts: {
          headerPattern: /^\[UI-\d+\] (\w+)(?:\(([^)]+)\))?(!)?: (.*)$/,
          headerCorrespondence: ["type", "scope", "breaking", "subject"]
        },
        releaseRules: [
          { type: "feat", breaking: true, release: "major" },
          { type: "fix", breaking: true, release: "major" },
          { breaking: true, release: "major" },
          { type: "feat", release: "minor" },
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
