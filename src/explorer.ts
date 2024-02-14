"use strict";

import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";
import {
  TreeItem,
  FileType,
  TreeItemCollapsibleState,
  Uri,
  TreeDataProvider,
} from "vscode";
import { getRootPath } from "./util";

export class TeamDocsExplorerProvider implements TreeDataProvider<any> {
  getTreeItem(element: any): TreeItem {
    const treeItem = new TreeItem(
      element.uri,
      element.type === FileType.Directory
        ? TreeItemCollapsibleState.Collapsed
        : TreeItemCollapsibleState.None
    );

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

    const children: any[] = [];
    readdirSync(folder, "utf-8").forEach(function (filename: string | Buffer) {
      const file = join(folder, filename.toString());
      const relative = file.replace(root, "");

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