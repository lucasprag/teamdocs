"use strict";

import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import {
  Event,
  EventEmitter,
  TreeItem,
  FileType,
  TreeItemCollapsibleState,
  Uri,
  TreeDataProvider,
} from "vscode";
import { minimatch } from "minimatch";
import { getRootPath, getExcludePatterns } from "./util";

export class TeamDocsExplorerProvider implements TreeDataProvider<any> {
  private _onDidChangeTreeData: EventEmitter<any | undefined | null | void> =
    new EventEmitter<any | undefined | null | void>();
  readonly onDidChangeTreeData: Event<any | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: any): TreeItem {
    const treeItem = new TreeItem(
      element.uri,
      element.type === FileType.Directory
        ? TreeItemCollapsibleState.Collapsed
        : TreeItemCollapsibleState.None
    );

    if (element.type === FileType.File) {
      treeItem.command = {
        command: "teamDocs.previewFile",
        title: "Preview File",
        arguments: [element.uri],
      };

      treeItem.contextValue = "file";
    } else {
      treeItem.contextValue = "folder";
    }

    return treeItem;
  }

  getChildren(element: any): Promise<any> {
    const workspaceRoot = getRootPath();
    if (!workspaceRoot) {
      return Promise.resolve([]);
    }

    let folder = join(workspaceRoot);
    if (element) {
      folder = join(workspaceRoot, element.relative);
    }

    return Promise.resolve(this.readDirectory(workspaceRoot, folder));
  }

  readDirectory(root: string, folder: string): Array<any> {
    if (!existsSync(folder)) {
      return [];
    }

    const excludePatterns = getExcludePatterns();

    const children: any[] = [];
    readdirSync(folder, "utf-8").forEach(function (filename: string | Buffer) {
      const file = join(folder, filename.toString());
      const relative = file.replace(root, "");

      // Check if the file matches any of the exclude patterns
      if (excludePatterns.some((pattern) => minimatch(relative, pattern))) {
        return;
      }

      const stat = statSync(file);
      const type = stat.isDirectory() ? FileType.Directory : FileType.File;
      const item = {
        uri: Uri.file(file),
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

      return a.type === FileType.Directory ? -1 : 1;
    });

    return children;
  }
}
