#pragma once

#include "framework.h"
#include "base_command.hpp"

namespace TwinKleS::WindowsExplorerExtension {

	inline constexpr auto k_shell_file = std::wstring_view{L"C:\\Program Files\\TwinKleS\\ToolKit\\shell.exe"};

	// ------------------------------------------------

	#pragma region config

	struct MethodInvokeCommandConfig {
		std::wstring                name;
		std::optional<bool>         type;
		std::optional<std::wregex>  rule;
		std::optional<std::wstring> method;
		std::wstring                argument;
	};

	struct MethodInvokeCommandConfigGroup {
		std::wstring                           name;
		std::vector<MethodInvokeCommandConfig> child;
		std::vector<std::size_t>               separator;
	};

	// ------------------------------------------------

	inline auto test_single_path (
		MethodInvokeCommandConfig const & config,
		std::wstring const &              path
	) -> bool {
		auto result = true;
		if (config.type) {
			if (config.type.value()) {
				result &= std::filesystem::is_directory(std::filesystem::path{path});
			} else {
				result &= std::filesystem::is_regular_file(std::filesystem::path{path});
			}
		}
		if (result && config.rule) {
			result &= std::regex_search(path, config.rule.value());
		}
		return result;
	}

	inline auto make_single_code (
		MethodInvokeCommandConfig const & config,
		std::wstring const &              path
	) -> std::wstring {
		if (!config.method) {
			return std::format(LR"("{}" -argument "{}")", path, config.argument);
		} else {
			return std::format(LR"("{}" -method "{}" -argument "{}")", path, config.method.value(), config.argument);
		}
	}

	#pragma endregion

	#pragma region command

	class MethodInvokeCommand :
		public BaseCommand {

	protected: //

		MethodInvokeCommandConfig const & m_config;
		bool                              m_has_icon;

	public: //

		#pragma region structor

		explicit MethodInvokeCommand (
			MethodInvokeCommandConfig const & config,
			bool const &                      has_icon = true
		):
			m_config{config},
			m_has_icon{has_icon} {
		}

		#pragma endregion

		#pragma region implement

		virtual IFACEMETHODIMP Invoke (
			_In_opt_ IShellItemArray * selection,
			_In_opt_ IBindCtx *        unused_1
		) override {
			try {
				auto parameter = std::wstring{};
				if (selection) {
					auto path_list = get_selection_path(selection);
					parameter.reserve(k_shell_file.size() + 2 + path_list.size() * 256);
					parameter.append(1, L'"');
					parameter.append(k_shell_file);
					parameter.append(1, L'"');
					for (auto & path : path_list) {
						parameter.append(1, L' ');
						parameter.append(make_single_code(thiz.m_config, path));
					}
				}
				parameter.append(1, L'\0');
				auto startup_info = STARTUPINFOW{};
				auto process_information = PROCESS_INFORMATION{};
				ZeroMemory(&startup_info, sizeof(startup_info));
				ZeroMemory(&process_information, sizeof(process_information));
				CreateProcessW(k_shell_file.data(), parameter.data(), nullptr, nullptr, FALSE, CREATE_NEW_CONSOLE, nullptr, nullptr, &startup_info, &process_information);
				return S_OK;
			}
			CATCH_RETURN()
		}

		// ------------------------------------------------

		virtual auto title (
		) -> LPCWSTR override {
			return thiz.m_config.name.c_str();
		}

		virtual auto icon (
		) -> LPCWSTR override {
			if (thiz.m_has_icon) {
				return k_shell_file.data();
			} else {
				return nullptr;
			}
		}

		virtual auto state (
			_In_opt_ IShellItemArray * selection
		) -> EXPCMDSTATE override {
			auto path_list = get_selection_path(selection);
			for (auto & path : path_list) {
				if (!test_single_path(thiz.m_config, path)) {
					return ECS_DISABLED;
				}
			}
			return ECS_ENABLED;
		}

		#pragma endregion

	};

