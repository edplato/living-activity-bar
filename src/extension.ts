// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import colorsJSON from './colors.json';

let colorShift: NodeJS.Timer;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
let i: number = 0;
let forward: boolean = true;
let notInit: boolean = false;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		const configuration = vscode.workspace.getConfiguration('workbench');
		
		// extenstion configuration for Living Activity Bar settings in package.json
		let extensionConfiguration: any = vscode.workspace.getConfiguration('living-activity-bar');

		// color selection from settings [default to blueToRed]
		let colorPick: string;

		// get color array
		let colors: string[];

		// color selection from settings [default to blueToRed]
		colorPick = extensionConfiguration.colorpick;

		// get color array
		colors = colorsJSON[colorPick];

		// get timer for setInterval color change
		let timer: number = extensionConfiguration.timer;
		// default to 100 as minimum
		if (timer < 50) {
			timer = 50;
		}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.livingActivityBar', () => {
		// The code you place here will be executed every time your command is executed

		vscode.workspace.onDidChangeConfiguration(e => {
			console.log('OUTER CHANGE')
			if (notInit && (e.affectsConfiguration("living-activity-bar.timer") || e.affectsConfiguration("living-activity-bar.colorpick"))) {
				// console.log(vscode.workspace, configuration);
				// console.log(vscode.window)
				extensionConfiguration = vscode.workspace.getConfiguration('living-activity-bar');
				deactivate();
				// color selection from settings [default to blueToRed]
				colorPick = extensionConfiguration.colorpick;
				// get color array
				colors = colorsJSON[colorPick];
				// get timer
				timer = extensionConfiguration.timer;
				// reset counter, direction, and init function to restart cycle
				i = 0;
				forward = true;
				notInit = false;
			// vscode.commands.executeCommand('extension.livingActivityBar')
			console.log('INNER CHANGE')

			colorShift = setInterval(function run() {
				let color: string = colors[i];
				configuration.update('colorCustomizations', {"activityBar.background": color}, true);
				if (notInit && (i === colors.length - 1 || i === 0)) {
					forward = !forward;
					if (forward) {
						i++;
					} else {
						i--;
					}
				} else {
					if (forward) {
						i++;
					} else {
						i--;
					}
				}
				notInit = true;
				return run;
			}(), timer);
	
		context.subscriptions.push(disposable);
			}
		})


console.log('START')
		colorShift = setInterval(function run() {
			let color: string = colors[i];
			configuration.update('colorCustomizations', {"activityBar.background": color}, true);
			if (notInit && (i === colors.length - 1 || i === 0)) {
				forward = !forward;
				if (forward) {
					i++;
				} else {
					i--;
				}
			} else {
				if (forward) {
					i++;
				} else {
					i--;
				}
			}
			notInit = true;
			return run;
		}(), timer);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('DEACTIVATE')
	clearInterval(colorShift);
}
