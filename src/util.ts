"use strict";

import { homedir } from "os";
import { resolve } from "path";
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
