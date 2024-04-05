import * as vscode from "vscode";
import { TeamDocsExplorerProvider } from "./explorer";
import { getRootPath } from "./util";

export function activate(context: vscode.ExtensionContext) {
  const provider = new TeamDocsExplorerProvider();

  vscode.window.registerTreeDataProvider("teamdocs", provider);

  vscode.commands.registerCommand("teamDocs.previewFile", function (resource) {
    return vscode.commands.executeCommand("markdown.showPreview", resource);
  });

  vscode.commands.registerCommand("teamDocs.openSettings", function () {
    vscode.commands.executeCommand("workbench.action.openSettings", "teamdocs");
  });

  vscode.commands.registerCommand("teamDocs.search", async () => {
    const workspaceRoot = getRootPath();
    if (workspaceRoot) {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(workspaceRoot, "**/**/**/**/**/**/*"),
        null
      );

      const fileNames = files.map((file) => {
        return file.path.replace(`${workspaceRoot}/`, "");
      });

      const selectedFile = await vscode.window.showQuickPick(fileNames, {
        placeHolder: "Type to search files...",
      });

      if (selectedFile) {
        const selectedFileUri = vscode.Uri.file(
          `${workspaceRoot}/${selectedFile}`
        );

        vscode.commands.executeCommand("markdown.showPreview", selectedFileUri, {
          preview: true,
        });
      }
    }
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
  } else {
    // customize view title based on dir name
    const dirName = workspaceRoot.split("/").slice(-1).join("");
    const view = vscode.window.createTreeView("teamdocs", {
      treeDataProvider: provider,
    });
    view.title = dirName;
  }
}

export function deactivate() {}
