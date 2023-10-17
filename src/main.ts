import { Notice, Plugin, TAbstractFile, TFile, normalizePath } from "obsidian";
import AutoTemplateSettingsTab, { AutoTemplateSettings } from "./settings-tab";
import parsePatterns from "./utils/parse-patterns";

const DEFAULT_SETTINGS: AutoTemplateSettings = {
	patterns: "",
};

export default class AutoTemplatePlugin extends Plugin {
	settings: AutoTemplateSettings;

	matchTemplate(file: TFile) {
		for (const matcher of parsePatterns(this.settings.patterns)) {
			const match = matcher(file.path);
			if (match) return match;
		}
	}

	async getTemplateContent(name: string) {
		let templatesConfig: string;
		try {
			templatesConfig = await this.app.vault.adapter.read(
				normalizePath(this.app.vault.configDir + "/templates.json")
			);
		} catch {
			throw new Error(
				"Failed to read templates config. Make sure the core plugin is enabled."
			);
		}

		let templatesFolder: string;
		try {
			templatesFolder = JSON.parse(templatesConfig).folder;
		} catch {
			throw new Error(
				"Failed to get templates folder from templates config. Make sure you've configured a template folder location in the core plugin's settings."
			);
		}

		let templateContent: string;
		try {
			templateContent = await this.app.vault.adapter.read(
				normalizePath(
					this.app.vault.getRoot().path +
						"/" +
						templatesFolder +
						"/" +
						name +
						".md"
				)
			);
		} catch {
			throw new Error(
				`Failed to read template "${name}". Make sure the template exists in the configured template folder.`
			);
		}
		return templateContent;
	}

	async onCreate(file: TAbstractFile) {
		if (!(file instanceof TFile)) return;
		try {
			const template = this.matchTemplate(file);
			if (!template) return;

			const content = await this.getTemplateContent(template);
			await this.app.vault.adapter.write(file.path, content);
		} catch (error) {
			new Notice(error.message);
			return;
		}
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new AutoTemplateSettingsTab(this.app, this));

		this.app.workspace.onLayoutReady(() =>
			this.app.vault.on("create", this.onCreate.bind(this))
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
