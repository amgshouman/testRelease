module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: false,
        parserOpts: {
          // Matches commit messages like:
          // [UI-123] feat(test)!: introduce a breaking change
          headerPattern: /^\[UI-\d+\] (\w+)(?:\(([^)]+)\))?(!)?: (.*)$/,
          headerCorrespondence: ["type", "scope", "breaking", "subject"]
        },
        // These rules trigger a major release if either:
        // - commit.breaking is true (set by our transform function)
        // - commit.breaking is the literal "!" (if the transform isn’t applied)
        releaseRules: [
          { type: "feat", breaking: true, release: "major" },
          { type: "fix", breaking: true, release: "major" },
          { breaking: true, release: "major" },
          { type: "feat", breaking: "!", release: "major" },
          { type: "fix", breaking: "!", release: "major" },
          { breaking: "!", release: "major" },
          { type: "breaking", release: "major" },
          { type: "fix", release: "patch" }
        ],
        // Transform function: if the commit has "!" as breaking,
        // convert it to boolean true and add a breaking note.
        transform: (commit) => {
          console.log("Before transform:", commit);
          if (commit.breaking === "!") {
            commit.breaking = true;
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
          { type: "feat", breaking: "!", release: "major" },
          { type: "fix", breaking: "!", release: "major" },
          { breaking: "!", release: "major" },
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
