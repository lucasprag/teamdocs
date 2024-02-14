import * as vscode from 'vscode';
import { getRootPath } from "./util";

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('teamdocs.helloWorld', () => {
    const workspaceRoot = getRootPath();
		vscode.window.showInformationMessage(`My workspaceRoot is ${workspaceRoot}!`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
