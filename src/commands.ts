"use strict";

import { TextDocument, TextEditor, commands } from "vscode";
import { getRootPath } from "./util";

export class TeamDocsCommands {
  getRoot(): string {
    return getRootPath();
  }

  previewFile(resource: TextDocument): Thenable<TextEditor> {
    return commands.executeCommand("markdown.showPreview", resource);
  }
}
