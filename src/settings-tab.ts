import { App, PluginSettingTab, Setting } from "obsidian";
import AutoTemplatePlugin from "./main";

export interface AutoTemplateSettings {
	patterns: string;
}

export default class AutoTemplateSettingsTab extends PluginSettingTab {
	plugin: AutoTemplatePlugin;

	constructor(app: App, plugin: AutoTemplatePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Patterns")
			.setDesc("A list of Folder:Template pairs.")
			.addTextArea((text) => {
				text.setPlaceholder("Folder:Template")
					.setValue(this.plugin.settings.patterns)
					.onChange(async (value) => {
						this.plugin.settings.patterns = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
