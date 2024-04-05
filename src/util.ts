"use strict";

import { homedir } from "os";
import { resolve, extname } from "path";
import { workspace } from "vscode";

export function getRootPath(): string {
  let location = workspace
    .getConfiguration()
    .get("teamdocs.path_to_docs_folder") as string;

  if (!location) {
    return "";
  }

  location = location.replace("~", homedir());
  location = location.replace("${HOME}", homedir());
  location = resolve(location);

  return location;
}

export function getExcludePatterns(): string[] {
  const excludeSettings: any = workspace
    .getConfiguration("files")
    .get("exclude");
  return Object.keys(excludeSettings || {}).filter(
    (key) => excludeSettings[key]
  );
}

export function isMarkdownFile(filePath: string): boolean {
  const fileExtension = extname(filePath);

  const markdownExtensions: string[] = [
    ".md",
    ".markdown",
    ".mdown",
    ".mkdn",
    ".mkd",
    ".mdwn",
    ".mdtxt",
    ".mdtext",
    ".text",
  ];

  return markdownExtensions.includes(fileExtension);
}
