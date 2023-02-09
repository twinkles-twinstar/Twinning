/**
 * + popcap.rsb_patch.encode PopCap-RSB-Patch 编码
 * + popcap.rsb_patch.decode PopCap-RSB-Patch 解码
 */
namespace TwinStar.Entry.method.popcap.rsb_patch {

	// ------------------------------------------------

	type Config = {
		encode_buffer_size: Executor.RequestArgument<string, false>;
		decode_buffer_size: Executor.RequestArgument<string, false>;
	};

	export function _injector(
		config: Config,
	) {
		g_executor_method.push(
			Executor.method_of({
				id: 'popcap.rsb_patch.encode',
				descriptor(
				) {
					return Executor.query_method_description(this.id);
				},
				worker(a: Entry.CFSA & {
					before_file: Executor.RequireArgument<string>;
					after_file: Executor.RequestArgument<string, false>;
					patch_file: Executor.RequestArgument<string, true>;
					use_raw_packet: Executor.RequestArgument<boolean, false>;
					buffer_size: Executor.RequestArgument<string, false>;
				}) {
					let before_file: string;
					let after_file: string;
					let patch_file: string;
					let use_raw_packet: boolean;
					let buffer_size: bigint;
					{
						before_file = Executor.require_argument(
							...Executor.query_argument_message(this.id, 'before_file'),
							a.before_file,
							(value) => (value),
							(value) => (CoreX.FileSystem.exist_file(value)),
						);
						after_file = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'after_file'),
							a.after_file,
							(value) => (value),
							null,
							...Executor.argument_requester_for_path('file', [true]),
						);
						patch_file = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'patch_file'),
							a.patch_file,
							(value) => (value),
							() => (after_file.replace(/((\.rsb))?$/i, '.rsbpatch')),
							...Executor.argument_requester_for_path('file', [false, a.fs_tactic_if_exist]),
						);
						use_raw_packet = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'use_raw_packet'),
							a.use_raw_packet,
							(value) => (value),
							null,
							() => (Console.confirm(null)),
							(value) => (null),
						);
						buffer_size = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'buffer_size'),
							a.buffer_size,
							(value) => (parse_size_string(value)),
							null,
							() => (Console.size(null)),
							(value) => (null),
						);
					}
					CoreX.Tool.PopCap.RSBPatch.encode_fs(before_file, after_file, patch_file, use_raw_packet, { number: 1n }, buffer_size);
					Console.notify('s', los(`执行成功`), [`${patch_file}`]);
				},
				default_argument: {
					...Entry.k_cfsa,
					before_file: undefined!,
					after_file: '?input',
					patch_file: '?default',
					use_raw_packet: '?input',
					buffer_size: config.encode_buffer_size,
				},
				input_filter: Entry.file_system_path_test_generator([['file', /.+(\.rsb)$/i]]),
				input_forwarder: 'before_file',
			}),
			Executor.method_of({
				id: 'popcap.rsb_patch.decode',
				descriptor(
				) {
					return Executor.query_method_description(this.id);
				},
				worker(a: Entry.CFSA & {
					before_file: Executor.RequireArgument<string>;
					patch_file: Executor.RequestArgument<string, true>;
					after_file: Executor.RequestArgument<string, false>;
					use_raw_packet: Executor.RequestArgument<boolean, false>;
					buffer_size: Executor.RequestArgument<string, false>;
				}) {
					let before_file: string;
					let patch_file: string;
					let after_file: string;
					let use_raw_packet: boolean;
					let buffer_size: bigint;
					{
						before_file = Executor.require_argument(
							...Executor.query_argument_message(this.id, 'before_file'),
							a.before_file,
							(value) => (value),
							(value) => (CoreX.FileSystem.exist_file(value)),
						);
						patch_file = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'patch_file'),
							a.patch_file,
							(value) => (value),
							null,
							...Executor.argument_requester_for_path('file', [true]),
						);
						after_file = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'after_file'),
							a.after_file,
							(value) => (value),
							() => (patch_file.replace(/((\.rsbpatch))?$/i, '.rsb')),
							...Executor.argument_requester_for_path('file', [false, a.fs_tactic_if_exist]),
						);
						use_raw_packet = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'use_raw_packet'),
							a.use_raw_packet,
							(value) => (value),
							null,
							() => (Console.confirm(null)),
							(value) => (null),
						);
						buffer_size = Executor.request_argument(
							...Executor.query_argument_message(this.id, 'buffer_size'),
							a.buffer_size,
							(value) => (parse_size_string(value)),
							null,
							() => (Console.size(null)),
							(value) => (null),
						);
					}
					CoreX.Tool.PopCap.RSBPatch.decode_fs(before_file, after_file, patch_file, use_raw_packet, { number: 1n }, buffer_size);
					Console.notify('s', los(`执行成功`), [`${after_file}`]);
				},
				default_argument: {
					...Entry.k_cfsa,
					before_file: undefined!,
					patch_file: '?input',
					after_file: '?default',
					use_raw_packet: '?input',
					buffer_size: config.decode_buffer_size,
				},
				input_filter: Entry.file_system_path_test_generator([['file', /.+(\.rsb)$/i]]),
				input_forwarder: 'before_file',
			}),
		);
	}

	// ------------------------------------------------

}

({
	injector: TwinStar.Entry.method.popcap.rsb_patch._injector,
});