	class MethodInvokeCommandEnum :
		public RuntimeClass<RuntimeClassFlags<ClassicCom>, IEnumExplorerCommand> {

	protected: //

		std::vector<ComPtr<IExplorerCommand>>                 m_commands;
		std::vector<ComPtr<IExplorerCommand>>::const_iterator m_current;

	public: //

		#pragma region structor

		explicit MethodInvokeCommandEnum (
			MethodInvokeCommandConfigGroup const & config
		) {
			auto separator_index = std::size_t{0};
			auto current_separator_section_count = std::size_t{0};
			thiz.m_commands.reserve(config.child.size() + config.separator.size());
			for (auto & e : config.child) {
				if (separator_index < config.separator.size() && current_separator_section_count == config.separator[separator_index]) {
					current_separator_section_count = 0;
					thiz.m_commands.emplace_back(Make<SeparatorCommand>());
					++separator_index;
				}
				thiz.m_commands.emplace_back(Make<MethodInvokeCommand>(e, false));
				++current_separator_section_count;
			}
			thiz.m_current = thiz.m_commands.cbegin();
		}

		#pragma endregion

		#pragma region implement

		virtual IFACEMETHODIMP Next (
			ULONG                                                      celt,
			__out_ecount_part(celt, *pceltFetched) IExplorerCommand ** pUICommand,
			__out_opt ULONG *                                          pceltFetched
		) override {
			auto fetched = ULONG{0};
			wil::assign_to_opt_param(pceltFetched, 0ul);
			for (auto i = ULONG{0}; i < celt && thiz.m_current != thiz.m_commands.cend(); i++) {
				thiz.m_current->CopyTo(&pUICommand[0]);
				++thiz.m_current;
				++fetched;
			}
			wil::assign_to_opt_param(pceltFetched, fetched);
			return fetched == celt ? S_OK : S_FALSE;
		}

		virtual IFACEMETHODIMP Skip (
			ULONG celt
		) override {
			return E_NOTIMPL;
		}

		virtual IFACEMETHODIMP Reset (
		) override {
			thiz.m_current = thiz.m_commands.cbegin();
			return S_OK;
		}

		virtual IFACEMETHODIMP Clone (
			__deref_out IEnumExplorerCommand ** ppenum
		) override {
			*ppenum = nullptr;
			return E_NOTIMPL;
		}

		#pragma endregion

	};

	class MethodInvokeGroupCommand :
		public BaseCommand {

	protected: //

		MethodInvokeCommandConfigGroup const & m_config;

	public: //

		// ------------------------------------------------

		#pragma region structor

		explicit MethodInvokeGroupCommand (
			MethodInvokeCommandConfigGroup const & config
		):
			m_config{config} {
		}

		#pragma endregion

		#pragma region implement

		virtual IFACEMETHODIMP EnumSubCommands (
			_COM_Outptr_ IEnumExplorerCommand ** ppEnum
		) override {
			*ppEnum = nullptr;
			auto e = Make<MethodInvokeCommandEnum>(thiz.m_config);
			return e->QueryInterface(IID_PPV_ARGS(ppEnum));
		}

		// ------------------------------------------------

		virtual auto title (
		) -> LPCWSTR override {
			return thiz.m_config.name.c_str();
		}

		virtual auto icon (
		) -> LPCWSTR override {
			return k_shell_file.data();
		}

		virtual auto state (
			_In_opt_ IShellItemArray * selection
		) -> EXPCMDSTATE override {
			auto path_list = get_selection_path(selection);
			for (auto & config : thiz.m_config.child) {
				auto state = true;
				for (auto & path : path_list) {
					if (!test_single_path(config, path)) {
						state = false;
						break;
					}
				}
				if (state) {
					return ECS_ENABLED;
				}
			}
			return ECS_DISABLED;
		}

		virtual auto flags (
		) -> EXPCMDFLAGS override {
			return ECF_HASSUBCOMMANDS;
		}

		#pragma endregion

	};

	#pragma endregion

}