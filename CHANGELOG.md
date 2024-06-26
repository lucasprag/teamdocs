# Change Log

All notable changes to this extension will be documented in this file following the structure inspired by [Keep a Changelog](https://keepachangelog.com/).

## [0.3.0] - 2024-04-05

### Added
- Added a menu to the top of the explorer to trigger a search.

### Changed
- Changed search and explorer to hide files based on the vscode's settings called "Files: Exclude"
- Changed search and explorer to only preview markdown files and open any other type of file.

## [0.2.0] - 2024-04-05

### Added
- Added `Team Docs: Search` command.

### Changed
- Changed the existing `Open Settings` command to `Team Docs: Open Settings`.

## [0.1.1] - 2024-02-13

### Changed
- Improve extension description in the README.md.
- Replace the extension icons that shows up in the Activity Bar.

## [0.1.0] - 2024-02-13

### Added
- required configuration for the documentation folder (`teamdocs.path_to_docs_folder`).
- check for when the configuration is missing with quick button to go to settings.
- explorer showing the documentation files and folders.
- when clicking on file, it shows the markdown preview.