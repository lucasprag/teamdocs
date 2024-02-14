"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamDocsExplorerProvider = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const util_1 = require("./util");
class TeamDocsExplorerProvider {
    _onDidChangeTreeData = new vscode_1.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        const treeItem = new vscode_1.TreeItem(element.uri, element.type === vscode_1.FileType.Directory
            ? vscode_1.TreeItemCollapsibleState.Collapsed
            : vscode_1.TreeItemCollapsibleState.None);
        if (element.type === vscode_1.FileType.File) {
            treeItem.command = {
                command: "teamDocs.previewFile",
                title: "Preview File",
                arguments: [element.uri],
            };
            treeItem.contextValue = "file";
        }
        else {
            treeItem.contextValue = "folder";
        }
        treeItem.tooltip = element.name;
        return treeItem;
    }
    getChildren(element) {
        const workspaceRoot = (0, util_1.getRootPath)();
        if (!workspaceRoot) {
            return Promise.resolve([]);
        }
        let folder = (0, path_1.join)(workspaceRoot);
        if (element) {
            folder = (0, path_1.join)(workspaceRoot, element.relative);
        }
        return Promise.resolve(this.readDirectory(workspaceRoot, folder));
    }
    readDirectory(root, folder) {
        if (!(0, fs_1.existsSync)(folder)) {
            return [];
        }
        const children = [];
        (0, fs_1.readdirSync)(folder, "utf-8").forEach(function (filename) {
            const file = (0, path_1.join)(folder, filename.toString());
            const relative = file.replace(root, "");
            const stat = (0, fs_1.statSync)(file);
            const type = stat.isDirectory() ? vscode_1.FileType.Directory : vscode_1.FileType.File;
            const item = {
                uri: vscode_1.Uri.file(file),
                relative: relative,
                name: filename,
                type: type,
            };
            children.push(item);
        });
        children.sort(function (a, b) {
            if (a.type === b.type) {
                return a.relative.localeCompare(b.relative);
            }
            return a.type === vscode_1.FileType.Directory ? -1 : 1;
        });
        return children;
    }
}
exports.TeamDocsExplorerProvider = TeamDocsExplorerProvider;
//# sourceMappingURL=explorer.js.map