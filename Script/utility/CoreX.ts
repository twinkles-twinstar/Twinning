namespace TwinStar.CoreX {

	// ------------------------------------------------

	const g_common_buffer = Core.ByteArray.default();

	export function set_common_buffer_size(
		size: bigint,
	): void {
		g_common_buffer.allocate(Core.Size.value(size));
		return;
	}

	// ------------------------------------------------

	export namespace JSON {

		// ------------------------------------------------

		const g_write_format: {
			disable_trailing_comma: boolean;
			disable_array_wrap_line: boolean;
		} = {
			disable_trailing_comma: false,
			disable_array_wrap_line: false,
		};

		export function set_write_format(
			disable_trailing_comma: boolean,
			disable_array_wrap_line: boolean,
		): void {
			g_write_format.disable_trailing_comma = disable_trailing_comma;
			g_write_format.disable_array_wrap_line = disable_array_wrap_line;
			return;
		}

		// ------------------------------------------------

		export function read<ConstraintT extends Core.JSON.JS_Value>(
			data: ArrayBuffer,
		): Core.JSON.Value<ConstraintT> {
			let data_stream = Core.CharacterStreamView.watch(Core.Miscellaneous.cast_ByteListView_to_CharacterListView(Core.ByteListView.value(data)));
			let value = Core.JSON.Value.default<ConstraintT>();
			Core.Tool.Data.Serialization.JSON.Read.process_whole(data_stream, value);
			return value;
		}

		/** NOTE : result is a view of buffer */
		export function write<ConstraintT extends Core.JSON.JS_Value>(
			value: Core.JSON.Value<ConstraintT>,
			disable_trailing_comma: boolean = g_write_format.disable_trailing_comma,
			disable_array_wrap_line: boolean = g_write_format.disable_array_wrap_line,
			data_buffer: Core.CharacterListView | bigint = Core.Miscellaneous.cast_ByteListView_to_CharacterListView(g_common_buffer.view()),
		): ArrayBuffer {
			let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
			let data_buffer_view = data_buffer instanceof Core.CharacterListView ? data_buffer : Core.Miscellaneous.cast_ByteListView_to_CharacterListView(data_buffer_if!.view());
			let data_stream = Core.CharacterStreamView.watch(data_buffer_view);
			Core.Tool.Data.Serialization.JSON.Write.process_whole(data_stream, value, Core.Boolean.value(disable_trailing_comma), Core.Boolean.value(disable_array_wrap_line));
			return Core.Miscellaneous.cast_CharacterListView_to_ByteListView(data_stream.stream_view()).value;
		}

		// ------------------------------------------------

		export function read_s<ConstraintT extends Core.JSON.JS_Value>(
			data: string,
		): Core.JSON.Value<ConstraintT> {
			let data_byte = Core.Miscellaneous.cast_moveable_String_to_ByteArray(Core.String.value(data));
			return read(data_byte.view().value);
		}

		export function write_s<ConstraintT extends Core.JSON.JS_Value>(
			value: Core.JSON.Value<ConstraintT>,
			disable_trailing_comma: boolean = g_write_format.disable_trailing_comma,
			disable_array_wrap_line: boolean = g_write_format.disable_array_wrap_line,
			data_buffer: Core.CharacterListView | bigint = Core.Miscellaneous.cast_ByteListView_to_CharacterListView(g_common_buffer.view()),
		): string {
			let data = write(value, disable_trailing_comma, disable_array_wrap_line, data_buffer);
			return Core.Miscellaneous.cast_CharacterListView_to_JS_String(Core.Miscellaneous.cast_ByteListView_to_CharacterListView(Core.ByteListView.value(data)));
		}

		// ------------------------------------------------

		export function read_fs<ConstraintT extends Core.JSON.JS_Value>(
			data_file: string,
		): Core.JSON.Value<ConstraintT> {
			let data = FileSystem.read_file(data_file);
			return read(data.view().value);
		}

		export function write_fs<ConstraintT extends Core.JSON.JS_Value>(
			data_file: string,
			value: Core.JSON.Value<ConstraintT>,
			disable_trailing_comma: boolean = g_write_format.disable_trailing_comma,
			disable_array_wrap_line: boolean = g_write_format.disable_array_wrap_line,
			data_buffer: Core.CharacterListView | bigint = Core.Miscellaneous.cast_ByteListView_to_CharacterListView(g_common_buffer.view()),
		): void {
			let data = write(value, disable_trailing_comma, disable_array_wrap_line, data_buffer);
			FileSystem.write_file(data_file, data);
			return;
		}

		// ------------------------------------------------

		export function read_js<ConstraintT extends Core.JSON.JS_Value>(
			data: ArrayBuffer,
		): ConstraintT {
			return read<ConstraintT>(data).value;
		}

		/** NOTE : result is a view of buffer */
		export function write_js<ConstraintT extends Core.JSON.JS_Value>(
			value: ConstraintT,
			disable_trailing_comma: boolean = g_write_format.disable_trailing_comma,
			disable_array_wrap_line: boolean = g_write_format.disable_array_wrap_line,
			data_buffer: Core.CharacterListView | bigint = Core.Miscellaneous.cast_ByteListView_to_CharacterListView(g_common_buffer.view()),
		): ArrayBuffer {
			return write(Core.JSON.Value.value<ConstraintT>(value), disable_trailing_comma, disable_array_wrap_line, data_buffer);
		}

		// ------------------------------------------------

		export function read_s_js<ConstraintT extends Core.JSON.JS_Value>(
			data: string,
		): ConstraintT {
			return read_s<ConstraintT>(data).value;
		}

		export function write_s_js<ConstraintT extends Core.JSON.JS_Value>(
			value: ConstraintT,
			disable_trailing_comma: boolean = g_write_format.disable_trailing_comma,
			disable_array_wrap_line: boolean = g_write_format.disable_array_wrap_line,
			data_buffer: Core.CharacterListView | bigint = Core.Miscellaneous.cast_ByteListView_to_CharacterListView(g_common_buffer.view()),
		): string {
			return write_s(Core.JSON.Value.value<ConstraintT>(value), disable_trailing_comma, disable_array_wrap_line, data_buffer);
		}

		// ------------------------------------------------

		export function read_fs_js<ConstraintT extends Core.JSON.JS_Value>(
			data_file: string,
		): ConstraintT {
			return read_fs<ConstraintT>(data_file).value;
		}

		export function write_fs_js<ConstraintT extends Core.JSON.JS_Value>(
			data_file: string,
			value: ConstraintT,
			disable_trailing_comma: boolean = g_write_format.disable_trailing_comma,
			disable_array_wrap_line: boolean = g_write_format.disable_array_wrap_line,
			data_buffer: Core.CharacterListView | bigint = Core.Miscellaneous.cast_ByteListView_to_CharacterListView(g_common_buffer.view()),
		): void {
			return write_fs(data_file, Core.JSON.Value.value<ConstraintT>(value), disable_trailing_comma, disable_array_wrap_line, data_buffer);
		}

		// ------------------------------------------------

	}

	export namespace XML {

		// ------------------------------------------------

		export function read_fs(
			data_file: string,
		): Core.XML.Node {
			let data_byte = FileSystem.read_file(data_file);
			let data = Core.Miscellaneous.cast_moveable_ByteArray_to_String(data_byte);
			let value = Core.XML.Node.default();
			Core.Tool.Data.Serialization.XML.Read.process_whole(data, value);
			return value;
		}

		export function write_fs(
			data_file: string,
			value: Core.XML.Node,
		): void {
			let data = Core.String.default();
			Core.Tool.Data.Serialization.XML.Write.process_whole(data, value);
			let data_byte = Core.Miscellaneous.cast_moveable_String_to_ByteArray(data);
			FileSystem.write_file(data_file, data_byte.view());
			return;
		}

		// ------------------------------------------------

		export function read_fs_js(
			data_file: string,
		): Core.XML.JS_Node {
			return read_fs(data_file).value;
		}

		export function write_fs_js(
			data_file: string,
			value: Core.XML.JS_Node,
		): void {
			return write_fs(data_file, Core.XML.Node.value(value));
		}

		// ------------------------------------------------

	}

	export namespace Image {

		// ------------------------------------------------

		export type ImageSize = typeof Core.Image.ImageSize.Value;

		export type ImagePosition = typeof Core.Image.ImagePosition.Value;

		// ------------------------------------------------

		export namespace File {

			// ------------------------------------------------

			export namespace PNG {

				// ------------------------------------------------

				export function size(
					data: Core.ByteListView,
				): ImageSize {
					return Core.Image.File.PNG.size(data).value;
				}

				export function read(
					data: Core.ByteStreamView,
					image: Core.Image.VBitmapView,
				): void {
					return Core.Image.File.PNG.read(data, image);
				}

				export function write(
					data: Core.ByteStreamView,
					image: Core.Image.CBitmapView,
				): void {
					return Core.Image.File.PNG.write(data, image);
				}

				// ------------------------------------------------

				// NOTE : avoid use this function
				export function size_fs(
					file: string,
				): ImageSize {
					let data = FileSystem.read_file(file);
					let image_size = size(data.view());
					return image_size;
				}

				export function read_fs(
					file: string,
					image: Core.Image.VBitmapView,
				): void {
					let data = FileSystem.read_file(file);
					let data_stream = Core.ByteStreamView.watch(data.view());
					read(data_stream, image);
					return;
				}

				export function write_fs(
					file: string,
					image: Core.Image.CBitmapView,
					data_buffer: Core.ByteListView | bigint = g_common_buffer.view(),
				): void {
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let data_stream = Core.ByteStreamView.watch(data_buffer_view);
					write(data_stream, image);
					FileSystem.write_file(file, data_stream.stream_view());
					return;
				}

				export function read_fs_of(
					file: string,
				): Core.Image.Bitmap {
					let data = FileSystem.read_file(file);
					let data_stream = Core.ByteStreamView.watch(data.view());
					let image_size = size(data.view());
					let image = Core.Image.Bitmap.allocate(Core.Image.ImageSize.value(image_size));
					read(data_stream, image.view());
					return image;
				}

				// ------------------------------------------------

			}

			// ------------------------------------------------

		}

		// ------------------------------------------------

	}

	export namespace FileSystem {

		// ------------------------------------------------

		export function exist(
			target: string,
		): boolean {
			return Core.FileSystem.exist(Core.Path.value(target)).value;
		}

		export function exist_file(
			target: string,
		): boolean {
			return Core.FileSystem.exist_file(Core.Path.value(target)).value;
		}

		export function exist_directory(
			target: string,
		): boolean {
			return Core.FileSystem.exist_directory(Core.Path.value(target)).value;
		}

		// ------------------------------------------------

		export function copy(
			source: string,
			destination: string,
		): void {
			return Core.FileSystem.copy(Core.Path.value(source), Core.Path.value(destination));
		}

		export function rename(
			source: string,
			destination: string,
		): void {
			return Core.FileSystem.rename(Core.Path.value(source), Core.Path.value(destination));
		}

		export function remove(
			source: string,
		): void {
			return Core.FileSystem.remove(Core.Path.value(source));
		}

		// ------------------------------------------------

		export function create_link(
			target: string,
			object: string,
			is_directory: boolean,
		): void {
			return Core.FileSystem.create_link(Core.Path.value(target), Core.Path.value(object), Core.Boolean.value(is_directory));
		}

		export function parse_link(
			target: string,
		): string {
			return Core.FileSystem.parse_link(Core.Path.value(target)).value;
		}

		// ------------------------------------------------

		export function create_hard_link(
			target: string,
			object: string,
		): void {
			return Core.FileSystem.create_hard_link(Core.Path.value(target), Core.Path.value(object));
		}

		// ------------------------------------------------

		export function create_file(
			target: string,
		): void {
			return Core.FileSystem.create_file(Core.Path.value(target));
		}

		// ------------------------------------------------

		export function size_file(
			target: string,
		): bigint {
			return Core.FileSystem.size_file(Core.Path.value(target)).value;
		}

		export function resize_file(
			target: string,
			size: bigint,
		): void {
			return Core.FileSystem.resize_file(Core.Path.value(target), Core.Size.value(size));
		}

		// ------------------------------------------------

		export function read_file(
			target: string,
		): Core.ByteArray {
			return Core.FileSystem.read_file(Core.Path.value(target));
		}

		export function write_file(
			target: string,
			data: Core.ByteListView | Core.ByteArray | ArrayBuffer,
		): void {
			let data_view: Core.ByteListView;
			if (data instanceof Core.ByteListView) {
				data_view = data;
			}
			if (data instanceof Core.ByteArray) {
				data_view = data.view();
			}
			if (data instanceof ArrayBuffer) {
				data_view = Core.ByteListView.value(data);
			}
			return Core.FileSystem.write_file(Core.Path.value(target), data_view!);
		}

		// ------------------------------------------------

		export function create_directory(
			path: string,
		): void {
			return Core.FileSystem.create_directory(Core.Path.value(path));
		}

		// ------------------------------------------------

		export function count(
			target: string,
			depth: null | bigint = null,
		): bigint {
			return Core.FileSystem.count(Core.Path.value(target), Core.SizeOptional.value(depth)).value;
		}

		export function count_file(
			target: string,
			depth: null | bigint = null,
		): bigint {
			return Core.FileSystem.count_file(Core.Path.value(target), Core.SizeOptional.value(depth)).value;
		}

		export function count_directory(
			target: string,
			depth: null | bigint = null,
		): bigint {
			return Core.FileSystem.count_directory(Core.Path.value(target), Core.SizeOptional.value(depth)).value;
		}

		// ------------------------------------------------

		export function list(
			target: string,
			depth: null | bigint = null,
		): Array<string> {
			return Core.FileSystem.list(Core.Path.value(target), Core.SizeOptional.value(depth)).value;
		}

		export function list_file(
			target: string,
			depth: null | bigint = null,
		): Array<string> {
			return Core.FileSystem.list_file(Core.Path.value(target), Core.SizeOptional.value(depth)).value;
		}

		export function list_directory(
			target: string,
			depth: null | bigint = null,
		): Array<string> {
			return Core.FileSystem.list_directory(Core.Path.value(target), Core.SizeOptional.value(depth)).value;
		}

		// ------------------------------------------------

		export function get_working_directory(
		): string {
			return Core.FileSystem.get_working_directory().value;
		}

		export function set_working_directory(
			target: string,
		): void {
			return Core.FileSystem.set_working_directory(Core.Path.value(target));
		}

		// ------------------------------------------------

		export function get_temporary_directory(
		): string {
			return Core.FileSystem.get_temporary_directory().value;
		}

		// ------------------------------------------------

	}

	export namespace Process {

		// ------------------------------------------------

		export function environment(
		): Array<string> {
			return Core.Process.environment().value;
		}

		export function exit(
			code: bigint,
		): void {
			return Core.Process.exit(Core.IntegerU32.value(code));
		}

		export function execute(
			program: string,
			argument: Array<string>,
			environment: Array<string>,
			input: null | string,
			output: null | string,
			error: null | string,
		): bigint {
			return Core.Process.execute(Core.Path.value(program), Core.StringList.value(argument), Core.StringList.value(environment), Core.PathOptional.value(input), Core.PathOptional.value(output), Core.PathOptional.value(error)).value;
		}

		export function system(
			command: string,
		): bigint {
			return Core.Process.system(Core.String.value(command)).value;
		}

		// ------------------------------------------------

	}

	export namespace Tool {

		export namespace Data {

			export namespace Hash {

				export namespace MD5 {

					export function hash_fs(
						data_file: string,
					): bigint {
						let data = FileSystem.read_file(data_file);
						let value = Core.ByteArray.default();
						Core.Tool.Data.Hash.MD5.Hash.process_whole(data.view(), value);
						return integer_from_byte(value.value);
					}

				}

				export namespace FNV {

					export function hash_fs(
						data_file: string,
						mode: typeof Core.Tool.Data.Hash.FNV.Mode.Value,
						bit_count: typeof Core.Tool.Data.Hash.FNV.BitCount.Value,
					): bigint {
						let data = FileSystem.read_file(data_file);
						let value = Core.ByteArray.default();
						Core.Tool.Data.Hash.FNV.Hash.process_whole(data.view(), value, Core.Tool.Data.Hash.FNV.Mode.value(mode), Core.Tool.Data.Hash.FNV.BitCount.value(bit_count));
						return integer_from_byte(value.value);
					}

					export function hash_s(
						data_string: string,
						mode: typeof Core.Tool.Data.Hash.FNV.Mode.Value,
						bit_count: typeof Core.Tool.Data.Hash.FNV.BitCount.Value,
					): bigint {
						let data = Core.Miscellaneous.cast_moveable_String_to_ByteArray(Core.String.value(data_string));
						let value = Core.ByteArray.default();
						Core.Tool.Data.Hash.FNV.Hash.process_whole(data.view(), value, Core.Tool.Data.Hash.FNV.Mode.value(mode), Core.Tool.Data.Hash.FNV.BitCount.value(bit_count));
						return integer_from_byte(value.value);
					}

				}

			}

			export namespace Encoding {

				export namespace Base64 {

					export function encode_fs(
						raw_file: string,
						ripe_file: string,
					): void {
						let raw_data = FileSystem.read_file(raw_file);
						let ripe_size = Core.Size.default();
						Core.Tool.Data.Encoding.Base64.Encode.compute_size(raw_data.size(), ripe_size);
						let ripe_data = Core.ByteArray.allocate(ripe_size);
						let raw_stream = Core.ByteStreamView.watch(raw_data.view());
						let ripe_stream = Core.CharacterStreamView.watch(Core.Miscellaneous.cast_ByteListView_to_CharacterListView(ripe_data.view()));
						Core.Tool.Data.Encoding.Base64.Encode.process_whole(raw_stream, ripe_stream);
						FileSystem.write_file(ripe_file, Core.Miscellaneous.cast_CharacterListView_to_ByteListView(ripe_stream.stream_view()));
						return;
					}

					export function decode_fs(
						ripe_file: string,
						raw_file: string,
					): void {
						let ripe_data = FileSystem.read_file(ripe_file);
						let ripe_stream = Core.CharacterStreamView.watch(Core.Miscellaneous.cast_ByteListView_to_CharacterListView(ripe_data.view()));
						let raw_size = Core.Size.default();
						Core.Tool.Data.Encoding.Base64.Decode.compute_size(ripe_stream.view(), raw_size);
						let raw_data = Core.ByteArray.allocate(raw_size);
						let raw_stream = Core.ByteStreamView.watch(raw_data.view());
						Core.Tool.Data.Encoding.Base64.Decode.process_whole(ripe_stream, raw_stream);
						FileSystem.write_file(raw_file, raw_stream.stream_view());
						return;
					}

				}

			}

			export namespace Encryption {

				export namespace XOR {

					export function encrypt_fs(
						plain_file: string,
						cipher_file: string,
						key: bigint,
					): void {
						let plain_data = FileSystem.read_file(plain_file);
						let cipher_data = Core.ByteArray.allocate(plain_data.size());
						let plain_stream = Core.ByteStreamView.watch(plain_data.view());
						let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
						Core.Tool.Data.Encryption.XOR.Encrypt.process_whole(plain_stream, cipher_stream, Core.Byte.value(key));
						FileSystem.write_file(cipher_file, cipher_stream.stream_view());
						return;
					}

				}

				export namespace Rijndael {

					export const ModeE = ['ecb', 'cbc', 'cfb'] as const;

					export type Mode = typeof ModeE[number];

					export const BlockSizeE = [16n, 24n, 32n] as const;

					export type BlockSize = typeof BlockSizeE[number];

					export function encrypt_fs(
						plain_file: string,
						cipher_file: string,
						mode: Mode,
						block_size: BlockSize,
						key_size: BlockSize,
						key: string,
						iv: string,
					): void {
						let plain_data = FileSystem.read_file(plain_file);
						let cipher_data = Core.ByteArray.allocate(plain_data.size());
						let plain_stream = Core.ByteStreamView.watch(plain_data.view());
						let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
						Core.Tool.Data.Encryption.Rijndael.Encrypt.process_whole(plain_stream, cipher_stream, Core.Tool.Data.Encryption.Rijndael.Mode.value(mode), Core.Size.value(block_size), Core.Size.value(key_size), Core.String.value(key), Core.String.value(iv));
						FileSystem.write_file(cipher_file, cipher_stream.stream_view());
						return;
					}

					export function decrypt_fs(
						cipher_file: string,
						plain_file: string,
						mode: Mode,
						block_size: BlockSize,
						key_size: BlockSize,
						key: string,
						iv: string,
					): void {
						let cipher_data = FileSystem.read_file(cipher_file);
						let plain_data = Core.ByteArray.allocate(cipher_data.size());
						let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
						let plain_stream = Core.ByteStreamView.watch(plain_data.view());
						Core.Tool.Data.Encryption.Rijndael.Decrypt.process_whole(cipher_stream, plain_stream, Core.Tool.Data.Encryption.Rijndael.Mode.value(mode), Core.Size.value(block_size), Core.Size.value(key_size), Core.String.value(key), Core.String.value(iv));
						FileSystem.write_file(plain_file, plain_stream.stream_view());
						return;
					}

				}

			}

			export namespace Compression {

				export namespace Deflate {

					export const CompressionLevelE = [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n] as const;

					export type CompressionLevel = typeof CompressionLevelE[number];

					export const WindowBitsE = [8n, 9n, 10n, 11n, 12n, 13n, 14n, 15n] as const;

					export type WindowBits = typeof WindowBitsE[number];

					export const MemoryLevelE = [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n] as const;

					export type MemoryLevel = typeof MemoryLevelE[number];

					export const StrategyE = ['default_mode', 'filtered', 'huffman_only', 'rle', 'fixed'] as const;

					export type Strategy = typeof StrategyE[number];

					export const WrapperTypeE = ['none', 'zlib', 'gzip'] as const;

					export type WrapperType = typeof WrapperTypeE[number];

					export function compress_fs(
						raw_file: string,
						ripe_file: string,
						level: CompressionLevel,
						window_bits: WindowBits,
						memory_level: MemoryLevel,
						strategy: Strategy,
						wrapper: WrapperType,
					): void {
						let raw_data = FileSystem.read_file(raw_file);
						let ripe_size_bound = Core.Size.default();
						Core.Tool.Data.Compression.Deflate.Compress.compute_size_bound(raw_data.size(), ripe_size_bound, Core.Size.value(window_bits), Core.Size.value(memory_level), Core.Tool.Data.Compression.Deflate.Wrapper.value(wrapper));
						let ripe_data = Core.ByteArray.allocate(ripe_size_bound);
						let raw_stream = Core.ByteStreamView.watch(raw_data.view());
						let ripe_stream = Core.ByteStreamView.watch(ripe_data.view());
						Core.Tool.Data.Compression.Deflate.Compress.process_whole(raw_stream, ripe_stream, Core.Size.value(level), Core.Size.value(window_bits), Core.Size.value(memory_level), Core.Tool.Data.Compression.Deflate.Strategy.value(strategy), Core.Tool.Data.Compression.Deflate.Wrapper.value(wrapper));
						FileSystem.write_file(ripe_file, ripe_stream.stream_view());
						return;
					}

					export function uncompress_fs(
						ripe_file: string,
						raw_file: string,
						window_bits: WindowBits,
						wrapper: WrapperType,
						raw_data_buffer: Core.ByteListView | bigint,
					): void {
						let raw_data_buffer_if = typeof raw_data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(raw_data_buffer)) : null;
						let raw_data_buffer_view = raw_data_buffer instanceof Core.ByteListView ? raw_data_buffer : raw_data_buffer_if!.view();
						let ripe_data = FileSystem.read_file(ripe_file);
						let ripe_stream = Core.ByteStreamView.watch(ripe_data.view());
						let raw_stream = Core.ByteStreamView.watch(raw_data_buffer_view);
						Core.Tool.Data.Compression.Deflate.Uncompress.process_whole(ripe_stream, raw_stream, Core.Size.value(window_bits), Core.Tool.Data.Compression.Deflate.Wrapper.value(wrapper));
						FileSystem.write_file(raw_file, raw_stream.stream_view());
						return;
					}

				}

				export namespace BZip2 {

					export const BlockSizeE = [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n] as const;

					export type BlockSize = typeof BlockSizeE[number];

					export function compress_fs(
						raw_file: string,
						ripe_file: string,
						block_size: BlockSize,
					): void {
						let raw_data = FileSystem.read_file(raw_file);
						let ripe_size_bound = Core.Size.value(raw_data.size().value + 128n); // TODO
						let ripe_data = Core.ByteArray.allocate(ripe_size_bound);
						let raw_stream = Core.ByteStreamView.watch(raw_data.view());
						let ripe_stream = Core.ByteStreamView.watch(ripe_data.view());
						Core.Tool.Data.Compression.BZip2.Compress.process_whole(raw_stream, ripe_stream, Core.Size.value(block_size), Core.Size.value(0n));
						FileSystem.write_file(ripe_file, ripe_stream.stream_view());
						return;
					}

					export function uncompress_fs(
						ripe_file: string,
						raw_file: string,
						raw_data_buffer: Core.ByteListView | bigint,
					): void {
						let raw_data_buffer_if = typeof raw_data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(raw_data_buffer)) : null;
						let raw_data_buffer_view = raw_data_buffer instanceof Core.ByteListView ? raw_data_buffer : raw_data_buffer_if!.view();
						let ripe_data = FileSystem.read_file(ripe_file);
						let ripe_stream = Core.ByteStreamView.watch(ripe_data.view());
						let raw_stream = Core.ByteStreamView.watch(raw_data_buffer_view);
						Core.Tool.Data.Compression.BZip2.Uncompress.process_whole(ripe_stream, raw_stream, Core.Boolean.value(false));
						FileSystem.write_file(raw_file, raw_stream.stream_view());
						return;
					}

				}

			}

			export namespace Differentiation {

				export namespace VCDiff {

					export function encode_fs(
						before_file: string,
						after_file: string,
						patch_file: string,
						interleaved: boolean,
						patch_size_bound: bigint,
					): void {
						let before_data = FileSystem.read_file(before_file);
						let after_data = FileSystem.read_file(after_file);
						let patch_data = Core.ByteArray.allocate(Core.Size.value(patch_size_bound));
						let before_stream = Core.ByteStreamView.watch(before_data.view());
						let after_stream = Core.ByteStreamView.watch(after_data.view());
						let patch_stream = Core.ByteStreamView.watch(patch_data.view());
						Core.Tool.Data.Differentiation.VCDiff.Encode.process_whole(before_stream, after_stream, patch_stream, Core.Boolean.value(interleaved));
						FileSystem.write_file(patch_file, patch_stream.stream_view());
						return;
					}

					export function decode_fs(
						before_file: string,
						after_file: string,
						patch_file: string,
						maximum_window_size: bigint,
						after_size_bound: bigint,
					): void {
						let before_data = FileSystem.read_file(before_file);
						let after_data = Core.ByteArray.allocate(Core.Size.value(after_size_bound));
						let patch_data = FileSystem.read_file(patch_file);
						let before_stream = Core.ByteStreamView.watch(before_data.view());
						let after_stream = Core.ByteStreamView.watch(after_data.view());
						let patch_stream = Core.ByteStreamView.watch(patch_data.view());
						Core.Tool.Data.Differentiation.VCDiff.Decode.process_whole(before_stream, after_stream, patch_stream, Core.Size.value(maximum_window_size));
						FileSystem.write_file(after_file, after_stream.stream_view());
						return;
					}

				}

			}

		}

		export namespace Texture {

			// ------------------------------------------------

			export const FormatE = [
				'a_8',
				'rgb_888',
				'rgba_8888',
				'rgb_565_l',
				'rgba_4444_l',
				'rgba_5551_l',
				'argb_4444_l',
				'argb_8888_l',
			] as const;

			export type Format = typeof FormatE[number];

			export const CompressionE = [
				'rgb_etc1',
				'rgb_etc2',
				'rgba_etc2',
				'rgb_pvrtc4',
				'rgba_pvrtc4',
			] as const;

			export type Compression = typeof CompressionE[number];

			export const TextureFormatE = [
				...FormatE,
				...CompressionE,
			] as const;

			export type CompositeFormat = typeof TextureFormatE[number];

			// ------------------------------------------------

			export function get_bpp(
				format: CompositeFormat,
			): bigint {
				let result: bigint;
				switch (format) {
					case 'a_8': {
						result = 8n;
						break;
					}
					case 'rgb_888': {
						result = 24n;
						break;
					}
					case 'rgba_8888': {
						result = 32n;
						break;
					}
					case 'rgb_565_l': {
						result = 16n;
						break;
					}
					case 'rgba_4444_l': {
						result = 16n;
						break;
					}
					case 'rgba_5551_l': {
						result = 16n;
						break;
					}
					case 'argb_4444_l': {
						result = 16n;
						break;
					}
					case 'argb_8888_l': {
						result = 32n;
						break;
					}
					case 'rgb_etc1': {
						result = 4n;
						break;
					}
					case 'rgb_etc2': {
						result = 4n;
						break;
					}
					case 'rgba_etc2': {
						result = 8n;
						break;
					}
					case 'rgb_pvrtc4': {
						result = 4n;
						break;
					}
					case 'rgba_pvrtc4': {
						result = 4n;
						break;
					}
				}
				return result;
			}

			export function compute_data_size(
				size: Image.ImageSize,
				format: CompositeFormat,
			): bigint {
				return size[0] * size[1] * get_bpp(format) / 8n;
			}

			export function compute_data_size_n(
				size: Image.ImageSize,
				format: Array<CompositeFormat>,
			): bigint {
				let data_size = 0n;
				for (let e of format) {
					data_size += compute_data_size(size, e);
				}
				return data_size;
			}

			// ------------------------------------------------

			export function encode(
				data: Core.OByteStreamView,
				image: Core.Image.CBitmapView,
				format: CompositeFormat,
			): void {
				switch (format) {
					case 'a_8':
					case 'rgb_888':
					case 'rgba_8888':
					case 'rgb_565_l':
					case 'rgba_4444_l':
					case 'rgba_5551_l':
					case 'argb_4444_l':
					case 'argb_8888_l': {
						Core.Tool.Texture.Encode.process_image(data, image, Core.Tool.Texture.Format.value(format));
						break;
					}
					case 'rgb_etc1': {
						Core.Tool.Texture.Compression.ETC1.Compress.process_image(data, image);
						break;
					}
					case 'rgb_etc2': {
						Core.Tool.Texture.Compression.ETC2.Compress.process_image(data, image, Core.Boolean.value(false));
						break;
					}
					case 'rgba_etc2': {
						Core.Tool.Texture.Compression.ETC2.Compress.process_image(data, image, Core.Boolean.value(true));
						break;
					}
					case 'rgb_pvrtc4': {
						Core.Tool.Texture.Compression.PVRTC4.Compress.process_image(data, image, Core.Boolean.value(false));
						break;
					}
					case 'rgba_pvrtc4': {
						Core.Tool.Texture.Compression.PVRTC4.Compress.process_image(data, image, Core.Boolean.value(true));
						break;
					}
				}
				return;
			}

			export function decode(
				data: Core.IByteStreamView,
				image: Core.Image.VBitmapView,
				format: CompositeFormat,
			): void {
				switch (format) {
					case 'a_8':
					case 'rgb_888':
					case 'rgba_8888':
					case 'rgb_565_l':
					case 'rgba_4444_l':
					case 'rgba_5551_l':
					case 'argb_4444_l':
					case 'argb_8888_l': {
						Core.Tool.Texture.Decode.process_image(data, image, Core.Tool.Texture.Format.value(format));
						break;
					}
					case 'rgb_etc1': {
						Core.Tool.Texture.Compression.ETC1.Uncompress.process_image(data, image);
						break;
					}
					case 'rgb_etc2': {
						Core.Tool.Texture.Compression.ETC2.Uncompress.process_image(data, image, Core.Boolean.value(false));
						break;
					}
					case 'rgba_etc2': {
						Core.Tool.Texture.Compression.ETC2.Uncompress.process_image(data, image, Core.Boolean.value(true));
						break;
					}
					case 'rgb_pvrtc4': {
						Core.Tool.Texture.Compression.PVRTC4.Uncompress.process_image(data, image, Core.Boolean.value(false));
						break;
					}
					case 'rgba_pvrtc4': {
						Core.Tool.Texture.Compression.PVRTC4.Uncompress.process_image(data, image, Core.Boolean.value(true));
						break;
					}
				}
				return;
			}

			// ------------------------------------------------

			export function encode_n(
				data: Core.OByteStreamView,
				image: Core.Image.CBitmapView,
				format: Array<CompositeFormat>,
			): void {
				for (let e of format) {
					encode(data, image, e);
				}
				return;
			}

			export function decode_n(
				data: Core.IByteStreamView,
				image: Core.Image.VBitmapView,
				format: Array<CompositeFormat>,
			): void {
				for (let e of format) {
					decode(data, image, e);
				}
				return;
			}

			// ------------------------------------------------

		}

		export namespace Wwise {

			export namespace EncodedMedia {

				export function decode_fs(
					ripe_file: string,
					raw_file: string,
					ffmpeg_program_file: string,
					ww2ogg_program_file: string,
					ww2ogg_code_book_file: string,
					temporary_directory: string,
				): void {
					let ripe_data = FileSystem.read_file(ripe_file);
					let raw_data = Core.ByteArray.default();
					Core.Tool.Wwise.EncodedMedia.Decode.process_audio(ripe_data.view(), raw_data, Core.Path.value(ffmpeg_program_file), Core.Path.value(ww2ogg_program_file), Core.Path.value(ww2ogg_code_book_file), Core.Path.value(temporary_directory));
					FileSystem.write_file(raw_file, raw_data.view());
					return;
				}

			}

			export namespace SoundBank {

				// TODO
				export function detect_version(
					data: ArrayBuffer,
				): typeof Core.Tool.Wwise.SoundBank.Version.Value {
					let version: typeof Core.Tool.Wwise.SoundBank.Version.Value = {
						number: undefined!,
					};
					let view = new DataView(data);
					version.number = BigInt(view.getUint32(0x0)) as any;
					assert_test([88n, 112n, 140n].includes(version.number));
					return version;
				}

				export function encode_fs(
					data_file: string,
					manifest_file: string,
					embedded_audio_directory: string,
					version: typeof Core.Tool.Wwise.SoundBank.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.Wwise.SoundBank.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.Wwise.SoundBank.Manifest.SoundBank.json(JSON.read_fs(manifest_file), version_c);
					Core.Tool.Wwise.SoundBank.Encode.process_sound_bank(stream, manifest, Core.Path.value(embedded_audio_directory), version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function decode_fs(
					data_file: string,
					manifest_file: null | string,
					embedded_audio_directory: null | string,
					version: typeof Core.Tool.Wwise.SoundBank.Version.Value,
				): void {
					let version_c = Core.Tool.Wwise.SoundBank.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.Wwise.SoundBank.Manifest.SoundBank.default();
					Core.Tool.Wwise.SoundBank.Decode.process_sound_bank(stream, manifest, Core.PathOptional.value(embedded_audio_directory), version_c);
					if (manifest_file !== null) {
						JSON.write_fs(manifest_file, manifest.get_json(version_c));
					}
					return;
				}

			}

		}

		export namespace Marmalade {

			export namespace DZip {

				export function pack_fs(
					data_file: string,
					manifest_file: string,
					resource_directory: string,
					version: typeof Core.Tool.Marmalade.DZip.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.Marmalade.DZip.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.Marmalade.DZip.Manifest.Package.json(JSON.read_fs(manifest_file), version_c);
					Core.Tool.Marmalade.DZip.Pack.process_package(stream, manifest, Core.Path.value(resource_directory), version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function unpack_fs(
					data_file: string,
					manifest_file: null | string,
					resource_directory: null | string,
					version: typeof Core.Tool.Marmalade.DZip.Version.Value,
				): void {
					let version_c = Core.Tool.Marmalade.DZip.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.Marmalade.DZip.Manifest.Package.default();
					Core.Tool.Marmalade.DZip.Unpack.process_package(stream, manifest, Core.PathOptional.value(resource_directory), version_c);
					if (manifest_file !== null) {
						JSON.write_fs(manifest_file, manifest.get_json(version_c));
					}
					return;
				}

			}

		}

		export namespace PopCap {

			export namespace ZLib {

				export function compress_fs(
					raw_file: string,
					ripe_file: string,
					level: Data.Compression.Deflate.CompressionLevel,
					window_bits: Data.Compression.Deflate.WindowBits,
					memory_level: Data.Compression.Deflate.MemoryLevel,
					strategy: Data.Compression.Deflate.Strategy,
					version: typeof Core.Tool.PopCap.ZLib.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.ZLib.Version.value(version);
					let raw_data = FileSystem.read_file(raw_file);
					let ripe_size_bound = Core.Size.default();
					Core.Tool.PopCap.ZLib.Compress.compute_size_bound(raw_data.size(), ripe_size_bound, Core.Size.value(window_bits), Core.Size.value(memory_level), version_c);
					let ripe_data = Core.ByteArray.allocate(ripe_size_bound);
					let raw_stream = Core.ByteStreamView.watch(raw_data.view());
					let ripe_stream = Core.ByteStreamView.watch(ripe_data.view());
					Core.Tool.PopCap.ZLib.Compress.process_whole(raw_stream, ripe_stream, Core.Size.value(level), Core.Size.value(window_bits), Core.Size.value(memory_level), Core.Tool.Data.Compression.Deflate.Strategy.value(strategy), version_c);
					FileSystem.write_file(ripe_file, ripe_stream.stream_view());
					return;
				}

				export function uncompress_fs(
					ripe_file: string,
					raw_file: string,
					window_bits: Data.Compression.Deflate.WindowBits,
					version: typeof Core.Tool.PopCap.ZLib.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.ZLib.Version.value(version);
					let ripe_data = FileSystem.read_file(ripe_file);
					let raw_size = Core.Size.default();
					Core.Tool.PopCap.ZLib.Uncompress.compute_size(ripe_data.view(), raw_size, version_c);
					let raw_data = Core.ByteArray.allocate(raw_size);
					let ripe_stream = Core.ByteStreamView.watch(ripe_data.view());
					let raw_stream = Core.ByteStreamView.watch(raw_data.view());
					Core.Tool.PopCap.ZLib.Uncompress.process_whole(ripe_stream, raw_stream, Core.Size.value(window_bits), version_c);
					FileSystem.write_file(raw_file, raw_stream.stream_view());
					return;
				}

			}

			export namespace Reanim {

				export function encode_fs(
					data_file: string,
					manifest_file: string,
					version: typeof Core.Tool.PopCap.Reanim.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.Reanim.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.PopCap.Reanim.Manifest.Animation.json(JSON.read_fs(manifest_file), version_c);
					Core.Tool.PopCap.Reanim.Encode.process_animation(stream, manifest, version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function decode_fs(
					data_file: string,
					manifest_file: string,
					version: typeof Core.Tool.PopCap.Reanim.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.Reanim.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.PopCap.Reanim.Manifest.Animation.default();
					Core.Tool.PopCap.Reanim.Decode.process_animation(stream, manifest, version_c);
					JSON.write_fs(manifest_file, manifest.get_json(version_c));
					return;
				}

			}

			export namespace RTON {

				export function encode_fs(
					data_file: string,
					value_file: string,
					enable_string_index: boolean,
					enable_rtid: boolean,
					version: typeof Core.Tool.PopCap.RTON.Version.Value,
					rton_data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.RTON.Version.value(version);
					let data_buffer_if = typeof rton_data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(rton_data_buffer)) : null;
					let data_buffer_view = rton_data_buffer instanceof Core.ByteListView ? rton_data_buffer : data_buffer_if!.view();
					let value = JSON.read_fs<Core.Tool.PopCap.RTON.JS_ValidValue>(value_file);
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					Core.Tool.PopCap.RTON.Encode.process_whole(stream, value, Core.Boolean.value(enable_string_index), Core.Boolean.value(enable_rtid), version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function decode_fs(
					data_file: string,
					value_file: string,
					version: typeof Core.Tool.PopCap.RTON.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.RTON.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let value = Core.JSON.Value.default<Core.Tool.PopCap.RTON.JS_ValidValue>();
					Core.Tool.PopCap.RTON.Decode.process_whole(stream, value, version_c);
					JSON.write_fs(value_file, value);
					return;
				}

				export function encrypt_fs(
					plain_file: string,
					cipher_file: string,
					key: string,
				): void {
					let plain_data = FileSystem.read_file(plain_file);
					let cipher_size = Core.Size.default();
					Core.Tool.PopCap.RTON.Encrypt.compute_size(plain_data.size(), cipher_size);
					let cipher_data = Core.ByteArray.allocate(cipher_size);
					let plain_stream = Core.ByteStreamView.watch(plain_data.view());
					let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
					Core.Tool.PopCap.RTON.Encrypt.process_whole(plain_stream, cipher_stream, Core.String.value(key));
					FileSystem.write_file(cipher_file, cipher_stream.stream_view());
					return;
				}

				export function decrypt_fs(
					cipher_file: string,
					plain_file: string,
					key: string,
				): void {
					let cipher_data = FileSystem.read_file(cipher_file);
					let plain_size = Core.Size.default();
					Core.Tool.PopCap.RTON.Decrypt.compute_size(cipher_data.size(), plain_size);
					let plain_data = Core.ByteArray.allocate(plain_size);
					let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
					let plain_stream = Core.ByteStreamView.watch(plain_data.view());
					Core.Tool.PopCap.RTON.Decrypt.process_whole(cipher_stream, plain_stream, Core.String.value(key));
					FileSystem.write_file(plain_file, plain_stream.stream_view());
					return;
				}

				export function encode_then_encrypt_fs(
					json_file: string,
					rton_file: string,
					enable_string_index: boolean,
					enable_rtid: boolean,
					version: typeof Core.Tool.PopCap.RTON.Version.Value,
					key: string,
					rton_data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.RTON.Version.value(version);
					let rton_data_buffer_if = typeof rton_data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(rton_data_buffer)) : null;
					let rton_data_buffer_view = rton_data_buffer instanceof Core.ByteListView ? rton_data_buffer : rton_data_buffer_if!.view();
					let json = JSON.read_fs<Core.Tool.PopCap.RTON.JS_ValidValue>(json_file);
					let rton_stream = Core.ByteStreamView.watch(rton_data_buffer_view);
					Core.Tool.PopCap.RTON.Encode.process_whole(rton_stream, json, Core.Boolean.value(enable_string_index), Core.Boolean.value(enable_rtid), version_c);
					let plain_stream = Core.ByteStreamView.watch(rton_stream.stream_view());
					let cipher_size = Core.Size.default();
					Core.Tool.PopCap.RTON.Encrypt.compute_size(plain_stream.size(), cipher_size);
					let cipher_data = Core.ByteArray.allocate(cipher_size);
					let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
					Core.Tool.PopCap.RTON.Encrypt.process_whole(plain_stream, cipher_stream, Core.String.value(key));
					FileSystem.write_file(rton_file, cipher_stream.stream_view());
					return;
				}

				export function decrypt_then_decode_fs(
					rton_file: string,
					json_file: string,
					version: typeof Core.Tool.PopCap.RTON.Version.Value,
					key: string,
				): void {
					let version_c = Core.Tool.PopCap.RTON.Version.value(version);
					let cipher_data = FileSystem.read_file(rton_file);
					let plain_size = Core.Size.default();
					Core.Tool.PopCap.RTON.Decrypt.compute_size(cipher_data.size(), plain_size);
					let plain_data = Core.ByteArray.allocate(plain_size);
					let cipher_stream = Core.ByteStreamView.watch(cipher_data.view());
					let plain_stream = Core.ByteStreamView.watch(plain_data.view());
					Core.Tool.PopCap.RTON.Decrypt.process_whole(cipher_stream, plain_stream, Core.String.value(key));
					let rton_stream = Core.ByteStreamView.watch(plain_stream.stream_view());
					let json = Core.JSON.Value.default<Core.Tool.PopCap.RTON.JS_ValidValue>();
					Core.Tool.PopCap.RTON.Decode.process_whole(rton_stream, json, version_c);
					JSON.write_fs(json_file, json);
					return;
				}

			}

			export namespace PAM {

				export function encode_fs(
					data_file: string,
					manifest_file: string,
					version: typeof Core.Tool.PopCap.PAM.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.PAM.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.PopCap.PAM.Manifest.Animation.json(JSON.read_fs(manifest_file), version_c);
					Core.Tool.PopCap.PAM.Encode.process_animation(stream, manifest, version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function decode_fs(
					data_file: string,
					manifest_file: string,
					version: typeof Core.Tool.PopCap.PAM.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.PAM.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.PopCap.PAM.Manifest.Animation.default();
					Core.Tool.PopCap.PAM.Decode.process_animation(stream, manifest, version_c);
					JSON.write_fs(manifest_file, manifest.get_json(version_c));
					return;
				}

			}

			export namespace PAK {

				export function pack_fs(
					data_file: string,
					manifest_file: string,
					resource_directory: string,
					version: typeof Core.Tool.PopCap.PAK.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.PAK.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.PopCap.PAK.Manifest.Package.json(JSON.read_fs(manifest_file), version_c);
					Core.Tool.PopCap.PAK.Pack.process_package(stream, manifest, Core.Path.value(resource_directory), version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function unpack_fs(
					data_file: string,
					manifest_file: null | string,
					resource_directory: null | string,
					version: typeof Core.Tool.PopCap.PAK.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.PAK.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.PopCap.PAK.Manifest.Package.default();
					Core.Tool.PopCap.PAK.Unpack.process_package(stream, manifest, Core.PathOptional.value(resource_directory), version_c);
					if (manifest_file !== null) {
						JSON.write_fs(manifest_file, manifest.get_json(version_c));
					}
					return;
				}

			}

			export namespace RSGP {

				export function pack_fs(
					data_file: string,
					manifest_file: string,
					resource_directory: string,
					version: typeof Core.Tool.PopCap.RSGP.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.RSGP.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.PopCap.RSGP.Manifest.Package.json(JSON.read_fs(manifest_file), version_c);
					Core.Tool.PopCap.RSGP.Pack.process_package(stream, manifest, Core.Path.value(resource_directory), version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function unpack_fs(
					data_file: string,
					manifest_file: null | string,
					resource_directory: null | string,
					version: typeof Core.Tool.PopCap.RSGP.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.RSGP.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.PopCap.RSGP.Manifest.Package.default();
					Core.Tool.PopCap.RSGP.Unpack.process_package(stream, manifest, Core.PathOptional.value(resource_directory), version_c);
					if (manifest_file !== null) {
						JSON.write_fs(manifest_file, manifest.get_json(version_c));
					}
					return;
				}

			}

			export namespace RSB {

				export function pack_fs(
					data_file: string,
					manifest_file: string,
					description_file: string,
					resource_directory: string,
					packet_file: null | string,
					new_packet_file: null | string,
					version: typeof Core.Tool.PopCap.RSB.Version.Value,
					data_buffer: Core.ByteListView | bigint,
				): void {
					let version_c = Core.Tool.PopCap.RSB.Version.value(version);
					let data_buffer_if = typeof data_buffer === 'bigint' ? Core.ByteArray.allocate(Core.Size.value(data_buffer)) : null;
					let data_buffer_view = data_buffer instanceof Core.ByteListView ? data_buffer : data_buffer_if!.view();
					let stream = Core.ByteStreamView.watch(data_buffer_view);
					let manifest = Core.Tool.PopCap.RSB.Manifest.Package.json(JSON.read_fs(manifest_file), version_c);
					let description = Core.Tool.PopCap.RSB.Description.PackageOptional.json(JSON.read_fs(description_file), version_c);
					Core.Tool.PopCap.RSB.Pack.process_package(stream, manifest, description, Core.Path.value(resource_directory), Core.PathOptional.value(packet_file), Core.PathOptional.value(new_packet_file), version_c);
					FileSystem.write_file(data_file, stream.stream_view());
					return;
				}

				export function unpack_fs(
					data_file: string,
					manifest_file: null | string,
					description_file: null | string,
					resource_directory: null | string,
					packet_file: null | string,
					version: typeof Core.Tool.PopCap.RSB.Version.Value,
				): void {
					let version_c = Core.Tool.PopCap.RSB.Version.value(version);
					let data = FileSystem.read_file(data_file);
					let stream = Core.ByteStreamView.watch(data.view());
					let manifest = Core.Tool.PopCap.RSB.Manifest.Package.default();
					let description = Core.Tool.PopCap.RSB.Description.PackageOptional.default();
					Core.Tool.PopCap.RSB.Unpack.process_package(stream, manifest, description, Core.PathOptional.value(resource_directory), Core.PathOptional.value(packet_file), version_c);
					if (manifest_file !== null) {
						JSON.write_fs(manifest_file, manifest.get_json(version_c));
					}
					if (description_file !== null) {
						JSON.write_fs(description_file, description.get_json(version_c));
					}
					return;
				}

			}

			export namespace RSBPatch {

				export function encode_fs(
					before_file: string,
					after_file: string,
					patch_file: string,
					use_raw_packet: boolean,
					version: typeof Core.Tool.PopCap.RSBPatch.Version.Value,
					patch_size_bound: bigint,
				): void {
					let version_c = Core.Tool.PopCap.RSBPatch.Version.value(version);
					let before_data = FileSystem.read_file(before_file);
					let after_data = FileSystem.read_file(after_file);
					let patch_data = Core.ByteArray.allocate(Core.Size.value(patch_size_bound));
					let before_stream = Core.ByteStreamView.watch(before_data.view());
					let after_stream = Core.ByteStreamView.watch(after_data.view());
					let patch_stream = Core.ByteStreamView.watch(patch_data.view());
					Core.Tool.PopCap.RSBPatch.Encode.process_whole(before_stream, after_stream, patch_stream, Core.Boolean.value(use_raw_packet), version_c);
					FileSystem.write_file(patch_file, patch_stream.stream_view());
					return;
				}

				export function decode_fs(
					before_file: string,
					after_file: string,
					patch_file: string,
					use_raw_packet: boolean,
					version: typeof Core.Tool.PopCap.RSBPatch.Version.Value,
					after_size_bound: bigint,
				): void {
					let version_c = Core.Tool.PopCap.RSBPatch.Version.value(version);
					let before_data = FileSystem.read_file(before_file);
					let after_data = Core.ByteArray.allocate(Core.Size.value(after_size_bound));
					let patch_data = FileSystem.read_file(patch_file);
					let before_stream = Core.ByteStreamView.watch(before_data.view());
					let after_stream = Core.ByteStreamView.watch(after_data.view());
					let patch_stream = Core.ByteStreamView.watch(patch_data.view());
					Core.Tool.PopCap.RSBPatch.Decode.process_whole(before_stream, after_stream, patch_stream, Core.Boolean.value(use_raw_packet), version_c);
					FileSystem.write_file(after_file, after_stream.stream_view());
					return;
				}

			}

		}

		export namespace Miscellaneous {

			export namespace XboxTiledTexture {

				// ------------------------------------------------

				export function encode(
					data: Core.OByteStreamView,
					image: Core.Image.CBitmapView,
					format: Texture.Format,
				): void {
					Core.Tool.Miscellaneous.XboxTiledTexture.Encode.process_image(data, image, Core.Tool.Texture.Format.value(format));
					return;
				}

				export function decode(
					data: Core.IByteStreamView,
					image: Core.Image.VBitmapView,
					format: Texture.Format,
				): void {
					Core.Tool.Miscellaneous.XboxTiledTexture.Decode.process_image(data, image, Core.Tool.Texture.Format.value(format));
					return;
				}

				// ------------------------------------------------

			}

			export namespace PvZ2ChineseAndroidAlphaPaletteTexture {

				// ------------------------------------------------

				export type BitCount = 1 | 2 | 3 | 4;

				export function compute_bit_count(
					value_count: number,
				): BitCount {
					assert_test(0b1 < value_count && value_count <= 0b1 << 4, `invalue value count`);
					let bit_count: BitCount;
					if (value_count <= 0b10) {
						bit_count = 1;
					} else if (value_count <= 0b100) {
						bit_count = 2;
					} else if (value_count <= 0b1000) {
						bit_count = 3;
					} else {
						bit_count = 4;
					}
					return bit_count;
				}

				// ------------------------------------------------

				export function compute_data_size_with_palette(
					size: Image.ImageSize,
					index_count: number,
				): bigint {
					let bit_count = compute_bit_count(index_count);
					return 1n + BigInt(index_count === 2 ? 0 : index_count) + size[0] * size[1] * BigInt(bit_count) / 8n;
				}

				export function evaluate_palette(
					image: Core.Image.CBitmapView,
				): Core.Tool.Miscellaneous.PvZ2ChineseAndroidAlphaPaletteTexture.JS_Palette {
					let image_size = image.size().value;
					let image_data = Core.ByteArray.allocate(Core.Size.value(image_size[0] * image_size[1] * 8n / 8n));
					let image_stream = Core.ByteStreamView.watch(image_data.view());
					Texture.encode(image_stream, image, 'a_8');
					let alpha_count: Record<number, number> = {};
					for (let e of new Uint8Array(image_stream.stream_view().value)) {
						let alpha_4 = (e >> 4) & ~(~0 << 4);
						alpha_count[alpha_4] = (alpha_count[alpha_4] || 0) + 1;
					}
					let palette = Object.keys(alpha_count).map(BigInt);
					if (palette.length <= 2) {
						if (!palette.includes(0b0000n)) {
							palette.push(0b0000n);
						}
						if (!palette.includes(0b1111n)) {
							palette.push(0b1111n);
						}
						if (palette.length === 2) {
							palette = [0b0000n, 0b1111n];
						}
					}
					return palette;
				}

				// ------------------------------------------------

				export function encode_with_palette(
					data: Core.OByteStreamView,
					image: Core.Image.CBitmapView,
					palette: Core.Tool.Miscellaneous.PvZ2ChineseAndroidAlphaPaletteTexture.JS_Palette,
				): void {
					let bit_count = compute_bit_count(palette.length);
					if (bit_count === 1) {
						data.write(Core.Byte.value(0n));
					} else {
						data.write(Core.Byte.value(BigInt(palette.length)));
						for (let e of palette) {
							data.write(Core.Byte.value(e));
						}
					}
					Core.Tool.Miscellaneous.PvZ2ChineseAndroidAlphaPaletteTexture.Encode.process_image(data, image, palette);
					return;
				}

				export function decode_with_palette(
					data: Core.IByteStreamView,
					image: Core.Image.VBitmapView,
				): void {
					let index_count = data.read().value;
					let palette: Core.Tool.Miscellaneous.PvZ2ChineseAndroidAlphaPaletteTexture.JS_Palette;
					if (index_count === 0n) {
						palette = [0b0000n, 0b1111n];
					} else {
						palette = [];
						for (let i = 0n; i < index_count; ++i) {
							palette.push(data.read().value);
						}
					}
					Core.Tool.Miscellaneous.PvZ2ChineseAndroidAlphaPaletteTexture.Decode.process_image(data, image, palette);
					return;
				}

				// ------------------------------------------------

			}

		}

	}

	export namespace Miscellaneous {

		// ------------------------------------------------

		export function evaluate(
			script: string,
			name: string = '<!evaluate>',
		): any {
			let script_s = Core.String.value(script);
			return Core.Miscellaneous.g_context.evaluate(Core.Miscellaneous.cast_String_to_CharacterListView(script_s), Core.String.value(name));
		}

		export function evaluate_fs(
			script_file: string,
			name: string = script_file,
		): any {
			let script = FileSystem.read_file(script_file);
			return Core.Miscellaneous.g_context.evaluate(Core.Miscellaneous.cast_ByteListView_to_CharacterListView(script.view()), Core.String.value(name));
		}

		export function callback(
			argument: Array<string>,
		): Array<string> {
			return Core.Miscellaneous.g_context.callback(Core.StringList.value(argument)).value;
		}

		// ------------------------------------------------

	}

	// ------------------------------------------------

}