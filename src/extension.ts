import * as vscode from 'vscode';
import { TeamDocsExplorerProvider } from "./explorer";
import { getRootPath } from "./util";

export function activate(context: vscode.ExtensionContext) {
  const provider = new TeamDocsExplorerProvider();

  vscode.window.registerTreeDataProvider("teamdocs", provider);

  vscode.commands.registerCommand("teamDocs.openSettings", function () {
    vscode.commands.executeCommand("workbench.action.openSettings", "teamdocs");
  });

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(function (e) {
      if (e.affectsConfiguration("teamdocs")) {
        provider.refresh();
      }
    })
  );

  const workspaceRoot = getRootPath();
  if (workspaceRoot === "") {
    vscode.window
      .showInformationMessage(
        "TeamDocs is missing the `teamdocs.path_to_docs_folder` configuration. Please set the path to your docs folder.",
        "Open Settings"
      )
      .then(function () {
        vscode.commands.executeCommand("teamDocs.openSettings");
      });
  }
}

export function deactivate() {}
